#include "server/message_handler.hpp"
#include <iostream>

std::string preprocess_message(std::string message_type, std::string message) {
  std::string header = message_type + std::string("\n") +
                       std::string(std::to_string(message.size())) +
                       std::string("\n");
  header += std::string(HEADER_SIZE - header.size(), ' ');

  return header + message;
}

MessageHandler::MessageHandler(int fd) : client_fd(fd) {}

bool MessageHandler::sendBuffered() {
  if (currently_sending.empty()) {
    if (write_buffer.empty()) {
      std::cout << "Write buffer empty for: " << client_fd << std::endl;
      return true;
    }
    currently_sending = write_buffer.front();
    write_buffer.pop();
    // add this point i we had only one message in queue then its empty now
  }

  size_t message_length = currently_sending.size();
  std::cout << "Currently sending: " << currently_sending << std::endl;
  const size_t bytes_sent =
      write(client_fd, currently_sending.data(), message_length);

  const size_t rest = message_length - bytes_sent;

  if (rest) {
    currently_sending = currently_sending.substr(rest + bytes_sent);
    return false;
  }
  currently_sending = "";
  if (!write_buffer.empty()) {
    currently_sending = write_buffer.front();
    write_buffer.pop();
    return false;
  }

  return true;
}

std::pair<std::string, json> MessageHandler::readMessage() {
  // I want first x bytes to determine message type and size

  const int bytes_to_read =
      read_header > 0 ? read_header : read_message_size - currently_read.size();

  std::cout << "MESSAGE HANDLER: bytes to read " << bytes_to_read << " "
            << currently_read.size() << std::endl;

  std::vector<char> readBuffer(bytes_to_read);

  int bytes_read = read(client_fd, readBuffer.data(), bytes_to_read);

  if (!bytes_read) {
    return {"DISCONNECT", nullptr};
  }

  if (read_header > 0) {
    message_header.append(readBuffer.data());
    read_header -= bytes_read;
  }
  std::cout << "read header: " << read_header << std::endl;
  std::cout << currently_read << std::endl;
  std::cout << readBuffer.size() << std::endl;

  if (read_header < 0) {
    // no we have full header
    const auto surplus = (message_header.size() - message_header_size);
    const auto surplus_str = message_header.substr(
        message_header_size, message_header_size + surplus);

    message_header = message_header.erase(message_header_size);
    currently_read += surplus_str;
    read_header += surplus;
  }

  if (read_header == 0) {
    if (read_message_size == 0) {
      // first 20 char are the type
      std::vector<std::string> header_part = split(message_header, '\n');

      read_message_type = header_part[0];

      // it's minus currently read size because it might be extened by surplused
      // amount
      read_message_size = std::stoi(header_part[1]);
    } else {
      currently_read.append(readBuffer.begin(), readBuffer.end());
    }
  }

  if (!currently_read.empty() &&
      read_message_size == static_cast<int>(currently_read.size())) {
    json json_message = json::parse(currently_read);
    std::string message_type = read_message_type;

    read_message_type = "";
    currently_read = "";
    message_header = "";
    read_header = 100;
    read_message_size = 0;
    std::cout << "Cleaned" << std::endl;
    return {message_type, json_message};
  }

  return {"", nullptr};
}

void MessageHandler::add_to_send_buffer(const std::string &type,
                                        const std::string &message) {
  std::cout << "Added " << type << " " << message << "to client " << client_fd
            << std::endl;
  write_buffer.push(preprocess_message(type, message));
  std::cout << "Buffer size: " << write_buffer.size() << std::endl;
}
#include "server/message_handler.hpp"
#include "spdlog/spdlog.h"
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
      spdlog::debug("Write buffer empty for: {0}", client_fd);
      return true;
    }
    currently_sending = write_buffer.front();
    write_buffer.pop();
    // add this point i we had only one message in queue then its empty now
  }

  size_t message_length = currently_sending.size();

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

  spdlog::debug("MESSAGE HANDLER: bytes to read {0} {1}", bytes_to_read,
                currently_read.size());

  std::vector<char> readBuffer(bytes_to_read);

  int bytes_read = read(client_fd, readBuffer.data(), bytes_to_read);

  if (!bytes_read) {
    return {"DISCONNECT", nullptr};
  }

  if (read_header > 0) {
    message_header.append(readBuffer.data(), bytes_read);
    read_header -= bytes_read;
  }

  if (read_header == 0) {
    if (read_message_size == 0) {
      std::vector<std::string> header_part = split(message_header, '\n');
      if (header_part.size() < 2) {
        spdlog::error("Header is not properly formatted");
      }
      read_message_type = header_part[0];
      read_message_size = std::stoi(header_part[1]);
    } else {
      currently_read.append(readBuffer.begin(), readBuffer.end());
    }
  }

  if (!currently_read.empty() &&
      read_message_size == static_cast<int>(currently_read.size())) {
    std::string message_type = read_message_type;

    bool error_occurred = false;
    json json_message;
    try {
      json_message = json::parse(currently_read);
    } catch (const nlohmann::json::parse_error &e) {
      spdlog::error("Couldn't parse json from client {0} - {1}", client_fd,
                    e.what());
      error_occurred = true;
    }

    read_message_type = "";
    currently_read = "";
    message_header = "";
    read_header = 100;
    read_message_size = 0;
    if (error_occurred) {
      return {"", nullptr};
    }

    spdlog::debug("Currently read for desc [{0}]", client_fd);
    return {message_type, json_message};
  }

  return {"", nullptr};
}

void MessageHandler::add_to_send_buffer(const std::string &type,
                                        const std::string &message) {
  write_buffer.push(preprocess_message(type, message));
}

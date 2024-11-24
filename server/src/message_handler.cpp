#include "server/message_handler.hpp"
#include <iostream>
MessageHandler::MessageHandler(int fd) : client_fd(fd) {
}

MessageHandler::~MessageHandler(){

}

bool MessageHandler::sendBuffered() {
    if (currently_sending.empty()) {
        if (write_buffer.empty()){

            return true;
        }
        currently_sending = write_buffer.front();
        write_buffer.pop();
    }

    size_t message_length = currently_sending.size();

    const size_t bytes_sent = write(client_fd, currently_sending.data(), message_length);

    const size_t rest = message_length - bytes_sent;
    if (rest) {
        currently_sending = currently_sending.substr(rest+bytes_sent);
        return false;
    }

    return true;
}

std::pair<std::string, json> MessageHandler::readMessage() {
    // I want first x bytes to determine message type and size

    const int bytes_to_read = read_header > 0 ?
            read_header : read_message_size - currently_read.size();

    std::cout << "MESSAGE HANDLER: bytes to read " << bytes_to_read << std::endl;
    std::vector<char> readBuffer(bytes_to_read);

    int bytes_read = read(client_fd, readBuffer.data(), bytes_to_read);

    if (!bytes_read) {
        return {"EOF", nullptr};
    }

    if (read_header > 0) {
        message_header.append(readBuffer.data());
        read_header -= bytes_read;
    }

    if (read_header < 0) {
        // no we have full header
        const auto surplus = (message_header.size()-message_header_size);
        const auto surplus_str = message_header.substr(message_header_size, message_header_size+surplus);

        message_header = message_header.erase(message_header_size);
        currently_read += surplus_str;
        read_header += surplus;
    }

    if (read_header == 0) {

        if (read_message_size == 0) {
            // first 20 char are the type
            int count = 0;
            int idx = 0;
            while (true) {
                if (message_header[idx] == '\n') {
                    count += 1;
                    if (count == 2) {
                        break;
                    }

                    idx++;
                    continue;
                }
                read_message_type += message_header[idx];

                count = 0;
                idx++;
            }

            // now for message size
            count = 0;
            idx++;

            int message_size_start_idx = idx;
            while (true) {
                if (message_header[idx] == '\n') {
                    count += 1;
                    if (count == 2) {
                        break;
                    }
                    idx++;
                    continue;
                }
                count = 0;
                idx++;
            }

            // it's minus currently read size because it might be extened by surplused amount
            read_message_size = std::stoi(message_header.substr(message_size_start_idx, idx-2)) - currently_read.size();

        } else {
            currently_read.append(readBuffer.data());

        }

    }

    if (!currently_read.empty() && read_message_size == currently_read.size()) {
        json json_message = json::parse(currently_read);
        std::string message_type = read_message_type;

        read_message_type = "";
        currently_read = "";
        message_header = "";
        read_header = 100;
        read_message_size = 0;
        return {message_type, json_message};
    }


    return {"", nullptr};
}

void MessageHandler::add_to_send_buffer(std::string message) {
    write_buffer.push(message);
}
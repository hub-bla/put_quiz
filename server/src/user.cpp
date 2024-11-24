#include "server/user.hpp"

User::User(int fd) : sock_fd(fd) {
    messenger = std::make_unique<MessageHandler>(fd);

}
User::~User() {

}


bool User::send_buffered() {
    return messenger->sendBuffered();
}

std::pair<std::string, json> User::read_message() {
    return messenger->readMessage();
};


void User::add_message_to_send_buffer(const std::string& message) {
    messenger->add_to_send_buffer(message);
};

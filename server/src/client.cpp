#include "server/client.hpp"

Client::Client(int fd) : sock_fd(fd) {
  messenger = std::make_unique<MessageHandler>(fd);
}
Client::~Client() {}

bool Client::send_buffered() { return messenger->sendBuffered(); }

std::pair<std::string, json> Client::read_message() {
  return messenger->readMessage();
};

void Client::add_message_to_send_buffer(const std::string &message) {
  messenger->add_to_send_buffer(message);
};

int Client::get_sock_fd() { return sock_fd; }

void Client::disconnect(const int &epoll_fd) {
  epoll_ctl(epoll_fd, EPOLL_CTL_DEL, sock_fd, NULL);
  close(sock_fd);
}
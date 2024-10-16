#include "server/socket.hpp"

Socket::Socket(int fd) : socket_fd(fd) {}

Socket::~Socket() { close(socket_fd); }

void Socket::on(const std::string &name,
                const std::function<void(std::string)> &callback) {
  callbacks.emplace(name, callback);
}

std::function<void(std::string &)>
Socket::handle_read(const std::string &callback_name) {
  auto it = callbacks.find(callback_name);

  return it->second;
}
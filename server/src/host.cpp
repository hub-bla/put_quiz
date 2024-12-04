#include "server/host.hpp"

Host::~Host() {}

Host::Host(int fd, std::function<void(std::string)> remove_game_fp,
           std::string code)
    : Client(fd), game_code(code), remove_game(remove_game_fp) {}

void Host::disconnect(const int &epoll_fd) {
  remove_game(game_code);
  epoll_ctl(epoll_fd, EPOLL_CTL_DEL, this->get_sock_fd(), NULL);
  close(this->get_sock_fd());
}
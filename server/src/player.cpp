#include "server/player.hpp"

Player::~Player() {}

Player::Player(int fd, std::function<void(std::string)> disconnect_from_game_fp,
               std::string code)
    : Client(fd), game_code(code),
      disconnect_from_game(disconnect_from_game_fp) {}

void Player::disconnect(const int &epoll_fd) {
  disconnect_from_game(game_code);
  epoll_ctl(epoll_fd, EPOLL_CTL_DEL, this->get_sock_fd(), NULL);
  close(this->get_sock_fd());
}
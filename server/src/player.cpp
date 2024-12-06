#include "server/player.hpp"

Player::~Player() {}

Player::Player(
    int fd,
    std::function<void(std::string, std::string, int)> disconnect_from_game_fp,
    std::string code, std::string player_name)
    : Client(fd), game_code(code), username(player_name),
      disconnect_from_game(disconnect_from_game_fp) {}

void Player::disconnect(const int &epoll_fd) {
  disconnect_from_game(game_code, username, this->get_sock_fd());
  epoll_ctl(epoll_fd, EPOLL_CTL_DEL, this->get_sock_fd(), NULL);
  close(this->get_sock_fd());
}

std::string Player::get_game_code() { return game_code; }
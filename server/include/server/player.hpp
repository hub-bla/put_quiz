#pragma once
#include "client.hpp"

class Player : public Client {
  std::string game_code;
  std::function<void(std::string)> disconnect_from_game;

public:
  Player(int fd, std::function<void(std::string)> disconnect_from_game_fp,
         std::string code);
  ~Player();
  void disconnect(const int &epoll_fd) override;
};
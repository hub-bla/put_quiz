#pragma once
#include "client.hpp"

class Player : public Client {
  std::string game_code;
  std::string username;
  std::function<void(std::string, std::string, int)> disconnect_from_game;

public:
  Player(int fd,
         std::function<void(std::string, std::string, int)>
             disconnect_from_game_fp,
         std::string code, std::string player_name);
  ~Player();
  void disconnect(const int &epoll_fd) override;
  std::string get_game_code();
};
#pragma once
#include "client.hpp"
#include <functional>

class Host : public Client {
  std::string game_code;
  std::function<void(std::string)> remove_game;

public:
  Host(int fd, std::function<void(std::string)> remove_game_fp,
       std::string code);
  ~Host();
  void disconnect(const int &epoll_fd) override;
};
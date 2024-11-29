#pragma once
#include "message_handler.hpp"
#include <string>
#include <sys/epoll.h>
#include <vector>

using json = nlohmann::json;

class Client {
  int sock_fd;
  std::unique_ptr<MessageHandler> messenger;

public:
  Client(int fd);
  virtual ~Client();

  std::pair<std::string, json> read_message();
  void add_message_to_send_buffer(const std::string &type,
                                  const std::string &message);
  bool send_buffered();
  int get_sock_fd();
  virtual void disconnect(const int &epoll_fd);
};
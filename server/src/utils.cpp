#include "server/utils.h"
#include <iostream>

void add_write_flag(const int &epoll_fd, const int &client_fd) {
  epoll_event client_events{};
  client_events.data.fd = client_fd;
  client_events.events = EPOLLIN | EPOLLOUT;
  epoll_ctl(epoll_fd, EPOLL_CTL_MOD, client_fd, &client_events);
}

std::vector<std::string> split(const std::string &str, char delimiter) {
  std::vector<std::string> result;
  std::istringstream stream(str);
  std::string token;

  while (std::getline(stream, token, delimiter)) {
    result.push_back(token);
  }

  return result;
}

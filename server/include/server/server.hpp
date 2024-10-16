#include <arpa/inet.h>
#include <iostream>
#include <memory>
#include <netdb.h>
#include <netinet/in.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <time.h>
#include <unistd.h>

#include "socket.hpp"

class Server {
private:
  int socket_fd;
  std::map<std::string, sockaddr_in> clients;
  std::function<void(std::shared_ptr<Socket> &)> on_connect;

public:
  Server();
  ~Server();
  template <typename T> void on(const std::string &&name, T callback) {
    if (name == "connect") {
      on_connect = callback;
    }
  }

  void listen();
};
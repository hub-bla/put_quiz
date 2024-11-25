#include <ctime>
#include <iostream>
#include <netinet/in.h>
#include <string>
#include <sys/epoll.h>
#include <sys/socket.h>
#include <unistd.h>
#include <unordered_map>
#include <functional>
#include "server/game.hpp"
#include "nlohmann/json.hpp"

using json = nlohmann::json;

#define SERVER_PORT 8913
#define QUEUE_SIZE 1
using namespace std;

unordered_map<std::string, unique_ptr<Game>> games;

unordered_map<int, shared_ptr<User>> users;

int epoll_fd;

void disconnect(json message, shared_ptr<User> user) {
    int client_fd = user->get_sock_fd();
    cout << "Client: " << client_fd << " disconnected" << endl;
    epoll_ctl(epoll_fd, EPOLL_CTL_DEL, client_fd, NULL);
    close(client_fd);
    users.erase(client_fd);
}

void ping(json message, shared_ptr<User> user) {
    int client_fd = user->get_sock_fd();
    epoll_event client_events;
    client_events.data.fd = client_fd;
    std::cout << "Message from client: " << message << std::endl;
    client_events.events = EPOLLIN | EPOLLOUT;
    epoll_ctl(epoll_fd, EPOLL_CTL_MOD, client_fd, &client_events);

    user->add_message_to_send_buffer("pong");
}

using CallbackType = std::function<void(json, shared_ptr<User>)>;

unordered_map<std::string, CallbackType> callbacks {
        {"DISCONNECT", disconnect},
        {"ping", ping}

};


std::string generate_game_code(const int len = 8) {
  static const char alphanum[] = "0123456789"
                                 "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  std::string new_game_code;
  new_game_code.reserve(len);

  for (int i = 0; i < len; ++i) {
    new_game_code += alphanum[rand() % (sizeof(alphanum) - 1)];
  }

  // generated code already exists -> try again
  if (games.find(new_game_code) == games.end()) {
    return generate_game_code();
  }

  return new_game_code;
}

int main() {
  srand((unsigned)time(NULL) * getpid());

  int server_fd;
  epoll_fd = epoll_create1(0);
  epoll_event ee;

  server_fd = socket(PF_INET, SOCK_STREAM, 0);
  int nFoo = 1;
  setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, (char *)&nFoo, sizeof(nFoo));
  struct sockaddr_in stAddr, stClientAddr;

  /* address structure */
  memset(&stAddr, 0, sizeof(struct sockaddr));
  stAddr.sin_family = AF_INET;
  stAddr.sin_addr.s_addr = htonl(INADDR_ANY);
  stAddr.sin_port = htons(SERVER_PORT);
  /* bind a name to a socket */
  auto nBind =
      bind(server_fd, (struct sockaddr *)&stAddr, sizeof(struct sockaddr));
  if (nBind < 0) {
    fprintf(stderr, "Can't bind a name to a socket.\n");
    exit(1);
  }

  std::cout << "Binded"
            << "\n";

  /* specify queue size */
  if (listen(server_fd, QUEUE_SIZE) < 0) {
    fprintf(stderr, "Can't set queue size.\n");
  }

  // add to epoll
  ee.events = EPOLLIN;
  ee.data.fd = server_fd;

  epoll_ctl(epoll_fd, EPOLL_CTL_ADD, server_fd, &ee);

  // just for checking the build
  return 0;

  while (1) {

    epoll_wait(epoll_fd, &ee, 1, -1);
    if (ee.data.fd == server_fd) {
      int client_fd = accept(server_fd, nullptr, nullptr);
      epoll_event client_events;
      cout << "Accepted client: " << client_fd << endl;
      users[client_fd] = make_shared<User>(client_fd);
      client_events.events = EPOLLIN | EPOLLHUP;
      client_events.data.fd = client_fd;
      epoll_ctl(epoll_fd, EPOLL_CTL_ADD, client_fd, &client_events);

    } else {
      const auto client_fd = ee.data.fd;

      const auto &user = users[client_fd];

      if (ee.events & EPOLLIN) {

        // set EPOLLOUT if needed to send a response
        const auto [type, message] = user->read_message();

        if (!type.empty()) {

            // now here we can do something like callbacks[type](message, user)
            // code becomes more modular
            callbacks[type](message, user);
        }
      }

      if (ee.events & EPOLLOUT) {
        bool done = user->send_buffered();

        if (done) {
          epoll_event client_events;
          client_events.data.fd = client_fd;
          client_events.events = EPOLLIN | EPOLLHUP;
          epoll_ctl(epoll_fd, EPOLL_CTL_MOD, client_fd, &client_events);
        }
      }
    }
  }

  return 0;
}

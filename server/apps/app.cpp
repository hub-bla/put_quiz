#include "nlohmann/json.hpp"
#include "server/game.hpp"
#include "server/host.hpp"
#include "server/player.hpp"
#include <ctime>
#include <functional>
#include <iostream>
#include <netinet/in.h>
#include <string>
#include <sys/epoll.h>
#include <sys/socket.h>
#include <unistd.h>
#include <unordered_map>

using json = nlohmann::json;

#define SERVER_PORT 8913
#define QUEUE_SIZE 1
using namespace std;

unordered_map<std::string, unique_ptr<Game>> games;

unordered_map<int, shared_ptr<Client>> clients;

int epoll_fd;

void delete_game(std::string game_code) {
  // function that will be based to the host constructor
  cout << "delete whole game" << endl;
  games.erase(game_code);
}

void remove_client_from_game(std::string game_code) {
  cout << "remove client from game" << endl;
}

std::string generate_game_code(const int len = 8) {
  static const char alphanum[] = "0123456789"
                                 "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  std::string new_game_code;
  new_game_code.reserve(len);

  for (int i = 0; i < len; ++i) {
    new_game_code += alphanum[rand() % (sizeof(alphanum) - 1)];
  }

  // generated code already exists -> try again
  if (games.find(new_game_code) != games.end()) {
    return generate_game_code();
  }

  return new_game_code;
}

void create_game(json message, shared_ptr<Client> client) {
  const int &client_fd = client->get_sock_fd();
  // TODO: check if host already send quiz

  std::string game_code = generate_game_code();
  games[game_code] = make_unique<Game>(game_code);
  cout << "create game" << endl;
  shared_ptr<Host> host = make_shared<Host>(client_fd, delete_game, game_code);
  clients[client_fd] = static_pointer_cast<Client>(host);
  json json_game_code;

  json_game_code["gameCode"] = game_code;

  epoll_event client_events{};
  client_events.data.fd = client_fd;
  client_events.events = EPOLLIN | EPOLLOUT;
  epoll_ctl(epoll_fd, EPOLL_CTL_MOD, client_fd, &client_events);
  string test = json_game_code.dump();
  cout << test << endl;
  clients[client_fd]->add_message_to_send_buffer(test);
}

void join_game(json message, shared_ptr<Client> client) {
  const int &client_fd = client->get_sock_fd();
  std::string game_code = message["game_code"];
  shared_ptr<Player> player =
      make_shared<Player>(client_fd, remove_client_from_game, game_code);
  clients[client_fd] = static_pointer_cast<Client>(player);
}

void disconnect(json message, shared_ptr<Client> client) {
  const int &client_fd = client->get_sock_fd();
  cout << "Client: " << client_fd << " disconnected" << endl;
  client->disconnect(epoll_fd); // removes from epoll and closes socket
  clients.erase(client_fd);
  cout << "Client: " << client_fd << " disconnected" << endl;
}

void ping(json message, shared_ptr<Client> client) {
  const int &client_fd = client->get_sock_fd();
  epoll_event client_events;
  client_events.data.fd = client_fd;
  std::cout << "Message from client: " << message << std::endl;
  client_events.events = EPOLLIN | EPOLLOUT;
  epoll_ctl(epoll_fd, EPOLL_CTL_MOD, client_fd, &client_events);

  client->add_message_to_send_buffer("pong");
}

using CallbackType = std::function<void(json, shared_ptr<Client>)>;

unordered_map<std::string, CallbackType> callbacks{{"DISCONNECT", disconnect},
                                                   {"ping", ping},
                                                   {"create_game", create_game},
                                                   {"join_game", join_game}

};

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
  //  return 0;

  while (1) {

    epoll_wait(epoll_fd, &ee, 1, -1);
    if (ee.data.fd == server_fd) {
      int client_fd = accept(server_fd, nullptr, nullptr);
      epoll_event client_events;
      cout << "Accepted client: " << client_fd << endl;
      clients[client_fd] = make_shared<Client>(client_fd);
      client_events.events = EPOLLIN | EPOLLHUP;
      client_events.data.fd = client_fd;
      epoll_ctl(epoll_fd, EPOLL_CTL_ADD, client_fd, &client_events);

    } else {
      const auto client_fd = ee.data.fd;

      const auto &client = clients[client_fd];

      if (ee.events & EPOLLIN) {

        // set EPOLLOUT if needed to send a response
        const auto [type, message] = client->read_message();

        if (!type.empty()) {

          // now here we can do something like callbacks[type](message, client)
          // code becomes more modular
          callbacks[type](message, client);
        }
      }

      if (ee.events & EPOLLOUT) {
        bool done = client->send_buffered();

        if (done) {
          cout << "Message was sent" << endl;
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

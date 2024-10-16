#include "server/server.hpp"
#include <nlohmann/json.hpp>
#include <thread>
#define SERVER_PORT 8913
#define QUEUE_SIZE 5

using json = nlohmann::json;

void run_new_socket(std::shared_ptr<Socket> socket) {
  std::cout << "Spawned new thread"
            << "\n";
  char buffer[20]; // probrably need exact size of type message
  int bytes_read;
  while (bytes_read = read(socket->socket_fd, &buffer,
                           sizeof buffer)) { // header has a fixed size
    auto on_type = std::string(buffer);
    const auto callback = socket->handle_read(on_type);
    std::cout << "Read type " << on_type.length() << "\n";
    if (callback == nullptr) {
      std::cout << "went here"
                << "\n";
      continue;
    }

    char msg_buffer[1000];
    std::string whole_msg;
    while (ssize_t bytes_read =
               read(socket->socket_fd, msg_buffer,
                    sizeof(msg_buffer) - 1)) { // this can be longer
      if (bytes_read <= 0) {
        break;
      }
      msg_buffer[bytes_read] = '\0';
      whole_msg.append(msg_buffer);
    }

    json parsedJson = json::parse(whole_msg);
    callback(whole_msg);
  }
  std::cout << bytes_read << "\n";
  std::cout << "Lost Connection"
            << "\n";
}

Server::Server() : socket_fd(socket(PF_INET, SOCK_STREAM, 0)) {
  //    setsockopt(socket_fd, SOL_SOCKET, SO_REUSEADDR);
  int nFoo = 1;
  setsockopt(socket_fd, SOL_SOCKET, SO_REUSEADDR, (char *)&nFoo, sizeof(nFoo));
  struct sockaddr_in stAddr, stClientAddr;
  /* address structure */
  memset(&stAddr, 0, sizeof(struct sockaddr));
  stAddr.sin_family = AF_INET;
  stAddr.sin_addr.s_addr = htonl(INADDR_ANY);
  stAddr.sin_port = htons(SERVER_PORT);

  /* bind a name to a socket */
  auto nBind =
      bind(socket_fd, (struct sockaddr *)&stAddr, sizeof(struct sockaddr));
  if (nBind < 0) {
    fprintf(stderr, "Can't bind a name to a socket.\n");
    exit(1);
  }
  /* specify queue size */
  if (::listen(socket_fd, QUEUE_SIZE) < 0) {
    fprintf(stderr, "Can't set queue size.\n");
  }
  std::cout << "Binded"
            << "\n";
}

Server::~Server() { close(socket_fd); }

void Server::listen() {
  socklen_t size = sizeof(struct sockaddr);
  while (true) {
    struct sockaddr client_addr;
    const int client_socket_fd =
        accept(socket_fd, (struct sockaddr *)&client_addr, &size);
    if (client_socket_fd == -1) {
      std::cout << "CLIENT SOCKET " << client_socket_fd << "\n";
      break;
    }

    auto socket = std::make_shared<Socket>(client_socket_fd);
    on_connect(socket);

    std::thread(run_new_socket, socket).detach();
  }
}

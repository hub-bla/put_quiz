#include <iostream>
#include <server/server.hpp>

using namespace std;
// wrong comment formatting

int main() {
  Server server;

  server.on("connect", [](std::shared_ptr<Socket> &socket) {
    cout << "Connected to " << socket->socket_fd << "\n";
    socket->on("run game", [](std::string game_options) {
      cout << "It's happening " << game_options << "\n";
    });
  });

  std::cout << "Passed so far!\n";

  // server.listen();
  return 0;
}

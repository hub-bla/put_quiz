#include "nlohmann/json.hpp"
#include "server/game.hpp"
#include "server/host.hpp"
#include "server/player.hpp"
#include "spdlog/spdlog.h"
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

void game_broadcast(const std::unique_ptr<Game> &game, const std::string &type,
                    const json &message);

void delete_game(const std::string &game_code);

void remove_client_from_game(const std::string &game_code,
                             const std::string &username, const int &client_fd);

std::string generate_game_code(const int &len);

class CallbackArgs {
public:
  shared_ptr<Client> client;
  json message;
  CallbackArgs(json mess, const shared_ptr<Client> &cli)
      : client(cli), message(std::move(mess)) {}

  ~CallbackArgs() = default;
};

// CALLBACKS
void create_game(const CallbackArgs &args);
void join_game(const CallbackArgs &args);
void disconnect(const CallbackArgs &args);
void ping(const CallbackArgs &args);
void next_question(const CallbackArgs &args);
void answer(const CallbackArgs &args);

using CallbackType = std::function<void(const CallbackArgs &)>;
unordered_map<std::string, CallbackType> callbacks{
    {"DISCONNECT", disconnect},       {"ping", ping},
    {"create_game", create_game},     {"join_game", join_game},
    {"next_question", next_question}, {"answer", answer}};

int main() {
  spdlog::set_level(spdlog::level::debug);
  srand((unsigned)time(nullptr) * getpid());

  int server_fd;
  epoll_fd = epoll_create1(0);
  epoll_event ee{};

  server_fd = socket(PF_INET, SOCK_STREAM, 0);
  int nFoo = 1;
  setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, (char *)&nFoo, sizeof(nFoo));
  sockaddr_in stAddr{};

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

  /* specify queue size */
  if (listen(server_fd, QUEUE_SIZE) < 0) {
    fprintf(stderr, "Can't set queue size.\n");
  }

  // add to epoll
  ee.events = EPOLLIN;
  ee.data.fd = server_fd;

  epoll_ctl(epoll_fd, EPOLL_CTL_ADD, server_fd, &ee);

  while (1) {
    epoll_wait(epoll_fd, &ee, 1, -1);
    if (ee.data.fd == server_fd) {
      int client_fd = accept(server_fd, nullptr, nullptr);

      epoll_event client_events{};
      clients[client_fd] = make_shared<Client>(client_fd);
      client_events.events = EPOLLIN | EPOLLHUP | EPOLLOUT;
      client_events.data.fd = client_fd;
      epoll_ctl(epoll_fd, EPOLL_CTL_ADD, client_fd, &client_events);
      spdlog::info("New client with sock desc {0}", client_fd);
    } else {
      const auto client_fd = ee.data.fd;
      const auto &client = clients[client_fd];

      if (ee.events & EPOLLIN) {
        const auto [type, message] = client->read_message();

        if (!type.empty() && callbacks.find(type) != callbacks.end()) {
          // now here we can do something like callbacks[type](message, client)
          // code becomes more modular
          auto callback_args = CallbackArgs(message, client);
          callbacks[type](callback_args);
        }
      }

      if (ee.events & EPOLLOUT) {
        bool done = client->send_buffered();

        if (done) {
          spdlog::debug("All messages from client's [{0}] buffer were sent",
                        client_fd);
          epoll_event client_events{};
          client_events.data.fd = client_fd;
          client_events.events = EPOLLIN | EPOLLHUP;
          epoll_ctl(epoll_fd, EPOLL_CTL_MOD, client_fd, &client_events);
        }
      }
    }
  }
  return 0;
}

void game_broadcast(const std::unique_ptr<Game> &game, const std::string &type,
                    const json &message) {
  const std::string &dumped_mess = message.dump();

  for (auto &player : game->players) {
    player.second->add_message_to_send_buffer(type, dumped_mess);
    add_write_flag(epoll_fd, player.first);
  }

  clients[game->host_desc]->add_message_to_send_buffer(type, dumped_mess);
  add_write_flag(epoll_fd, game->host_desc);
}

void delete_game(const std::string &game_code) {
  // function that will be passed to the host constructor
  spdlog::info("Delete Game: [{0}]", game_code);
  const auto &game = games[game_code];
  const auto players = game->players;

  for (const auto &player : players) {
    player.second->disconnect(epoll_fd);
  }

  games.erase(game_code);
}

void remove_client_from_game(const std::string &game_code,
                             const std::string &username,
                             const int &client_fd) {
  spdlog::info("Game: [{0}] Player: [{1}] - remove from the game", game_code,
               username);
  const auto &game = games[game_code];
  game->players.erase(client_fd);
  game->player_fd_usernames.erase(client_fd);
  game->usernames.erase(username);
}

std::string generate_game_code(const int &len) {
  static const char alphanum[] = "0123456789"
                                 "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  std::string new_game_code;
  new_game_code.reserve(len);
  while (true) {
    for (int i = 0; i < len; ++i) {
      new_game_code += alphanum[rand() % (sizeof(alphanum) - 1)];
    }

    // generated code already exists -> try again
    if (games.find(new_game_code) == games.end()) {
      break;
    }
    new_game_code = "";
  }

  return new_game_code;
}

void create_game(const CallbackArgs &args) {
  const int &client_fd = args.client->get_sock_fd();
  const json &message = args.message;
  // TODO: check if host already send quiz
  std::string game_code = generate_game_code(8);
  games[game_code] = make_unique<Game>(game_code, client_fd, message);

  const auto &game = games[game_code];

  shared_ptr<Host> host = make_shared<Host>(client_fd, delete_game, game_code);
  clients[client_fd] = static_pointer_cast<Client>(host);

  game->host_desc = client_fd;

  json json_game_code;
  json_game_code["gameCode"] = game_code;

  add_write_flag(epoll_fd, client_fd);
  clients[client_fd]->add_message_to_send_buffer("game_code",
                                                 json_game_code.dump());
  spdlog::info("Create game: {0}", game_code);
}

void join_game(const CallbackArgs &args) {
  const int &client_fd = args.client->get_sock_fd();
  std::string game_code = args.message["gameCode"];
  std::string username = args.message["username"];
  // TODO: validate if the game code actually exists and if the username does
  // not exists in the room

  if (games.find(game_code) == games.end()) {
    // TODO: SEND TO THE CLIENT THAT HE PASSED WRONG CODE
    return;
  }

  const auto &game = games[game_code];

  if (game->usernames.find(username) != game->usernames.end()) {
    json username_already_exists_message;
    username_already_exists_message["text"] =
        "Player with provided username already exists.";
    args.client->add_message_to_send_buffer(
        "error", username_already_exists_message.dump());
    add_write_flag(epoll_fd, client_fd);
    spdlog::error(
        "Game: [{0}] - player with username [{1}] already exists in this game.",
        game_code, username);
    return;
  }

  // TODO: If the game started should we allow new players to join ??

  shared_ptr<Player> player = make_shared<Player>(
      client_fd, remove_client_from_game, game_code, username);
  clients[client_fd] = static_pointer_cast<Client>(player);

  spdlog::debug("Add Player: [{0}] to the Game: [{1}]", username, game_code);
  game->add_player(clients[client_fd], username);

  int host_fd = games[game_code]->get_host_desc();
  auto host = clients[host_fd];

  json user_data{};
  user_data["username"] = args.message["username"];

  host->add_message_to_send_buffer("new_player", user_data.dump());
  add_write_flag(epoll_fd, host->get_sock_fd());
  json ok_message;
  ok_message["text"] = "ok";
  clients[client_fd]->add_message_to_send_buffer("ok", ok_message.dump());
  add_write_flag(epoll_fd, client_fd);
  spdlog::info("Game: [{0}], Player: [{1}] - joined room", game_code, username);
}

void next_question(const CallbackArgs &args) {
  const auto host = static_pointer_cast<Host>(args.client);
  const std::string &game_code = host->get_game_code();
  const auto &game = games[game_code];
  const json &question = game->get_next_question();
  //    if (question.empty()) { // might not work
  //        // end signal
  //        cout << "End of the game" << endl;
  //        // broadcast end
  //        return;
  //    }
  game_broadcast(game, "question", question);
  game_broadcast(game, "standing", game->standings);
}

void answer(const CallbackArgs &args) {
  const auto player = static_pointer_cast<Player>(args.client);
  const int &player_fd = player->get_sock_fd();
  const std::string &game_code = player->get_game_code();
  const auto &game = games[game_code];
  const std::string &username = game->player_fd_usernames[player_fd];
  const json &message = args.message;

  spdlog::debug("Game: [{0}], Player: [{1}] - answer was sent", game_code,
                username);

  if (!game->submit_answer(username, message)) {
    spdlog::warn(
        "Game: [{0}] Player: [{1}] - Answer not for the current question",
        game_code, username);
    return;
  }

  game_broadcast(game, "standing", game->standings);
}

void disconnect(const CallbackArgs &args) {
  const int &client_fd = args.client->get_sock_fd();
  args.client->disconnect(epoll_fd); // removes from epoll and closes socket
  clients.erase(client_fd);
  spdlog::info("Client: [{0}] - disconnected", client_fd);
}

void ping(const CallbackArgs &args) {
  const int &client_fd = args.client->get_sock_fd();

  std::cout << "Message from client: " << args.message << std::endl;

  json pongJson;
  pongJson["pong"] = "ping";

  args.client->add_message_to_send_buffer("pong", pongJson.dump());
  add_write_flag(epoll_fd, client_fd);
}
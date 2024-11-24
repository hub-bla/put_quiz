#include "server/message_handler.hpp"
#include <string>
#include <vector>

using json = nlohmann::json;

class User {
  int sock_fd;
  std::unique_ptr<MessageHandler> messenger;

public:
  User(int fd);
  ~User();

  std::pair<std::string, json> read_message();
  void add_message_to_send_buffer(const std::string &message);
  bool send_buffered();
};
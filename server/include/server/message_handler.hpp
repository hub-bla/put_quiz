#include "nlohmann/json.hpp"
#include "utils.h"
#include <queue>
#include <string>
#include <unistd.h>

#define HEADER_SIZE 100
using json = nlohmann::json;

class MessageHandler {
private:
  const int message_header_size = 100;
  int client_fd;
  std::queue<std::string> write_buffer;
  std::string currently_sending;
  std::string currently_read;

  std::string message_header;
  int read_header = 100;
  std::string read_message_type;
  int read_message_size = 0;

public:
  MessageHandler(int fd);
  ~MessageHandler() = default;

  void add_to_send_buffer(const std::string &type, const std::string &message);
  bool sendBuffered();
  std::pair<std::string, json> readMessage();
};
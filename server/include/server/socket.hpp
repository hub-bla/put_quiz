#include <arpa/inet.h>
#include <functional>
#include <map>
#include <netdb.h>
#include <netinet/in.h>
#include <stdlib.h>
#include <string.h>
#include <string>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>

class Socket {
private:
  std::map<std::string, std::function<void(std::string)>> callbacks;

public:
  int socket_fd;
  explicit Socket(int fd);
  ~Socket();
  void on(const std::string &name,
          const std::function<void(std::string)> &callback);
  std::function<void(std::string &)>
  handle_read(const std::string &callback_name);
};

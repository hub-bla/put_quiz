#include <sstream>
#include <string>
#include <sys/epoll.h>
#include <vector>

void add_write_flag(const int &epoll_fd, const int &client_fd);

std::vector<std::string> split(const std::string &str, char delimiter);

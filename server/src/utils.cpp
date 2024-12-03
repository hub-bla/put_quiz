#include "server/utils.h"

std::vector<std::string> split(const std::string &str, char delimiter) {
  std::vector<std::string> result;
  std::istringstream stream(str);
  std::string token;

  while (std::getline(stream, token, delimiter)) {
    result.push_back(token);
  }

  return result;
}
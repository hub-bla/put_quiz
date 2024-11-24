#include "user.hpp"
#include <memory>
#include <string>
#include <unordered_map>
#include <vector>
class Game {
public:
  std::string game_code;
  std::unordered_map<std::string, int> user_answers;
  std::vector<std::shared_ptr<User>> users;

  Game();
  ~Game();
};
#include "client.hpp"
#include <memory>
#include <string>
#include <unordered_map>
#include <vector>

class Game {
public:
  std::string game_code;
  std::unordered_map<std::string, int> user_answers;
  std::vector<std::shared_ptr<Client>> clients;

  Game(std::string code);

  /* In the game destructor every client will be disconnected
   * That's what the host would want to use when he is disconnecting
   * so in this case just by removing the pointer to game room i will be able to
   * do that
   * */
  ~Game();
};
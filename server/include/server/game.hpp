#include "client.hpp"
#include "quiz.hpp"
#include <memory>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

class Game {
private:
public:
  int host_desc;
  std::string game_code;
  json standings;
  std::unordered_map<int, std::shared_ptr<Client>> players;
  std::unordered_map<int, std::string> player_fd_usernames;
  std::unordered_set<std::string> usernames;

  Quiz quiz;
  Game(const std::string &code, int host_desc, const json &host_quiz);

  /* In the game destructor every client will be disconnected
   * That's what the host would want to use when he is disconnecting
   * so in this case just by removing the pointer to game room i will be able to
   * do that
   * */
  ~Game();

  int get_host_desc() const;

  json get_next_question();

  void add_player(std::shared_ptr<Client> cli, const std::string &username);
  bool submit_answer(const std::string &username, const json &answer);
};
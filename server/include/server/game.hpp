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
  Game(std::string code, int host_desc, const json &host_quiz);

  ~Game() = default;

  int get_host_desc() const;

  json get_next_question();

  void add_player(const std::shared_ptr<Client> &cli,
                  const std::string &username);
  bool submit_answer(const std::string &username, const json &answer);
};
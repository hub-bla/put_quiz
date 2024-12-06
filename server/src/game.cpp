#include "server/game.hpp"
#include <iostream>
#include <utility>
Game::Game(std::string code, int host_fd, const json &host_quiz)
    : host_desc(host_fd), game_code(std::move(code)), quiz(host_quiz), is_started(false) {
  standings["numberOfQuestions"] = quiz.get_number_of_questions();
  standings["standings"] = json();
}

int Game::get_host_desc() const { return host_desc; }

json Game::get_next_question() { 
    if (!this->is_started){
    this->is_started = true;
  }
  return quiz.get_next_question();
}

void Game::add_player(const std::shared_ptr<Client> &cli,
                      const std::string &username) {
  const int &client_fd = cli->get_sock_fd();
  players[client_fd] = cli;
  player_fd_usernames[client_fd] = username;
  usernames.insert(username);

  json playerStanding;
  playerStanding["answeredCorrectly"] = 0;
  playerStanding["answeredWrong"] = 0;
  playerStanding["points"] = 0;
  standings["standings"][username] = playerStanding;
}

bool Game::submit_answer(const std::string &username, const json &answer) {
  const json &question = quiz.get_current_question();

  if (question["text"] != answer["text"]) {
    return false; // answer is not for the current question
  }

  if (quiz.validate_answer(answer)) {
    auto &answeredCorrectlyJSON =
        standings["standings"][username]["answeredCorrectly"];
    auto &pointsJSON = standings["standings"][username]["points"];
    answeredCorrectlyJSON = answeredCorrectlyJSON.get<int>() + 1;
    pointsJSON = pointsJSON.get<int>() + 100;
  } else {
    auto &answeredWrongJSON = standings["standings"][username]["answeredWrong"];
    answeredWrongJSON = answeredWrongJSON.get<int>() + 1;
  }

  return true;
}

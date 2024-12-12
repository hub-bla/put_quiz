#include "server/game.hpp"
#include <cmath>
#include <iostream>
#include <utility>

// todo create config file
#define TIME_FOR_ANS_MS 5000
#define ANSWER_LIMIT 0.5

Game::Game(std::string code, int host_fd, const json &host_quiz)
    : host_desc(host_fd), game_code(std::move(code)), quiz(host_quiz),
      is_started(false), current_question_answered(0), standings_updated(false) {
  standings["numberOfQuestions"] = quiz.get_number_of_questions();
  standings["standings"] = json();
}

int Game::get_host_desc() const { return host_desc; }

json Game::get_next_question() {
  for(auto username: usernames){
    standings["standings"][username]["answered"] = 0;
  }

  if (!this->is_started) {
    this->is_started = true;
  }
  standings_updated = false;
  current_question_answered = 0;
  question_start = std::chrono::steady_clock::now();
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
  playerStanding["answered"] = 0;
  standings["standings"][username] = playerStanding;
}

bool Game::submit_answer(const std::string &username, const json &answer) {
  const json &question = quiz.get_current_question();

  if (question["text"] != answer["text"]) {
    return false; // answer is not for the current question
  }

  current_question_answered++;
  if (quiz.validate_answer(answer)) {
    auto &answeredCorrectlyJSON =
        standings["standings"][username]["answeredCorrectly"];
    auto &pointsJSON = standings["standings"][username]["points"];
    answeredCorrectlyJSON = answeredCorrectlyJSON.get<int>() + 1;
    pointsJSON = pointsJSON.get<int>() + calculate_points();
  } else {
    auto &answeredWrongJSON = standings["standings"][username]["answeredWrong"];
    answeredWrongJSON = answeredWrongJSON.get<int>() + 1;
  }

  auto &answeredJSON = standings["standings"][username]["answered"];
  answeredJSON = 1;

  return true;
}

int Game::calculate_points() {
  const auto now = std::chrono::steady_clock::now();
  const auto int_ms = std::chrono::duration_cast<std::chrono::milliseconds>(
      now - question_start);

  double p_result =
      (1 - (std::pow(int_ms.count(), 2) / std::pow(TIME_FOR_ANS_MS, 2))) * 100;
  int result = std::round(p_result);
  return result >= 0 ? result : 0;
}

bool Game::answers_over_limit() {
  return static_cast<double>(current_question_answered) / players.size() >=
                 ANSWER_LIMIT
             ? true
             : false;
}

void Game::update_standings(){
  if(standings_updated){
    return;
  }
  for(auto username: usernames){
    auto &playerJSON = standings["standings"][username];
    if(!playerJSON["answered"].get<int>() && is_started){
      playerJSON["answeredWrong"] = playerJSON["answeredWrong"].get<int>() + 1;
    }
  }
  standings_updated = true;
}
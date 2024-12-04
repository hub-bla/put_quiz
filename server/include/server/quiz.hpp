#pragma once

#include "nlohmann/json.hpp"
#include "server/question.hpp"
#include <queue>

using json = nlohmann::json;

class Quiz {
private:
  std::queue<Question> questions; // only sequentional access
  Question current_question;
  int number_of_questions;
  int count = 0;
  void parse_content(const json &content);

public:
  Quiz(json content);
  ~Quiz();
  json get_next_question();
  bool validate_answer(const json &answer);
  bool is_finished();
  int get_number_of_questions() const;
  json get_current_question();
};
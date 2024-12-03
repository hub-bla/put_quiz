#pragma once

#include "nlohmann/json.hpp"
#include "server/question.hpp"
#include <queue>

using json = nlohmann::json;

class Quiz {
  std::queue<Question> questions; // only sequentional access
  std::unique_ptr<Question> current_question;
  int count;

public:
  Quiz(json content);
  ~Quiz();
  json get_next_question();
  bool validate_answer(json answer);
  bool is_finished();

private:
  void parse_content(json content);
};
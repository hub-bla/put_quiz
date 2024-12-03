#pragma once

#include "nlohmann/json.hpp"
#include <string>

using json = nlohmann::json;

class Question {
  json question;
  int correct_answer_Idx;

public:
  explicit Question(json question);
  ~Question();
  json get_question();
  bool validate_answer(json answer);
};
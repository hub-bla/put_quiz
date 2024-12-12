#include "server/question.hpp"

Question::Question(json question) {
  this->question = question;
  correct_answer_Idx = question["correctAnswerIdx"].get<int>();
  this->question.erase("correctAnswerIdx");
}

bool Question::validate_answer(const json &answer) const {
  return answer["answerIdx"].get<int>() == correct_answer_Idx;
}

Question::~Question() {}

json Question::get_question() { return question; }
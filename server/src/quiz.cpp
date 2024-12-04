#include "server/quiz.hpp"
#include <iostream>
Quiz::Quiz(json content) { parse_content(content); };

Quiz::~Quiz(){};

json Quiz::get_next_question() {
  current_question = questions.front();
  questions.pop();
  count -= 1;
  if (count == 0) {
    return nullptr;
  }

  return current_question.get_question();
};

bool Quiz::is_finished() { return questions.empty(); };

bool Quiz::validate_answer(const json &answer) {
  return current_question.validate_answer(answer);
};

void Quiz::parse_content(const json &content) {
  for (auto &question : content["questions"]) {
    questions.push(question);
    count++;
  };
  number_of_questions = count;
};

int Quiz::get_number_of_questions() const { return number_of_questions; }

json Quiz::get_current_question() { return current_question.get_question(); }
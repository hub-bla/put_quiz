#include "server/question.hpp"


explicit Question::Question(json question){
    this->question = question;
    correct_answer_Idx = question["correctAnswerIdx"].get<int>();
    this->question.erase("correctAnswerIdx");
};


bool Question::validate_answer(json answer){
    if(answer["answerIdx"].get<int>() == correct_answer_Idx){
        return true;
    }
    return false;
};

Question::~Question(){};

json Question::get_question(){
    return question;
};
#include "server/question.hpp"


Question::Question(json question){
    this->question = question;
    correct_answer_Idx = question["correctAnswerIdx"].get<int>();
    this->question.erase("correctAnswerIdx");
};


bool Question::validate_answer(json answer){
    //TODO based on answer structure check correctess

};

Question::~Question(){};

json Question::get_question(){
    return question;
};
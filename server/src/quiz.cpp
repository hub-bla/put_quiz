#include "server/quiz.hpp"  


Quiz::Quiz(json content) : finished(false), count(0), current_question(nullptr){
    parse_content(content);
};


Quiz::~Quiz() {};


json Quiz::get_next_question(){
    current_question = std::make_unique<Question>(std::move(questions.front()));
    questions.pop();
    count -= 1;
    if(count == 0){
        finished == true;
    };

    return current_question->get_question();
};

bool Quiz::is_finished(){
    return finished;
};

bool Quiz::validate_answer(json answer){
    return current_question->validate_answer(answer);
};

void Quiz::parse_content(json content)
    {for (auto& question : content["questions"]) {
        questions.push(Question(question));
        count++;
    }
    finished = count > 0 ? false : true;
};
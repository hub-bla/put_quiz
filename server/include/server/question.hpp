#pragma once

#include <string>
#include "nlohmann/json.hpp"

using json = nlohmann::json;

class Question{
    json question;
    int correct_answer_Idx;

    public:
    Question(json question);
    ~Question();
    json get_question();
    bool validate_answer(json answer);
};
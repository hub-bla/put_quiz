#include "server/game.hpp"

Game::Game(std::string code, int host_fd)
    : host_desc(host_fd), game_code(code) {}

Game::~Game() {}

int Game::get_host_desc() { return host_desc; }
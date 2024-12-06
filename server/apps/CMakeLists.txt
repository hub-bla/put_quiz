add_executable(app app.cpp
        ../include/server/message_handler.hpp)

target_link_libraries(app PRIVATE server_lib nlohmann_json spdlog)

add_test(app_test app)

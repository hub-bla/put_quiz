add_executable(app app.cpp)

target_link_libraries(app PRIVATE server_lib nlohmann_json)

add_test(app_test app)

file(GLOB HEADER_LIST CONFIGURE_DEPENDS "${CrappyTest_SOURCE_DIR}/include/server/*.hpp")
add_library(server_lib ${HEADER_LIST}
        message_handler.cpp
        game.cpp
        client.cpp
        host.cpp
        player.cpp
        utils.cpp)

target_include_directories(server_lib PUBLIC ../include)
target_link_libraries(server_lib PRIVATE nlohmann_json)

target_compile_features(server_lib PUBLIC cxx_std_11)
target_compile_options(server_lib PRIVATE -pthread)

source_group(
        TREE "${CrappyTest_SOURCE_DIR}/include"
        PREFIX "Header Files"
        FILES ${HEADER_LIST})
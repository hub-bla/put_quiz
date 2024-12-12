file(GLOB HEADER_LIST CONFIGURE_DEPENDS "${PutQuiz_SOURCE_DIR}/include/server/*.hpp")
file(GLOB IMPLEMENTATION_LIST CONFIGURE_DEPENDS "*.cpp")
add_library(server_lib ${HEADER_LIST}
        ${IMPLEMENTATION_LIST})

target_include_directories(server_lib PUBLIC ../include)
target_link_libraries(server_lib PRIVATE nlohmann_json spdlog pthread rt)

target_compile_features(server_lib PUBLIC cxx_std_11)
target_compile_options(server_lib PRIVATE -pthread)

source_group(
        TREE "${PutQuiz_SOURCE_DIR}/include"
        PREFIX "Header Files"
        FILES ${HEADER_LIST})
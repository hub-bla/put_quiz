add_library(nlohmann_json INTERFACE)
add_library(spdlog INTERFACE)

target_include_directories(nlohmann_json INTERFACE
    "${CMAKE_CURRENT_SOURCE_DIR}/nlohmann_json/single_include"
)

target_include_directories(spdlog INTERFACE
        "${CMAKE_CURRENT_SOURCE_DIR}/spdlog/include"
)
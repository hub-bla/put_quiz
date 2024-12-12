cmake_minimum_required(VERSION 3.15...3.30)

project(
        PutQuiz
        VERSION 0.1
        DESCRIPTION "An example project with CMake"
        LANGUAGES CXX
)

if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE "Debug")
endif()

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

add_compile_options(-Wall -Wextra -Wpedantic)

set(PutQuiz_SOURCE_DIR ${CMAKE_SOURCE_DIR})

include (CTest)

add_subdirectory(thirdparty)

add_subdirectory(src)

add_subdirectory(apps)

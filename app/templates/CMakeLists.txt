cmake_minimum_required(VERSION <%= CMakeVersion %>)

# Enable CCache
find_program(CCACHE_PROGRAM ccache)
if(CCACHE_PROGRAM)
    set_property(GLOBAL PROPERTY RULE_LAUNCH_COMPILE "${CCACHE_PROGRAM}")
endif()

# Kepp Conan Project and CMake project names in sync
project(${CONAN_PROJECT_NAME} VERSION ${CONAN_PROJECT_VERSION})

# Store executables in "bin" subdirectory.
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin")

# Export compile_commands.json
set(CMAKE_EXPORT_COMPILE_COMMANDS TRUE)

# Add an executable that is called the same as Conan Project
add_executable(${CONAN_PROJECT_NAME}
    ${PROJECT_SOURCE_DIR}/source/main.cpp
    ${PROJECT_SOURCE_DIR}/source/Application.cpp)
target_include_directories(${CONAN_PROJECT_NAME} PRIVATE source)

# Unit-Testing
include(CTest)
if (BUILD_TESTING)
    add_subdirectory(test/unit)
endif()

install(TARGETS ${CONAN_PROJECT_NAME}
        RUNTIME DESTINATION bin
        LIBRARY DESTINATION lib)

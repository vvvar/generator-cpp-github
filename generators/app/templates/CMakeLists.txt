cmake_minimum_required(VERSION 3.17.1)

# Enable CCache
find_program(CCACHE_PROGRAM ccache)

if(CCACHE_PROGRAM)
  set_property(GLOBAL PROPERTY RULE_LAUNCH_COMPILE "${CCACHE_PROGRAM}")
endif()

# Kepp Conan Project and CMake project names in sync
project(${CONAN_PROJECT_NAME} VERSION ${CONAN_PROJECT_VERSION})

# Store executables in the "bin" subdirectory.
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin")

# Export compile_commands.json
set(CMAKE_EXPORT_COMPILE_COMMANDS TRUE)

# Add an executable that is called the same as Conan Project
add_executable(${CONAN_PROJECT_NAME} 
  ${PROJECT_SOURCE_DIR}/source/main.cpp
  ${PROJECT_SOURCE_DIR}/source/foo/Foo.cpp)

# Since it is an app, we don't have public includes. Thus store them where the source is
target_include_directories(${CONAN_PROJECT_NAME} PRIVATE source)

# Unit-Testing
# enable_testing() should be added in the top-CMakeLists.txt.
# Otherwise - CTest will not run from the the build root
enable_testing()
add_subdirectory(test/unit)

# Copy binary
install(TARGETS ${CONAN_PROJECT_NAME} LIBRARY DESTINATION bin)

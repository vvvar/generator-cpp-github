# Find the unit-testing framework
find_package(GTest CONFIG REQUIRED)

# Create the unit-test executable
add_executable(${CONAN_PROJECT_NAME}-test 
    source/Foo.test.cpp
    ${PROJECT_SOURCE_DIR}/source/foo/Foo.cpp)

# We will need headers from our app
target_include_directories(${CONAN_PROJECT_NAME}-test PRIVATE ${PROJECT_SOURCE_DIR}/source)

# Link with the library under test and testing framework
target_link_libraries(${CONAN_PROJECT_NAME}-test PRIVATE GTest::gtest_main GTest::gmock_main)

# Add the test that we can run with the ctest
add_test(NAME UnitTestSuite COMMAND ${CONAN_PROJECT_NAME}-test WORKING_DIRECTORY ${CMAKE_RUNTIME_OUTPUT_DIRECTORY})
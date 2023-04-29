# Find the unit-testing framework
find_package(GTest CONFIG REQUIRED)

# Create the unit-test executable
add_executable(${CONAN_PROJECT_NAME}-test source/Foo.test.cpp)

# Link with the library under test and testing framework
target_link_libraries(${CONAN_PROJECT_NAME}-test PRIVATE ${CONAN_PROJECT_NAME} GTest::gtest_main GTest::gmock_main)

# Add the test that we can run with the ctest
add_test(NAME UnitTestSuite COMMAND ${CONAN_PROJECT_NAME}-test WORKING_DIRECTORY ${CMAKE_RUNTIME_OUTPUT_DIRECTORY})
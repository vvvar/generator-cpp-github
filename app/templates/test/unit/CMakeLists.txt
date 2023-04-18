enable_testing()

find_package(GTest REQUIRED)

add_executable(${CONAN_PROJECT_NAME}-test Application.test.cpp)

target_link_libraries(${CONAN_PROJECT_NAME}-test PRIVATE GTest::gtest_main GTest::gmock_main)

add_test(NAME UnitTestSuite COMMAND ${CONAN_PROJECT_NAME}-test WORKING_DIRECTORY ${CMAKE_RUNTIME_OUTPUT_DIRECTORY})
#include <gtest/gtest.h>

#include "Foo.hpp"

TEST(FooTestSuite, TestAnswerOnUltimateQuestionOfLife) {
  EXPECT_EQ(project::Foo().answerOnUltimateQuestionOfLife(), 42);
}
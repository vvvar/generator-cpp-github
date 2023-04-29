#include <gtest/gtest.h>

#include <foo/Foo.hpp>

TEST (FooTestSuite, TestAnswerOnUltimateQuestionOfLife) { EXPECT_EQ (project::Foo().AnswerOnUltimateQuestionOfLife(), 42); }

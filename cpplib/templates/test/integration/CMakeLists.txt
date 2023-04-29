cmake_minimum_required(VERSION <%= CMakeVersion %>)
project(PackageTest CXX)

find_package(<%= ProjectName %> CONFIG REQUIRED)

add_executable(integration source/app.cpp)
target_link_libraries(integration <%= ProjectName %>::<%= ProjectName %>)
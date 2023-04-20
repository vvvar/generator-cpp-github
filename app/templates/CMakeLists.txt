cmake_minimum_required(VERSION <%= CMakeVersion %>)

# Enable CCache
find_program(CCACHE_PROGRAM ccache)
if(CCACHE_PROGRAM)
    set_property(GLOBAL PROPERTY RULE_LAUNCH_COMPILE "${CCACHE_PROGRAM}")
endif()

# Kepp Conan Project and CMake project names in sync
project(${CONAN_PROJECT_NAME} VERSION ${CONAN_PROJECT_VERSION})

# Store executables in "bin" subdirectory.
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib")

# Export compile_commands.json
set(CMAKE_EXPORT_COMPILE_COMMANDS TRUE)

# Add an executable that is called the same as Conan Project
add_library(${CONAN_PROJECT_NAME} ${PROJECT_SOURCE_DIR}/source/Foo.cpp)

# Add public include paths
target_include_directories(${CONAN_PROJECT_NAME} PUBLIC include)

# Unit-Testing
include(CTest)
if (BUILD_TESTING)
    add_subdirectory(test/unit)
endif()

# Create XXXConfig.cmake file
include(GNUInstallDirs)
set(INCLUDE_INSTALL_DIR ${CMAKE_INSTALL_INCLUDEDIR}/Foo
    CACHE PATH "Location of header files" )
set(SYSCONFIG_INSTALL_DIR ${CMAKE_INSTALL_SYSCONFDIR}/foo
    CACHE PATH "Location of configuration files" )
include(CMakePackageConfigHelpers)
configure_package_config_file("cmake/config.cmake.in"
  "${CMAKE_CURRENT_BINARY_DIR}/${CONAN_PROJECT_NAME}Config.cmake"
  INSTALL_DESTINATION "${CMAKE_INSTALL_LIBDIR}/cmake/${CONAN_PROJECT_NAME}"
  PATH_VARS INCLUDE_INSTALL_DIR SYSCONFIG_INSTALL_DIR)

# Create XXXConfigVersion.cmake file
write_basic_package_version_file(
  "${CMAKE_CURRENT_BINARY_DIR}/${CONAN_PROJECT_NAME}ConfigVersion.cmake"
  VERSION 1.2.3
  COMPATIBILITY SameMajorVersion )
install(FILES "${CMAKE_CURRENT_BINARY_DIR}/${CONAN_PROJECT_NAME}Config.cmake"
              "${CMAKE_CURRENT_BINARY_DIR}/${CONAN_PROJECT_NAME}ConfigVersion.cmake"
        DESTINATION "${CMAKE_INSTALL_LIBDIR}/cmake/${CONAN_PROJECT_NAME}" )

# Copy header files
install(DIRECTORY include DESTINATION include)

# Copy library
install(TARGETS ${CONAN_PROJECT_NAME} LIBRARY DESTINATION lib)

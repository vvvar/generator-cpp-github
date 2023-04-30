# Choose conan host(target) profile based on platform. 
# Documentation - https://docs.conan.io/2/reference/config_files/profiles.html#reference-config-files-profiles
conan_host_profile := if os() == "macos" {
    "config/conan/macos-armv8.profile"
} else if os() == "windows" {
    "config/conan/windows-x86_64.profile"
} else if os() == "linux" {
    "config/conan/linux-x86_64.profile"
} else {
    ""
}

# Setup all necessary dependencies for macOS
[macos]
setup:
    brew update # Get available packages
    brew bundle install --file=config/system/requirements.macos.brew.rb --no-lock # Install system dependencies from config file
    pip3 install -r config/system/requirements.dev.pip.txt # Install Python dependencies
    conan profile detect --force # Setup "default" Conan profile(none by default)

# Setup all necessary dependencies for Windows
[windows]
setup:
    chocolatey install config/system/requirements.windows.choco.config --ignore-package-exit-codes # Install system dependencies from config file
    pip3 install -r config/system/requirements.dev.pip.txt # Install Python dependencies
    conan profile detect --force # Setup "default" Conan profile(none by default)

# Setup all necessary dependencies for Linux
[linux]
setup:
    sudo apt-get update # Update available packages list
    xargs -a config/system/requirements.linux.apt.txt sudo apt-get install -y # Install system dependencies from config file
    pip3 install -r config/system/requirements.dev.pip.txt # Install Python dependencies
    conan profile detect --force # Setup "default" Conan profile(none by default)

# Cleanup build, temp and all generated files for Unix
cleanup:
    rm -rf build # Remove project build dir
    rm -f CMakeUserPresets.json # Remove project user presets
    rm -rf test/integration/build # Remove testings build dir
    rm -f test/integration/CMakeUserPresets.json # Remove testing user presets
    rm -rf Testing # Remove unit-testing dir
    rm -rf ~/.conan2/p # Clean Conan cache
    rm -f config/system/requirements.macos.brew.rb.lock.json # Remove brew lock(macOS only)

# Build and package using Conan
build:
    conan install . --profile:host {{conan_host_profile}} --build missing # Install dependencies(build from sources if pre-build package is not available)
    conan build . --profile:host {{conan_host_profile}} # Build(eventually it will use CMake)
    conan export-pkg . --profile:host {{conan_host_profile}} # Create Conan package in local Conan Cache 

# Run static code analysis
sca:
    cppcheck --project=build/Release/compile_commands.json --enable=all --report-progress --check-config --suppress=missingIncludeSystem 

# Run unit-tests
test-unit:
    ctest --test-dir build/Release # Invoke unit tests that was build as separate target(part of build)

# Run all kinds of testing
test: test-unit
@echo off
set ProjectRoot=%~dp0/../..
cd %ProjectRoot%

call conan install . --build missing && conan build . && conan export-pkg . || exit \b 1
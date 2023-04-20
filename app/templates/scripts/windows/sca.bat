@echo off
set ProjectRoot=%~dp0/../..
cd %ProjectRoot%

call "C:\Program Files\Cppcheck --project=build/Release/compile_commands.json --enable=all --report-progress --check-config --suppress=missingIncludeSystem" || exit \b 1
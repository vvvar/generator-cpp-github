@echo off
set ProjectRoot=%~dp0/../..
cd %ProjectRoot%
cd build/Release

call ctest . || exit \b 1
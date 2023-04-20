@echo off
set ProjectRoot=%~dp0/../..
cd %ProjectRoot%

call conan test test/integration `conan inspect . -f json | jq -r '. = .name + "/" + .version'` --no-remote || exit \b 1
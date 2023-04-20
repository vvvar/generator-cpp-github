@echo off
set ProjectRoot=%~dp0/../..
cd %ProjectRoot%

call chocolatey install config/system/requirements.windows.choco.config --ignore-package-exit-codes || exit \b 1

call conan profile detect --force || exit \b 1
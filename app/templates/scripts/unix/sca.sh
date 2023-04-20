BASEDIR=$(dirname "$0")
cd $BASEDIR/../../

cppcheck --project=build/Release/compile_commands.json --enable=all --report-progress --check-config --suppress=missingIncludeSystem
BASEDIR=$(dirname "$0")
cd $BASEDIR/../../

conan install . --build missing && conan build . && conan export-pkg .
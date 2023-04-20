BASEDIR=$(dirname "$0")
cd $BASEDIR/../../

conan test test/integration `conan inspect . -f json | jq -r '. = .name + "/" + .version'` --no-remote
BASEDIR=$(dirname "$0")
cd $BASEDIR/../../

brew update && brew bundle install --file=config/system/requirements.macos.brew.rb

conan profile detect
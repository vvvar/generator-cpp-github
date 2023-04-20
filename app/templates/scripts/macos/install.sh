BASEDIR=$(dirname "$0")
cd $BASEDIR/../../

brew update && brew bundle install --file=config/system/requirements.macos.brew.rb

pip3 install -r config/system/requirements.dev.pip.txt

conan profile detect --force
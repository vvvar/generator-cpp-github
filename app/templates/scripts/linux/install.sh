BASEDIR=$(dirname "$0")
cd $BASEDIR/../../

sudo apt-get update
xargs -a config/system/requirements.linux.apt.txt sudo apt-get install -y

pip3 install -r config/system/requirements.dev.pip.txt

conan profile detect --force
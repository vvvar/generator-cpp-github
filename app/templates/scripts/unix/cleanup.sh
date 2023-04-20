BASEDIR=$(dirname "$0")
cd $BASEDIR/../../

# Remove build artefacts from root
rm -rf build 2> /dev/null
rm CMakeUserPresets.json  2> /dev/null

# Remove build artefacta from tests
rm -rf Testing
rm -rf test/integration/build 2> /dev/null
rm test/integration/CMakeUserPresets.json 2> /dev/null

# Remove Conan Cache
rm -rf ~/.conan2/p 2> /dev/null

# Remove installation Cache
rm config/system/requirements.macos.brew.rb.lock.json 2> /dev/null
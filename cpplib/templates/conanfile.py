from conan import ConanFile
from conan.tools.cmake import CMakeToolchain, CMakeDeps, CMake, cmake_layout

class ConanProject(ConanFile):
    name = "<%= ProjectName %>"
    version = "0.0.1"
    url = "<%= ProjectWebPage %>"
    description = "Description: <%= ProjectDescription %>"
    settings = "os", "compiler", "arch", "build_type"
    options = { "shared": [True, False, None] }
    default_options = { "shared": None }

    """
    Define what shall be exported for client who'd like to build your package from sources.
    Documentation - https://docs.conan.io/2/reference/conanfile/attributes.html#exports-sources
    """
    exports_sources = (
        "*",
        "!.git*",
        "!.devcontainer/*",
        "!.github/*",
        "!.vscode/*",
        "!assets/*",
        "!config/*",
        "!doc/*",
        "!examples/*",
        "!gen/*",
        "!modules/*",
        "!source/*",
        "!test/*",
        "!README.md"
    )

    test_requires = "gtest/cci.20210126", 

    def validate(self):
        """
        Validate settings. Used to reject unwanted configurations.
        Documentation - https://docs.conan.io/2/reference/conanfile/methods/validate.html
        """
        pass

    def config_options(self):
        """
        Adjust options based on settings.
        Documentation - https://docs.conan.io/2/reference/conanfile/methods/config_options.html
        """
        pass

    def layout(self):
        """
        Define folder structure.
        Documentation - https://docs.conan.io/2/reference/conanfile/methods/layout.html
        """
        cmake_layout(self)

    def generate(self):
        """
        Generate build-system files that will be used while build.
        Documentation - https://docs.conan.io/2/reference/conanfile/methods/generate.html
        """
        tc = CMakeToolchain(self)
        tc.cache_variables["CONAN_PROJECT_NAME"] = str(self.name)
        tc.cache_variables["CONAN_PROJECT_VERSION"] = str(self.version)
        tc.cache_variables["CONAN_PROJECT_NAME"] = str(self.name)
        tc.generate()
        deps = CMakeDeps(self)
        deps.generate()

    def build(self):
        """
        Build project.
        Documentation - https://docs.conan.io/2/reference/conanfile/methods/build.html
        """
        cmake = CMake(self)
        cmake.configure()
        cmake.build()

    def package(self):
        """
        Specify how to create a Conan Package out of build artifacts.
        Documentation - https://docs.conan.io/2/reference/conanfile/methods/package.html
        """
        cmake = CMake(self)
        cmake.install()

    def package_info(self):
        """
        Define package's meta-information that would be consumed by clients(include dirs, source, etc.)
        Documentation - https://docs.conan.io/2/reference/conanfile/methods/package_info.html
        """
        self.cpp_info.libs = ["<%= ProjectName %>"]
        self.cpp_info.includedirs = ['include']
        self.cpp_info.libdirs = ['lib']

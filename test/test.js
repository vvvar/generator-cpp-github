const { execSync } = require("child_process");
const { platform } = require("process");
const path = require("node:path");
const mochaAssert = require("assert");
const yeomanAssert = require("yeoman-assert");
const package_json = require("../package.json");

function getGeneratorName() {
  // "generator-" prefix is automatically removed by yeoman
  return package_json.name.replace("generator-", "");
}

describe(getGeneratorName(), function () {
  describe("package", function () {
    it("should be recognized by yeoman", function () {
      execSync("npm link", { cwd: path.join(__dirname, "../") });
      const availableGenerators = execSync("yo --generators");
      mochaAssert(
        availableGenerators.includes(getGeneratorName()),
        `${getGeneratorName()} is not available in yo, available generators are: ${availableGenerators}`
      );
    });
  });

  describe(":app", function () {
    before(async function () {
      const { YeomanTest } = await import("yeoman-test");
      this.yeomanTest = new YeomanTest().create(path.join(__dirname, "../generators/app"), {}, {}).withAnswers({
        ProjectName: "test-application",
        ProjectNamePretty: "Test C++ Application",
        ProjectDescription: "Dummy description for the application",
        ProjectWebPage: "http://example.com",
        ProjectMaintainersEmail: "tester@testerenko.com",
      });
      await this.yeomanTest.run();
    });

    it("should generate .devcontainer", function () {
      yeomanAssert.file([".devcontainer/devcontainer.json", ".devcontainer/Dockerfile"]);
    });

    it("should generate GitHub Issue Templates", async function () {
      yeomanAssert.file([".github/ISSUE_TEMPLATE/bug_report.md", ".github/ISSUE_TEMPLATE/feature_request.md"]);
    });

    it("should generate GitHub Actions", async function () {
      yeomanAssert.file([".github/workflows/build.yml", ".github/workflows/merge_request.yml", ".github/workflows/release.yml"]);
    });

    it("should generate VS Code integration", async function () {
      yeomanAssert.file([".vscode/extensions.json", ".vscode/settings.json", ".vscode/tasks.json"]);
    });

    it("should generate assets folder", async function () {
      yeomanAssert.file(["assets/icon.png", "assets/README.md", "assets/screenshot.png"]);
    });

    it("should generate CMake integration", async function () {
      yeomanAssert.file(["cmake/config.cmake.in", "test/unit/CMakeLists.txt", "CMakeLists.txt"]);
    });

    it("should generate Conan 2.0 integration", async function () {
      yeomanAssert.file([
        "config/conan/linux-x86_64.profile",
        "config/conan/macos-armv8.profile",
        "config/conan/windows-x86_64.profile",
        "conanfile.py",
      ]);
    });

    it("should generate integration with system dependency managers", async function () {
      yeomanAssert.file([
        "config/system/requirements.dev.pip.txt",
        "config/system/requirements.linux.apt.txt",
        "config/system/requirements.macos.brew.rb",
        "config/system/requirements.windows.choco.config",
      ]);
    });

    it("should generate code-formatting configurations", async function () {
      yeomanAssert.file(["config/.black-format", "config/.clang-format"]);
    });

    it("should generate project license", async function () {
      yeomanAssert.file(["LICENSE.md"]);
    });

    it("should generate project contribution guide", async function () {
      yeomanAssert.file(["docs/CONTRIBUTING.md"]);
    });

    it("should generate project release guide", async function () {
      yeomanAssert.file(["docs/RELEASE.md"]);
    });

    it("should generate folder for git submodules", async function () {
      yeomanAssert.file(["modules/README.md"]);
    });

    it("should generate dummy c++ application", async function () {
      yeomanAssert.file(["source/foo/Foo.hpp", "source/foo/Foo.cpp", "source/main.cpp"]);
    });

    it("should generate basic unit-test", async function () {
      yeomanAssert.file(["test/unit/source/Foo.test.cpp"]);
    });

    it("should generate test runner", async function () {
      yeomanAssert.file(["justfile"]);
    });

    it("should generate the project with working setup task", async function () {
      execSync("just setup", { cwd: this.yeomanTest.temporaryDir });
    });

    it("should generate the project with working build task", async function () {
      execSync("just setup", { cwd: this.yeomanTest.temporaryDir });
      execSync("just build", { cwd: this.yeomanTest.temporaryDir });
    });

    it("should generate the project with working tests", async function () {
      execSync("just setup", { cwd: this.yeomanTest.temporaryDir });
      execSync("just build", { cwd: this.yeomanTest.temporaryDir });
      execSync("just test", { cwd: this.yeomanTest.temporaryDir });
    });

    it("should generate the project with working static code analysis", async function () {
      if (platform !== "win32") {
        // SCA is not available on Windows
        execSync("just setup", { cwd: this.yeomanTest.temporaryDir });
        execSync("just build", { cwd: this.yeomanTest.temporaryDir });
        execSync("just sca", { cwd: this.yeomanTest.temporaryDir });
      } else {
        this.skip();
      }
    });
  });

  describe(":cpplib", function () {
    before(async function () {
      const { YeomanTest } = await import("yeoman-test");
      this.yeomanTest = new YeomanTest().create(path.join(__dirname, "../generators/lib"), {}, {}).withAnswers({
        ProjectName: "test-library",
        ProjectNamePretty: "Test C++ Library",
        ProjectDescription: "Dummy description for C++ library",
        ProjectWebPage: "http://example.com",
        ProjectMaintainersEmail: "tester@testerenko.com",
      });
      await this.yeomanTest.run();
    });

    it("should generate .devcontainer", function () {
      yeomanAssert.file([".devcontainer/devcontainer.json", ".devcontainer/Dockerfile"]);
    });

    it("should generate GitHub Issue Templates", async function () {
      yeomanAssert.file([".github/ISSUE_TEMPLATE/bug_report.md", ".github/ISSUE_TEMPLATE/feature_request.md"]);
    });

    it("should generate GitHub Actions", async function () {
      yeomanAssert.file([".github/workflows/build.yml", ".github/workflows/merge_request.yml", ".github/workflows/release.yml"]);
    });

    it("should generate VS Code integration", async function () {
      yeomanAssert.file([".vscode/extensions.json", ".vscode/settings.json", ".vscode/tasks.json"]);
    });

    it("should generate assets folder", async function () {
      yeomanAssert.file(["assets/icon.png", "assets/README.md", "assets/screenshot.png"]);
    });

    it("should generate CMake integration", async function () {
      yeomanAssert.file(["cmake/config.cmake.in", "test/unit/CMakeLists.txt", "CMakeLists.txt"]);
    });

    it("should generate Conan 2.0 integration", async function () {
      yeomanAssert.file([
        "config/conan/linux-x86_64.profile",
        "config/conan/macos-armv8.profile",
        "config/conan/windows-x86_64.profile",
        "test/integration/conanfile.py",
        "conanfile.py",
      ]);
    });

    it("should generate integration with system dependency managers", async function () {
      yeomanAssert.file([
        "config/system/requirements.dev.pip.txt",
        "config/system/requirements.linux.apt.txt",
        "config/system/requirements.macos.brew.rb",
        "config/system/requirements.windows.choco.config",
      ]);
    });

    it("should generate code-formatting configurations", async function () {
      yeomanAssert.file(["config/.black-format", "config/.clang-format"]);
    });

    it("should generate project license", async function () {
      yeomanAssert.file(["LICENSE.md"]);
    });

    it("should generate project contribution guide", async function () {
      yeomanAssert.file(["docs/CONTRIBUTING.md"]);
    });

    it("should generate project release guide", async function () {
      yeomanAssert.file(["docs/RELEASE.md"]);
    });

    it("should generate folder for git submodules", async function () {
      yeomanAssert.file(["modules/README.md"]);
    });

    it("should generate dummy c++ library", async function () {
      yeomanAssert.file(["include/Foo.hpp", "source/Foo.cpp"]);
    });

    it("should generate basic unit-test", async function () {
      yeomanAssert.file(["test/unit/source/Foo.test.cpp"]);
    });

    it("should generate basic integration testing application", async function () {
      yeomanAssert.file(["test/integration/source/main.cpp"]);
    });

    it("should generate test runner", async function () {
      yeomanAssert.file(["justfile"]);
    });

    it("should generate the project with working setup task", async function () {
      execSync("just setup", { cwd: this.yeomanTest.temporaryDir });
    });

    it("should generate the project with working build task", async function () {
      execSync("just setup", { cwd: this.yeomanTest.temporaryDir });
      execSync("just build", { cwd: this.yeomanTest.temporaryDir });
    });

    it("should generate the project with working tests", async function () {
      execSync("just setup", { cwd: this.yeomanTest.temporaryDir });
      execSync("just build", { cwd: this.yeomanTest.temporaryDir });
      execSync("just test", { cwd: this.yeomanTest.temporaryDir });
    });

    it("should generate the project with working static code analysis", async function () {
      if (platform !== "win32") {
        // SCA is not available on Windows
        execSync("just setup", { cwd: this.yeomanTest.temporaryDir });
        execSync("just build", { cwd: this.yeomanTest.temporaryDir });
        execSync("just sca", { cwd: this.yeomanTest.temporaryDir });
      } else {
        this.skip();
      }
    });
  });
});

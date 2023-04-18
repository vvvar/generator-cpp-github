const Generator = require('yeoman-generator');

const isValidProjectName = str => {
  return !str.includes("_") && !str.includes(" ") && !/[A-Z]/.test(str);
}

const isValidUrl = urlString => {
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
return !!urlPattern.test(urlString);
}

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }

  initializing() {
    this.log("initializing...");
  }

  async prompting() {
    this.log("prompting...");
    this.answers = await this.prompt([
      // Project naming, descriptions etc.
      {
        name: "ProjectName",
        message: "Please, enter your project name(No spaces. No special symbols. No capital letters. '-' symbol as separator e.g. 'my-first-app')",
        default: "example-project",
        validate: input => isValidProjectName(input)
      },
      {
        name: "ProjectNamePretty",
        message: "Please, enter your pretty project name(this would be displayed in your docs as a pretty name)",
        default: "Example Project",
      },
      {
        name: "ProjectDescription",
        message: "Please, enter shot description of the project",
        default: "My project does so many things!"
      },
      // Projects links - webpage, git, releases, etc
      {
        name: "ProjectWebPage",
        message: "Please, enter the link to project website(Wiki, Github Pages, etc.)",
        default: "http://example.com",
        validate: input => isValidUrl(input)
      },
      {
        name: "ProjectGitRepoUrl",
        message: "Please, enter the link to your Git repo(e.g. https://github.com/octocat/octorepo.git)",
        validate: input => isValidUrl(input)
      },
      {
        name: "ProjectGitUser",
        message: "Please, enter your git user",
      },
      // Conan info
      {
        name: "ProjectConanRepoUrl",
        message: "Please, enter the link to the Conan Repository",
        default: "https://center.conan.io",
        validate: input => isValidUrl(input)
      },
      {
        name: "ProjectConanUser",
        message: "Please, enter which Conan User shall be set",
      },
      {
        name: "ProjectMaintainersEmail",
        message: "Please, enter project contact E-Mail",
        default: "example@example.com",
      },
      // System dependencies version
      {
        name: "ConanVersion",
        message: "Which Conan version to use?",
        default: "2.0.2",
      },
      {
        name: "CMakeVersion",
        message: "Which CMake version to use?",
        default: "3.17.1",
      },
      {
        name: "GitVersion",
        message: "Which Git version to use?",
        default: "2.34.1",
      },
    ]);
    this.log("answers:", this.answers);
  }

  async configuring() {
    this.log("configuring...");
    const sourceRoot = this.sourceRoot();
    const destinationRoot = this.destinationRoot();
    this.log("sourceRoot:", sourceRoot);
    this.log("destinationRoot:", destinationRoot);
  }

  async writing() {
    await this.fs.copyTpl(this.templatePath(".devcontainer"), this.destinationPath(".devcontainer"), this.answers);
    await this.fs.copyTpl(this.templatePath(".github"), this.destinationPath(".github"), this.answers);
    await this.fs.copyTpl(this.templatePath(".vscode"), this.destinationPath(".vscode"), this.answers);
    await this.fs.copyTpl(this.templatePath("assets"), this.destinationPath("assets"), this.answers);
    await this.fs.copyTpl(this.templatePath("config"), this.destinationPath("config"), this.answers, undefined, {
      globOptions: {
        dot: true
      }
    });
    await this.fs.copyTpl(this.templatePath("doc"), this.destinationPath("doc"), this.answers);
    await this.fs.copyTpl(this.templatePath("examples"), this.destinationPath("examples"), this.answers);
    await this.fs.copyTpl(this.templatePath("modules"), this.destinationPath("modules"), this.answers);
    await this.fs.copyTpl(this.templatePath("source"), this.destinationPath("source"), this.answers);
    await this.fs.copyTpl(this.templatePath("test"), this.destinationPath("test"), this.answers);
    await this.fs.copyTpl(this.templatePath(".gitignore"), this.destinationPath(".gitignore"), this.answers);
    await this.fs.copyTpl(this.templatePath("CMakeLists.txt"), this.destinationPath("CMakeLists.txt"), this.answers);
    await this.fs.copyTpl(this.templatePath('conanfile.py'), this.destinationPath('conanfile.py'), this.answers);
    await this.fs.copyTpl(this.templatePath("README.md"), this.destinationPath("README.md"), this.answers);
  }
};
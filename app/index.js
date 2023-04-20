const Generator = require('yeoman-generator');
const nfs = require('node:fs');
const npath = require('node:path');
const dircompare = require('dir-compare');
const dirTree = require("directory-tree");
const jsonDiff = require('json-diff');

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

const GLOBAL_CONFIGURATION = {
  ConanVersion: "2.0.2",
  CMakeVersion: "3.17.1",
  GitVersion: "2.34.1"
};

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    // Next, add your custom code
    this.option("validate");
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
        message: "Enter the in-code name of the project(No spaces. No special symbols. No capital letters. '-' symbol as separator)",
        default: "example-project",
        validate: input => isValidProjectName(input)
      },
      {
        name: "ProjectNamePretty",
        message: "Enter the pretty name of the project(this would be displayed in your docs)",
        default: "Example Project",
      },
      {
        name: "ProjectDescription",
        message: "Enter the shot description of the project",
        default: "My project does so many things!"
      },
      // Projects links - webpage, git, releases, etc
      {
        name: "ProjectWebPage",
        message: "Enter the link to project website(Wiki, Github Pages, etc.)",
        default: "http://example.com",
        validate: input => isValidUrl(input)
      },
      // Contact info
      {
        name: "ProjectMaintainersEmail",
        message: "Please, enter project contact E-Mail",
        default: "example@example.com",
      },
    ]);
  }

  async configuring() {
    this.log("configuring...");
    const sourceRoot = this.sourceRoot();
    const destinationRoot = this.destinationRoot();
    this.log("sourceRoot:", sourceRoot);
    this.log("destinationRoot:", destinationRoot);
    if (this.options.validate) {
      nfs.rmSync(this._tmpPath(""), { recursive: true, force: true });
      nfs.mkdirSync(this._tmpPath(""), { recursive: true });
      this.log(`tmpRoot: ${this._tmpPath("")}`);
    }
  }

  _tmpPath(path) {
    return npath.join(npath.resolve(__dirname), "../", "tmp", npath.basename(this.destinationPath()), path);
  }

  async writing() {
    const destpath = this.options.validate ? path => this._tmpPath(path) : path => this.destinationPath(path);
    const CONFIG = {...this.answers, ...GLOBAL_CONFIGURATION};
    await this.fs.copyTpl(this.templatePath(".devcontainer"), destpath(".devcontainer"), CONFIG);
    await this.fs.copyTpl(this.templatePath(".github"), destpath(".github"), CONFIG);
    await this.fs.copyTpl(this.templatePath(".vscode"), destpath(".vscode"), CONFIG);
    await this.fs.copyTpl(this.templatePath("assets"), destpath("assets"), CONFIG);
    await this.fs.copyTpl(this.templatePath("cmake"), destpath("cmake"), CONFIG);
    await this.fs.copyTpl(this.templatePath("config"), destpath("config"), CONFIG, undefined, {
      globOptions: {
        dot: true
      }
    });
    await this.fs.copyTpl(this.templatePath("doc"), destpath("doc"), CONFIG);
    await this.fs.copyTpl(this.templatePath("examples"), destpath("examples"), CONFIG);
    await this.fs.copyTpl(this.templatePath("include"), destpath("include"), CONFIG);
    await this.fs.copyTpl(this.templatePath("modules"), destpath("modules"), CONFIG);
    await this.fs.copyTpl(this.templatePath("scripts"), destpath("scripts"), CONFIG);
    await this.fs.copyTpl(this.templatePath("source"), destpath("source"), CONFIG);
    await this.fs.copyTpl(this.templatePath("test"), destpath("test"), CONFIG);
    await this.fs.copyTpl(this.templatePath(".gitignore"), destpath(".gitignore"), CONFIG);
    await this.fs.copyTpl(this.templatePath("CMakeLists.txt"), destpath("CMakeLists.txt"), CONFIG);
    await this.fs.copyTpl(this.templatePath('conanfile.py'), destpath('conanfile.py'), CONFIG);
    await this.fs.copyTpl(this.templatePath("README.md"), destpath("README.md"), CONFIG);
  }

  _trimFromDirTree(pathChunk, dirTree) {
    dirTree.path = dirTree.path.replace(pathChunk, "");
    if (dirTree.children) {
      dirTree.children.forEach(child => this._trimFromDirTree(pathChunk, child));
    }
  }

  async end() {
    if (this.options.validate) {
      const dirTreeA = dirTree(this._tmpPath(""));
      const dirTreeB = dirTree(this.destinationPath(""), { exclude: /.git$/ });

      this._trimFromDirTree(this._tmpPath(""), dirTreeA);
      this._trimFromDirTree(this.destinationPath(""), dirTreeB);

      this.log(jsonDiff.diffString(dirTreeA, dirTreeB));
    }
  }
};
const Generator = require('yeoman-generator');
const nfs = require('node:fs');
const npath = require('node:path');
const dircompare = require('dir-compare');
const dirTree = require("directory-tree");
const jsonDiff = require('json-diff');
const tree = require('tree-node-cli');

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

  _isConfigAvailable() {
    return Object.keys(this.config.getAll()).length !== 0;
  }

  async initializing() {
    if (this.options.validate && !this._isConfigAvailable()) {
      this.log.error("Can't validate project that has not been created yet. Please generate the project first before validating.");
      throw new Error("Cant validate project: .yo-rc.json was not found in root.");
    }
    if (this._isConfigAvailable()) {
      if (this.config.get("GeneratorType") !== "app") {
        this.log.error(`Project already exist and having a different type: ${this.config.get("GeneratorType")}. Please use ${this.config.get("GeneratorType")} generator with :${this.config.get("gentype")}`);
        throw new Error("Cant generate the project - project already exist and having a different type.");
      }
    }
  }

  async prompting() {
    this.answers = {};
    if (this._isConfigAvailable()) {
      this.log(".yo-rc.json has been found in the root of the project. Will use configuration from it.");
      this.answers = this.config.getAll();
    } else {
      this.log("Seems you're setting up the project for the first time. Please answer following questions.");
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
  }

  async configuring() {
    if (this.options.validate) {
      nfs.rmSync(this._tmpPath(""), { recursive: true, force: true });
      nfs.mkdirSync(this._tmpPath(""), { recursive: true });
      this.log(`tmpRoot: ${this._tmpPath("")}`);
    }
    this.config.set(this.answers);
    this.config.set("GeneratorType", "app");
    this.config.save();
  }

  _tmpPath(path) {
    return npath.join(npath.resolve(__dirname), "../", "tmp", npath.basename(this.destinationPath()), path);
  }

  _destPath(path) {
    return this.options.validate ? this._tmpPath(path) : this.destinationPath(path);
  }

  async writing() {
    
    const CONFIG = {...this.answers, ...GLOBAL_CONFIGURATION};
    await this.fs.copyTpl(this.templatePath(".devcontainer"), this._destPath(".devcontainer"), CONFIG);
    await this.fs.copyTpl(this.templatePath(".github"), this._destPath(".github"), CONFIG);
    await this.fs.copyTpl(this.templatePath(".vscode"), this._destPath(".vscode"), CONFIG);
    await this.fs.copyTpl(this.templatePath("assets"), this._destPath("assets"), CONFIG);
    await this.fs.copyTpl(this.templatePath("cmake"), this._destPath("cmake"), CONFIG);
    await this.fs.copyTpl(this.templatePath("config"), this._destPath("config"), CONFIG, undefined, {
      globOptions: {
        dot: true
      }
    });
    await this.fs.copyTpl(this.templatePath("doc"), this._destPath("doc"), CONFIG);
    await this.fs.copyTpl(this.templatePath("modules"), this._destPath("modules"), CONFIG);
    await this.fs.copyTpl(this.templatePath("source"), this._destPath("source"), CONFIG);
    await this.fs.copyTpl(this.templatePath("test"), this._destPath("test"), CONFIG);
    await this.fs.copyTpl(this.templatePath(".gitignore"), this._destPath(".gitignore"), CONFIG);
    await this.fs.copyTpl(this.templatePath("CMakeLists.txt"), this._destPath("CMakeLists.txt"), CONFIG);
    await this.fs.copyTpl(this.templatePath('conanfile.py'), this._destPath('conanfile.py'), CONFIG);
    await this.fs.copyTpl(this.templatePath('justfile'), this._destPath('justfile'), CONFIG);
    await this.fs.copyTpl(this.templatePath("README.md"), this._destPath("README.md"), CONFIG);
  }

  _trimFromDirTree(pathChunk, dirTree) {
    dirTree.path = dirTree.path.replace(pathChunk, "");
    if (dirTree.children) {
      dirTree.children.forEach(child => this._trimFromDirTree(pathChunk, child));
    }
    return dirTree;
  }

  _getDirTree(path) {
    return tree(path, { dirsFirst: true });
  }

  async end() {
    if (this.options.validate) {
      const pathToReference = this._tmpPath("");
      const pathToDest = this.destinationPath("");

      const dirTreeReference = this._trimFromDirTree(pathToReference, dirTree(pathToReference, { normalizePath: true }));
      const dirTreeDest = this._trimFromDirTree(pathToDest, dirTree(pathToDest, { normalizePath: true, exclude: /.git$/ }));

      const diff = jsonDiff.diff(dirTreeReference, dirTreeDest).children.filter(node => node[0] === "-");
      this.log(diff);
      if (diff.length) {
        this.log("There is a diff in reference folder structure and your's. Please check diff in validation folder for the details");
        this.fs.write(this.destinationPath("validation/reference.txt"), this._getDirTree(pathToReference));
        this.fs.write(this.destinationPath("validation/your.txt"), this._getDirTree(pathToDest));
        this.fs.write(this.destinationPath("validation/diff.json"), JSON.stringify(jsonDiff.diff(dirTreeReference, dirTreeDest), null, 3));
      } else {
        this.log("Validation successful. There is no diff in folder structure.")
      }
    }
  }
};
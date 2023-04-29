# CPPgen

Yeoman-based generator of C++ apps and libraries with tech stack:
- Conan 2.0
- CMake
- GitHub Actions
- Clang-Format
- Sonar Lint
- brew/choco/apt

## Installation

1. Install [`nodejs`](https://nodejs.org/en)
2. Install [`Yeoman`](https://yeoman.io)
```sh
npm install -g yo
```
3. Clone this repo
4. Add this generator
```sh
cd /path/to/cloned/repo
npm link
```

## Usage

### Generate C++ Library project

```sh
yo cppgen:cpplib
```

### Generate C++ Application project

```sh
yo cppgen:cppapp
```

### Validate project folder structure

```sh
yo cppgen:[type] --validate
```
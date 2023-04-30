# Project Development

This document describes how to develop for this project.

### Workflow

Git Workflow - [GitFlow](https://www.atlassian.com/de/git/tutorials/comparing-workflows/gitflow-workflow).
Merge Strategy - Squash, fast-forward.
Merge checks:
- successful build on a CI
- approve from at least one maintainer

Branch naming and usage:
- `master` - main branch, only merges from `release/XXX` branches are allowed
- `feature/<short_name>` - feature
- `improvement/<short_name>` - improvement
- `bugfix/<short_name>` - bugfixes
- `experimental/<short_name>` - branches for POCs, experimental feature that are not intended to be merged, etc.

### Pre-requisites

- [Just v1.13.0+](https://github.com/casey/just)
- [VS Code](https://code.visualstudio.com/download)

## Setting up the project

```sh
just setup
```

Alternatively, you can use `Setup` task from [tasks.json](../.vscode/tasks.json).

## Building

```sh
just build
```

Alternatively, you can use `Build` task from [tasks.json](../.vscode/tasks.json).

## Running Tests

### Running All Tests

```sh
just test
```

### Running Unit-Tests

```sh
just test-unit
```

Alternatively, you can use `Test(Unit)` task from [tasks.json](../.vscode/tasks.json).

### Running Integration Tests

```sh
just test-integration
```

Alternatively, you can use `Test(Integration)` task from [tasks.json](../.vscode/tasks.json).

## Running Static Code Analysis

```sh
just sca
```

Alternatively, you can use `SCA` task from [tasks.json](../.vscode/tasks.json).

## Cleaning up workspace

```sh
just cleanup
```

Alternatively, you can use `Cleanup` task from [tasks.json](../.vscode/tasks.json).

## List all available tasks

```sh
just --list
```

## Checking on a CI

- [Merge Check Workflow](../.github/workflows/merge_check.yml) will run on every merge request
- [Release Workflow](../.github/workflows/make_release.yml) will run on every commit into `main` branch

## Making the release

See [Release Manual](RELEASE.md).

## Code Style & Quality

Code style rules and tools applied in this project are provided by:
- [`Black`](../config/.black-format) - Python files
- [`Clang Format`](../config/.clang-format) - C/C++ files

Code linting is provided by:
- [`SonarLint`](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode) - C/C++ files

SCA is provided by:
- [`cppcheck`](https://cppcheck.sourceforge.io) - C/C++ files

> **Note**: cppcheck is not available on a CI for Windows because it requires to reboot which is not possible using GitHub-hosted runner.

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

## Building

Run `Project: Build` task from [tasks.json](../.vscode/tasks.json).

## Packaging

Run `Project: Export Package` task from [tasks.json](../.vscode/tasks.json).

## Testing

Run `Project: Test` task from [tasks.json](../.vscode/tasks.json).

## Code Analysis

Run `Project: SCA` task from [tasks.json](../.vscode/tasks.json).

## Checking on a CI

All commits passed testing on a CI using GitHub Workflow.

## Making the release

See [Release Manual](RELEASE.md).

## Code Style

Code style rules and tools applied in this project are provided by:
- [`Black`](../config/.black-format) - Python files
- [`Clang Format`](../config/.clang-format) - C/C++ files

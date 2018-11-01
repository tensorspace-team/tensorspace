# Developer Guide

We are excited that you would like to contribute to open source projects like we do!

- [Pull Request Guidelines](#pull-request-guidelines)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)

## Pull Request Guidelines
Do's:
1. Checkout a new branch from the relevant branch for development
2. Run `npm test` and make sure all tests pass before submitting a PR

Dont's:
1. DO NOT submit PR against master branch.
2. DO NOT check into `build` folder in commits.

If you are going to:
- Fix a bug / Optimize or refactor code
  - Put `<title> (#<issue-id>`in your PR title for a better release log, e.g. `update entities encoding/decoding (#3899)`.
  - Provide detailed description in the PR.
  - Add relevant tests
  - Run tests. Make sure newly added code does not break existing functionalities
  ```shell
  git checkout -b i-found-a-bug
  
  # ... fix the bug ...
  
  # only continue to next step if all tests passed
  npm test 
  
  git add <relevant-files-that-have-been-modified>
  
  git commit -m 'update entities encoding/decoding'
  
  git push origin i-found-a-bug
  ```
  - Don't forget to submit a pull request :P
  
- Add a new feature
  - Provide convincing reason to add this feature. Ideally you should open a suggestion issue first and have it greenlighted before working on it
  - Create a new branch
  - Add relevant tests
  - Submit PR

## Project Structure
- **`assets`**: 

Static resource for repo.

- **`docs`**:

TensorSpace Tutorials written in different languages.

- **`build`**: 

Contains files for distribution. This folder will only be updated if there is a new release. Latest development is reflected in branches.

- **`examples`**: 

Carefully selected examples to illustrate major functionality of TensorSpace.

- **`src`**: 

Source code.

- **`test`**:

Unit tests for each module of the source file. Help NEEDED here.


## Development Setup
1. `Fork` the repo to your Github account.

2. Clone your copy of tensorspace repo to your local machine.
```shell
git clone https://github.com/<your-github-id>/tensorspace.git
```
3. Install dev tools/libs
- Option 1: npm
```Shell
npm install 
```
- Option 2: yarn
```Shell
yarn install
```

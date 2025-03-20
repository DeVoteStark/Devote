# Contributing to DeVote

Welcome to the DeVote project! We appreciate your interest in contributing. This guide outlines the process and guidelines for contributing to ensure a smooth and effective collaboration.

## Code of Conduct

Please review and adhere to our [Code of Conduct](link-to-code-of-conduct.md) to maintain a respectful and inclusive environment.

## Getting Started

1.  **Fork the Repository:** Click the "Fork" button on the top right of the DeVote repository page.
2.  **Clone Your Fork:** Clone your forked repository to your local machine:

    ```bash
    git clone [https://github.com/YourUsername/Devote.git](https://www.google.com/search?q=https://github.com/YourUsername/Devote.git)
    cd Devote
    ```

3.  **Set Up Your Environment:** Follow the instructions in the [README.md](README.md) file to install the necessary dependencies and configure your development environment. This includes setting up Node.js, Cairo, Starknet CLI, and any other required tools.
4.  **Create a Branch:** Create a branch for your feature or bug fix:

    ```bash
    git checkout -b feature/your-feature-name
    ```

## Contribution Process

1.  **Report Issues and Suggest Features:** If you find a bug or have a feature request, please create an issue on GitHub. Provide clear and detailed information, following the issue templates if available.

2.  **Submit Pull Requests (PRs):**

    * Ensure your code follows the coding standards outlined below.
    * Write clear and descriptive commit messages.
    * Include relevant tests and documentation.
    * Link your PR to the relevant issue.
    * Ensure your branch is up-to-date with the `main` branch:

        ```bash
        git pull origin main
        ```

    * Submit your PR for review.

3.  **PR Review Process:**

    * Project maintainers will review your PR and provide feedback.
    * Be prepared to address any feedback and make necessary changes.
    * Once your PR is approved, it will be merged into the `main` branch.

## Coding Standards

* **Cairo:** Follow the official Cairo style guide and best practices.
* **TypeScript:** Adhere to the Airbnb JavaScript Style Guide with TypeScript extensions.
* **Linting and Formatting:** Use ESLint and Prettier to ensure consistent code formatting. Run the linting and formatting scripts defined in the `package.json` file.
* **Testing:** Write unit tests, integration tests, and end-to-end tests for your code.
* **Documentation:** Document your code with clear and concise comments. Follow the project's documentation style.

## Testing Guidelines

* Run the project's test suites to ensure your changes do not introduce regressions.
* Write new tests for any new features or bug fixes.
* Ensure all tests pass before submitting a PR.

## Documentation Guidelines

* Update the `README.md` file and any relevant documentation to reflect your changes.
* Write clear and concise documentation that is easy to understand.
* Follow the project's documentation style.

## Communication

* Use GitHub issues and pull requests for communication related to code changes.
* Join our [Discord server](link-to-discord) for general discussions and support.

## Issue Reporting Guidelines

When reporting an issue, please include the following information:

* **Title:** A clear and descriptive title.
* **Description:** A detailed description of the issue.
* **Steps to Reproduce:** Steps to reproduce the issue.
* **Expected Behavior:** What you expected to happen.
* **Actual Behavior:** What actually happened.
* **Environment:** Your operating system, browser, and any other relevant information.

## Feature Request Guidelines

When requesting a new feature, please include the following information:

* **Title:** A clear and descriptive title.
* **Description:** A detailed description of the feature.
* **Benefits:** Explain the benefits of the feature.
* **Use Cases:** Provide examples of how the feature would be used.

Thank you for contributing to DeVote!
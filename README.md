# Planit Jupiter Cloud WebDriverIO TypeScript Framework

### Planit Technical Assessment – Automation

**Author:** Christian M. Balangatan

### Tech Stack:
- **WebdriverIO:** Browser automation library for UI testing.
- **TypeScript:** Statically typed superset of JavaScript for enhanced code quality.
- **Mocha:** Asynchronous testing framework for Node.js and browsers.
- **Allure Report:** Lightweight test reporting tool, integratable with Jenkins.
- **Spec-reporter:** Built-in reporter for human-readable test results.
- **Expect-webdriver:** Assertion library for UI testing with WebDriver.

### Pre-Requisites:
1. Install Node.js locally. [Download Node.js](https://nodejs.org/en)
2. Install Allure Command Line Interface (CLI) locally: `npm install -g allure-commandline`
3. Clone project: `git clone https://github.com/pioneer29/planit-jupiter-cloud-wdio-ts-fw.git`
4. Install dependencies: `npm install -f`

### Folders and Files Structure:
- `./allure-results`: Folder for Allure report.
- `./build/bin/jupiter-cloud-test-automation-pipeline.groovy`: Groovy file for Jenkins pipeline.
- `./node_modules`: Folder for npm dependencies.
- `./test/pageobjects`: Page Object Model framework implementation.
- `./test/specs`: Automated test scripts.
- `./utils`: Common script utilities (e.g., Report, custom logger).
- `./package.json`: Project dependencies and npm scripts.
- `./sample_env`: Environment variables file (rename to `.env` for local usage).
- `./tsconfig.json`: TypeScript compiler configuration.
- `./wdio.conf.ts`: WebDriverIO configuration for test settings and capabilities.

### How to Run the Tests:
1. Open terminal and run: `npm run test-local`
   - Executes tests located in `./test/specs` folder.
   - Includes runtime environment variables: `BASE_URL=https://jupiter.cloud.planittesting.com/#/`, `RUNTIME_BROWSER=chrome`, `LOG_LEVEL=debug`.
   - Opens Allure report at the end of execution.

### Notes:
- **Test Coverage:** 
  - `jupiter-contact-page.test.ts`: Covers Test Case 1 and Test Case 2.
  - `jupiter-shop-page.test.ts`: Covers Test Case 3.
- **Allure Report:** Use `allure serve sample-allure-results --host 127.0.0.1` to open the Allure report from a previous test run.

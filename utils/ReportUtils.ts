import logger from "./Logger";
import AllureReporter from "@wdio/allure-reporter";
import { browser } from "@wdio/globals";

export class Allure {
  /**
   * This method outputs logs into generated Allure Report and console
   *
   * @author Christian Balangatan <christianbalangatan@yahoo.com>
   * @param status   status of the step (PASSED or FAILED)
   * @param message message to be included on the logs
   *
   */
  async log(status: string, message: string) {
    const allure = AllureReporter;

    switch (status.toUpperCase()) {
      case "INFO":
        allure.addStep(message);
        logger.info(message); // to output logs in terminal
        break;
      case "PASSED":
        allure.startStep(message);
        //logger.info(message); // to output logs in terminal
        allure.endStep();
        break;
      case "DEBUG":
        allure.addStep(`Debug: ${message}}`);
        logger.debug(message); // to output logs in terminal
        break;
      case "WARN":
        allure.addStep(message);
        logger.warn(message); // to output logs in terminal
        await browser.takeScreenshot();
        break;
      case "FAILED":
        //allure.addStep(message, { message: `Error in ${message}` }, 'failed');
        allure.startStep(message);
        logger.error(message); // to output logs in terminal
        await browser.takeScreenshot();
        throw new Error(message); // to stop the execution of current test
        allure.endStep();

        break;
      default:
        logger.error(`Invalid Allure.log() status: [${status}]`);
        break;
    }
  }
}

export default new Allure();

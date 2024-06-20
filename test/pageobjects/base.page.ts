import { browser } from "@wdio/globals";
import { ChainablePromiseElement } from "webdriverio";
import { env } from "process";
import allureLogger from "../../utils/ReportUtils";

/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class BasePage {
  /**
   * Opens a sub page of the page
   * @param path path of the sub page (e.g. /path/to/page.html)
   */
  public open(path: string) {
    allureLogger.log("INFO", `Opening URL: [${env.BASE_URL}${path}]`);

    return browser.url(`${env.BASE_URL}${path}`);
  }

  /**
   * Clicks a web element
   * @param webElement web element to click
   */
  async click(webElement: ChainablePromiseElement<WebdriverIO.Element>) {
    try {
      allureLogger.log("INFO", `Click [${await webElement.getText()}] button`);
      // Wait for the element to be clickable
      await webElement.waitForClickable({ timeout: 5000 });
      // Perform the click action
      await webElement.click();
    } catch (error) {
      console.error("Error clicking the element:", error);
    }
  }

  /**
   * This method scrolls to the Web Element and enters the specified text value in
   * the input field. The purpose of this method is to have a common method that
   * sets the focus on a Web Element to enter the text value.
   *
   * @param webElement   Web Element to enter the text value
   * @param text String value to enter in the input field
   *
   */
  async enterText(
    webElement: ChainablePromiseElement<WebdriverIO.Element>,
    text: string
  ) {
    try {
      allureLogger.log(
        "INFO",
        `Set [${text}] in [${await webElement.getAttribute("id")}] textfield`
      );

      // Wait for the element to be displayed
      await webElement.waitForDisplayed();

      // Set the value in the element
      await webElement.setValue(text);
    } catch (error) {
      console.error("Error setting value in the element:", error);
    }
  }
}

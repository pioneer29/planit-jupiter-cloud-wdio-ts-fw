import { $ } from "@wdio/globals";
import BasePage from "./base.page";
import allureLogger from "../../utils/ReportUtils";

/**
 * sub page containing specific selectors and methods for a contact page
 */
class ContactPage extends BasePage {
  /**
   * define selectors using getter methods
   */
  public get txtForename() {
    return $("//input[@id='forename']");
  }

  public get txtSurname() {
    return $("//input[@id='surname']");
  }

  public get txtEmail() {
    return $("//input[@id='email']");
  }

  public get txtTelephone() {
    return $("//input[@id='telephone']");
  }

  public get txtMessage() {
    return $("//textarea[@id='message']");
  }

  public get btnSubmit() {
    return $("//a[@class='btn-contact btn btn-primary']");
  }

  /**
   * Methods to interact with the contact page
   *
   */

  /**
   * This method validates the message in contact page if displayed or not
   *
   * @author Christian Balangatan <christianbalangatan@yahoo.com>
   * @param message message to be checked
   * @returns true or false
   *
   */
  public async validateMessage(message: string) {
    const webElement = await browser.$(`//*[contains(text(), "${message}")]`);
    return await webElement.isDisplayed();
  }

  /**
   * This method validates the main sucess message in contact page if displayed or not
   *
   * @author Christian Balangatan <christianbalangatan@yahoo.com>
   * @param message message to be checked
   * @returns true or false
   *
   */
  public async validateSuccessMessage(message: string) {
    const webElement = await browser.$(`//div[@class='alert alert-success']`);
    allureLogger.log(
      "INFO",
      `Validating [${message}] success message is displayed.`
    );

    if ((await webElement.getText()) === message) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * This method validates the main error message in contact page if displayed or not
   *
   * @author Christian Balangatan <christianbalangatan@yahoo.com>
   * @param message message to be checked
   * @returns true or false
   *
   */
  public async validateMainErrorMessage(message: string) {
    try {
      const webElement = await browser.$(
        `//div[@class='alert alert-error ng-scope']`
      );
      allureLogger.log(
        "INFO",
        `Validating if [${message}] error message is displayed`
      );

      if ((await webElement.getText()) === message) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * This method populates mandatory fields in Contact page
   *
   * @author Christian Balangatan <christianbalangatan@yahoo.com>
   * @param forename forename to set
   * @param email email to set
   * @param message message to set
   *
   */
  public async populateMandatoryFields(
    forename: string,
    email: string,
    message: string
  ) {
    await super.enterText(this.txtForename, forename); // enter forename
    await super.enterText(this.txtEmail, email); // enter email
    await super.enterText(this.txtMessage, message); // enter message
  }

  /**
   * This method waits for prgress indicator to disappear
   *
   * @author Christian Balangatan <christianbalangatan@yahoo.com>
   *
   */
  public async waitForprogressIndicatorToDisappear() {
    const webElement = await browser.$(
      `//div[@class='progress progress-info wait']`
    );

    await webElement.waitForDisplayed({ reverse: true, timeout: 20000 }); // wait for progres indicator to disappear
  }
}

export default new ContactPage();

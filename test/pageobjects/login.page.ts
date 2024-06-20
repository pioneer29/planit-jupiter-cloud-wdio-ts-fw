import { $ } from "@wdio/globals";
import BasePage from "./base.page";

/**
 * sub page containing specific selectors and methods for a login page
 */
class LoginPage extends BasePage {
  /**
   * define selectors using getter methods
   */
  public get txtUsername() {
    return $("//input[@id='loginUserName']");
  }

  public get txtPassword() {
    return $("//input[@id='loginPassword']");
  }

  public get btnLogin() {
    return $('//button[@type="submit"]');
  }

  public get lnkLogin() {
    return $('//a[contains(text(), "Login")]');
  }

  /**
   * a method to encapsule automation code to interact with the page
   * e.g. to login using username and password
   */
  public async login(username: string, password: string) {
    await super.click(this.lnkLogin);
    await super.enterText(this.txtUsername, username);
    await super.enterText(this.txtPassword, password);
    await super.click(this.btnLogin);
  }

  /**
   * overwrite specific options to adapt it to page object
   */
  public open(path: string) {
    return super.open(path);
  }
}

export default new LoginPage();

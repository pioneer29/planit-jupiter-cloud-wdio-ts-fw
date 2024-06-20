import { $ } from "@wdio/globals";
import BasePage from "./base.page";
import allureLogger from "../../utils/ReportUtils";

/**
 * sub page containing specific selectors and methods for a shop page
 */
class ShopPage extends BasePage {
  /**
   * define selectors using getter methods
   */

  public get btnCart() {
    return $("//i[@class='icon icon-shopping-cart icon-white']");
  }

  public get btnEmptyCart() {
    return $("//a[@class='btn btn-danger ng-scope']");
  }

  public get btnCheckOut() {
    return $("//a[@class='btn-checkout btn btn-success  ng-scope']");
  }

  public get txtTotal() {
    return $("//strong[@class='total ng-binding']");
  }
  /**
   * Methods to interact with the contact page
   *
   */

  /**
   * This method clicks the buy button for the given item multiple times
   *
   * @author Christian Balangatan <christianbalangatan@yahoo.com>
   * @param INPUT_DATA array of (INPUT_DATA.ITEM_NAME = item name; INPUT_DATA.QUANTITY = quantity; INPUT_DATA.PRODUCT_NUM product number in the cart item table)
   *
   */
  public async clickBuyButton(
    INPUT_DATA: { ITEM_NAME: string; QUANTITY: number; PRODUCT_NUM: string }[]
  ) {
    for (const item of INPUT_DATA) {
      allureLogger.log(
        "INFO",
        `Clicking buy [${item.ITEM_NAME}] [${item.QUANTITY}] times.`
      );

      for (let i = 0; i < item.QUANTITY; i++) {
        const webElement = await browser.$(
          `//li[@id='product-${item.PRODUCT_NUM}']/descendant::a[@class='btn btn-success']`
        );
        await webElement.click();
      }
    }
  }

  /**
   * This method verifies the sub total of each item in the cart
   *
   * @author Christian Balangatan <christianbalangatan@yahoo.com>
   * @param INPUT_DATA array of (INPUT_DATA.ITEM_NAME = item name; INPUT_DATA.QUANTITY = quantity; INPUT_DATA.PRICE price of the item)
   * @returns true or false
   *
   */
  public async verifyItemSubTotal(
    INPUT_DATA: {
      ITEM_NAME: string;
      QUANTITY: number;
      PRICE: number;
    }[]
  ) {
    let blnFlag = false;
    const table = await $("//table[@class='table table-striped cart-items']"); // table element

    await table.waitForExist({ timeout: 15000 }); // wait for table to exist

    const tableRows = await $$(
      "//table[@class='table table-striped cart-items']//tbody/tr"
    ); // table rows element

    // re-usable function to validate and log each item in the table
    const validateAndLog = (
      label: string,
      expected: string,
      actual: string
    ): boolean => {
      allureLogger.log(
        "INFO",
        `Validating ${label}: [Expected: ${expected} | Actual: ${actual}]`
      );
      if (expected.trim() === actual.trim()) {
        return true;
      } else {
        allureLogger.log(
          "FAILED",
          `Validating ${label}: [Expected: ${expected} | Actual: ${actual}]`
        );
        return false;
      }
    };

    // loop on each items in the item cart table
    for (let i = 0; i < tableRows.length; i++) {
      const { ITEM_NAME, PRICE, QUANTITY } = INPUT_DATA[i];
      const expectedItem = ITEM_NAME; // expected item name
      const expectedPrice = `$${PRICE}`; // expected price
      const expectedSubTotal = `$${QUANTITY * PRICE}`; // expected subtotal

      const cells = await tableRows[i].$$("td");
      const [actualItem, actualPrice, actualSubTotal] = await Promise.all([
        cells[0].getText(), // cell for Item
        cells[1].getText(), // cell for Price
        cells[3].getText(), // cell for Subtotal
      ]);

      blnFlag =
        validateAndLog("Item", expectedItem, actualItem) &&
        validateAndLog("Price", expectedPrice, actualPrice) &&
        validateAndLog("Subtotal", expectedSubTotal, actualSubTotal);

      if (!blnFlag) break; // break the loop if there is mismatch
    }
    return blnFlag; // return the blnFlag value
  }

  /**
   * This method verifies the  total of all items in the cart
   *
   * @author Christian Balangatan <christianbalangatan@yahoo.com>
   * @returns true or false
   *
   */
  public async verifyItemTotal() {
    let blnFlag = false;
    let actualSubTotalSum = 0;
    let actualTotal = 0;
    const table = await $("//table[@class='table table-striped cart-items']"); // table element

    await table.waitForExist({ timeout: 15000 }); // wait for table to exist

    const tableRows = await $$(
      "//table[@class='table table-striped cart-items']//tbody/tr"
    ); // table rows element

    // loop on each items subtotal in the item cart table and get the sum
    for (let i = 0; i < tableRows.length; i++) {
      const cells = await tableRows[i].$$("td");
      let actualSubTotal = (await cells[3].getText()).replace(/[^0-9.-]+/g, "");
      actualSubTotalSum += parseFloat(actualSubTotal);
    }

    let actualTotalText = await this.txtTotal.getText();
    actualTotal = parseFloat(actualTotalText.replace(/[^0-9.-]+/g, ""));

    if (actualSubTotalSum === actualTotal) {
      allureLogger.log(
        "INFO",
        `Validating [Actual Subtotal Sum: ${actualSubTotalSum} | Actual Total: ${actualTotal}]`
      );
      blnFlag = true;
    } else {
      allureLogger.log(
        "FAILED",
        `Validating [Actual Subtotal Sum: ${actualSubTotalSum} | Actual Total: ${actualTotal}]`
      );
      blnFlag = false;
    }

    return blnFlag; // return the blnFlag value
  }
}

export default new ShopPage();

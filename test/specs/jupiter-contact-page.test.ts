import { expect } from "@wdio/globals";
import allureLogger from "../../utils/ReportUtils";
import ContactPage from "../pageobjects/contact.page";

describe("Jupiter Toys - Contact Page Tests", () => {
  const TIMEOUT = 300000; // 5 mins timeout
  const INPUT_DATA = {
    FORNAME: "Christian",
    EMAIL: "christianbalangatan@yahoo.com",
    MESSAGE: "This is a test message",
  };
  const ERROR_MESSAGES = [
    "Forename is required",
    "Email is required",
    "Message is required",
  ];

  const MAIN_ERROR_MESSAGE =
    "We welcome your feedback - but we won't get it unless you complete the form correctly.";

  // Test case 1:
  // 1. From the home page go to contact page
  // 2. Click submit button
  // 3. Verify error messages
  // 4. Populate mandatory fields
  // 5. Validate errors are gone
  it("Test Case 1: should validate Contact Page error messages", async () => {
    await ContactPage.open("home");
    await ContactPage.open("contact");
    await ContactPage.click(ContactPage.btnSubmit);
    expect(await ContactPage.validateMainErrorMessage(MAIN_ERROR_MESSAGE)).toBe(
      true
    );
    for (const errorMessage of ERROR_MESSAGES) {
      console.log(
        `${errorMessage} ${await ContactPage.validateMessage(errorMessage)}`
      );
      allureLogger.log(
        "INFO",
        `Validating [${errorMessage}] message is displayed`
      );
      expect(await ContactPage.validateMessage(errorMessage)).toBe(true);
    }
    await ContactPage.populateMandatoryFields(
      INPUT_DATA.FORNAME,
      INPUT_DATA.EMAIL,
      INPUT_DATA.MESSAGE
    );
    expect(await ContactPage.validateMainErrorMessage(MAIN_ERROR_MESSAGE)).toBe(
      false
    );
    for (const errorMessage of ERROR_MESSAGES) {
      allureLogger.log(
        "INFO",
        `Validating [${errorMessage}] message is not displayed`
      );
      expect(await ContactPage.validateMessage(errorMessage)).toBe(false);
    }
  }).timeout(TIMEOUT);

  // Test case 2:
  // 1. From the home page go to contact page
  // 2. Populate mandatory fields
  // 3. Click submit button
  // 4. Validate successful submission message
  // Note: Run this test 5 times to ensure 100% pass rate

  for (let i = 0; i < 5; i++) {
    it(`Test Case 2: should validate Contact Page successful submission message - Run #: ${
      i + 1
    }`, async () => {
      await ContactPage.open("home");
      await ContactPage.open("contact");
      await ContactPage.populateMandatoryFields(
        INPUT_DATA.FORNAME,
        INPUT_DATA.EMAIL,
        INPUT_DATA.MESSAGE
      );
      await ContactPage.click(ContactPage.btnSubmit);
      await ContactPage.waitForprogressIndicatorToDisappear();
      expect(
        await ContactPage.validateSuccessMessage(
          `Thanks ${INPUT_DATA.FORNAME}, we appreciate your feedback.`
        )
      ).toBe(true);
    }).timeout(TIMEOUT);
  }
});

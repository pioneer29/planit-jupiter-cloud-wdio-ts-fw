import { expect } from "@wdio/globals";
import ShopPage from "../pageobjects/shop.page";

describe("Jupiter Toys - Shop Page Tests", () => {
  const TIMEOUT = 300000; // 5 mins timeout
  const INPUT_DATA = [
    {
      ITEM_NAME: "Stuffed Frog",
      QUANTITY: 2,
      PRICE: 10.99,
      PRODUCT_NUM: "2",
    },
    {
      ITEM_NAME: "Fluffy Bunny",
      QUANTITY: 5,
      PRICE: 9.99,
      PRODUCT_NUM: "4",
    },
    {
      ITEM_NAME: "Valentine Bear",
      QUANTITY: 3,
      PRICE: 14.99,
      PRODUCT_NUM: "7",
    },
  ];

  // Test case 3:
  // 1. Buy 2 Stuffed Frog, 5 Fluffy Bunny, 3 Valentine Bear
  // 2. Go to the cart page
  // 3. Verify the subtotal for each product is correct
  // 4. Verify the price for each product
  // 5. Verify that total = sum(sub totals)
  it("Test Case 3: should validate shop Page, items in cart and sub totals", async () => {
    await ShopPage.open("home");
    await ShopPage.open("shop");
    await ShopPage.clickBuyButton(INPUT_DATA); // Buy 2 Stuffed Frog, 5 Fluffy Bunny, 3 Valentine Bear
    await ShopPage.click(ShopPage.btnCart);
    expect(await ShopPage.verifyItemSubTotal(INPUT_DATA)).toBe(true);
    expect(await ShopPage.verifyItemTotal()).toBe(true);
  }).timeout(TIMEOUT);
});

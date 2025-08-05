import { cart } from "../cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function getPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  cart.forEach((cartItem) => {
    let product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });
  const totalBeforeTax = productPriceCents + shippingPriceCents;
  const estimatedTax = totalBeforeTax * 0.1;
  const totalAfterTax = totalBeforeTax + estimatedTax;

  let itemQuantity = 0;
  cart.forEach((cartItem) => {
    itemQuantity += cartItem.quantity;
  });

  const paymentSummaryHTML = `<div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items : ${itemQuantity}</div>
            <div class="payment-summary-money">$${formatCurrency(
              productPriceCents
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(
              shippingPriceCents
            )}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(
              totalBeforeTax
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(
              estimatedTax
            )}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(
              totalAfterTax
            )}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>`;

  document.querySelector(".payment-summary").innerHTML = paymentSummaryHTML;

  document.querySelector(".place-order-button").addEventListener("click", async () => {
      const response = await fetch("https://supersimplebackend.dev/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: cart,
        }),
      });

      const order = await response.json();
      addOrder(order);

      window.location.href = "orders.html";
    });
}
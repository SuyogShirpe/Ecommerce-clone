import { cart , clearCart } from "../cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";
import { updateCartQuantity } from "../home.js";

export function getPaymentSummary() {

if (cart.length === 0) {
    document.querySelector(".payment-summary").innerHTML = `
      <div class="empty-payment-summary">
      No payment summary available.
      </div>`;
    return;
  }

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

    const cartWithSize = cart.map(cartItem => ({
    ...cartItem,
    variation: cartItem.size || "default"
  }));
      const response = await fetch("https://supersimplebackend.dev/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: cartWithSize,
        }),
      });

      const order = await response.json();
      order.products.forEach((orderProduct) =>{
        const matchingCartItem = cart.find(cartItem => cartItem.productId === orderProduct.productId)
        if(matchingCartItem){
          orderProduct.size = matchingCartItem.size;
        }
      })
      addOrder(order);

      window.location.href = "orders.html";

    clearCart();
    updateCartQuantity();

    });
}
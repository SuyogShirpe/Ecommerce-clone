import { cart,removeFromCart,updateQuantity , updateDeliveryOption,} from "../cart.js";
import { getProduct, products } from "../../data/products.js";
import { deliveryOptions , getDeliveryOption } from "../../data/deliveryOptions.js";
import { getPaymentSummary } from "./paymentSummary.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

export function getOrderSummary() {

  if (cart.length === 0) {
    document.querySelector(".order-summary").innerHTML = `
      <div class="empty-cart">
        🛒 Your cart is empty.
      </div>`;
    return;
  }
    
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateText = deliveryDate.format("dddd, MMMM D");

    

    cartSummaryHTML += `<div class="cart-item-container cart-item-container-${
      matchingProduct.id
    }-${cartItem.size}">
            <div class="delivery-date">
              Delivery date: ${dateText}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  ${matchingProduct.getPrice()}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label quantity-label-${
                      matchingProduct.id
                    }-${cartItem.size || 'default'}">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary" data-product-id="${
                    matchingProduct.id
                  }" data-size="${cartItem.size || 'default'}">
                    Update
                  </span>
                  <input class="quantity-input quantity-input-${
                    matchingProduct.id
                  }-${cartItem.size || 'default'}">
                  <span class="save-quantity-link link-primary" data-product-id="${
                    matchingProduct.id
                  }" data-size="${cartItem.size || 'default'}">Save</span>
                  <span class="delete-quantity-link link-primary" data-product-id="${
                    matchingProduct.id
                  }" data-size="${cartItem.size || 'default'}">
                    Delete
                  </span>
                </div>
                ${cartItem.size && cartItem.size !== 'default' ? `<div>Size : ${cartItem.size}</div>`:''}
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${getDeliveryOptions(matchingProduct, cartItem)}
                
              </div>
            </div>
          </div>
          `;
          
  });

  function getDeliveryOptions(matchingProduct, cartItem) {
    let deliveryOptionsHTML = "";

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateText = deliveryDate.format("dddd, MMMM D");

      const priceCents =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)}`;
      const isChecked =
        deliveryOption.id === cartItem.deliveryOptionId ? "checked" : "";

      deliveryOptionsHTML += `<div class="delivery-option"
                data-product-id="${matchingProduct.id}"
                data-size="${cartItem.size || 'default'}"
                data-delivery-option-id="${deliveryOption.id}">
                  <input type="radio" ${isChecked}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}-${cartItem.size || 'default'}">
                  <div>
                    <div class="delivery-option-date">
                      ${dateText}
                    </div>
                    <div class="delivery-option-price">
                      ${priceCents} - Shipping
                    </div>
                  </div>
                </div>`;
    });
    return deliveryOptionsHTML;
  }

  document.querySelector(".order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll(".delete-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const size = link.dataset.size || "default";
      removeFromCart(productId , size);

      
    updateCartQuantity();
    getPaymentSummary();
    getOrderSummary();
    });
  });

  function updateCartQuantity() {
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    document.querySelector(".return-to-home-link").innerHTML =
      cartQuantity + " items";
  }
  updateCartQuantity();
  

  document.querySelectorAll(".update-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const size = link.dataset.size || "default";

      document
        .querySelector(`.cart-item-container-${productId}-${size}`)
        .classList.add("is-editing-quantity");
    });
  });

  document.querySelectorAll(".save-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const size = link.dataset.size || "default";

      document
        .querySelector(`.cart-item-container-${productId}-${size}`)
        .classList.remove("is-editing-quantity");

      const quantityInput = document.querySelector(
        `.quantity-input-${productId}-${size}`
      );
      const newQuantity = Number(quantityInput.value);

      updateQuantity(productId, newQuantity , size);

      const quantityLabel = document.querySelector(
        `.quantity-label-${productId}-${size}`
      );
      quantityLabel.innerHTML = newQuantity;

      updateCartQuantity();
      getPaymentSummary();
    });
  });

  document.querySelectorAll(".delivery-option").forEach((option) => {
    option.addEventListener("click", () => {
      const { productId, deliveryOptionId, size } = option.dataset;
      updateDeliveryOption(productId, deliveryOptionId, size || 'default');

      getOrderSummary();
      getPaymentSummary();
    });
  });
}



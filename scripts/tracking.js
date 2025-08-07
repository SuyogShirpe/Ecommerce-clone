import { getMatchingOrder } from "../data/orders.js";
import { getProduct } from "../data/products.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {updateCartQuantity} from "./home.js";

async function loadPage() {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  const order = getMatchingOrder(orderId);
  const product = getProduct(productId);

  let productDetails = "";

  order.products.forEach((detail) => {
    if (detail.productId == product.id) {
      productDetails = detail;
    }
  });

  const trackingHTML = `<a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on ${dayjs(productDetails.estimatedDeliveryTime).format(
            "dddd , MMMM D"
          )}
        </div>

        <div class="product-info">
          ${product.name}
        </div>

        <div class="product-info">
          Quantity: ${productDetails.quantity}
        </div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
          <div class="progress-label">
            Preparing
          </div>
          <div class="progress-label current-status">
            Shipped
          </div>
          <div class="progress-label">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar"></div>
        </div>`;

  document.querySelector(".order-tracking").innerHTML = trackingHTML;

  updateCartQuantity(productId);
}
loadPage();

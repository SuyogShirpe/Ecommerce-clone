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

  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const estimatedDeliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  const progressPercentage = ((today - orderTime) / (estimatedDeliveryTime - orderTime)) * 100;

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
          <span>
            Quantity : ${productDetails.quantity}
          </span>
          <span>${productDetails.size && productDetails.size !== 'default' ? `
            Size : ${productDetails.size}` : ''}
          </span>
        </div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
          <div class="progress-label ${progressPercentage < 50 ? 'current status' : ''}">
            Preparing
          </div>
          <div class="progress-label ${progressPercentage > 50 && progressPercentage < 100 ? 'current status' : ''}">
            Shipped
          </div>
          <div class="progress-label ${progressPercentage >= 100 ? 'current status' : ''}">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" style="width:${progressPercentage}%;"></div>
        </div>`;

  document.querySelector(".order-tracking").innerHTML = trackingHTML;

  updateCartQuantity(productId);
  console.log(order);
}
loadPage();

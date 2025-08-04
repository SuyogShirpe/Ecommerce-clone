import {orders} from '../data/orders.js';
import {getProduct} from "../data/products.js";
import {formatCurrency} from "./utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";



let ordersHTML ='';

orders.forEach((order) => {

    const orderTime = dayjs(order.orderTime).format('MMMM D');

    ordersHTML += `
    <div class="order-container">
        <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderTime}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(order.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>

            </div>
        </div>

        <div class='order-details-grid'>
        ${productListHTML(order)}</div>
    </div>
`;


});


function productListHTML(order) {
    let productListHTML = '';

    order.products.forEach((productDetails) => {

        const product = getProduct(productDetails.productId);

        productListHTML += `
            <div class="product-image-container">
              <img src="${product.image}">
            </div>

            <div class="product-details">
              <div class="product-name">
                ${product.name}
              </div>
              <div class="product-delivery-date">
                Arriving on : ${dayjs(productDetails.estimatedDeliveryTime).format('MMMM D')}
              </div>
              <div class="product-quantity">
                Quantity : ${productDetails.quantity}
              </div>
              <button class="buy-again-button button-primary">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
                <button class="track-package-button button-secondary">
                  Track package
                </button>
              </a>
            </div>`;
    });
    
    return productListHTML;
}

document.querySelector('.orders-grid').innerHTML =ordersHTML;




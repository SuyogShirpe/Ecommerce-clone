import { getOrderSummary } from "./checkout/orderSummary.js";
import { getPaymentSummary } from "./checkout/paymentSummary.js";

new Promise((resolve) => {
  
  getOrderSummary();
  getPaymentSummary();
  resolve();

})

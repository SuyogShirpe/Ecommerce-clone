export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
  orders.unshift(order);
  saveToStrorage();
}

function saveToStrorage() {
  localStorage.setItem("orders", JSON.stringify(orders));
}

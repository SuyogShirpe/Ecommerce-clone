export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
  orders.unshift(order);
  saveToStrorage();
}

function saveToStrorage() {
  localStorage.setItem("orders", JSON.stringify(orders));
}

export function getMatchingOrder(orderId){
  let matchingOrder = '';

  orders.forEach((order) => {
    if(orderId == order.id){
      matchingOrder = order;
    }
  })
  return matchingOrder;
}
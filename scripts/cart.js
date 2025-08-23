export let cart =  JSON.parse(localStorage.getItem('cart')) || [
    {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
      size: 'default',
      deliveryOptionId:'1'
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
      size: 'default',
      deliveryOptionId:'2'
    }
  ];

cart = cart.map(item => ({
  ...item,
  size: item.size || "default"
}));


function saveToStorage(){
  localStorage.setItem('cart',JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;

  const quantitySelector = document.querySelector(`.quantity-selector-${productId}`);
  const quantity = quantitySelector ? Number(quantitySelector.value) : 1;
  let size = "default";
  const sizeSelector = document.querySelector(`.size-selector-${productId}`);
  if (sizeSelector) {
    size = sizeSelector.value || "default";
  }

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId && cartItem.size === size) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
    matchingItem.size = size;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      size:size,
      deliveryOptionId: '1'
    });
  }
  saveToStorage();
}

export function removeFromCart(productId , size = 'default') {
   cart = cart.filter(
    (cartItem) => !(cartItem.productId === productId && cartItem.size === size)
  );
  saveToStorage();
}

export function updateQuantity(productId, newQuantity , size = 'default') {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId && cartItem.size === size) {
      matchingItem = cartItem;
    }
  });
  matchingItem.quantity = newQuantity;
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId, size ='default') {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId && cartItem.size === size) {
      matchingItem = cartItem;
    }
  });
  
  
  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

export function addToCartFromOrders(productId , size = 'default') {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId  && cartItem.size === size) {
      matchingItem = cartItem;
    }
  });

  const quantity = 1;

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      size:size,
      deliveryOptionId: '1'
    });
  }
  saveToStorage();
}
console.log(cart);

export function clearCart(){
  cart = [];
  saveToStorage();
}

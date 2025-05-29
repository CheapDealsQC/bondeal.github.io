// js/cart.js
const CART_KEY = 'spotideals_cart';

export function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addItem(item) {
  const cart = getCart();
  cart.push(item);
  saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

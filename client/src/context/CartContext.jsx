import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ✅ ADD TO CART
const addToCart = (product) => {
  setCart((prev) => {

    const existing = prev.find((item) => item._id === product._id);

    if (existing) {
      return prev.map((item) =>
        item._id === product._id
          ? { ...item, qty: item.qty + 1 }
          : item
      );
    }

    // ✅ ENSURE _id EXISTS
    return [...prev, {
      _id: product._id || Date.now(),  // fallback ID
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    }];
  });
};

  // ❌ REMOVE BY ID (FIXED)
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // ➕ INCREASE QTY
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  };

  // ➖ DECREASE QTY
  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  // 🧹 CLEAR
  const clearCart = () => setCart([]);

  // 💰 TOTAL
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
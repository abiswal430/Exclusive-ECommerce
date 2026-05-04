import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [savedItems, setSavedItems] = useState([]); // ⭐ NEW

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

      return [...prev, { ...product, qty: 1 }];
    });
  };

  // ❌ REMOVE FROM CART
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // ⭐ SAVE FOR LATER
  const saveForLater = (item) => {
    setCart((prev) => prev.filter((p) => p._id !== item._id));
    setSavedItems((prev) => [...prev, item]);
  };

  // ⭐ MOVE BACK TO CART
  const moveToCart = (item) => {
    setSavedItems((prev) => prev.filter((p) => p._id !== item._id));
    addToCart(item);
  };

  // ❌ REMOVE FROM SAVED
  const removeFromSaved = (id) => {
    setSavedItems((prev) => prev.filter((item) => item._id !== id));
  };

  // ➕ INCREASE
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  // ➖ DECREASE
  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        savedItems, // ⭐ expose
        addToCart,
        removeFromCart,
        saveForLater,
        moveToCart,
        removeFromSaved,
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
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'gramudyam_cart_items';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      // Pre-populate with 1 authentic demo item
      return [
        {
          id: "2",
          productId: "2",
          name: "Traditional Warli Painting (Tarpa Dance)",
          nameMr: "पारंपरिक वारली चित्रकला (तारपा नृत्य)",
          price: 2400,
          originalPrice: 2800,
          quantity: 1,
          image: "https://lh3.googleusercontent.com/aida/AEtjO1X3LEEY6ALq7o8roki26KHrB7VZgQBBySHXkwLk9SDfdYFAxEOw5Sp1qsd5pxT-LLfTMYihu3k3YwHmAGRDKE61Zk5YQvucYVhf2XnzMMYpr1pb3o6VOqzL2PVFqIDp7GkrLYtnh_O-SyAO7SORHBtD37h_qo4t6TVyMk76q47EjuQ-C9Es5nPhUPXJkWyEZdkdbIztkyNSm1Zo5c8NUF84bBQe5O5--W07bvG3xWkXH5okp0nT6uDUMJ4F",
          artisan: "Savita Patil",
          cluster: "Dahanu, Palghar",
          trustTagId: "GM-TRUST-0002"
        }
      ];
    } catch {
      return [];
    }
  });

  const [fairTradeDonation, setFairTradeDonation] = useState(100);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => String(item.productId || item.id) === String(product.id));
      if (existing) {
        showToast(`Increased quantity of "${product.name}" in cart`);
        return prev.map((item) =>
          String(item.productId || item.id) === String(product.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      showToast(`Added "${product.name}" to cart`);
      return [
        ...prev,
        {
          id: product.id,
          productId: product.id,
          name: product.name,
          nameMr: product.nameMr,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity,
          image: product.image,
          artisan: product.artisan?.name || "Artisan Guild",
          cluster: `${product.artisan?.village || ''}, ${product.artisan?.district || ''}`.trim() || "Maharashtra",
          trustTagId: product.trustTagId
        }
      ];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((item) => String(item.id) !== String(id) && String(item.productId) !== String(id)));
    showToast("Removed item from cart");
  };

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (String(item.id) === String(id) || String(item.productId) === String(id)) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = subtotal > 1500 || items.length === 0 ? 0 : 80;
  const total = subtotal + shippingCost + fairTradeDonation;
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        shippingCost,
        fairTradeDonation,
        setFairTradeDonation,
        total,
        totalCount,
        toastMessage
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

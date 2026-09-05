"use client";

import { useState, useEffect, useRef } from "react";
import { Product, PRODUCTS } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const lastAddedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize with 1 default item (Origin 72) for immediate visceral feel, or keep empty
  useEffect(() => {
    try {
      const saved = localStorage.getItem("noire_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          return;
        }
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  // Clear any pending "last added" timer on unmount
  useEffect(() => {
    return () => {
      if (lastAddedTimerRef.current) {
        clearTimeout(lastAddedTimerRef.current);
        lastAddedTimerRef.current = null;
      }
    };
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("noire_cart", JSON.stringify(newItems));
    } catch {
      // ignore
    }
  };

  const addItem = (product: Product, quantity = 1) => {
    const existingIndex = items.findIndex((i) => i.product.id === product.id);
    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...items];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [...items, { product, quantity }];
    }
    saveCart(updated);
    setLastAddedId(product.id);
    setIsOpen(true);
    if (lastAddedTimerRef.current) {
      clearTimeout(lastAddedTimerRef.current);
    }
    lastAddedTimerRef.current = setTimeout(() => {
      lastAddedTimerRef.current = null;
      setLastAddedId(null);
    }, 1500);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    const updated = items.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    saveCart(updated);
  };

  const removeItem = (productId: string) => {
    const updated = items.filter((i) => i.product.id !== productId);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce(
    (acc, i) => acc + i.product.price * i.quantity,
    0
  );

  return {
    items,
    isOpen,
    setIsOpen,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalCount,
    subtotal,
    lastAddedId,
  };
}

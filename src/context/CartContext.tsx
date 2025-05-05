
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (product: Product, quantity = 1) => {
    if (quantity > product.stock) {
      toast({
        title: "Estoque insuficiente",
        description: `Apenas ${product.stock} unidades disponíveis`,
        variant: "destructive",
      });
      return;
    }

    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.product.id === product.id
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        
        if (newQuantity > product.stock) {
          toast({
            title: "Estoque insuficiente",
            description: `Você já tem ${existingItem.quantity} no carrinho. Apenas ${product.stock} unidades disponíveis.`,
            variant: "destructive",
          });
          return currentItems;
        }

        toast({
          title: "Produto adicionado",
          description: `${product.name} foi adicionado ao carrinho`,
        });

        return currentItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }

      toast({
        title: "Produto adicionado",
        description: `${product.name} foi adicionado ao carrinho`,
      });

      return [...currentItems, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(currentItems => 
      currentItems.filter(item => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems => {
      const productItem = currentItems.find(item => item.product.id === productId);
      
      if (productItem && quantity > productItem.product.stock) {
        toast({
          title: "Estoque insuficiente",
          description: `Apenas ${productItem.product.stock} unidades disponíveis`,
          variant: "destructive",
        });
        return currentItems;
      }

      return currentItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity, 
      0
    );
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

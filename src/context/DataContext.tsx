
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { products as initialProducts, categories as initialCategories, customers as initialCustomers, purchases as initialPurchases } from '@/lib/data';
import { Product, Category, Customer, Purchase, CartItem, PaymentMethod, PaymentStatus, Discount } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { getWhatsAppShareUrl } from '@/lib/utils';

interface DataContextType {
  products: Product[];
  categories: Category[];
  customers: Customer[];
  purchases: Purchase[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  updateCustomerBalance: (customerId: string, amount: number) => void;
  addPurchase: (items: CartItem[], paymentMethod: PaymentMethod, paymentStatus: PaymentStatus, customerId?: string, cashReceived?: number, cashChange?: number, discount?: Discount) => Purchase;
  getCustomerById: (id: string | undefined) => Customer | undefined;
  getProductById: (id: string) => Product | undefined;
  getCategoryById: (id: string) => Category | undefined;
  shareToWhatsApp: (phone: string, message: string) => string;
  generateDebtMessage: (customer: Customer) => string;
  generatePromotionMessage: (products: Product[]) => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const { toast } = useToast();

  // Product functions
  const addProduct = (product: Product) => {
    if (!product.id) {
      product.id = Math.random().toString(36).substring(2, 15);
    }
    setProducts([...products, product]);
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado com sucesso`,
    });
  };

  const updateProduct = (product: Product) => {
    setProducts(products.map(p => (p.id === product.id ? product : p)));
    toast({
      title: "Produto atualizado",
      description: `${product.name} foi atualizado com sucesso`,
    });
  };

  const deleteProduct = (productId: string) => {
    const productToDelete = products.find(p => p.id === productId);
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: "Produto removido",
        description: `${productToDelete.name} foi removido com sucesso`,
      });
    }
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  // Customer functions
  const addCustomer = (customer: Customer) => {
    if (!customer.id) {
      customer.id = Math.random().toString(36).substring(2, 15);
    }
    if (!customer.purchaseHistory) {
      customer.purchaseHistory = [];
    }
    setCustomers([...customers, customer]);
    toast({
      title: "Cliente adicionado",
      description: `${customer.name} foi adicionado com sucesso`,
    });
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(customers.map(c => (c.id === customer.id ? customer : c)));
    toast({
      title: "Cliente atualizado",
      description: `${customer.name} foi atualizado com sucesso`,
    });
  };

  const deleteCustomer = (customerId: string) => {
    const customerToDelete = customers.find(c => c.id === customerId);
    if (customerToDelete) {
      setCustomers(customers.filter(c => c.id !== customerId));
      toast({
        title: "Cliente removido",
        description: `${customerToDelete.name} foi removido com sucesso`,
      });
    }
  };

  const updateCustomerBalance = (customerId: string, amount: number) => {
    setCustomers(customers.map(c => {
      if (c.id === customerId) {
        return { ...c, accountBalance: c.accountBalance + amount };
      }
      return c;
    }));
  };

  // Purchase functions
  const addPurchase = (
    items: CartItem[], 
    paymentMethod: PaymentMethod, 
    paymentStatus: PaymentStatus, 
    customerId?: string, 
    cashReceived?: number, 
    cashChange?: number, 
    discount?: Discount
  ): Purchase => {
    const total = calculateTotalWithDiscount(items, discount);
    const customer = customerId ? customers.find(c => c.id === customerId) : undefined;
    
    // Gera um id baseado em timestamp + random
    const purchaseId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const purchase: Purchase = {
      id: purchaseId,
      date: new Date().toISOString().split('T')[0],
      items,
      total,
      paymentMethod,
      paymentStatus,
      customer,
      cashReceived,
      cashChange,
      discount
    };

    setPurchases([...purchases, purchase]);

    // Update product stock
    items.forEach(item => {
      updateProductStock(item.product.id, item.product.stock - item.quantity);
    });

    // If payment is 'account', update customer balance
    if (paymentMethod === 'account' && customer) {
      updateCustomerBalance(customer.id, -total); // Negative amount because the customer is getting in debt
      
      // Add purchase to customer history
      setCustomers(currentCustomers => 
        currentCustomers.map(c => {
          if (c.id === customer.id) {
            return {
              ...c,
              purchaseHistory: [...c.purchaseHistory, purchase]
            };
          }
          return c;
        })
      );
    }

    toast({
      title: "Venda registrada",
      description: `Venda no valor de R$ ${total.toFixed(2)} registrada com sucesso`,
    });

    return purchase;
  };

  // Helper functions
  const getCustomerById = (id: string | undefined) => {
    if (!id) return undefined;
    return customers.find(c => c.id === id);
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const getCategoryById = (id: string) => {
    return categories.find(c => c.id === id);
  };

  const calculateTotalWithDiscount = (items: CartItem[], discount?: Discount): number => {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    
    if (!discount) return subtotal;
    
    if (discount.type === 'percentage') {
      const discountAmount = (discount.value / 100) * subtotal;
      return subtotal - discountAmount;
    } else if (discount.type === 'fixed') {
      return Math.max(subtotal - discount.value, 0);
    }
    
    return subtotal;
  };

  // WhatsApp Integration
  const shareToWhatsApp = (phone: string, message: string): string => {
    const formattedPhone = phone.replace(/\D/g, '');
    return getWhatsAppShareUrl(`${formattedPhone}`, message);
  };
  
  const generateDebtMessage = (customer: Customer): string => {
    const debtAmount = Math.abs(customer.accountBalance);
    return `Olá ${customer.name}, o Bairro Mercadinho informa que você possui um saldo devedor de ${debtAmount.toFixed(2)} reais. Por favor, entre em contato para regularizar sua situação.`;
  };
  
  const generatePromotionMessage = (promotionProducts: Product[]): string => {
    let message = "🛒 PROMOÇÕES DO DIA - Bairro Mercadinho 🛒\n\n";
    
    promotionProducts.forEach((product, index) => {
      message += `${index + 1}. ${product.name} - ${(product.price).toFixed(2)} reais\n`;
    });
    
    message += "\nVenha aproveitar enquanto durar o estoque!";
    return message;
  };

  return (
    <DataContext.Provider value={{
      products,
      categories,
      customers,
      purchases,
      addProduct,
      updateProduct,
      deleteProduct,
      updateProductStock,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      updateCustomerBalance,
      addPurchase,
      getCustomerById,
      getProductById,
      getCategoryById,
      shareToWhatsApp,
      generateDebtMessage,
      generatePromotionMessage
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

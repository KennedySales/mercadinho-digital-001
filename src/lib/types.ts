
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  expirationDate: string | null;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  accountBalance: number;
  purchaseHistory: Purchase[];
}

export interface Purchase {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customer?: Customer;
  cashReceived?: number;
  cashChange?: number;
  discount?: Discount;
}

export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  description?: string;
}

export type PaymentMethod = 'cash' | 'credit_card' | 'pix' | 'account';
export type PaymentStatus = 'paid' | 'pending';

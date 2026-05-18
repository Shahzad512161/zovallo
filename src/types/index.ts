// src/types/index.ts
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  avatar?: string;
  role?: 'admin' | 'user';
  createdAt?: Date | any;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  specifications?: Record<string, string>;
  featured: boolean;
  createdAt?: any;
  updatedAt?: any;
  reviews?: Review[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt?: any;
}

export interface Order {
  id: string;
  userId: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    notes?: string;
  };
  products: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalPrice: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt?: any;
}
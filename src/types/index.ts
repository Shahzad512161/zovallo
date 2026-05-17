export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
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
  specifications: Record<string, string>;
  featured: boolean;
  createdAt: any;
  reviews?: Review[];
}

export interface Order {
  id: string;
  userId: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    address: string;
    postalCode: string;
    notes?: string;
  };
  products: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  totalPrice: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'COD';
  createdAt: any;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  createdAt: any;
}

export type Category = 
  | 'Sofa Sets'
  | 'Dining Tables'
  | 'Beds'
  | 'Mattresses'
  | 'Acoustic Wall Panels'
  | 'Coffee Tables'
  | 'Office Chairs'
  | 'Wardrobes';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  images?: string[];
  features?: string[];
  specs?: Record<string, string>;
  stock: number;
  featured?: boolean;
  reviews?: Review[];
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingDetails: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    address: string;
    postalCode: string;
    notes?: string;
  };
  paymentMethod: 'COD';
  createdAt: any;
}

export interface User {
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

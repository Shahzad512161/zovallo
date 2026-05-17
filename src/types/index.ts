export type Category = 
  | 'Sofa Sets'
  | 'Dining Tables'
  | 'Beds'
  | 'Mattresses'
  | 'Acoustic Wall Panels'
  | 'Coffee Tables'
  | 'Office Chairs'
  | 'Wardrobes';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
  featured?: boolean;
}

export interface User {
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
  };
  paymentMethod: 'Cash on Delivery';
  createdAt: any;
}

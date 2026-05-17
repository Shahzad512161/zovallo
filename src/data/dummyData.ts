import { type Product } from '../types';

export const CATEGORIES = [
  'Sofa Sets',
  'Dining Tables',
  'Beds',
  'Mattresses',
  'Acoustic Wall Panels',
  'Coffee Tables',
  'Office Chairs',
  'Wardrobes'
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Royal Velvet Sofa Set',
    description: 'Luxurious velvet sofa set with walnut wood legs. Perfect for modern living rooms.',
    price: 1299.99,
    category: 'Sofa Sets',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    stock: 5,
    featured: true
  },
  {
    id: '2',
    name: 'Scandinavian Dining Table',
    description: 'Solid oak dining table with a minimalist design. Comfortably seats six.',
    price: 849.99,
    category: 'Dining Tables',
    image: 'https://images.unsplash.com/photo-1577146333359-39f99d73010b?auto=format&fit=crop&q=80&w=800',
    stock: 8,
    featured: true
  },
  {
    id: '3',
    name: 'Premium Memory Foam Mattress',
    description: 'High-density memory foam mattress with cooling technology. Size: King.',
    price: 599.99,
    category: 'Mattresses',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800',
    stock: 12,
    featured: false
  },
  {
    id: '4',
    name: 'Executive Ergonomic Chair',
    description: 'Adjustable lumbar support and breathable mesh. Ideal for home offices.',
    price: 249.99,
    category: 'Office Chairs',
    image: 'https://images.unsplash.com/photo-1505797149-43b00fe1eeac?auto=format&fit=crop&q=80&w=800',
    stock: 15,
    featured: true
  }
];

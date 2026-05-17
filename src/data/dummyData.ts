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
  // Sofa Sets
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
    id: 's2',
    name: 'Modern Gray Sectional',
    description: 'A spacious gray sectional sofa with deep seating and performance fabric.',
    price: 1899.00,
    category: 'Sofa Sets',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800',
    stock: 3,
    featured: false
  },
  // Dining Tables
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
    id: 'd2',
    name: 'Marble Top Dining Table',
    description: 'Exquisite marble top table with gold-finished steel base.',
    price: 1450.00,
    category: 'Dining Tables',
    image: 'https://images.unsplash.com/photo-1530018607912-eff2ec1adab0?auto=format&fit=crop&q=80&w=800',
    stock: 4,
    featured: false
  },
  // Beds
  {
    id: 'b1',
    name: 'Upholstered King Bed',
    description: 'Elegant upholstered bed frame with a high headboard and linen finish.',
    price: 999.00,
    category: 'Beds',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800',
    stock: 6,
    featured: true
  },
  {
    id: 'b2',
    name: 'Solid Walnut Bed Frame',
    description: 'Mid-century modern bed frame crafted from sustainably sourced walnut.',
    price: 1200.00,
    category: 'Beds',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
    stock: 5,
    featured: false
  },
  // Mattresses
  {
    id: '3',
    name: 'Premium Memory Foam Mattress',
    description: 'High-density memory foam mattress with cooling technology. Size: King.',
    price: 599.99,
    category: 'Mattresses',
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800',
    stock: 12,
    featured: false
  },
  // Acoustic Wall Panels
  {
    id: 'p1',
    name: 'Wood Slat Wall Panel',
    description: 'Natural oak wood slat panels for superior sound absorption and style.',
    price: 159.00,
    category: 'Acoustic Wall Panels',
    image: 'https://images.unsplash.com/photo-1615876234586-44c13824bba3?auto=format&fit=crop&q=80&w=800',
    stock: 20,
    featured: true
  },
  // Coffee Tables
  {
    id: 'c1',
    name: 'Minimalist Glass Coffee Table',
    description: 'Tempered glass top with a sleek black metal frame.',
    price: 320.00,
    category: 'Coffee Tables',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800',
    stock: 10,
    featured: false
  },
  // Office Chairs
  {
    id: '4',
    name: 'Executive Ergonomic Chair',
    description: 'Adjustable lumbar support and breathable mesh. Ideal for home offices.',
    price: 249.99,
    category: 'Office Chairs',
    image: 'https://images.unsplash.com/photo-1505797149-43b00fe1eeac?auto=format&fit=crop&q=80&w=800',
    stock: 15,
    featured: true
  },
  // Wardrobes
  {
    id: 'w1',
    name: 'Grand Oak Wardrobe',
    description: 'Extra large wardrobe with soft-close doors and integrated LED lighting.',
    price: 1100.00,
    category: 'Wardrobes',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120ec?auto=format&fit=crop&q=80&w=800',
    stock: 4,
    featured: false
  }
];

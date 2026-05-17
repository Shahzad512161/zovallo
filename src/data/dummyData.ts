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
    title: 'Royal Velvet Sofa Set',
    slug: 'royal-velvet-sofa-set',
    description: 'Luxurious velvet sofa set with walnut wood legs. Perfect for modern living rooms. This premium set includes a 3-seater sofa and two matching armchairs, all upholstered in ultra-soft, stain-resistant velvet.',
    price: 1299.99,
    category: 'Sofa Sets',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1550226844-27ce051475b4?auto=format&fit=crop&q=80&w=800'
    ],
    specifications: {
      'Sofa Dimensions': '220cm x 95cm x 85cm',
      'Armchair Dimensions': '90cm x 85cm x 85cm',
      'Material': 'Velvet, Walnut Wood',
      'Color': 'Royal Blue',
      'Assembly': 'Minimal assembly required'
    },
    stock: 5,
    featured: true,
    createdAt: new Date('2024-01-01'),
    reviews: [
      { id: 'r1', userName: 'James W.', rating: 5, comment: 'Absolutely stunning sofa set. The blue is even more vibrant in person!', date: '2024-03-10' },
      { id: 'r2', userName: 'Sarah L.', rating: 4, comment: 'Very comfortable and looks very high-end. Assembly was a bit tricky but worth it.', date: '2024-02-15' }
    ]
  },
  {
    id: 's2',
    title: 'Modern Gray Sectional',
    slug: 'modern-gray-sectional',
    description: 'A spacious gray sectional sofa with deep seating and performance fabric.',
    price: 1899.00,
    category: 'Sofa Sets',
    images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800'],
    stock: 3,
    featured: false,
    specifications: {},
    createdAt: new Date('2024-01-02')
  },
  {
    id: '2',
    title: 'Scandinavian Dining Table',
    slug: 'scandinavian-dining-table',
    description: 'Solid oak dining table with a minimalist design. Comfortably seats six.',
    price: 849.99,
    category: 'Dining Tables',
    images: ['https://images.unsplash.com/photo-1577146333359-39f99d73010b?auto=format&fit=crop&q=80&w=800'],
    stock: 8,
    featured: true,
    specifications: {},
    createdAt: new Date('2024-01-03')
  },
  {
    id: 'd2',
    title: 'Marble Top Dining Table',
    slug: 'marble-top-dining-table',
    description: 'Exquisite marble top table with gold-finished steel base.',
    price: 1450.00,
    category: 'Dining Tables',
    images: ['https://images.unsplash.com/photo-1530018607912-eff2ec1adab0?auto=format&fit=crop&q=80&w=800'],
    stock: 4,
    featured: false,
    specifications: {},
    createdAt: new Date('2024-01-04')
  },
  {
    id: 'b1',
    title: 'Upholstered King Bed',
    slug: 'upholstered-king-bed',
    description: 'Elegant upholstered bed frame with a high headboard and linen finish.',
    price: 999.00,
    category: 'Beds',
    images: ['https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800'],
    stock: 6,
    featured: true,
    specifications: {},
    createdAt: new Date('2024-01-05')
  },
  {
    id: 'b2',
    title: 'Solid Walnut Bed Frame',
    slug: 'solid-walnut-bed-frame',
    description: 'Mid-century modern bed frame crafted from sustainably sourced walnut.',
    price: 1200.00,
    category: 'Beds',
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800'],
    stock: 5,
    featured: false,
    specifications: {},
    createdAt: new Date('2024-01-06')
  },
  {
    id: '3',
    title: 'Premium Memory Foam Mattress',
    slug: 'premium-memory-foam-mattress',
    description: 'High-density memory foam mattress with cooling technology. Size: King.',
    price: 599.99,
    category: 'Mattresses',
    images: ['https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800'],
    stock: 12,
    featured: false,
    specifications: {},
    createdAt: new Date('2024-01-07')
  },
  {
    id: 'p1',
    title: 'Wood Slat Wall Panel',
    slug: 'wood-slat-wall-panel',
    description: 'Natural oak wood slat panels for superior sound absorption and style.',
    price: 159.00,
    category: 'Acoustic Wall Panels',
    images: ['https://images.unsplash.com/photo-1615876234586-44c13824bba3?auto=format&fit=crop&q=80&w=800'],
    stock: 20,
    featured: true,
    specifications: {},
    createdAt: new Date('2024-01-08')
  },
  {
    id: 'c1',
    title: 'Minimalist Glass Coffee Table',
    slug: 'minimalist-glass-coffee-table',
    description: 'Tempered glass top with a sleek black metal frame.',
    price: 320.00,
    category: 'Coffee Tables',
    images: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800'],
    stock: 10,
    featured: false,
    specifications: {},
    createdAt: new Date('2024-01-09')
  },
  {
    id: '4',
    title: 'Executive Ergonomic Chair',
    slug: 'executive-ergonomic-chair',
    description: 'Adjustable lumbar support and breathable mesh. Ideal for home offices.',
    price: 249.99,
    category: 'Office Chairs',
    images: ['https://images.unsplash.com/photo-1505797149-43b00fe1eeac?auto=format&fit=crop&q=80&w=800'],
    stock: 15,
    featured: true,
    specifications: {},
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'w1',
    title: 'Grand Oak Wardrobe',
    slug: 'grand-oak-wardrobe',
    description: 'Extra large wardrobe with soft-close doors and integrated LED lighting.',
    price: 1100.00,
    category: 'Wardrobes',
    images: ['https://images.unsplash.com/photo-1595428774223-ef52624120ec?auto=format&fit=crop&q=80&w=800'],
    stock: 4,
    featured: false,
    specifications: {},
    createdAt: new Date('2024-01-11')
  }
];

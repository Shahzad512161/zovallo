import { PRODUCTS } from '../data/dummyData';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, CreditCard, Award, Star, Quote } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = PRODUCTS.filter(p => p.featured);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-start overflow-hidden px-8 lg:px-24">
        <img 
          src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=2000" 
          alt="Home Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="relative z-10 space-y-8 max-w-2xl">
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-white uppercase tracking-[0.3em] block underline decoration-gold underline-offset-8">
              New Season Arrival
            </span>
            <h1 className="text-5xl md:text-7xl text-white font-display font-medium leading-[1.05]">
              The Walnut <br /> & <span className="text-gold italic">Olive</span> Edit
            </h1>
            <p className="text-lg text-cream/80 max-w-md font-light leading-relaxed">
              Discover our masterfully crafted autumnal collection, blending traditional joinery with modern silhouettes for the contemporary home.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/shop">
              <Button size="lg" className="bg-white text-near-black hover:bg-gold px-10 border-none shadow-xl">
                Explore Collection
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-near-black px-10">
                View Lookbook
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products (Best Sellers) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 text-center md:text-left">
          <div className="space-y-3">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-gray-a0">Best Selling Products</h3>
            <h2 className="text-4xl font-display text-near-black">Pieces Destined to Last</h2>
            <div className="w-16 h-0.5 bg-gold mx-auto md:mx-0" />
          </div>
          <Link to="/shop" className="text-[12px] font-bold uppercase tracking-widest text-walnut hover:text-gold transition-colors underline underline-offset-4">
            Shop All Collections →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-cream border border-warm-beige flex items-center justify-center mx-auto">
              <Award className="w-8 h-8 text-walnut" />
            </div>
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-near-black">Premium Quality</h4>
            <p className="text-[13px] text-gray-666 font-light leading-relaxed">Hand-selected materials for lasting elegance.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-cream border border-warm-beige flex items-center justify-center mx-auto">
              <CreditCard className="w-8 h-8 text-walnut" />
            </div>
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-near-black">Cash On Delivery</h4>
            <p className="text-[13px] text-gray-666 font-light leading-relaxed">Secure payment upon your satisfaction.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-cream border border-warm-beige flex items-center justify-center mx-auto">
              <Truck className="w-8 h-8 text-walnut" />
            </div>
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-near-black">Fast Delivery</h4>
            <p className="text-[13px] text-gray-666 font-light leading-relaxed">UK-wide logistics to your doorstep.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-cream border border-warm-beige flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-walnut" />
            </div>
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-near-black">Secure Checkout</h4>
            <p className="text-[13px] text-gray-666 font-light leading-relaxed">Your data protected by industry standards.</p>
          </div>
        </div>
      </section>

      {/* Categories Grid (Expanded) */}
      <section className="bg-warm-beige/30 py-24 px-6 lg:px-8 border-y border-warm-beige">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-display text-near-black tracking-tight">Featured Collections</h2>
            <p className="text-gray-666 font-light">Explore a world of textures, finishes, and timeless designs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <CategoryCard 
              title="Sofas" 
              image="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800" 
              link="/category/sofa-sets"
              subtitle="Living Area"
            />
            <CategoryCard 
              title="Dining" 
              image="https://images.unsplash.com/photo-1577146333359-39f99d73010b?auto=format&fit=crop&q=80&w=800" 
              link="/category/dining-tables"
              subtitle="The Feast"
            />
            <CategoryCard 
              title="Beds" 
              image="https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800" 
              link="/category/beds"
              subtitle="Nightly Rest"
            />
            <CategoryCard 
              title="Sleep" 
              image="https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800" 
              link="/category/mattresses"
              subtitle="Mattresses"
            />
            <CategoryCard 
              title="Panels" 
              image="https://images.unsplash.com/photo-1615876234586-44c13824bba3?auto=format&fit=crop&q=80&w=800" 
              link="/category/acoustic-wall-panels"
              subtitle="Acoustics"
            />
          </div>
        </div>
      </section>

      {/* Featured Collection Banner */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mx-6 lg:mx-8 bg-walnut">
        <img 
          src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=2000" 
          alt="Collection Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale"
        />
        <div className="relative z-10 text-center space-y-6 px-4">
          <span className="text-[11px] font-bold text-gold uppercase tracking-[0.4em] block">Limited Edition</span>
          <h2 className="text-4xl md:text-6xl text-white font-display font-medium leading-tight max-w-3xl">
            The Heritage Walnut <br/> <span className="italic">Artisan</span> Collection
          </h2>
          <Button size="lg" className="bg-white text-near-black hover:bg-gold px-12 border-none">
            DISCOVER THE STORY
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-6 text-center md:text-left">
              <div className="flex justify-center md:justify-start space-x-1">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 text-gold fill-gold" />)}
              </div>
              <Quote className="w-8 h-8 text-warm-beige mx-auto md:mx-0" />
              <p className="text-[15px] text-near-black font-light italic leading-relaxed">
                "The attention to detail in their walnut collection is simply unmatched. It has transformed my apartment into a sanctuary of style."
              </p>
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-widest text-walnut">Eleanor Vance</p>
                <p className="text-[10px] text-gray-a0 uppercase tracking-widest">Interior Architect</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-near-black text-white py-24 px-6 lg:px-8 flex items-center justify-center text-center">
        <div className="max-w-3xl space-y-8">
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold">Join the Collective</h3>
            <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight">Signature Style, Delivered.</h2>
            <p className="text-cream/60 font-light max-w-lg mx-auto">
              Subscribe for exclusive design inspiration, seasonal collection reveals, and artisanal insights.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto border-b border-white/20 pb-2 focus-within:border-gold transition-colors">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-transparent px-0 py-3 text-[14px] outline-none flex-grow placeholder:text-white/20 font-light"
            />
            <button className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold hover:text-white transition-colors">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ title, image, link, subtitle }: { title: string; image: string; link: string; subtitle: string }) {
  return (
    <Link to={link} className="relative aspect-[3/4] group overflow-hidden bg-walnut block">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 opacity-80 group-hover:opacity-100" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-1 p-4 bg-black/10 group-hover:bg-black/40 transition-colors">
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          {subtitle}
        </span>
        <h3 className="text-3xl font-display font-medium tracking-tight">
          {title}
        </h3>
        <span className="w-0 group-hover:w-8 h-px bg-white transition-all duration-500 ease-out" />
      </div>
    </Link>
  );
}

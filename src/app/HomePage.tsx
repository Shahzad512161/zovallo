import { PRODUCTS } from '../data/dummyData';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

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

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-3">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-gray-a0">Curated Selection</h3>
            <h2 className="text-4xl font-display text-near-black">Best of the Season</h2>
            <div className="w-16 h-0.5 bg-gold" />
          </div>
          <Link to="/shop" className="text-[12px] font-bold uppercase tracking-widest text-walnut hover:text-gold transition-colors underline underline-offset-4">
            Shop All Collections →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-warm-beige/30 py-24 px-6 lg:px-8 border-y border-warm-beige">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-display text-near-black tracking-tight">Refined Categories</h2>
            <p className="text-gray-666 font-light">Explore a world of textures, finishes, and timeless designs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CategoryCard 
              title="Living" 
              image="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800" 
              link="/category/sofa-sets"
              subtitle="Timeless Comfort"
            />
            <CategoryCard 
              title="Sleep" 
              image="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800" 
              link="/category/beds"
              subtitle="Restorative Spaces"
            />
            <CategoryCard 
              title="Work" 
              image="https://images.unsplash.com/photo-1518455027359-f3f816b1a238?auto=format&fit=crop&q=80&w=800" 
              link="/category/office-chairs"
              subtitle="Focused Design"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ title, image, link, subtitle }: { title: string; image: string; link: string; subtitle: string }) {
  return (
    <Link to={link} className="relative aspect-[3/4] group overflow-hidden bg-walnut block">
      <img src={image} alt={title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-70 group-hover:opacity-100" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-2 p-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          {subtitle}
        </span>
        <h3 className="text-4xl font-display font-medium tracking-tight">
          {title}
        </h3>
        <span className="w-0 group-hover:w-12 h-px bg-white transition-all duration-500 ease-out" />
      </div>
    </Link>
  );
}

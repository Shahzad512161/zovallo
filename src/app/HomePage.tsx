import { useEffect, useState } from "react";
import { ProductCard } from "../components/ui/ProductCard";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import {
  Truck,
  ShieldCheck,
  CreditCard,
  Award,
  Star,
  Quote,
} from "lucide-react";
import { SEO } from "../components/SEO";
import { productApi } from "../services/productApi";
import { categoryApi } from "../services/categoryApi";
import { Product, Category } from "../types";
import { LoadingSpinner } from "../components/ui/Loading";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAllCategories(),
      ]);

      setAllProducts(productsData);
      const featured = productsData.filter((p) => p.featured === true);
      setFeaturedProducts(
        featured.length > 0 ? featured : productsData.slice(0, 4),
      );
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryImage = (category: Category): string => {
    if (category.image && category.image.startsWith("data:image")) {
      return category.image;
    }
    if (category.image && category.image.startsWith("http")) {
      return category.image;
    }
    const fallbackImages: Record<string, string> = {
      "Sofa Sets":
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
      "Dining Tables":
        "https://images.unsplash.com/photo-1577146333359-39f99d73010b?auto=format&fit=crop&q=80&w=800",
      Beds: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800",
      Mattresses:
        "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800",
      "Acoustic Wall Panels":
        "https://images.unsplash.com/photo-1615876234586-44c13824bba3?auto=format&fit=crop&q=80&w=800",
      "Coffee Tables":
        "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
      "Office Chairs":
        "https://images.unsplash.com/photo-1505797149-43b00fe1eeac?auto=format&fit=crop&q=80&w=800",
      Wardrobes:
        "https://images.unsplash.com/photo-1595428774223-ef52624120ec?auto=format&fit=crop&q=80&w=800",
    };
    return (
      fallbackImages[category.name] ||
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"
    );
  };

  const getCategorySubtitle = (categoryName: string): string => {
    const subtitles: Record<string, string> = {
      "Sofa Sets": "Living Area",
      "Dining Tables": "The Feast",
      Beds: "Nightly Rest",
      Mattresses: "Sleep",
      "Acoustic Wall Panels": "Acoustics",
      "Coffee Tables": "Centerpiece",
      "Office Chairs": "Workspace",
      Wardrobes: "Storage",
    };
    return subtitles[categoryName] || "Collection";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] sm:min-h-[600px]">
        <LoadingSpinner />
        <span className="ml-3 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gold">
          Loading Experience...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
      <SEO
        title="Home"
        description="Discover our masterfully crafted autumnal collection, blending traditional joinery with modern silhouettes for the contemporary home."
      />

      {/* Hero Section - Responsive */}
      <section className="relative h-[70vh] sm:h-[80vh] lg:h-[85vh] flex items-center justify-start overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=2000"
          alt="Home Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 space-y-4 sm:space-y-6 md:space-y-8 px-4 sm:px-8 lg:px-16 xl:px-24 max-w-full sm:max-w-lg md:max-w-2xl">
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <span className="text-[8px] sm:text-[10px] md:text-[11px] font-bold text-white uppercase tracking-[0.2em] sm:tracking-[0.3em] block underline decoration-gold underline-offset-4 sm:underline-offset-8">
              New Season Arrival
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-display font-medium leading-[1.1] sm:leading-[1.05]">
              The Walnut <br className="hidden sm:block" /> &{" "}
              <span className="text-gold italic">Olive</span> Edit
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-cream/80 max-w-sm sm:max-w-md font-light leading-relaxed">
              Discover our masterfully crafted autumnal collection, blending
              traditional joinery with modern silhouettes for the contemporary
              home.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Link to="/shop">
              <Button
                size="lg"
                className="bg-white text-near-black hover:bg-gold px-6 sm:px-8 md:px-10 py-2 sm:py-3 text-[10px] sm:text-[11px] border-none shadow-xl"
              >
                Explore Collection
              </Button>
            </Link>
            <Link to="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-near-black px-6 sm:px-8 md:px-10 py-2 sm:py-3 text-[10px] sm:text-[11px]"
              >
                View Lookbook
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products / Best Sellers - Responsive Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 md:space-y-16">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-gray-a0">
              Best Selling Products
            </h3>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-near-black">
              Pieces Destined to Last
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-gold mx-auto sm:mx-0" />
          </div>
          <Link
            to="/shop"
            className="text-[10px] sm:text-[12px] font-bold uppercase tracking-widest text-walnut hover:text-gold transition-colors underline underline-offset-4"
          >
            Shop All Collections →
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 text-sm sm:text-base">
              No products found. Add some products in the admin panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us - Responsive Icons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 text-center">
          <div className="space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-cream border border-warm-beige flex items-center justify-center mx-auto rounded-lg">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-walnut" />
            </div>
            <h4 className="text-[10px] sm:text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-near-black">
              Premium Quality
            </h4>
            <p className="text-[11px] sm:text-[12px] md:text-[13px] text-gray-666 font-light leading-relaxed px-2">
              Hand-selected materials for lasting elegance.
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-cream border border-warm-beige flex items-center justify-center mx-auto rounded-lg">
              <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-walnut" />
            </div>
            <h4 className="text-[10px] sm:text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-near-black">
              Cash On Delivery
            </h4>
            <p className="text-[11px] sm:text-[12px] md:text-[13px] text-gray-666 font-light leading-relaxed px-2">
              Secure payment upon your satisfaction.
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-cream border border-warm-beige flex items-center justify-center mx-auto rounded-lg">
              <Truck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-walnut" />
            </div>
            <h4 className="text-[10px] sm:text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-near-black">
              Fast Delivery
            </h4>
            <p className="text-[11px] sm:text-[12px] md:text-[13px] text-gray-666 font-light leading-relaxed px-2">
              UK-wide logistics to your doorstep.
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-cream border border-warm-beige flex items-center justify-center mx-auto rounded-lg">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-walnut" />
            </div>
            <h4 className="text-[10px] sm:text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-near-black">
              Secure Checkout
            </h4>
            <p className="text-[11px] sm:text-[12px] md:text-[13px] text-gray-666 font-light leading-relaxed px-2">
              Your data protected by industry standards.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid - Responsive */}
      <section className="bg-warm-beige/30 py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-y border-warm-beige">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 md:space-y-16">
          <div className="text-center space-y-2 sm:space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-near-black tracking-tight">
              Featured Collections
            </h2>
            <p className="text-gray-666 font-light text-sm sm:text-base">
              Explore a world of textures, finishes, and timeless designs.
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-400 text-sm sm:text-base">
                No categories found. Add some categories in the admin panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
              {categories.slice(0, 5).map((category) => (
                <CategoryCard
                  key={category.id}
                  title={category.name}
                  image={getCategoryImage(category)}
                  link={`/category/${category.slug}`}
                  subtitle={getCategorySubtitle(category.name)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Collection Banner - Responsive */}
      <section className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden mx-4 sm:mx-6 lg:mx-8 bg-walnut rounded-xl sm:rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=2000"
          alt="Collection Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale"
        />
        <div className="relative z-10 text-center space-y-4 sm:space-y-5 md:space-y-6 px-4">
          <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-gold uppercase tracking-[0.3em] sm:tracking-[0.4em] block">
            Limited Edition
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-display font-medium leading-tight max-w-3xl mx-auto px-2">
            The Heritage Walnut <br className="hidden sm:block" />{" "}
            <span className="italic">Artisan</span> Collection
          </h2>
          <Button
            size="lg"
            className="bg-white text-near-black hover:bg-gold px-8 sm:px-10 md:px-12 py-2 sm:py-3 text-[10px] sm:text-[11px] border-none"
          >
            DISCOVER THE STORY
          </Button>
        </div>
      </section>

      {/* Newsletter Section - Responsive */}
      {/* <section className="bg-near-black text-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-7 md:space-y-8">
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gold">
              Join the Collective
            </h3>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-medium tracking-tight">
              Signature Style, Delivered.
            </h2>
            <p className="text-cream/60 font-light text-sm sm:text-base max-w-lg mx-auto px-4">
              Subscribe for exclusive design inspiration, seasonal collection
              reveals, and artisanal insights.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto border-b border-white/20 pb-2 focus-within:border-gold transition-colors">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-transparent px-2 sm:px-0 py-2 sm:py-3 text-sm sm:text-[14px] outline-none flex-grow placeholder:text-white/20 font-light text-center sm:text-left"
            />
            <button className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-gold hover:text-white transition-colors">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section> */}
    </div>
  );
}

// Responsive Category Card Component
function CategoryCard({
  title,
  image,
  link,
  subtitle,
}: {
  title: string;
  image: string;
  link: string;
  subtitle: string;
}) {
  return (
    <Link
      to={link}
      className="relative aspect-[3/4] group overflow-hidden bg-walnut block rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
        loading="lazy"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-1 sm:space-y-2 p-3 sm:p-4 bg-black/10 group-hover:bg-black/40 transition-colors">
        <span className="text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] transform translate-y-3 sm:translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          {subtitle}
        </span>
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-display font-medium tracking-tight text-center px-1 sm:px-2 line-clamp-2">
          {title}
        </h3>
        <span className="w-0 group-hover:w-6 sm:group-hover:w-8 h-px bg-white transition-all duration-500 ease-out" />
      </div>
    </Link>
  );
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ArrowRight, ShirtIcon, Star } from "lucide-react";
import { useEffect, useRef } from "react";

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
        }
      });
    }, observerOptions);

    if (heroRef.current) observer.observe(heroRef.current);
    if (productsRef.current) {
      const productCards = productsRef.current.querySelectorAll('.product-card');
      productCards.forEach((card) => observer.observe(card));
    }

    return () => observer.disconnect();
  }, []);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section 
        ref={heroRef}
        className="relative py-20 md:py-32 overflow-hidden opacity-0"
      >
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center mb-6">
              <ShirtIcon className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Premium Oversized
              <span className="block text-primary mt-2">Black Tees</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our exclusive collection of oversized black t-shirts. 
              Crafted for comfort, designed for style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/products">
                <Button size="lg" className="group">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline">
                  View Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <Star className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-muted-foreground">
                  Made from the finest materials for lasting comfort and durability
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <ShirtIcon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Perfect Fit</h3>
                <p className="text-muted-foreground">
                  Oversized design that looks great on everyone
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Star className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Unique Designs</h3>
                <p className="text-muted-foreground">
                  Exclusive designs you won't find anywhere else
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section ref={productsRef} className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Collection</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our latest designs and find your perfect oversized tee
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.slice(0, 3).map((product, index) => (
                <Link 
                  key={product.id} 
                  to={`/products/${product.id}`}
                  className="product-card opacity-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      <p className="text-lg font-bold text-primary">₹{product.price}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
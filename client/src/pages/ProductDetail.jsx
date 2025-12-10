import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { 
  Star, Heart, ChevronRight, Check, ShoppingCart, 
  Package, Shield, Truck, Phone, ChevronLeft, ChevronDown, Zap, Award,
  X, ZoomIn, ZoomOut
} from "lucide-react";
import { fetchCategoriesWithProducts } from "../services/api";

// Shimmer component for loading state
const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
);

const ProductDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="pt-28 pb-0 px-4 sm:px-6 lg:px-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-t-3xl border border-border/60 shadow-sm p-6 lg:p-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="relative overflow-hidden bg-gray-200 aspect-square">
                  <Shimmer />
                </div>
                <div className="flex gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative w-20 h-20 bg-gray-200 overflow-hidden">
                      <Shimmer />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative h-8 w-3/4 bg-gray-200 rounded overflow-hidden">
                  <Shimmer />
                </div>
                <div className="relative h-12 w-full bg-gray-200 rounded overflow-hidden">
                  <Shimmer />
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="relative h-4 w-full bg-gray-200 rounded overflow-hidden">
                      <Shimmer />
                    </div>
                  ))}
                </div>
                <div className="relative h-16 w-1/3 bg-gray-200 rounded overflow-hidden">
                  <Shimmer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  useEffect(() => {
    const minTimer = setTimeout(() => setMinLoadingTime(false), 2000);

    const loadProduct = async () => {
      try {
        if (!id) {
          navigate('/products');
          return;
        }

        let productId = "";
        let categoryId = "";

        if (id.includes("--")) {
          const parts = id.split("--");
          productId = parts[0];
          categoryId = parts[1];
        } else {
          const catIndex = id.lastIndexOf("cat_");
          if (catIndex === -1) {
            navigate("/products");
            return;
          }
          productId = id.substring(0, catIndex);
          categoryId = id.substring(catIndex);
        }

        const data = await fetchCategoriesWithProducts();
        let foundProduct = null;

        Object.values(data.categories).forEach((category) => {
          if (category.category_id === categoryId) {
            Object.values(category.subcategories).forEach((subcategory) => {
              const prod = subcategory.products.find(p => p.product_id === productId);
              if (prod) {
                foundProduct = {
                  ...prod,
                  category_name: category.category_name,
                  main_category: category.main_category,
                  subcategory_name: subcategory.subcategory_name
                };
              }
            });
          }
        });

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          navigate('/products');
        }
      } catch (error) {
        console.error("Error loading product:", error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    return () => clearTimeout(minTimer);
  }, [id, navigate]);


  const handleBuyNow = () => {
    alert("Please contact us via email or phone to purchase this product.");
  };

  const getPrice = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 15000) + 1000;
  };

  const price = product?.product_price ?? getPrice(product?.product_id ?? "fallback_id");
  const rating = 4.5;

  useEffect(() => {
    if (!product?.image_urls || product.image_urls.length <= 1 || showLightbox) return;
    const intervalId = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.image_urls.length);
    }, 2000);
    return () => clearInterval(intervalId);
  }, [product?.image_urls, showLightbox]);


  const handleOpenLightbox = () => {
    if (!product?.image_urls?.length) return;
    setLightboxZoom(1);
    setShowLightbox(true);
  };

  const handleCloseLightbox = () => {
    setShowLightbox(false);
    setLightboxZoom(1);
  };

  const handleZoom = (delta) => {
    setLightboxZoom((prev) => Math.min(Math.max(prev + delta, 1), 3));
  };

  if (loading || minLoadingTime || !product) return <ProductDetailSkeleton />;

  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="w-full bg-white border-b border-border/60 py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">
          <img src="/prosmart_logo_lg.png" alt="Prosmart Concepts logo" className="h-12 w-auto" />

          <div className="flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary font-medium">Home</Link>
            <Link to="/products" className="text-foreground hover:text-primary font-medium">Products</Link>
          </div>
        </div>
      </nav>

      <main className="pt-0 pb-0 px-4 sm:px-6 lg:px-10">

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 mb-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/products">Products</Link>
            <ChevronRight className="w-4 h-4" />
            <span>{product.category_name || product.subcategory}</span>
          </nav>
        </div>

        <div className="container mx-auto px-0">
          <div className="bg-white border border-border/60 rounded-t-2xl shadow-sm px-0 pt-0 pb-0 mb-0">

            <div className="grid lg:grid-cols-2 gap-12 p-6 lg:p-8">

              {/* LEFT IMAGES */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >

                {product.main_category && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-xs font-semibold text-white bg-gradient-to-r from-primary to-accent px-4 py-2 rounded-full shadow-lg">
                      {product.main_category}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                </button>

                <div
                  className="relative overflow-hidden bg-gradient-to-br from-muted via-background to-muted/50 aspect-square mb-6 cursor-zoom-in"
                  onClick={handleOpenLightbox}
                >
                  <AnimatePresence mode="wait">
                    {product.image_urls?.length > 0 ? (
                      <motion.img
                        key={selectedImage}
                        src={product.image_urls[selectedImage]}
                        alt={product.product_name}
                        className="w-full h-full object-contain p-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="w-48 h-48 text-primary/20" />
                      </div>
                    )}
                  </AnimatePresence>

                  {product.image_urls?.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev === 0 ? product.image_urls.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev === product.image_urls.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {product.image_urls?.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {product.image_urls.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`relative flex-shrink-0 w-20 h-20 overflow-hidden bg-muted border-2 transition-all ${
                          selectedImage === i
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={url} className="w-full h-full object-contain p-2" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* LIGHTBOX */}
              {showLightbox && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
                  <button
                    onClick={handleCloseLightbox}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-foreground shadow-lg flex items-center justify-center hover:bg-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="relative max-w-5xl w-full bg-white/5 rounded-2xl p-4 shadow-2xl">
                    <div className="flex items-center justify-center overflow-hidden rounded-xl bg-background">
                      <img
                        src={product.image_urls[selectedImage]}
                        alt="zoomed"
                        className="max-h-[70vh] object-contain transition-transform"
                        style={{ transform: `scale(${lightboxZoom})` }}
                        onWheel={(e) => {
                          e.preventDefault();
                          handleZoom(e.deltaY < 0 ? 0.1 : -0.1);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-center gap-3 mt-4">
                      <button
                        onClick={() => handleZoom(0.1)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-foreground rounded-full shadow-sm"
                      >
                        <ZoomIn className="w-4 h-4" /> Zoom In
                      </button>
                      <button
                        onClick={() => handleZoom(-0.1)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-foreground rounded-full shadow-sm"
                      >
                        <ZoomOut className="w-4 h-4" /> Zoom Out
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* RIGHT SECTION — INFO */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Category Badges */}
                <div className="flex flex-wrap gap-2">
                  {product.subcategory_name && (
                    <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-3 py-1.5 rounded-full">
                      {product.subcategory_name}
                    </span>
                  )}
                  {product.category_name && (
                    <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                      {product.category_name}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {product.product_name}
                </h1>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="font-semibold ml-2">{rating}</span>
                  </div>
                </div>

                {product.product_title && (
                  <div className="py-4 border-y border-border">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      {product.product_title}
                    </h2>
                  </div>
                )}

                {product.product_description && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.product_description}
                    </p>
                  </div>
                )}

                {/* Contact Us */}
                <div className="pt-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-cyan-900 text-cyan-900 bg-transparent hover:bg-cyan-50"
                    onClick={handleBuyNow}
                  >
                    Contact Us
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Quality Warranty</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Truck className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Fast Delivery</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">24/7 Support</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Certified Product</p>
                  </div>
                </div>

              </motion.div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ProductDetail;

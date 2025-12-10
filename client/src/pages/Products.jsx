import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ChevronRight, Grid3X3, LayoutGrid, X } from 'lucide-react';
import ProductsHeader from '../products/ProductsHeader';
import ProductCard from '../products/ProductCard';
import ProductFilters from '../products/ProductFilters';
import ProductsLoading from '../products/ProductsLoading';
import { fetchCategoriesWithProducts } from '../services/api';

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [activeTab, setActiveTab] = useState('All Items');
  const [showFilters, setShowFilters] = useState(true);
  const [priceRange, setPriceRange] = useState(null);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShimmer, setShowShimmer] = useState(true);
  const [error, setError] = useState(null);
  const shimmerTimeoutRef = useRef(null);
  // Fetch products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      // Minimum shimmer duration for smooth UX (500ms)
      const MIN_SHIMMER_MS = 500;
      const startTime = Date.now();
      const controller = new AbortController();
      const TIMEOUT_MS = 20_000;
      const timeoutId = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        setLoading(true);
        setShowShimmer(true);
        setError(null);
        const data = await fetchCategoriesWithProducts({ signal: controller.signal });
        setProductData(data);

        // Calculate how much time remains to reach the minimum shimmer duration
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_SHIMMER_MS - elapsed);

        // Clear any existing timer before setting a new one
        if (shimmerTimeoutRef.current) {
          window.clearTimeout(shimmerTimeoutRef.current);
        }

        shimmerTimeoutRef.current = window.setTimeout(() => {
          setShowShimmer(false);
        }, remaining);

        setLoading(false);
      } catch (err) {
        console.error('Failed to load products:', err);
        const isAbort = err instanceof DOMException && err.name === 'AbortError';
        setError(
          isAbort
            ? 'Request timed out. Please retry.'
            : 'Failed to load products. Please try again later.'
        );
        setLoading(false);
        setShowShimmer(false);
      }
      
      window.clearTimeout(timeoutId);
    };

    loadProducts();

    return () => {
      if (shimmerTimeoutRef.current) {
        window.clearTimeout(shimmerTimeoutRef.current);
      }
    };
  }, []);

  // Handle category parameter from URL
  useEffect(() => {
    if (categoryParam && productData) {
      // Check if it's a main category
      const mainCats = new Set();
      Object.values(productData.categories).forEach((category) => {
        if (category.main_category) {
          mainCats.add(category.main_category);
        }
      });

      if (mainCats.has(categoryParam)) {
        setActiveTab(categoryParam);
      } else {
        // Check if it's a category name
        const categoryExists = Object.values(productData.categories).some(
          (cat) => cat.category_name === categoryParam
        );
        if (categoryExists) {
          setSelectedCategories([categoryParam]);
        }
      }
    }
  }, [categoryParam, productData]);

  // Extract all products, main categories, categories, and subcategories from data
  const { allProducts, mainCategories, categories, subcategories } = useMemo(() => {
    if (!productData) {
      return {
        allProducts: [],
        mainCategories: [],
        categories: [],
        subcategories: [],
      };
    }

    const products = [];
    const mainCats = new Set();
    const cats = [];
    const subcats = [];

    Object.values(productData.categories).forEach((category) => {
      cats.push(category.category_name);
      if (category.main_category) {
        mainCats.add(category.main_category);
      }
      Object.values(category.subcategories).forEach((subcategory) => {
        subcats.push(subcategory.subcategory_name);
        products.push(...subcategory.products);
      });
    });

    return {
      allProducts: products,
      mainCategories: Array.from(mainCats),
      categories: [...new Set(cats)],
      subcategories: [...new Set(subcats)],
    };
  }, [productData]);

  // Get categories and subcategories for the active main category tab
  const { filteredCategories, filteredSubcategories } = useMemo(() => {
    if (!productData || activeTab === 'All Items') {
      return {
        filteredCategories: categories,
        filteredSubcategories: subcategories,
      };
    }

    const cats = [];
    const subcats = [];

    Object.values(productData.categories).forEach((category) => {
      if (category.main_category === activeTab) {
        cats.push(category.category_name);
        Object.values(category.subcategories).forEach((subcategory) => {
          subcats.push(subcategory.subcategory_name);
        });
      }
    });

    return {
      filteredCategories: [...new Set(cats)],
      filteredSubcategories: [...new Set(subcats)],
    };
  }, [activeTab, categories, subcategories, productData]);

  // Filter products based on selections
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by active tab (main category)
    if (activeTab !== 'All Items' && productData) {
      filtered = filtered.filter((product) => product.main_category === activeTab);
    }

    // Filter by selected categories
    if (selectedCategories.length > 0 && productData) {
      filtered = filtered.filter((product) => {
        const category = Object.values(productData.categories).find(
          (cat) => cat.category_id === product.category_id
        );
        return category && selectedCategories.includes(category.category_name);
      });
    }

    // Filter by selected subcategories
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedSubcategories.includes(product.subcategory)
      );
    }

    return filtered;
  }, [allProducts, activeTab, selectedCategories, selectedSubcategories, productData]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setActiveTab('All Items');
    setPriceRange(null);
  };

  // Error state
  if (error) {
    return (
      <div className="h-screen overflow-hidden bg-white flex flex-col">
        <ProductsHeader />
        <main className="flex-1 bg-gradient-to-br from-emerald-50/80 via-cyan-50/60 to-sky-100/70 backdrop-blur-sm rounded-t-[3rem] shadow-xl py-8 px-8 lg:px-16 mx-6 lg:mx-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Loading/Shimmer state - show while data is loading
  if (showShimmer) {
    return (
      <div className="h-screen overflow-hidden bg-white flex flex-col">
        <ProductsHeader />
        <main className="relative flex-1 bg-gradient-to-br from-emerald-50/80 via-cyan-50/60 to-sky-100/70 backdrop-blur-sm rounded-t-[3rem] shadow-xl py-8 px-8 lg:px-16 mx-6 lg:mx-12 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-white/35 backdrop-blur-md" />
          <div className="relative z-10 flex flex-col h-full">
            <ProductsLoading />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-white flex flex-col">
      <ProductsHeader />

      <main className="relative flex-1 bg-gradient-to-br from-white via-cyan-100/85 to-sky-200/60 backdrop-blur-sm rounded-t-2xl shadow-xl py-6 px-6 lg:px-10 mx-3 lg:mx-6 overflow-hidden pt-20">
        <div className="pointer-events-none absolute inset-0 bg-white/35 backdrop-blur-md" />
        <div className="relative z-10 flex flex-col h-full">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 flex-shrink-0">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold text-foreground mb-2"
              >OUR PRODUCTS
              </motion.h1>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hover:text-foreground cursor-pointer transition-colors">Home</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-primary font-medium">Products</span>
              </div>
            </div>

            {/* Main Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-nowrap gap-2 overflow-x-auto no-scrollbar -mx-2 px-2 sm:flex-wrap sm:overflow-visible sm:mx-0 sm:px-0"
            >
              <button
                onClick={() => {
                  setActiveTab('All Items');
                  setSelectedCategories([]);
                  setSelectedSubcategories([]);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                  activeTab === 'All Items'
                    ? 'bg-white border-2 border-cyan-600 text-cyan-600 shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                All Items
              </button>
              {mainCategories.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedCategories([]);
                    setSelectedSubcategories([]);
                  }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                    activeTab === tab
                      ? 'bg-white border-2 border-cyan-600 text-cyan-600 shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </motion.div>
          </div>

          <div className="flex gap-0 flex-1 overflow-hidden">
            {/* Sidebar Filters - Independent Scroll */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: showFilters ? 1 : 0, x: showFilters ? 0 : -20 }}
              className={`w-80 flex-shrink-0 hidden lg:block ${!showFilters && 'lg:hidden'} h-full overflow-hidden`}
            >
              <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-gray-300 p-6 h-full overflow-y-auto custom-scrollbar no-scrollbar">
                <ProductFilters
                  categories={filteredCategories}
                  subcategories={filteredSubcategories}
                  selectedCategories={selectedCategories}
                  selectedSubcategories={selectedSubcategories}
                  onCategoryChange={handleCategoryChange}
                  onSubcategoryChange={handleSubcategoryChange}
                  onResetFilters={handleResetFilters}
                  priceRange={[priceRange?.min || 0, priceRange?.max || 500]}
                  onPriceChange={(range) => setPriceRange({ min: range[0], max: range[1] })}
                />
              </div>
            </motion.aside>

            {/* Dotted Line Separator */}
            {showFilters && (
              <div className="hidden lg:flex flex-col items-center px-6">
                <div className="w-0 h-full border-l-2 border-dashed border-primary/30" />
            </div>
            )}

            {/* Products Section - Independent Scroll */}
            <div className="flex-1 h-full overflow-hidden flex flex-col min-h-0 relative">
              {/* Toolbar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 sm:gap-4 justify-between mb-6 flex-shrink-0 overflow-x-auto no-scrollbar -mx-2 px-2 sm:overflow-visible sm:mx-0 sm:px-0"
              >
                {/* Mobile Filters Button - Only visible on mobile */}
                <div className="relative md:hidden">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-muted-foreground text-sm shadow-sm flex-shrink-0 hover:bg-muted transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {(selectedCategories.length > 0 || selectedSubcategories.length > 0) && (
                      <span className="ml-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                        {selectedCategories.length + selectedSubcategories.length}
                      </span>
                    )}
                  </button>

                  {/* Mobile Filters Dropdown Card */}
                  {showFilters && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setShowFilters(false)}
                      />
                      {/* Filters Card */}
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-20 left-4 right-4 bg-card rounded-xl shadow-2xl border-2 border-border z-50 md:hidden max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col"
                      >
                        {/* Card Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
                          <h3 className="font-bold text-base text-foreground">Filters</h3>
                          <button
                            onClick={() => setShowFilters(false)}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                          >
                            <X className="w-5 h-5 text-muted-foreground" />
                          </button>
                        </div>

                        {/* Filters Content - Scrollable */}
                        <div className="overflow-y-auto flex-1 p-4">
                          <ProductFilters
                            categories={filteredCategories}
                            subcategories={filteredSubcategories}
                            selectedCategories={selectedCategories}
                            selectedSubcategories={selectedSubcategories}
                            onCategoryChange={handleCategoryChange}
                            onSubcategoryChange={handleSubcategoryChange}
                            onResetFilters={handleResetFilters}
                            priceRange={[priceRange?.min || 0, priceRange?.max || 500]}
                            onPriceChange={(range) => setPriceRange({ min: range[0], max: range[1] })}
                          />
                        </div>

                        {/* Card Footer - Apply Button */}
                        <div className="p-4 border-t border-border bg-muted/50 flex gap-3">
                          <button
                            onClick={handleResetFilters}
                            className="flex-1 px-4 py-2.5 border border-border rounded-lg text-muted-foreground font-medium hover:bg-muted transition-colors text-sm"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => setShowFilters(false)}
                            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
                          >
                            Apply Filters
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Active Filters Display */}
              {(selectedCategories.length > 0 || selectedSubcategories.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-6 flex-shrink-0">
                  {selectedCategories.map((cat) => (
                    <span
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                    >
                      {cat}
                      <X className="w-3 h-3" />
                    </span>
                  ))}
                  {selectedSubcategories.map((sub) => (
                    <span
                      key={sub}
                      onClick={() => handleSubcategoryChange(sub)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/20 border border-accent/30 rounded-full text-xs text-foreground cursor-pointer hover:bg-accent/30 transition-colors"
                    >
                      {sub}
                      <X className="w-3 h-3" />
                    </span>
                  ))}
                </div>
              )}

              {/* Products Grid - Vertical scroll on mobile, grid on desktop */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 min-h-0">
                {filteredProducts.length > 0 ? (
                  <>
                    {/* Mobile: Single Column Vertical Scroll - Only visible on mobile (< 768px) */}
                    <div className="md:hidden">
                      <div className="grid grid-cols-1 gap-4 pb-6">
                        {filteredProducts.map((product, index) => (
                          <ProductCard key={product.product_id} product={product} index={index} isMobile={true} />
                        ))}
                      </div>

                      {/* Load More */}
                      {filteredProducts.length > 16 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex justify-center mt-6 pb-8"
                        >
                          <button className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors shadow-lg text-sm">
                            Load More Products
                          </button>
                        </motion.div>
                      )}
                    </div>

                    {/* Tablet: 2 Column Grid - Visible from md to lg */}
                    <div className="hidden md:block lg:hidden">
                      <div className="grid grid-cols-2 gap-4 sm:gap-5">
                        {filteredProducts.map((product, index) => (
                          <ProductCard key={product.product_id} product={product} index={index} />
                        ))}
                      </div>

                      {/* Load More */}
                      {filteredProducts.length > 16 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex justify-center mt-8 pb-8"
                        >
                          <button className="px-6 py-2.5 sm:px-8 sm:py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors shadow-lg text-sm sm:text-base">
                            Load More Products
                          </button>
                        </motion.div>
                      )}
                    </div>

                    {/* Desktop: Grid Layout - Visible from lg breakpoint */}
                    <div className="hidden lg:block">
                      <div className="grid grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredProducts.map((product, index) => (
                          <ProductCard key={product.product_id} product={product} index={index} />
                        ))}
                      </div>

                      {/* Load More */}
                      {filteredProducts.length > 16 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex justify-center mt-12 pb-8"
                        >
                          <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors shadow-lg">
                            Load More Products
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[200px]">
                    <p className="text-muted-foreground text-sm sm:text-base">No products found matching your filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;

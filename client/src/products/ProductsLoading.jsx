import { motion } from 'framer-motion';
import ProductCardSkeleton from './ProductCardSkeleton';

const ProductsLoading = () => {
  const skeletonCards = Array.from({ length: 12 }, (_, i) => i);

  return (
    <>
      {/* Page Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 flex-shrink-0">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-12 w-64 bg-slate-200 rounded-lg mb-2 animate-shimmer"
          />

          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-slate-200 rounded animate-shimmer" />
            <div className="h-4 w-4 bg-slate-200 rounded animate-shimmer" />
            <div className="h-4 w-16 bg-slate-200 rounded animate-shimmer" />
          </div>
        </div>

        {/* Main Category Tabs Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div
              key={i}
              className="h-10 w-32 bg-slate-200 rounded-full animate-shimmer"
            />
          ))}
        </motion.div>
      </div>

      <div className="flex gap-0 flex-1 overflow-hidden">
        {/* Sidebar Filter Skeleton */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 flex-shrink-0 hidden lg:block h-full overflow-hidden"
        >
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50 p-6 h-full overflow-hidden">
            <div className="space-y-6">
              {/* Filter Header */}
              <div className="h-6 w-20 bg-slate-200 rounded animate-shimmer" />

              {/* Price Range */}
              <div className="space-y-3">
                <div className="h-4 w-32 bg-slate-200 rounded animate-shimmer" />
                <div className="h-2 w-full bg-slate-200 rounded-full animate-shimmer" />
              </div>

              {/* Category */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="h-4 w-24 bg-slate-200 rounded animate-shimmer" />
                <div className="h-10 w-full bg-slate-200 rounded-lg animate-shimmer" />
              </div>

              {/* Subcategories */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="h-4 w-28 bg-slate-200 rounded animate-shimmer" />
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="flex items-center gap-3 p-2.5">
                      <div className="h-4 w-4 bg-slate-200 rounded animate-shimmer" />
                      <div className="h-4 flex-1 bg-slate-200 rounded animate-shimmer" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Dotted Separator */}
        <div className="hidden lg:flex flex-col items-center px-6">
          <div className="w-0 h-full border-l-2 border-dashed border-primary/30" />
        </div>

        {/* Products Section */}
        <div className="flex-1 h-full overflow-hidden flex flex-col">
          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-6 flex-shrink-0"
          >
            <div className="h-10 w-32 bg-slate-200 rounded-lg animate-shimmer lg:hidden" />

            <div className="flex items-center gap-4 ml-auto">
              <div className="h-4 w-24 bg-slate-200 rounded animate-shimmer" />
              <div className="h-10 w-32 bg-slate-200 rounded-lg animate-shimmer" />
              <div className="hidden sm:flex h-10 w-24 bg-slate-200 rounded-lg animate-shimmer" />
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {skeletonCards.map((_, index) => (
                <ProductCardSkeleton key={index} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsLoading;

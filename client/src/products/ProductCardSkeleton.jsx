import { motion } from 'framer-motion';

const ProductCardSkeleton = ({ index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
    >
      {/* Image Skeleton */}
      <div className="aspect-square bg-gradient-to-b from-slate-50 to-white p-4 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full bg-slate-200 rounded-lg animate-shimmer" />
      </div>

      {/* Product Info Skeleton */}
      <div className="p-4 space-y-2">
        {/* Category & Rating Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 bg-slate-200 rounded animate-shimmer" />
          <div className="h-3 w-12 bg-slate-200 rounded animate-shimmer" />
        </div>

        {/* Product Name Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-200 rounded animate-shimmer" />
          <div className="h-4 w-3/4 bg-slate-200 rounded animate-shimmer" />
        </div>

        {/* Add to Cart Button Skeleton */}
        <div className="h-8 w-full bg-slate-200 rounded-full animate-shimmer" />
      </div>
    </motion.div>
  );
};

export default ProductCardSkeleton;

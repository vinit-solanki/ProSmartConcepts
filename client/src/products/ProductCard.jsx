import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";

const ProductCard = ({ product, index, isMobile = false }) => {

  // Fallback random price generator using product_id hash (stable)
  const getPrice = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 15000) + 1000;
  };

  // Universal price formatter (string or number)
  const formatPrice = (value) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return value;
    return `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  // Final price
  const price = product.product_price
    ? Number(product.product_price)
    : getPrice(product.product_id);

  // Discount logic
  const hasDiscount = product.product_id.charCodeAt(0) % 3 === 0;
  const discountPercent = hasDiscount ? 20 : 0;
  const originalPrice = hasDiscount ? Math.floor(price * 1.25) : null;

  const rating = 4.5;

  // Product Detail ID
  const productDetailId = `${product.product_id}${product.category_id}`;

  return (
    <Link to={`/products/${productDetailId}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03, duration: 0.4 }}
        className={`group relative border-2 shadow-sm hover:shadow-lg transition-all duration-300 rounded-[2rem_2rem_1rem_1rem] overflow-hidden
          ${
            isMobile
              ? "bg-white/80 backdrop-blur-md border-white/50"
              : "bg-white border-gray-300"
          }`}
      >
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10 bg-yellow-400 text-black text-xs font-bold px-2.5 py-1 rounded-md">
            {discountPercent}% Off
          </div>
        )}

        {/* Image */}
        <div className="aspect-square bg-gray-50 p-4 flex items-center justify-center overflow-hidden">
          {product.image_urls && product.image_urls.length > 0 ? (
            <img
              src={product.image_urls[0]}
              alt={product.product_name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center">
              <span className="text-slate-400 text-sm">No image</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Category */}
          <span className="text-gray-500 text-xs font-medium block">
            {product.subcategory || "Product"}
          </span>

          {/* Product Name + Rating */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-gray-800 font-semibold text-sm line-clamp-2 flex-1">
              {product.product_name}
            </h3>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
              <span className="text-gray-600 text-xs">({rating})</span>
            </div>
          </div>

          {/* Bottom Section: Contact Button */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button className="flex items-center gap-1 px-4 py-2 bg-cyan-500 text-white hover:bg-cyan-600 transition-colors rounded-full text-xs font-medium whitespace-nowrap shadow-sm">
              Contact Us
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;

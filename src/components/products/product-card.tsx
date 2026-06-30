"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/cart-context";
import { ReviewStars } from "@/components/shared/review-stars";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first size and flavor
    const defaultSize = product.sizes[0] || "Standard";
    const defaultFlavor = product.flavors ? product.flavors[0] : "Standard";
    addToCart(product, defaultSize, defaultFlavor, 1);
  };

  // Determine badge label in Arabic
  let badgeText = "";
  if (product.isBestSeller) badgeText = "الأكثر مبيعاً";
  else if (product.isNew) badgeText = "وصلنا حديثاً";
  else if (product.originalPrice && product.originalPrice > product.price) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    badgeText = `وفر ${discount}%`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-[#121212] border border-neutral-900 rounded-lg overflow-hidden group relative flex flex-col h-full hover:border-[#D4AF37]/45 shadow-lg hover:shadow-[0_10px_30px_rgba(212,175,55,0.08)] transition-all duration-300"
    >
      {/* Product Image and Overlay Controls */}
      <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden border-b border-neutral-900/60">
        {/* Badge */}
        {badgeText && (
          <span className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-gradient-to-r from-[#996515] to-[#D4AF37] text-black text-[10px] font-black rounded shadow-[0_0_8px_rgba(212,175,55,0.3)]">
            {badgeText}
          </span>
        )}

        {/* Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 brightness-95 group-hover:brightness-100"
        />

        {/* hover quick view controls */}
        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <Link
            href={`/product/${product.id}`}
            className="p-3 bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37] hover:text-[#D4AF37] rounded-full text-white transition-all duration-300"
            title="عرض التفاصيل"
          >
            <Eye size={18} />
          </Link>
          <button
            onClick={handleAddToCart}
            className="p-3 bg-[#D4AF37] hover:bg-[#b38c27] rounded-full text-black transition-all duration-300 cursor-pointer"
            title="أضف إلى السلة"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>

      {/* Product Content info */}
      <div className="p-4 flex flex-col flex-1 space-y-2 text-right">
        <span className="text-[10px] font-sans font-bold text-[#D4AF37]">
          {product.category}
        </span>
        <Link href={`/product/${product.id}`} className="block flex-1">
          <h3 className="text-xs sm:text-sm font-sans font-bold text-white group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2 leading-relaxed">
            {product.name}
          </h3>
        </Link>

        {/* Rating and count */}
        <div className="flex items-center gap-2 justify-start flex-row-reverse">
          <ReviewStars rating={product.rating} size={11} />
          <span className="text-[10px] text-neutral-500 font-bold font-sans">({product.reviewsCount} تقييم)</span>
        </div>

        {/* Prices & Action Button */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-900/60 mt-auto flex-row-reverse">
          <div className="flex items-baseline gap-1.5 flex-row-reverse">
            <span className="text-sm font-sans font-black text-white">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-500 line-through font-medium">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2 rounded bg-neutral-900 border border-neutral-805 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black transition-all duration-300 flex items-center justify-center cursor-pointer"
            aria-label="أضف إلى السلة"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

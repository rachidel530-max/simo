"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Trophy } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { dbGetProducts, Product } from "@/utils/supabase";

export default function BestSellersPage() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBestSellers = async () => {
      try {
        const prods = await dbGetProducts();
        // filter best sellers
        const best = prods.filter(p => p.isBestSeller);
        setProductsList(best);
      } catch (e) {
        console.error("Failed to load best sellers:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadBestSellers();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={36} className="text-[#D4AF37] animate-spin" />
        <p className="text-neutral-400 font-sans text-xs">جاري تحميل المنتجات الأكثر مبيعاً...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold font-sans">
          <Trophy size={12} />
          خيارات الرياضيين والأبطال الأولى بالمغرب
        </div>
        <h1 className="font-sans font-black text-3xl sm:text-5xl text-white">
          المنتجات <span className="gold-gradient-text">الأكثر مبيعاً وشهرة</span>
        </h1>
        <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto" />
        <p className="text-neutral-500 text-xs font-sans max-w-lg mx-auto leading-relaxed">
          المنتجات والمعدات الرياضية التي يثق بها عملاؤنا بشدة ويكررون طلبها باستمرار لتحقيق نتائجهم التدريبية الكبرى.
        </p>
      </div>

      {/* Best Sellers Grid */}
      {productsList.length === 0 ? (
        <div className="bg-[#121212] border border-neutral-900 rounded-lg p-16 text-center space-y-4 max-w-2xl mx-auto">
          <Trophy size={40} className="text-neutral-700 mx-auto animate-pulse" />
          <h3 className="font-sans font-bold text-neutral-400 text-sm">لا تتوفر أي منتجات مصنفة كأكثر مبيعاً</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            يتم احتساب تصنيفات الأكثر مبيعاً بناءً على إحصائيات المبيعات الفعلية بالمتجر. تصفح كتالوج المتجر الرئيسي للشراء.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productsList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}

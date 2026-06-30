"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, X, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { GoldButton } from "@/components/shared/gold-button";
import { dbGetProducts, dbGetCategories, Product } from "@/utils/supabase";

function ShopCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Load URL search parameters
  const initialCategory = searchParams.get("category") || "الكل";
  const initialSearch = searchParams.get("search") || "";

  // State
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState<"all" | "under-40" | "40-80" | "over-80">("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["الكل"]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Synchronize with query parameters if they change
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "الكل");
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  // Load products and categories from unified DB API
  useEffect(() => {
    const loadShopData = async () => {
      try {
        setIsLoading(true);
        const prods = await dbGetProducts();
        setAllProducts(prods);
        
        const cats = await dbGetCategories();
        const catNames = ["الكل", ...cats.map(c => c.name)];
        setCategories(catNames);
        
        // Initial setup for filtered
        setFilteredProducts(prods);
      } catch (e) {
        console.error("Failed to load shop products:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadShopData();
  }, []);

  // Handle filtering
  useEffect(() => {
    setIsSearching(true);
    const delay = setTimeout(() => {
      let results = [...allProducts];

      // 1. Search text filter
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
      }

      // 2. Category filter
      if (selectedCategory && selectedCategory !== "الكل") {
        results = results.filter((p) => p.category === selectedCategory);
      }

      // 3. Price range filter
      if (priceRange === "under-40") {
        results = results.filter((p) => p.price < 40);
      } else if (priceRange === "40-80") {
        results = results.filter((p) => p.price >= 40 && p.price <= 80);
      } else if (priceRange === "over-80") {
        results = results.filter((p) => p.price > 80);
      }

      // 4. Sort results
      if (sortBy === "price-low") {
        results.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
        results.sort((a, b) => b.price - a.price);
      } else if (sortBy === "rating") {
        results.sort((a, b) => b.rating - a.rating);
      }

      setFilteredProducts(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm, selectedCategory, priceRange, sortBy, allProducts]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("الكل");
    setPriceRange("all");
    setSortBy("featured");
    router.push("/shop");
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={36} className="text-[#D4AF37] animate-spin" />
        <p className="text-neutral-400 font-sans text-xs">جاري تحميل كتالوج المنتجات الفاخرة...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title Header */}
      <div className="border-b border-neutral-900 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-right md:text-right">
        <div className="w-full order-1 md:order-2">
          <span className="text-[10px] font-sans font-bold tracking-widest text-[#D4AF37] uppercase">مكملات رياضية فاخرة</span>
          <h1 className="font-sans font-black text-3xl sm:text-5xl text-white mt-1">
            متجر <span className="gold-gradient-text">الأداء العالي</span>
          </h1>
        </div>
      </div>

      {/* Control Tools Panel */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* DESKTOP SIDEBAR FILTERS (Visible on lg) */}
        <aside className="hidden lg:block w-64 bg-[#121212] border border-neutral-900 rounded-lg p-6 space-y-8 text-right">
          
          {/* Categories Filter */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-xs text-[#D4AF37] uppercase">الفئات</h4>
            <div className="flex flex-col gap-2 font-sans text-xs font-semibold">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    router.push(`/shop?category=${encodeURIComponent(cat)}`);
                  }}
                  className={`text-right py-1.5 px-3 rounded hover:bg-neutral-900 transition-colors w-full ${
                    selectedCategory === cat 
                      ? "text-[#D4AF37] bg-[#D4AF37]/10 font-bold" 
                      : "text-neutral-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-xs text-[#D4AF37] uppercase">نطاق السعر</h4>
            <div className="flex flex-col gap-2 font-sans text-xs">
              <label className="flex items-center gap-2 justify-end text-neutral-400 cursor-pointer">
                <span>الكل</span>
                <input
                  type="radio"
                  name="priceRange"
                  checked={priceRange === "all"}
                  onChange={() => setPriceRange("all")}
                  className="accent-[#D4AF37]"
                />
              </label>
              <label className="flex items-center gap-2 justify-end text-neutral-400 cursor-pointer">
                <span>أقل من $40</span>
                <input
                  type="radio"
                  name="priceRange"
                  checked={priceRange === "under-40"}
                  onChange={() => setPriceRange("under-40")}
                  className="accent-[#D4AF37]"
                />
              </label>
              <label className="flex items-center gap-2 justify-end text-neutral-400 cursor-pointer">
                <span>$40 - $80</span>
                <input
                  type="radio"
                  name="priceRange"
                  checked={priceRange === "40-80"}
                  onChange={() => setPriceRange("40-80")}
                  className="accent-[#D4AF37]"
                />
              </label>
              <label className="flex items-center gap-2 justify-end text-neutral-400 cursor-pointer">
                <span>أكثر من $80</span>
                <input
                  type="radio"
                  name="priceRange"
                  checked={priceRange === "over-80"}
                  onChange={() => setPriceRange("over-80")}
                  className="accent-[#D4AF37]"
                />
              </label>
            </div>
          </div>

          {/* Clear Button */}
          <button
            onClick={handleClearFilters}
            className="w-full text-center py-2 text-xs font-bold text-neutral-500 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded transition-all cursor-pointer font-sans"
          >
            إعادة تعيين الفلاتر
          </button>
        </aside>

        {/* PRODUCTS LIST & SEARCH BAR AREA */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Search bar & Mobile Filter Triggers */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-3 text-neutral-500" size={18} />
              <input
                type="text"
                placeholder="ابحث عن مكملك المفضل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#121212] border border-neutral-900 rounded py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-600 focus:border-[#D4AF37] font-sans text-right"
              />
            </div>

            {/* Mobile Filter Button and Sorting Options */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
              {/* Sort By Select */}
              <div className="flex items-center gap-2 bg-[#121212] border border-neutral-900 rounded px-3 py-2">
                <ArrowUpDown size={14} className="text-[#D4AF37]" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs text-neutral-400 font-sans font-bold border-none outline-none cursor-pointer pr-1 text-right"
                >
                  <option value="featured" className="bg-[#121212]">المميزة</option>
                  <option value="price-low" className="bg-[#121212]">السعر: من الأقل للأعلى</option>
                  <option value="price-high" className="bg-[#121212]">السعر: من الأعلى للأقل</option>
                  <option value="rating" className="bg-[#121212]">التقييم الأعلى</option>
                </select>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-[#121212] border border-neutral-900 rounded px-3 py-2 text-xs font-bold text-neutral-400 hover:text-white"
              >
                <SlidersHorizontal size={14} className="text-[#D4AF37]" />
                <span>تصفية</span>
              </button>
            </div>
          </div>

          {/* Search status indicators */}
          {isSearching && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-sans justify-end">
              <span>جاري فرز المنتجات...</span>
              <Loader2 size={12} className="animate-spin text-[#D4AF37]" />
            </div>
          )}

          {/* Product grid container */}
          {filteredProducts.length === 0 ? (
            <div className="bg-[#121212] border border-neutral-900 rounded-lg p-16 text-center space-y-4">
              <SlidersHorizontal size={40} className="text-neutral-700 mx-auto" />
              <h3 className="font-sans font-bold text-neutral-400 text-sm">لم نجد أي مكملات مطابقة للفلاتر</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                جرب تغيير خيارات البحث أو نطاق الأسعار، أو اضغط أدناه لعرض التشكيلة كاملة من سيمو بروتين.
              </p>
              <GoldButton variant="outline" size="sm" onClick={handleClearFilters} className="mx-auto">
                عرض كافة المنتجات
              </GoldButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER FILTERS */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          {/* Drawer Panel */}
          <div className="fixed top-0 right-0 w-3/4 max-w-xs h-full bg-[#121212] border-l border-[#D4AF37]/20 p-6 flex flex-col justify-between shadow-2xl text-right">
            
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
                <button onClick={() => setIsMobileFilterOpen(false)} className="text-neutral-500 hover:text-white">
                  <X size={20} />
                </button>
                <h3 className="font-sans font-bold text-sm text-white">تصفية المنتجات</h3>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-xs text-[#D4AF37] uppercase">الفئات</h4>
                <div className="flex flex-col gap-2 font-sans text-xs">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsMobileFilterOpen(false);
                        router.push(`/shop?category=${encodeURIComponent(cat)}`);
                      }}
                      className={`text-right py-1.5 px-3 rounded ${
                        selectedCategory === cat 
                          ? "text-[#D4AF37] bg-[#D4AF37]/10 font-bold" 
                          : "text-neutral-400 hover:bg-neutral-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-xs text-[#D4AF37] uppercase">السعر</h4>
                <div className="flex flex-col gap-2 font-sans text-xs">
                  <label className="flex items-center gap-2 justify-end text-neutral-400">
                    <span>الكل</span>
                    <input
                      type="radio"
                      name="priceRangeMobile"
                      checked={priceRange === "all"}
                      onChange={() => { setPriceRange("all"); setIsMobileFilterOpen(false); }}
                      className="accent-[#D4AF37]"
                    />
                  </label>
                  <label className="flex items-center gap-2 justify-end text-neutral-400">
                    <span>أقل من $40</span>
                    <input
                      type="radio"
                      name="priceRangeMobile"
                      checked={priceRange === "under-40"}
                      onChange={() => { setPriceRange("under-40"); setIsMobileFilterOpen(false); }}
                      className="accent-[#D4AF37]"
                    />
                  </label>
                  <label className="flex items-center gap-2 justify-end text-neutral-400">
                    <span>$40 - $80</span>
                    <input
                      type="radio"
                      name="priceRangeMobile"
                      checked={priceRange === "40-80"}
                      onChange={() => { setPriceRange("40-80"); setIsMobileFilterOpen(false); }}
                      className="accent-[#D4AF37]"
                    />
                  </label>
                  <label className="flex items-center gap-2 justify-end text-neutral-400">
                    <span>أكثر من $80</span>
                    <input
                      type="radio"
                      name="priceRangeMobile"
                      checked={priceRange === "over-80"}
                      onChange={() => { setPriceRange("over-80"); setIsMobileFilterOpen(false); }}
                      className="accent-[#D4AF37]"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Clear Button */}
            <button
              onClick={() => { handleClearFilters(); setIsMobileFilterOpen(false); }}
              className="w-full text-center py-3 text-xs font-bold text-neutral-500 hover:text-white border border-neutral-800 rounded transition-all cursor-pointer font-sans mt-auto"
            >
              إعادة تعيين الكل
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={36} className="text-[#D4AF37] animate-spin" />
        <p className="text-neutral-400 font-sans text-xs">جاري تحميل المتجر...</p>
      </div>
    }>
      <ShopCatalog />
    </Suspense>
  );
}

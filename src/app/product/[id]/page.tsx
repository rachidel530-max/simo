"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ShoppingBag, Phone, ShieldCheck, Check, Sparkles, Star, ArrowLeft, Loader2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { ReviewStars } from "@/components/shared/review-stars";
import { GoldButton } from "@/components/shared/gold-button";
import { ProductCard } from "@/components/products/product-card";
import { dbGetProducts, Product } from "@/utils/supabase";

export default function ProductDetailPage() {
  const router = useRouter();
  const routeParams = useParams();
  const productId = routeParams.id as string;

  const { addToCart } = useCart();

  // Database states
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Selector states
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"benefits" | "ingredients">("benefits");
  const [isAddedToast, setIsAddedToast] = useState(false);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setIsLoading(true);
        const prods = await dbGetProducts();
        setAllProducts(prods);
        const found = prods.find((p) => p.id === productId);
        if (found) {
          setProduct(found);
          setSelectedSize(found.sizes[0] || "Standard");
          setSelectedFlavor(found.flavors ? found.flavors[0] : "Standard");
        }
      } catch (e) {
        console.error("Failed to load product details:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadProductData();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={36} className="text-[#D4AF37] animate-spin" />
        <p className="text-neutral-400 font-sans text-xs">جاري تحميل تفاصيل المنتج الفاخر...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-28 text-center space-y-6">
        <h2 className="font-sans font-black text-2xl text-[#ea3838]">
          المنتج غير موجود
        </h2>
        <p className="text-neutral-500 text-xs font-sans">
          عذراً، المنتج الذي تبحث عنه غير موجود أو تم حذفه من كتالوج سيمو بروتين.
        </p>
        <Link href="/shop" className="inline-block">
          <GoldButton size="sm" className="flex-row-reverse">
            العودة إلى المتجر <ArrowRight size={14} />
          </GoldButton>
        </Link>
      </div>
    );
  }

  // Filter related products
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedFlavor, quantity);
    setIsAddedToast(true);
    setTimeout(() => {
      setIsAddedToast(false);
    }, 3000);
  };

  const handleWhatsAppOrder = () => {
    const orderText = `💪 طلب مباشر من SIMO PROTEIN 💪
    
المنتج: ${product.name}
الحجم: ${selectedSize}
النكهة: ${selectedFlavor !== "Standard" ? selectedFlavor : "افتراضية"}
الكمية: ${quantity}
السعر الإجمالي: $${(product.price * quantity).toFixed(2)}

أود تأكيد طلبي وشحنه في أقرب وقت ممكن. شكراً لكم!`;

    const encoded = encodeURIComponent(orderText);
    const whatsappUrl = `https://wa.me/212612345678?text=${encoded}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {isAddedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-5 left-5 z-50 bg-[#121212] border-2 border-[#D4AF37] p-4 rounded shadow-2xl flex items-center gap-3 text-right"
          >
            <div className="h-8 w-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-black">
              <Check size={18} />
            </div>
            <div>
              <h4 className="font-sans font-bold text-xs text-[#D4AF37]">تمت الإضافة للسلة</h4>
              <p className="text-[10px] text-white font-sans max-w-[200px] truncate mt-0.5">{product.name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main product presentation block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* RIGHT COLUMN: Product Image Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square w-full rounded-lg bg-neutral-950 overflow-hidden border border-neutral-900 shadow-xl group relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <span className="text-[#ea3838] border-2 border-[#ea3838] font-sans font-bold text-sm px-4 py-2 rounded">
                  نفذت الكمية
                </span>
              </div>
            )}
          </div>
        </div>

        {/* LEFT COLUMN: Purchase Options / Details */}
        <div className="lg:col-span-7 space-y-8 text-right">
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 justify-end">
              <span className="px-2.5 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold font-sans">
                {product.category}
              </span>
              {product.isBestSeller && (
                <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold font-sans">
                  الأكثر مبيعاً
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-sans font-black text-white leading-relaxed">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 justify-end flex-row-reverse">
              <ReviewStars rating={product.rating} size={15} />
              <span className="text-xs text-neutral-500 font-sans">({product.reviewsCount} تقييم حقيقي من الرياضيين)</span>
            </div>
          </div>

          {/* Price Block */}
          <div className="p-5 bg-neutral-950/40 border border-neutral-900 rounded-lg flex items-center justify-between flex-row-reverse">
            <div>
              <span className="text-[10px] text-neutral-500 font-sans block mb-1">السعر الحصري</span>
              <div className="flex items-baseline gap-2 flex-row-reverse">
                <span className="text-3xl font-sans font-black text-[#D4AF37]">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-base text-neutral-500 line-through font-sans">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            {product.originalPrice && (
              <span className="px-3 py-1 bg-[#ea3838]/10 border border-[#ea3838]/20 text-[#ea3838] text-xs font-bold font-sans rounded">
                وفرت {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          <p className="text-sm text-neutral-400 font-sans leading-relaxed">
            {product.description}
          </p>

          {/* Selectors Options */}
          <div className="space-y-6 border-t border-neutral-900 pt-6">
            
            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-400 font-sans">اختر الحجم:</span>
                <div className="flex flex-wrap gap-3 justify-end">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded text-xs font-sans font-bold border transition-all ${
                        selectedSize === size
                          ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                          : "bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Flavors */}
            {product.flavors && product.flavors.length > 0 && product.flavors[0] !== "Standard" && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-400 font-sans">اختر النكهة:</span>
                <div className="flex flex-wrap gap-3 justify-end">
                  {product.flavors.map((flavor) => (
                    <button
                      key={flavor}
                      onClick={() => setSelectedFlavor(flavor)}
                      className={`px-4 py-2 rounded text-xs font-sans font-bold border transition-all ${
                        selectedFlavor === flavor
                          ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                          : "bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white"
                      }`}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 justify-end">
              <div className="flex items-center border border-neutral-800 rounded bg-black">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-neutral-400 hover:text-white"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold font-sans text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-neutral-400 hover:text-white"
                >
                  +
                </button>
              </div>
              <span className="text-xs font-bold text-neutral-400 font-sans">الكمية:</span>
            </div>

            {/* Action buttons (Add to cart & direct whatsapp order) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              
              {/* WhatsApp direct order */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-4 rounded bg-[#25D366] text-black hover:bg-[#20ba5a] text-sm font-sans font-black flex items-center justify-center gap-2 border border-transparent shadow-[0_0_15px_rgba(37,211,102,0.2)] hover:shadow-[0_0_25px_rgba(37,211,102,0.35)] transition-all cursor-pointer"
              >
                <Phone size={16} />
                <span>طلب سريع عبر WhatsApp</span>
              </button>

              {/* Add to cart */}
              <GoldButton
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-4 text-sm font-sans font-black flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>{product.stock === 0 ? "نفذت الكمية" : "إضافة إلى السلة"}</span>
              </GoldButton>

            </div>

            {/* Brand Guarantees */}
            <div className="grid grid-cols-3 gap-4 border-t border-neutral-900 pt-6 text-center text-[10px] text-neutral-500 font-sans">
              <div className="p-3 bg-neutral-950/20 border border-neutral-900/60 rounded">
                <span className="text-lg block mb-1">📦</span>
                <span>توصيل سريع لباب المنزل</span>
              </div>
              <div className="p-3 bg-neutral-950/20 border border-neutral-900/60 rounded">
                <span className="text-lg block mb-1">🛡️</span>
                <span>فحص معملي HPLC</span>
              </div>
              <div className="p-3 bg-neutral-950/20 border border-neutral-900/60 rounded">
                <span className="text-lg block mb-1">💎</span>
                <span>أصلي ومضمون 100%</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Tabs description block (Benefits / Ingredients) */}
      <div className="border-t border-neutral-900 pt-12 space-y-6 text-right">
        <div className="flex border-b border-neutral-900 gap-6 justify-end font-sans font-bold text-sm">
          <button
            onClick={() => setActiveTab("ingredients")}
            className={`pb-3 relative transition-all ${
              activeTab === "ingredients" ? "text-[#D4AF37]" : "text-neutral-500 hover:text-white"
            }`}
          >
            المكونات الدقيقة
            {activeTab === "ingredients" && (
              <motion.span layoutId="tabLine" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("benefits")}
            className={`pb-3 relative transition-all ${
              activeTab === "benefits" ? "text-[#D4AF37]" : "text-neutral-500 hover:text-white"
            }`}
          >
            الفوائد والاستخدام
            {activeTab === "benefits" && (
              <motion.span layoutId="tabLine" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37]" />
            )}
          </button>
        </div>

        <div className="max-w-4xl ml-auto leading-relaxed text-sm font-sans text-neutral-400">
          {activeTab === "benefits" ? (
            <ul className="list-disc list-inside space-y-2">
              {product.benefits && product.benefits.map((b, idx) => (
                <li key={idx} className="pr-2">{b}</li>
              ))}
            </ul>
          ) : (
            <ul className="list-disc list-inside space-y-2">
              {product.ingredients && product.ingredients.map((i, idx) => (
                <li key={idx} className="pr-2">{i}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Related products grid list */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-10 border-t border-neutral-900">
          <div className="text-right">
            <span className="text-[10px] font-sans font-bold text-[#D4AF37] block">قد يعجبك أيضاً</span>
            <h2 className="text-xl sm:text-2xl font-sans font-black text-white mt-1">منتجات ذات صلة بالقسم</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

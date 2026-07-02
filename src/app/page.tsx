"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ShieldCheck, Flame, Trophy, Award, 
  ChevronDown, MessageSquare, Sparkles, Star, Loader2, ArrowRight
} from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { GoldButton } from "@/components/shared/gold-button";
import { ReviewStars } from "@/components/shared/review-stars";
import { dbGetProducts, dbGetCategories, dbGetBanners, Product } from "@/utils/supabase";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const prods = await dbGetProducts();
        const cats = await dbGetCategories();
        const bans = await dbGetBanners();
        setProductsList(prods);
        setCategories(cats);
        setBanners(bans);
      } catch (e) {
        console.error("Failed to load homepage data:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadHomeData();
  }, []);

  // Filter products for sections
  const featuredProducts = productsList.filter(p => p.isFeatured).slice(0, 3);
  const bestSellers = productsList.filter(p => p.isBestSeller).slice(0, 4);
  const discountedProducts = productsList.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 4);

  // Testimonials (Arabic)
  const testimonials = [
    {
      name: "طارق بن سليمان",
      role: "لاعب كمال أجسام محترف IFBB",
      rating: 5,
      comment: "واي بروتين أيزوليت من سيمو بروتين هو الأفضل بدون منازع. نقاوة عالية، سرعة ذوبان رهيبة، نكهة الشوكولاتة لذيذة للغاية والاستشفاء العضلي تطور عندي بشكل ملحوظ.",
      img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=120"
    },
    {
      name: "سلمى العلمي",
      role: "مدربة كروس فت",
      rating: 5,
      comment: "حزام الرفع بسمك 10 ملم ذو القفل الذهبي غيّر من أدائي في تمرين السكوات بالكامل. ثبات رهيب لأسفل الظهر وجودة الجلد ممتازة ومقاومة للاهتراء.",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120"
    },
    {
      name: "رشيد الجراني",
      role: "بطل رفع أثقال",
      rating: 5,
      comment: "كرياتين سيمو مونوهيدرات نقي جداً وحل مشاكل ثبات القوة والوزن عندي. أخلطه مع مشروب قبل التمرين والضخ العضلي يكون لا يصدق في النادي.",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120"
    }
  ];

  // Instagram simulated gallery links
  const instagramGallery = [
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300",
    "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=300",
    "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=300",
    "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=300",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=300",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300"
  ];

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={40} className="text-[#D4AF37] animate-spin" />
        <p className="text-neutral-400 font-sans text-xs">جاري تحميل تشكيلة سيمو بروتين الفاخرة...</p>
      </div>
    );
  }

 const primaryBanner = {
  image: "/images/hero.jpeg",
  title: "",
  subtitle: "مكملات غذائية ومعدات رياضية فاخرة مصممة للأبطال لتحقيق الأرقام القياسية"
};

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
     <section className="relative min-h-[90vh] flex items-start justify-center overflow-hidden bg-black pt-16 text-center">
        {/* Dark overlay graphic */}
        <div className="absolute inset-0 bg-radial-gradient(circle at center, rgba(212,175,55,0.08) 0%, rgba(0,0,0,1) 100%) z-10" />
        
        {/* Background Image Banner */}
        <div 
          className="absolute inset-0 bg-contain md:bg-cover bg-center bg-no-repeat opacity-30 select-none pointer-events-none"
          style={{
  backgroundImage: `url(${
    typeof window !== "undefined" && window.innerWidth < 768
      ? "/images/Fitness_supplement_store_banner_2K_202607020036.jpeg"
      : primaryBanner.image
  })`,
}}
        />
       {/* Floating gold glowing rings */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#996515]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider font-sans mx-auto"
          >
            <Sparkles size={12} />
            مكملات غذائية ومعدات صالة رياضية النخبة
          </motion.div>

          <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.5 }}
  className="mt-[500px]"
>

            <Link href="/shop" className="w-full sm:w-auto">
              <GoldButton size="lg" className="w-full sm:w-auto flex-row-reverse">
                     تجربة <ArrowLeft size={16} />
              </GoldButton>
            </Link>  
          </motion.div>
        </div>
      </section>

      {/* 2. CATEGORIES OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-sans font-black text-2xl sm:text-4xl text-white">
            تسوق حسب <span className="text-[#D4AF37]">الأقسام</span>
          </h2>
          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              key={cat.name}
              className="group relative h-48 rounded-lg overflow-hidden border border-neutral-900 hover:border-[#D4AF37]/50 shadow-lg cursor-pointer"
            >
              {/* Bg Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700 pointer-events-none"
                style={{ backgroundImage: `url(${cat.bg || cat.bg_image})` }}
              />
              {/* Radial Fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

              <Link href={`/shop?category=${encodeURIComponent(cat.name)}`} className="absolute inset-0 z-20 flex flex-col justify-end p-4 text-right">
                <span className="text-2xl mb-1">{cat.icon || "⚡"}</span>
                <h4 className="font-sans font-bold text-sm text-white group-hover:text-[#D4AF37] transition-colors">
                  {cat.name}
                </h4>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (Banner cards layout) */}
      {featuredProducts.length > 0 && (
        <section className="bg-neutral-950/40 border-y border-neutral-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 text-right md:text-right">
              <Link href="/shop" className="self-center md:self-auto order-2 md:order-1">
                <GoldButton variant="outline" size="sm" className="flex-row-reverse">
                  عرض جميع المنتجات <ArrowLeft size={14} />
                </GoldButton>
              </Link>
              <div className="space-y-2 order-1 md:order-2">
                <span className="text-[10px] font-sans font-bold tracking-widest text-[#D4AF37] uppercase">مختارات الخبراء والرياضيين</span>
                <h2 className="font-sans font-black text-2xl sm:text-4xl text-white">
                  المنتجات <span className="gold-gradient-text">المميزة</span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. BEST SELLERS */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-sans font-black text-2xl sm:text-4xl text-white">
              الأكثر <span className="text-[#D4AF37]">مبيعاً</span>
            </h2>
            <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto" />
            <p className="text-neutral-500 text-xs font-sans">خيارات أبطالنا الأكثر طلباً وشهرة في المتجر</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 5. EXCLUSIVE OFFERS */}
      {discountedProducts.length > 0 && (
        <section className="bg-neutral-950/40 border-y border-neutral-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="font-sans font-black text-2xl sm:text-4xl text-white">
                عروض <span className="text-[#D4AF37]">حصرية وخاصة</span>
              </h2>
              <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto" />
              <p className="text-neutral-500 text-xs font-sans">أسعار لا تفوت لفترة محدودة على أرقى المكملات</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {discountedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. REVIEWS & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-sans font-black text-2xl sm:text-4xl text-white">
            ماذا يقول <span className="text-[#D4AF37]">عملاؤنا</span>
          </h2>
          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto" />
          <p className="text-neutral-500 text-xs font-sans">آراء وتقييمات حقيقية من محترفي ومحبي الرياضة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={t.name}
              className="bg-[#121212] border border-neutral-900 p-8 rounded-lg flex flex-col space-y-6 relative hover:border-[#D4AF37]/30 transition-all text-right"
            >
              {/* Quote icon glow decoration */}
              <span className="absolute top-6 left-6 text-5xl text-neutral-800 font-serif select-none pointer-events-none">”</span>
              
              <div className="flex items-center gap-4 justify-start flex-row-reverse">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/20"
                />
                <div>
                  <h4 className="font-sans font-bold text-xs text-white">{t.name}</h4>
                  <p className="text-[10px] text-neutral-500 font-sans mt-0.5">{t.role}</p>
                </div>
              </div>

              <div className="flex justify-start flex-row-reverse">
                <ReviewStars rating={t.rating} size={13} />
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed font-sans flex-grow">
                {t.comment}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. INSTAGRAM GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-sans font-black text-2xl sm:text-4xl text-white">
            معرض <span className="text-[#D4AF37]">الإنستغرام</span>
          </h2>
          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto" />
          <p className="text-neutral-500 text-xs font-sans">تابعنا على @simoprotein وشاركنا رحلتك وتطورك</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramGallery.map((img, idx) => (
            <motion.div
              whileHover={{ scale: 1.03 }}
              key={idx}
              className="aspect-square bg-neutral-900 rounded overflow-hidden relative group border border-neutral-950 hover:border-[#D4AF37]/20 shadow-md transition-all duration-300"
            >
              <img
                src={img}
                alt="Instagram feed"
                className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-sans font-bold">@simoprotein</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. CTA CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-[#996515]/10 rounded-2xl blur-xl" />
        <div className="bg-[#121212] border border-[#D4AF37]/20 rounded-2xl p-10 sm:p-16 relative z-10 text-center space-y-8 max-w-4xl mx-auto">
          <Trophy className="text-[#D4AF37] mx-auto" size={48} />
          <h2 className="text-2xl sm:text-4xl font-sans font-black text-white leading-tight">
            هل أنت مستعد لتجاوز <span className="gold-gradient-text">حدود طاقتك؟</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed font-sans">
            انضم إلى المئات من الرياضيين المحترفين الذين يثقون في سيمو بروتين كوقود يومي لبناء أجسامهم والتفوق في الصالة الرياضية.
          </p>
          <div className="pt-4">
            <Link href="/shop">
              <GoldButton size="lg" className="mx-auto flex-row-reverse">
                اطلب الآن واستلم عند باب منزلك <ArrowLeft size={16} />
              </GoldButton>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

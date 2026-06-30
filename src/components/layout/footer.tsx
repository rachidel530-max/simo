"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Phone, Send, CheckCircle2, ShieldCheck, Truck, RefreshCw, Mail, MapPin
} from "lucide-react";
import { motion } from "framer-motion";
import { dbGetStoreInfo, dbGetSocialLinks, StoreInfo, SocialLinks } from "@/utils/supabase";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const info = await dbGetStoreInfo();
        const links = await dbGetSocialLinks();
        setStoreInfo(info);
        setSocialLinks(links);
      } catch (e) {
        console.error("Failed to load footer settings:", e);
      }
    };
    loadSettings();
    // Set listener for settings update events (custom event or just reload occasionally)
    const handleSettingsUpdate = () => {
      loadSettings();
    };
    window.addEventListener("settings-updated", handleSettingsUpdate);
    return () => window.removeEventListener("settings-updated", handleSettingsUpdate);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
  };

  const currentInfo = storeInfo || {
    name: "SIMO PROTEIN",
    phone: "+212612345678",
    email: "info@simoprotein.com",
    address: "شارع الجيش الملكي، الدار البيضاء، المغرب"
  };

  const currentLinks = socialLinks || {
    whatsapp: "https://wa.me/212612345678",
    instagram: "https://instagram.com/simoprotein",
    facebook: "https://facebook.com/simoprotein",
    tiktok: "https://tiktok.com/@simoprotein"
  };

  return (
    <footer className="bg-[#050505] border-t border-[#D4AF37]/15 mt-auto relative overflow-hidden">
      {/* Brand value features banner */}
      <div className="border-b border-neutral-900 bg-[#080808] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
          <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded border border-neutral-900/60 bg-neutral-950/20 w-full justify-between">
            <div className="text-right md:order-1">
              <h4 className="font-sans font-bold text-xs uppercase text-white">توصيل سريع لكافة المدن</h4>
              <p className="text-[11px] text-neutral-400 mt-1">توصيل منزلي سريع ومضمون خلال 24-48 ساعة لجميع مدن المغرب.</p>
            </div>
            <Truck className="text-[#D4AF37] flex-shrink-0 md:order-2" size={32} />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded border border-neutral-900/60 bg-neutral-950/20 w-full justify-between">
            <div className="text-right md:order-1">
              <h4 className="font-sans font-bold text-xs uppercase text-white">منتجات أصلية 100%</h4>
              <p className="text-[11px] text-neutral-400 mt-1">مستوردة مباشرة من المصنع ومعتمدة بنسبة 100% ومفحوصة مخبرياً.</p>
            </div>
            <ShieldCheck className="text-[#D4AF37] flex-shrink-0 md:order-2" size={32} />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded border border-neutral-900/60 bg-neutral-950/20 w-full justify-between">
            <div className="text-right md:order-1">
              <h4 className="font-sans font-bold text-xs uppercase text-white">الدفع عند الاستلام</h4>
              <p className="text-[11px] text-neutral-400 mt-1">ادفع نقداً بكل أريحية وثقة فقط عندما تستلم طلبيتك وتفحصها.</p>
            </div>
            <RefreshCw className="text-[#D4AF37] flex-shrink-0 md:order-2" size={32} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-right">
        {/* Brand Information */}
        <div className="space-y-6">
          <span className="font-heading font-black text-2xl tracking-tighter uppercase text-white">
            SIMO <span className="gold-gradient-text">PROTEIN</span>
          </span>
          <p className="text-xs leading-relaxed text-neutral-400 font-sans">
            نحن نوفر أفضل المكملات الغذائية الرياضية عالية الجودة والمعتمدة مخبرياً، ومعدات اللياقة البدنية المصممة لمساعدتك على التفوق وتحقيق أهدافك التدريبية بثقة تامة.
          </p>
          <div className="flex items-center gap-3 justify-start">
            <a href={currentLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-neutral-900 border border-neutral-850 hover:border-[#D4AF37] text-neutral-400 hover:text-white transition-colors" title="Instagram">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href={currentLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-neutral-900 border border-neutral-850 hover:border-[#D4AF37] text-neutral-400 hover:text-white transition-colors" title="Facebook">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href={currentLinks.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-neutral-900 border border-neutral-850 hover:border-[#D4AF37] text-neutral-400 hover:text-white transition-colors" title="TikTok">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
              </svg>
            </a>
            <a href={currentLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 hover:border-[#D4AF37] text-[#D4AF37] hover:text-white transition-colors" title="WhatsApp">
              <Phone size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-sans font-bold text-xs uppercase text-[#D4AF37] mb-6">أقسام المتجر</h4>
          <ul className="space-y-3 font-sans text-xs">
            <li>
              <Link href="/shop?category=واي%20بروتين" className="text-neutral-400 hover:text-white transition-colors">واي بروتين</Link>
            </li>
            <li>
              <Link href="/shop?category=بروتين%20معزول%20(Isolate)" className="text-neutral-400 hover:text-white transition-colors">بروتين معزول (Isolate)</Link>
            </li>
            <li>
              <Link href="/shop?category=ماس%20جينر" className="text-neutral-400 hover:text-white transition-colors">ماس جينر</Link>
            </li>
            <li>
              <Link href="/shop?category=كرياتين" className="text-neutral-400 hover:text-white transition-colors">كرياتين مونوهيدرات</Link>
            </li>
            <li>
              <Link href="/shop?category=أحزمة%20رياضية" className="text-neutral-400 hover:text-white transition-colors">أحزمة الرفع الرياضية</Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="font-sans font-bold text-xs uppercase text-[#D4AF37] mb-6">الدعم والخصوصية</h4>
          <ul className="space-y-3 font-sans text-xs">
            <li>
              <Link href="/about" className="text-neutral-400 hover:text-white transition-colors">من نحن</Link>
            </li>
            <li>
              <Link href="/contact" className="text-neutral-400 hover:text-white transition-colors">اتصل بنا</Link>
            </li>
            <li>
              <Link href="/faq" className="text-neutral-400 hover:text-white transition-colors">الأسئلة الشائعة</Link>
            </li>
            <li>
              <Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors">سياسة الخصوصية</Link>
            </li>
            <li>
              <Link href="/admin" className="text-neutral-500 hover:text-[#D4AF37] transition-colors">لوحة المشرف (خاصة)</Link>
            </li>
          </ul>
        </div>

        {/* Store contact info details */}
        <div className="space-y-4">
          <h4 className="font-sans font-bold text-xs uppercase text-[#D4AF37]">معلومات المتجر</h4>
          <ul className="space-y-3 font-sans text-xs text-neutral-400">
            <li className="flex items-center gap-2 justify-end">
              <span>{currentInfo.address}</span>
              <MapPin size={14} className="text-[#D4AF37] flex-shrink-0" />
            </li>
            <li className="flex items-center gap-2 justify-end">
              <a href={`tel:${currentInfo.phone}`} className="hover:text-white transition-colors">{currentInfo.phone}</a>
              <Phone size={14} className="text-[#D4AF37] flex-shrink-0" />
            </li>
            <li className="flex items-center gap-2 justify-end">
              <a href={`mailto:${currentInfo.email}`} className="hover:text-white transition-colors">{currentInfo.email}</a>
              <Mail size={14} className="text-[#D4AF37] flex-shrink-0" />
            </li>
          </ul>
          
          <form onSubmit={handleSubscribe} className="relative pt-2">
            <input
              type="email"
              required
              placeholder="بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0B0B0B] border border-neutral-800 text-xs px-4 py-3 rounded text-white focus:border-[#D4AF37] font-sans placeholder-neutral-600 text-right"
            />
            <button
              type="submit"
              className="absolute left-1 top-[9px] bottom-1 px-4 bg-[#D4AF37] text-black font-sans font-bold text-[10px] rounded hover:bg-[#b38c27] transition-all flex items-center justify-center cursor-pointer"
            >
              <Send size={12} />
            </button>
          </form>

          {isSubscribed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded text-[10px] font-bold justify-end"
            >
              <span>تم الاشتراك بنجاح! شكرًا لك.</span>
              <CheckCircle2 size={14} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer copyright bottom */}
      <div className="border-t border-neutral-900 bg-[#020202] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <p className="text-[10px] text-neutral-500 font-sans tracking-wider font-bold order-2 md:order-1">
            &copy; {new Date().getFullYear()} {currentInfo.name}. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-6 text-[10px] text-neutral-500 font-sans font-bold tracking-wider order-1 md:order-2">
            <Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
            <span className="text-neutral-800">|</span>
            <span className="text-[#D4AF37] flex items-center gap-1">
              جميع الطلبيات تؤكد عبر الواتساب ويتم الشحن الفوري
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

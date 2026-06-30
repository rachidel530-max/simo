"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { GoldButton } from "@/components/shared/gold-button";
import { motion, AnimatePresence } from "framer-motion";
import { dbGetStoreInfo, dbGetSocialLinks, StoreInfo, SocialLinks } from "@/utils/supabase";

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const info = await dbGetStoreInfo();
        const links = await dbGetSocialLinks();
        setStoreInfo(info);
        setSocialLinks(links);
      } catch (e) {
        console.error("Failed to load contact page info:", e);
      }
    };
    loadContactInfo();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.message) {
      setIsSubmitted(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => {
        setIsSubmitted(false);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* 1. Header */}
      <div className="border-b border-neutral-900 pb-6 text-right">
        <span className="text-[10px] font-sans font-bold tracking-widest text-[#D4AF37] uppercase">تواصل مباشر</span>
        <h1 className="font-sans font-black text-3xl sm:text-5xl text-white mt-1">
          اتصل <span className="gold-gradient-text">بنا</span>
        </h1>
      </div>

      {/* 2. Grid Content: Form + Contact Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* RIGHT COLUMN: Contact Form (lg:order-2) */}
        <div className="space-y-6 bg-[#121212] p-6 sm:p-8 rounded-lg border border-neutral-900 text-right order-1 lg:order-2">
          <div className="space-y-2">
            <h3 className="font-sans font-bold text-lg text-white">أرسل لنا رسالة</h3>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              هل لديك استفسارات حول الحجم، المكمل المناسب لك، أو حالة شحن طلبيتك؟ راسلنا وسيجيبك مستشارونا الرياضيون في غضون 2-4 ساعات.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-sans font-bold text-neutral-400 uppercase">بريدك الإلكتروني *</label>
                <input
                  type="email"
                  required
                  placeholder="بريدك الإلكتروني"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full bg-black border border-neutral-800 text-xs px-4 py-3 rounded text-white focus:border-[#D4AF37] font-sans text-right placeholder-neutral-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-sans font-bold text-neutral-400 uppercase">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  placeholder="الاسم"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-black border border-neutral-800 text-xs px-4 py-3 rounded text-white focus:border-[#D4AF37] font-sans text-right placeholder-neutral-700"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-sans font-bold text-neutral-400 uppercase">الموضوع</label>
              <input
                type="text"
                placeholder="عنوان الرسالة (مثل: استفسار عن منتج، خصم كميات)"
                value={formState.subject}
                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                className="w-full bg-black border border-neutral-800 text-xs px-4 py-3 rounded text-white focus:border-[#D4AF37] font-sans text-right placeholder-neutral-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-sans font-bold text-neutral-400 uppercase">تفاصيل الرسالة *</label>
              <textarea
                required
                rows={5}
                placeholder="اكتب رسالتك بالتفصيل هنا..."
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full bg-black border border-neutral-800 text-xs px-4 py-3 rounded text-white focus:border-[#D4AF37] font-sans text-right placeholder-neutral-700 resize-none"
              />
            </div>

            <GoldButton type="submit" className="w-full py-4 text-xs font-bold flex-row-reverse">
              إرسال الرسالة بنجاح <Send size={12} />
            </GoldButton>
          </form>

          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-2 p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded text-xs justify-end"
              >
                <span>شكرًا لك! تم إرسال رسالتك لفريق الدعم بنجاح وسنتواصل معك قريباً.</span>
                <CheckCircle2 size={16} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LEFT COLUMN: Contact details / Map (lg:order-1) */}
        <div className="space-y-8 order-2 lg:order-1 text-right flex flex-col justify-between">
          
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-sans font-bold tracking-widest text-[#D4AF37] uppercase">معلومات الاتصال الرسمي</span>
              <h3 className="font-sans font-black text-2xl text-white">مقر ومخزن سيمو بروتين</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                يسعدنا دائماً تواصلكم معنا. يمكنك الاتصال بخدمة العملاء مباشرة لتعديل طلبيتك أو لتلقي نصائح التغذية واختيار المكمل المناسب لهدفك الرياضي.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Phone */}
              <div className="flex gap-4 p-4 rounded bg-[#121212] border border-neutral-900/60 items-center justify-start flex-row-reverse">
                <div className="p-3 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex-shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs text-white">رقم الهاتف والواتساب الرسمي</h4>
                  <a href={`tel:${currentInfo.phone}`} className="text-xs text-neutral-400 mt-1 block hover:text-white transition-colors">{currentInfo.phone}</a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 p-4 rounded bg-[#121212] border border-neutral-900/60 items-center justify-start flex-row-reverse">
                <div className="p-3 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs text-white">البريد الإلكتروني للعملاء</h4>
                  <a href={`mailto:${currentInfo.email}`} className="text-xs text-neutral-400 mt-1 block hover:text-white transition-colors">{currentInfo.email}</a>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-4 p-4 rounded bg-[#121212] border border-neutral-900/60 items-center justify-start flex-row-reverse">
                <div className="p-3 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs text-white">المستودع الرئيسي</h4>
                  <p className="text-xs text-neutral-400 mt-1 block">{currentInfo.address}</p>
                </div>
              </div>

              {/* Work Hours */}
              <div className="flex gap-4 p-4 rounded bg-[#121212] border border-neutral-900/60 items-center justify-start flex-row-reverse">
                <div className="p-3 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex-shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs text-white">أوقات العمل واستقبال الطلبيات</h4>
                  <p className="text-xs text-neutral-400 mt-1 block">كل يوم: من 9:00 صباحاً حتى 9:00 مساءً</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social connections block */}
          <div className="p-6 bg-neutral-950/40 rounded-lg border border-neutral-900 flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-[10px] font-sans font-bold text-[#D4AF37] uppercase">تفاعل معنا على منصات التواصل</span>
            <div className="flex items-center gap-4">
              <a href={currentLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[#25D366] text-black font-sans font-bold text-xs rounded hover:bg-[#20ba5a] transition-all flex items-center gap-1 cursor-pointer">
                واتساب مباشر
              </a>
              <a href={currentLinks.instagram} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-white font-sans font-bold text-xs rounded hover:border-[#D4AF37] transition-all flex items-center gap-1 cursor-pointer">
                إنستغرام
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

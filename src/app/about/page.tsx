"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Award, Zap, Users } from "lucide-react";
import { GoldButton } from "@/components/shared/gold-button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Header Banner */}
      <section className="relative min-h-[45vh] flex items-center justify-center bg-black py-16 text-center">
        <div className="absolute inset-0 bg-radial-gradient(circle at center, rgba(212,175,55,0.06) 0%, rgba(0,0,0,1) 100%) z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 select-none scale-102 pointer-events-none" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=1200')` }}
        />
        <div className="relative z-20 text-center space-y-4 max-w-3xl mx-auto px-4">
          <span className="text-[10px] font-sans font-bold tracking-widest text-[#D4AF37] uppercase">قصتنا وقيمنا</span>
          <h1 className="font-sans font-black text-3xl sm:text-5xl text-white">
            إرث سيمو <span className="gold-gradient-text">بروتين</span>
          </h1>
          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto" />
          <p className="text-xs text-neutral-400 font-sans max-w-xl mx-auto leading-relaxed mt-2">
            نهدف إلى وضع معايير جديدة تماماً لنقاء المكملات الرياضية وجودتها في المغرب.
          </p>
        </div>
      </section>

      {/* 2. Brand Story Columns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content (Right in RTL, left in layout) */}
          <div className="space-y-6 text-right order-1 lg:order-2">
            <span className="text-[10px] font-sans font-bold tracking-widest text-[#D4AF37] uppercase">أصول تأسيس المتجر</span>
            <h2 className="font-sans font-black text-2xl sm:text-4xl text-white leading-relaxed">
              ولدنا في صالات الجيم. <br />
              وصيغت منتجاتنا في المختبرات.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
              تأسست شركة سيمو بروتين في الدار البيضاء عام 2024 بواسطة نخبة من رياضيي كمال الأجسام وخبراء الكيمياء الغذائية. بنيت فكرة المتجر على حقيقة واحدة بسيطة: الرياضيون يستحقون مكملات أفضل خالية من الغش التجاري والمكونات الهجينة غير المجدية.
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
              مهمتنا هي خلق بيئة تسوق شفافة للمكملات الرياضية. نقوم بتركيب وإنتاج واي بروتين معزول (Isolate)، وماس جينر، وكرياتين نقي 100%، ومعدات رياضية مصممة خصيصاً لمساعدتك على التفوق التدريبي والوصول لأقوى استشفاء عضلي ممكن.
            </p>
            <div className="border-r-2 border-[#D4AF37] pr-4 italic text-neutral-300 text-xs sm:text-sm font-sans">
              "نحن نرفض المساومة على الجودة لأن تدريباتك الشاقة وعرقك يستحقان فقط النتائج الصافية والآمنة."
            </div>
          </div>

          {/* Image (Left in RTL, right in layout) */}
          <div className="relative h-[400px] rounded-lg overflow-hidden border border-[#D4AF37]/20 shadow-2xl order-2 lg:order-1">
            <div className="absolute inset-0 bg-black/35 z-10" />
            <img
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600"
              alt="Simo Protein Training"
              className="w-full h-full object-cover grayscale contrast-125"
            />
          </div>
        </div>
      </section>

      {/* 3. Core Values Feature Blocks */}
      <section className="bg-neutral-950/40 border-y border-neutral-900 py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="text-[10px] font-sans font-bold tracking-widest text-[#D4AF37] uppercase">مبادئنا الأساسية</span>
            <h2 className="font-sans font-black text-2xl sm:text-4xl text-white">
              قيمنا <span className="gold-gradient-text">السامية</span>
            </h2>
            <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#121212] border border-neutral-900 p-6 rounded-lg text-center space-y-4 hover:border-[#D4AF37]/35 transition-all">
              <ShieldCheck className="text-[#D4AF37] mx-auto animate-pulse" size={32} />
              <h4 className="font-sans font-bold text-xs text-white">الشفافية الكاملة</h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed font-sans">نفصح عن كل غرام داخل مكملاتنا بتقرير مخبري HPLC. صفر غش، صفر مواد مالئة رخيصة.</p>
            </div>
            <div className="bg-[#121212] border border-neutral-900 p-6 rounded-lg text-center space-y-4 hover:border-[#D4AF37]/35 transition-all">
              <Award className="text-[#D4AF37] mx-auto" size={32} />
              <h4 className="font-sans font-bold text-xs text-white">جودة معملية فائقة</h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed font-sans">نستورد خامات البروتين والمكونات الدقيقة والنقية من أرقى الموردين المعتمدين عالمياً.</p>
            </div>
            <div className="bg-[#121212] border border-neutral-900 p-6 rounded-lg text-center space-y-4 hover:border-[#D4AF37]/35 transition-all">
              <Zap className="text-[#D4AF37] mx-auto" size={32} />
              <h4 className="font-sans font-bold text-xs text-white">أقصى طاقة للأداء</h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed font-sans">تتم صياغة وخلط جرعات المكونات الفعالة بناءً على أحدث دراسات العلوم والتدريب الرياضي.</p>
            </div>
            <div className="bg-[#121212] border border-neutral-900 p-6 rounded-lg text-center space-y-4 hover:border-[#D4AF37]/35 transition-all">
              <Users className="text-[#D4AF37] mx-auto" size={32} />
              <h4 className="font-sans font-bold text-xs text-white">دعم مجتمع الأبطال</h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed font-sans">نساند الرياضيين، رافعي الأثقال، ومحبي اللياقة البدنية بالمغرب لتحقيق أفضل بناء جسدي وصحي.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. QA Standards Verification */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image */}
          <div className="relative h-[350px] rounded-lg overflow-hidden border border-[#D4AF37]/20 shadow-2xl order-2">
            <div className="absolute inset-0 bg-[#D4AF37]/5 z-10" />
            <img
              src="https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=600"
              alt="Quality Lab Supplement"
              className="w-full h-full object-cover grayscale contrast-125"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-6 text-right order-1">
            <span className="text-[10px] font-sans font-bold tracking-widest text-[#D4AF37] uppercase">معايير التصنيع الفاخرة</span>
            <h2 className="font-sans font-black text-2xl sm:text-4xl text-white leading-relaxed">
              رقابة معملية صارمة <br />
              وضمان HPLC على كل دفعة.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
              كل برطمان واي بروتين، وكل كيس كرياتين يحمل فخراً شهادة الجودة والتحليل الفسيولوجي HPLC لضمان خلوه التام من الشوائب والمعادن الثقيلة أو النيتروجين غير البروتيني المضاف لزيادة النسبة وهمياً.
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
              تخضع أحزمتنا الرياضية المصنوعة من الجلد ومعدات الجيم لاختبارات تحمل شديدة وقاسية في منشآتنا الخاصة للتأكد من قدرتها على مجابهة أكثر التمارين ضخامة ومقاومة التمزق أو الفك المفاجئ للرافعة الفولاذية.
            </p>
            
            <div className="pt-4">
              <Link href="/shop">
                <GoldButton size="md" className="flex-row-reverse">
                  استكشف تشكيلتنا الحائزة على ثقة المحترفين
                </GoldButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageSquare } from "lucide-react";

export default function FAQPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "ما الذي يجعل مكملات سيمو بروتين فاخرة وذات جودة عالية؟",
      a: "مكملاتنا الرياضية يتم إنتاجها في منشآت معتمدة ومطابقة للمواصفات الدولية، ونستخدم فقط خامات بروتين ميكرونية ومصفاة بشكل فائق. بالإضافة إلى ذلك، نقوم بإجراء فحص مخبري HPLC دوري للتأكد بنسبة 100% من تطابق المكونات مع ما هو مكتوب على العبوة وخلوها التام من الشوائب أو المواد الحافظة الضارة."
    },
    {
      q: "كم من الوقت يستغرق توصيل الطلبية داخل المغرب؟",
      a: "يتم تجهيز وشحن الطلبيات خلال 12 إلى 24 ساعة من تأكيد الطلب. يستغرق التوصيل المنزلي من 1 إلى 2 أيام عمل للمدن الكبرى (الدار البيضاء، الرباط، مراكش، طنجة، فاس) ومن 2 إلى 3 أيام عمل للمناطق والأقاليم الأخرى."
    },
    {
      q: "كيف يمكنني إتمام ودفع قيمة الطلبية؟",
      a: "طريقة الدفع الأساسية والمريحة المتاحة لدينا هي 'الدفع عند الاستلام' (Cash on Delivery). هذا يعني أنك تطلب عبر الموقع دون الحاجة لبطاقة بنكية، وتقوم بالدفع نقداً لموزع الشحن فقط عندما تتسلم طلبيتك وتتأكد منها بين يديك."
    },
    {
      q: "لماذا يجب إرسال الطلب عبر WhatsApp بعد الشراء؟",
      a: "تسهيلاً على عملائنا ولضمان أقصى سرعة في التوصيل، بمجرد تقديم طلبك، نوفر لك خيار إعادة إرسال تفاصيل طلبيتك مباشرة إلى خدمة العملاء على الواتساب بضغطة زر واحدة. يساعدنا هذا في تأكيد العنوان وموعد التسليم المناسب لك فورياً ودون أي تأخير."
    },
    {
      q: "هل يمكنني تعديل أو إلغاء طلبي بعد تأكيده؟",
      a: "نعم بالتأكيد. بما أن تأكيد الموعد النهائي يتم عبر محادثة الواتساب، يمكنك إخبار الموظف مباشرة بإضافة أو تعديل أي نكهة أو حجم، أو تغيير عنوان الشحن أو إلغاء الطلبية بالكامل قبل أن تغادر شحنتك مستودعنا الرئيسي."
    },
    {
      q: "هل الملحقات والأحزمة الرياضية مغطاة بضمان؟",
      a: "نعم. أحزمة رفع الأثقال الذهبية الفاخرة ذات قفل الرافعة (Lever Belts) تأتي مع ضمان مدى الحياة على قفل الرافعة الفولاذي ضد الكسر أو التلف المصنعي، وضمان لمدة عام كامل على خياطة وجلد الحزام."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12 text-right">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold font-sans">
          <MessageSquare size={12} />
          إجابات فورية لجميع استفساراتكم
        </div>
        <h1 className="font-sans font-black text-3xl sm:text-5xl text-white">
          الأسئلة <span className="gold-gradient-text">الشائعة</span>
        </h1>
        <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto" />
        <p className="text-neutral-500 text-xs font-sans max-w-lg mx-auto leading-relaxed">
          جمعنا لكم أكثر الأسئلة تكراراً من أبطالنا حول الشحن، جودة المكملات، وطريقة إتمام الطلب والدفع عند الاستلام.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4 pt-4">
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div
              key={idx}
              className="bg-[#121212] border border-neutral-900 rounded-lg overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full p-5 flex items-center justify-between text-right font-sans font-bold text-sm sm:text-base text-white hover:text-[#D4AF37] transition-colors gap-4"
              >
                <ChevronDown 
                  size={18} 
                  className={`text-[#D4AF37] transition-transform duration-350 flex-shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`} 
                />
                <span>{faq.q}</span>
              </button>
              
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-5 pt-0 border-t border-neutral-900/60 text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

    </div>
  );
}

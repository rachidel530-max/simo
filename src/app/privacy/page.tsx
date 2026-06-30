import React from "react";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-right font-sans">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold">
          <ShieldCheck size={12} />
          خصوصية بيانات عملائنا محمية بالكامل
        </div>
        <h1 className="font-sans font-black text-3xl sm:text-5xl text-white">
          سياسة <span className="gold-gradient-text">الخصوصية</span>
        </h1>
        <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto" />
      </div>

      {/* Policy Content */}
      <div className="bg-[#121212] border border-neutral-900 rounded-lg p-6 sm:p-10 space-y-8 text-neutral-400 text-xs sm:text-sm leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white">1. التزامنا تجاه الخصوصية</h2>
          <p>
            في متجر سيمو بروتين (SIMO PROTEIN)، نعتبر سرية وخصوصية بياناتكم الشخصية أمراً فائق الأهمية. توضح هذه الصفحة كيفية جمعنا للبيانات، واستخدامها، وحمايتها عند تصفحكم للموقع وإجراء الطلبيات. نحن لا نطلب من عملائنا إنشاء حسابات عضوية أو حفظ بيانات بطاقات ائتمانية لضمان تجربة تسوق آمنة وسريعة بدون أي مخاطر.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white">2. المعلومات التي نجمعها</h2>
          <p>
            بما أن عملية التصفح والشراء تتم بالكامل بدون الحاجة لإنشاء حساب شخصي، فإننا نجمع فقط البيانات الضرورية لشحن وتوصيل الطلبية إليك عند إتمام الشراء، وهي:
          </p>
          <ul className="list-disc list-inside space-y-1 pr-4 text-neutral-500">
            <li>الاسم الكامل (لتهيئة مستندات الشحنة والموزع).</li>
            <li>رقم الهاتف والواتساب (لتأكيد الطلب وتحديد موعد الشحن).</li>
            <li>عنوان الشحن بالتفصيل والمدينة (لتوجيه موزع الشحن لباب منزلك).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white">3. مشاركة وحماية البيانات</h2>
          <p>
            نحن نتعهد بعدم بيع أو مشاركة أو تأجير بياناتكم الشخصية لأي جهة تجارية أو تسويقية خارجية. يتم مشاركة معلومات العنوان والهاتف فقط مع شركات الشحن والتوصيل المتعاقد معها لتوصيل الطلبية لباب بيتك. يتم تخزين الطلبيات بشكل آمن على خوادمنا المشفرة وسجلاتنا الداخلية لإدارة وتتبع عمليات التسليم.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white">4. طلبات WhatsApp والتأكيد الفوري</h2>
          <p>
            لتوفير أعلى مستويات الأمان والسرعة، نوفر إمكانية نقل تفاصيل الطلبية وتأكيدها عبر تطبيق الواتساب بشكل مباشر. هذا يمنحك اتصالاً مباشراً مع ممثلي خدمة العملاء لمتابعة الشحنة أو الاستفسار عن حالة التوصيل بكل سهولة ويضمن خصوصية التواصل.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white">5. التعديلات على سياسة الخصوصية</h2>
          <p>
            قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر لمواكبة التغييرات التشغيلية أو القانونية. ننصحك بمراجعة هذه الصفحة بشكل دوري للوقوف على أي مستجدات.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-neutral-900 text-center">
          <p className="text-xs text-neutral-500">
            إذا كان لديك أي استفسار حول سياسة الخصوصية الخاصة بنا، يمكنك التواصل معنا مباشرة عبر البريد الإلكتروني: <strong className="text-white">info@simoprotein.com</strong>
          </p>
        </section>

      </div>

    </div>
  );
}

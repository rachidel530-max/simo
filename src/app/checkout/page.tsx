"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, ShoppingBag, ShieldCheck, CheckCircle2, Truck, Loader2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { GoldButton } from "@/components/shared/gold-button";
import { dbGetStoreInfo } from "@/utils/supabase";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { createOrder } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "الدار البيضاء"
  });

  const [storePhone, setStorePhone] = useState("212612345678");
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderDetails, setCreatedOrderDetails] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch store phone on mount
  useEffect(() => {
    const loadPhone = async () => {
      try {
        const info = await dbGetStoreInfo();
        if (info && info.phone) {
          // clean up phone formatting (remove wa.me, +, etc)
          const cleanPhone = info.phone.replace(/[^0-9]/g, "");
          setStorePhone(cleanPhone);
        }
      } catch (e) {
        console.error("Failed to load store phone for checkout:", e);
      }
    };
    loadPhone();
  }, []);

  // Route back if cart is empty and not checked out
  useEffect(() => {
    if (cart.length === 0 && !isSuccess) {
      router.push("/cart");
    }
  }, [cart, isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;
    setIsSubmitting(true);

    try {
      const itemsPayload = cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        size: item.selectedSize,
        flavor: item.selectedFlavor,
        price: item.product.price,
        quantity: item.quantity
      }));

      // Generate random order ID
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

      // Save order in database (Supabase / local fallback)
      const orderRecord = await createOrder({
        id: orderId,
        customer_name: formData.name,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}`,
        city: formData.city,
        items: itemsPayload,
        total: cartTotal
      });

      setCreatedOrderDetails(orderRecord);
      setIsSuccess(true);
      clearCart();

      // Format WhatsApp message
      const orderItemsText = cart.map(
        (item) => `• ${item.product.name}
  الحجم: ${item.selectedSize}
  النكهة: ${item.selectedFlavor !== "Standard" ? item.selectedFlavor : "افتراضية"}
  الكمية: ${item.quantity} x $${item.product.price.toFixed(2)}`
      ).join("\n\n");

      const message = `💪 طلب جديد من متجر SIMO PROTEIN 💪

رقم الطلبية: ${orderRecord.id}
التاريخ: ${new Date(orderRecord.created_at).toLocaleDateString("ar-MA")}

تفاصيل المشتري:
الاسم: ${formData.name}
الهاتف: ${formData.phone}
العنوان: ${formData.address}
المدينة: ${formData.city}

الملخص والمشتريات:
${orderItemsText}

طريقة الدفع: الدفع عند الاستلام (CoD)
قيمة التوصيل: مجاني
المجموع الكلي: $${cartTotal.toFixed(2)}

يرجى تأكيد وتجهيز المكملات للشحن في أقرب وقت. شكراً لكم!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${storePhone}?text=${encodedMessage}`;
      
      // Delay slightly for UX before redirecting
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 1000);

    } catch (e) {
      console.error("Order completion failed:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess && createdOrderDetails) {
    return (
      <div className="max-w-xl mx-auto px-4 py-28 text-center space-y-8">
        <div className="h-16 w-16 bg-[#D4AF37]/15 rounded-full flex items-center justify-center text-[#D4AF37] mx-auto border-2 border-[#D4AF37] animate-pulse">
          <CheckCircle2 size={36} />
        </div>
        <div className="space-y-3">
          <h2 className="font-sans font-black text-2xl text-white">تم تسجيل طلبيتك بنجاح!</h2>
          <p className="text-[#D4AF37] font-sans font-bold text-sm">رقم الطلب: {createdOrderDetails.id}</p>
          <p className="text-xs text-neutral-400 font-sans max-w-sm mx-auto leading-relaxed">
            لقد تم حجز وتجهيز مكملاتك الرياضية بنجاح. سنفتح لك محادثة واتساب الآن لمراسلة مسؤول الشحن لتأكيد الطلب وشحنه فوراً.
          </p>
        </div>

        <div className="bg-[#121212] border border-neutral-900 rounded-lg p-6 text-right space-y-4 font-sans text-xs">
          <h4 className="font-bold text-white border-b border-neutral-900 pb-2">تفاصيل الشحن والتوصيل</h4>
          <p className="text-neutral-400">الاسم الكامل: <span className="text-white font-bold">{formData.name}</span></p>
          <p className="text-neutral-400">رقم الهاتف: <span className="text-white font-bold">{formData.phone}</span></p>
          <p className="text-neutral-400">العنوان: <span className="text-white font-bold">{formData.address}، {formData.city}</span></p>
          <p className="text-neutral-400">طريقة الدفع: <span className="text-[#D4AF37] font-bold">الدفع نقدًا عند الاستلام</span></p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => {
              const message = `أهلاً SIMO PROTEIN، أود متابعة طلبي رقم ${createdOrderDetails.id}.`;
              window.open(`https://wa.me/${storePhone}?text=${encodeURIComponent(message)}`, "_blank");
            }}
            className="w-full py-3.5 bg-[#25D366] text-black rounded font-sans font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition-all cursor-pointer"
          >
            <Phone size={16} /> إعادة فتح محادثة WhatsApp
          </button>
          <Link href="/shop" className="block">
            <GoldButton variant="outline" size="sm" className="w-full py-3.5 text-xs flex-row-reverse">
              مواصلة التسوق بالمتجر <ArrowRight size={14} />
            </GoldButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-neutral-900 pb-6 text-right">
        <span className="text-[10px] font-sans font-bold tracking-widest text-[#D4AF37] uppercase">الدفع والتوصيل</span>
        <h1 className="font-sans font-black text-3xl sm:text-5xl text-white mt-1">
          إتمام <span className="gold-gradient-text">الطلب</span>
        </h1>
      </div>

      {/* Checkout Form & Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* RIGHT COLUMN: Customer Details Form (lg:col-span-7) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6 order-1 lg:order-2 text-right">
          <div className="bg-[#121212] border border-neutral-900 p-6 rounded-lg space-y-6">
            <h3 className="font-sans font-bold text-sm text-white border-b border-neutral-900 pb-3 flex items-center gap-2 justify-end">
              <span>معلومات المستلم ومكان الشحن</span>
              <Truck size={16} className="text-[#D4AF37]" />
            </h3>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 font-sans block">الاسم الكامل للعميل *</label>
                <input
                  type="text"
                  required
                  placeholder="الاسم الأول والأخير"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black border border-neutral-800 text-xs px-4 py-3 rounded text-white focus:border-[#D4AF37] font-sans text-right"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 font-sans block">رقم الهاتف لتأكيد الطلب (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="مثال: 0612345678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-black border border-neutral-800 text-xs px-4 py-3 rounded text-white focus:border-[#D4AF37] font-sans text-right"
                />
              </div>

              {/* Shipping Address */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 font-sans block">عنوان التوصيل بالكامل *</label>
                <input
                  type="text"
                  required
                  placeholder="رقم المنزل، اسم الشارع، الحي"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-black border border-neutral-800 text-xs px-4 py-3 rounded text-white focus:border-[#D4AF37] font-sans text-right"
                />
              </div>

              {/* City Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 font-sans block">المدينة *</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-black border border-neutral-800 text-xs px-4 py-3 rounded text-white focus:border-[#D4AF37] font-sans pr-2 text-right cursor-pointer"
                >
                  <option value="الدار البيضاء">الدار البيضاء (Casablanca)</option>
                  <option value="الرباط">الرباط (Rabat)</option>
                  <option value="مراكش">مراكش (Marrakech)</option>
                  <option value="طنجة">طنجة (Tangier)</option>
                  <option value="فاس">فاس (Fes)</option>
                  <option value="مكناس">مكناس (Meknes)</option>
                  <option value="أكادير">أكادير (Agadir)</option>
                  <option value="القنيطرة">القنيطرة (Kenitra)</option>
                  <option value="وجدة">وجدة (Oujda)</option>
                  <option value="تطوان">تطوان (Tetouan)</option>
                </select>
              </div>

            </div>
          </div>

          {/* Payment Method Option */}
          <div className="bg-[#121212] border border-neutral-900 p-6 rounded-lg space-y-4">
            <h3 className="font-sans font-bold text-sm text-white">طريقة الدفع المتاحة</h3>
            <div className="p-4 bg-neutral-950 border border-[#D4AF37]/30 rounded flex items-center justify-between flex-row-reverse">
              <div className="text-right">
                <span className="text-xs font-bold text-white block">الدفع نقداً عند الاستلام (CoD)</span>
                <span className="text-[10px] text-neutral-500 font-sans block mt-1">توصيل الطلبية لباب منزلك والدفع نقداً للموزع</span>
              </div>
              <span className="h-4 w-4 rounded-full border-4 border-[#D4AF37] bg-transparent flex-shrink-0" />
            </div>
          </div>

          {/* Submit Order via WhatsApp */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4.5 rounded bg-[#25D366] text-black hover:bg-[#20ba5a] text-sm font-sans font-black flex items-center justify-center gap-2 border border-transparent shadow-[0_0_15px_rgba(37,211,102,0.2)] transition-all cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>جاري تسجيل الطلبية...</span>
              </>
            ) : (
              <>
                <Phone size={16} />
                <span>تأكيد الطلب وإرساله عبر WhatsApp</span>
              </>
            )}
          </button>
        </form>

        {/* LEFT COLUMN: Order Items & Subtotal (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6 order-2 lg:order-1 text-right">
          
          <div className="bg-[#121212] border border-neutral-900 p-6 rounded-lg space-y-6">
            <h3 className="font-sans font-bold text-sm text-white border-b border-neutral-900 pb-3">ملخص المشتريات</h3>
            
            {/* Products List */}
            <div className="max-h-60 overflow-y-auto space-y-4 pr-1">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedFlavor}`} className="flex gap-4 items-center justify-start flex-row-reverse border-b border-neutral-900/60 pb-3">
                  <div className="w-12 h-12 bg-neutral-950 border border-neutral-900 rounded overflow-hidden flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate leading-relaxed">{item.product.name}</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      {item.selectedSize} {item.selectedFlavor !== "Standard" ? `| ${item.selectedFlavor}` : ""} • {item.quantity} قطع
                    </p>
                  </div>
                  <span className="text-xs font-bold text-neutral-300 font-sans">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-3 font-sans text-xs border-t border-neutral-900/60 pt-4">
              <div className="flex justify-between items-center flex-row-reverse">
                <span className="text-neutral-400">المجموع الفرعي</span>
                <span className="text-white">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center flex-row-reverse border-b border-neutral-900 pb-3">
                <span className="text-neutral-400">تكلفة التوصيل</span>
                <span className="text-[#25D366] font-bold">مجاني (سريع)</span>
              </div>
              <div className="flex justify-between items-center flex-row-reverse pt-2">
                <span className="text-xs font-bold text-white">المجموع النهائي</span>
                <span className="text-base font-black text-[#D4AF37]">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-center text-[10px] text-neutral-500 font-sans bg-neutral-950/30 p-3 rounded border border-neutral-900">
              <span>جميع المشتريات مؤمنة بضمان سيمو بروتين</span>
              <ShieldCheck size={14} className="text-[#D4AF37]" />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

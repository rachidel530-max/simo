"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, Ticket } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { GoldButton } from "@/components/shared/gold-button";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    
    // Simulating promo code "SIMO10" for 10% off
    if (promoCode.trim().toUpperCase() === "SIMO10") {
      setDiscountAmount(cartTotal * 0.10);
      setIsPromoApplied(true);
      setPromoCode("");
    } else {
      setPromoError("كوبون غير صالح. جرب الكوبون التجريبي 'SIMO10'");
    }
  };

  const finalTotal = cartTotal - discountAmount;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-28 text-center space-y-6">
        <ShoppingBag className="text-neutral-800 mx-auto stroke-[1.2]" size={64} />
        <h2 className="font-sans font-black text-2xl text-white">سلة التسوق الخاصة بك فارغة</h2>
        <p className="text-neutral-500 text-xs font-sans max-w-sm mx-auto leading-relaxed">
          يبدو أنك لم تقم بإضافة أي من مكملاتنا الفاخرة بعد. ابدأ بناء عضلاتك الآن وتصفح المتجر!
        </p>
        <Link href="/shop" className="inline-block pt-2">
          <GoldButton size="sm" className="flex-row-reverse">
            الذهاب للمتجر وتصفح المنتجات <ArrowRight size={14} />
          </GoldButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-neutral-900 pb-6 text-right">
        <span className="text-[10px] font-sans font-bold tracking-widest text-[#D4AF37] uppercase">سلة التسوق</span>
        <h1 className="font-sans font-black text-3xl sm:text-5xl text-white mt-1">
          حقيبة <span className="gold-gradient-text">المشتريات</span>
        </h1>
      </div>

      {/* Grid: Items + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RIGHT COLUMN: Items List (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">
          
          {/* Table Header (Desktop) */}
          <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-neutral-900 text-[11px] font-sans font-bold text-neutral-500 px-4 flex-row-reverse text-right">
            <span className="col-span-6">المنتج</span>
            <span className="col-span-2 text-center">السعر الفردي</span>
            <span className="col-span-2 text-center">الكمية</span>
            <span className="col-span-2 text-left">المجموع</span>
          </div>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedFlavor}`}
                className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 bg-[#121212] border border-neutral-900 rounded-lg relative group text-right flex-row-reverse"
              >
                {/* Item Details */}
                <div className="col-span-1 sm:col-span-6 flex gap-4 items-center justify-start flex-row-reverse">
                  <div className="w-20 h-20 bg-neutral-950 border border-neutral-900 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-sans font-bold text-[#D4AF37]">
                      {item.product.category}
                    </span>
                    <Link href={`/product/${item.product.id}`} className="block">
                      <h4 className="text-xs sm:text-sm font-sans font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-relaxed">
                        {item.product.name}
                      </h4>
                    </Link>
                    <div className="flex flex-wrap gap-x-2 text-[10px] text-neutral-500 font-sans justify-end">
                      <span>الحجم: <strong className="text-neutral-400">{item.selectedSize}</strong></span>
                      {item.selectedFlavor && item.selectedFlavor !== "Standard" && (
                        <span>النكهة: <strong className="text-neutral-400">{item.selectedFlavor}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-1 sm:col-span-2 text-center text-sm font-sans text-neutral-300">
                  <span className="sm:hidden text-xs text-neutral-500 ml-1">السعر:</span>
                  ${item.product.price.toFixed(2)}
                </div>

                {/* Quantity Controls */}
                <div className="col-span-1 sm:col-span-2 flex justify-center">
                  <div className="flex items-center border border-neutral-800 rounded bg-black">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedFlavor, item.quantity - 1)}
                      className="px-2.5 py-1.5 text-neutral-400 hover:text-white"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="px-3 text-xs font-bold font-sans text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedFlavor, item.quantity + 1)}
                      className="px-2.5 py-1.5 text-neutral-400 hover:text-white"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="col-span-1 sm:col-span-2 text-left text-sm font-sans font-bold text-[#D4AF37]">
                  <span className="sm:hidden text-xs text-neutral-500 ml-1">المجموع:</span>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>

                {/* Remove Trash Button */}
                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedFlavor)}
                  className="absolute top-2 left-2 text-neutral-500 hover:text-[#ea3838] transition-colors p-1"
                  aria-label="حذف المنتج"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Continue shopping link */}
          <div className="pt-4 text-right">
            <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-[#D4AF37] transition-all font-sans flex-row-reverse">
              <ArrowRight size={14} />
              <span>مواصلة التسوق وتصفح المزيد</span>
            </Link>
          </div>
        </div>

        {/* LEFT COLUMN: Summary & Coupon Code (lg:col-span-1) */}
        <div className="space-y-6 order-2 lg:order-1 text-right">
          
          {/* Promo Coupon Form */}
          <div className="bg-[#121212] border border-neutral-900 p-6 rounded-lg space-y-4">
            <h4 className="font-sans font-bold text-xs text-white flex items-center gap-2 justify-end">
              <span>تطبيق قسيمة الخصم</span>
              <Ticket size={14} className="text-[#D4AF37]" />
            </h4>
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="رمز الخصم (مثال: SIMO10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full bg-black border border-neutral-800 text-xs px-3 py-2.5 rounded text-white focus:border-[#D4AF37] font-sans text-right"
              />
              <button
                type="submit"
                className="bg-[#D4AF37] text-black font-sans font-bold text-xs px-4 py-2.5 rounded hover:bg-[#b38c27] transition-all cursor-pointer flex-shrink-0"
              >
                تطبيق
              </button>
            </form>
            
            {promoError && <p className="text-[10px] text-[#ea3838] font-bold font-sans">{promoError}</p>}
            {isPromoApplied && (
              <p className="text-[10px] text-[#25D366] font-bold font-sans">
                تم تطبيق قسيمة الخصم بنجاح! تم خصم 10%
              </p>
            )}
          </div>

          {/* Cart Calculations Summary */}
          <div className="bg-[#121212] border border-neutral-900 p-6 rounded-lg space-y-6">
            <h4 className="font-sans font-bold text-xs text-white border-b border-neutral-900 pb-3">ملخص الطلبية</h4>
            
            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between items-center flex-row-reverse">
                <span className="text-neutral-400">المجموع الفرعي</span>
                <span className="text-white">${cartTotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center flex-row-reverse text-[#ea3838]">
                  <span>قيمة الخصم</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center flex-row-reverse border-b border-neutral-900 pb-3">
                <span className="text-neutral-400">تكلفة الشحن</span>
                <span className="text-[#25D366] font-bold">مجاني</span>
              </div>
              <div className="flex justify-between items-center flex-row-reverse pt-2">
                <span className="text-sm font-bold text-white">المجموع النهائي</span>
                <span className="text-lg font-black text-[#D4AF37]">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block pt-2">
              <GoldButton size="lg" className="w-full flex-row-reverse py-4 text-sm font-black">
                الذهاب للدفع وتأكيد الطلب <ArrowLeft size={16} />
              </GoldButton>
            </Link>

            <div className="flex items-center gap-2 justify-center text-[10px] text-neutral-500 font-sans border-t border-neutral-900/60 pt-4">
              <span>جميع طلبياتنا أمنة ومحمية بالكامل</span>
              <ShieldCheck size={14} className="text-[#D4AF37]" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

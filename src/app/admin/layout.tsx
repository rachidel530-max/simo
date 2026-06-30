"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingBag, PlusCircle, ArrowLeft, ShieldAlert, KeyRound, Loader2, LogOut, Package, Settings, ClipboardList, FolderTree } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, login, logout } = useAuth();
  
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const success = await login(email, password);
      if (!success) {
        setErrorMsg("بيانات الدخول غير صحيحة. يرجى التحقق وإعادة المحاولة.");
      }
    } catch (e) {
      setErrorMsg("حدث خطأ أثناء الاتصال بالنظام.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. RENDER SECURE LOGIN FORM IF NOT AUTHENTICATED AS ADMIN
  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4 py-20 text-right">
        {/* Glow decoration */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#121212] border border-[#D4AF37]/20 rounded-lg p-8 shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-2 shadow-[0_0_12px_rgba(212,175,55,0.15)] animate-pulse">
              <KeyRound size={22} />
            </div>
            <span className="font-heading font-black text-xl tracking-tighter uppercase text-white">
              SIMO <span className="gold-gradient-text">CONSOLE</span>
            </span>
            <h2 className="font-sans font-bold text-xs text-neutral-500 uppercase tracking-widest mt-1">
              لوحة تحكم المشرف والمدير
            </h2>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
            {errorMsg && (
              <div className="p-3 bg-[#ea3838]/10 border border-[#ea3838]/20 text-[#ea3838] text-xs font-bold rounded text-right font-sans">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 font-sans block">البريد الإلكتروني للمدير</label>
              <input
                type="email"
                required
                placeholder="admin@simoprotein.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-neutral-850 text-xs px-4 py-3 rounded text-white focus:border-[#D4AF37] font-sans text-right"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 font-sans block">كلمة المرور</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-neutral-850 text-xs px-4 py-3 rounded text-white focus:border-[#D4AF37] font-sans text-right"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-[#996515] to-[#D4AF37] text-black font-sans font-black text-xs rounded hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <span>تسجيل دخول المشرف</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="inline-flex items-center gap-1 text-[10px] text-neutral-500 hover:text-white transition-all font-sans flex-row-reverse">
              <ArrowLeft size={12} />
              <span>العودة لصفحة المتجر الرئيسية</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. RENDER THE COMPLETE SIDEBAR AND LAYOUT IF AUTHENTICATED
  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col md:flex-row text-right">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-black border-b md:border-b-0 md:border-l border-neutral-900 p-6 flex flex-col justify-between">
        <div className="space-y-8">
          <div>
            <span className="font-heading font-black text-xl tracking-tighter uppercase text-white">
              SIMO <span className="gold-gradient-text">CONSOLE</span>
            </span>
            <p className="text-[10px] font-sans font-bold text-neutral-500 uppercase tracking-widest mt-1">
              لوحة التحكم الإدارية للمتجر
            </p>
          </div>

          <nav className="flex flex-col gap-2 font-sans text-xs font-bold text-neutral-400">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex-row-reverse justify-end"
            >
              <LayoutDashboard size={14} /> 
              <span>نظرة عامة والإحصائيات</span>
            </Link>
            
            <Link
              href="/shop"
              className="flex items-center gap-3 px-4 py-3 rounded hover:text-white hover:bg-neutral-900/50 flex-row-reverse justify-end"
            >
              <ShoppingBag size={14} /> 
              <span>تصفح المتجر مباشر</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer Log out */}
        <div className="pt-6 border-t border-neutral-900 mt-8 md:mt-0 space-y-4">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-[#ea3838]/10 text-[#ea3838] transition-all font-sans text-xs font-bold flex-row-reverse justify-end cursor-pointer"
          >
            <LogOut size={14} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main admin dashboard page content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}

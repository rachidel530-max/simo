"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Search, Menu, X, 
  Trash2, Plus, Minus, LogOut, LayoutDashboard
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { GoldButton } from "@/components/shared/gold-button";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const { user, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Monitor scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "المتجر", href: "/shop" },
    { label: "العروض", href: "/offers" },
    { label: "الأكثر مبيعاً", href: "/best-sellers" },
    { label: "من نحن", href: "/about" },
    { label: "تواصل معنا", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled 
            ? "bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#D4AF37]/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]" 
            : "bg-transparent border-b border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-heading font-black text-2xl tracking-tighter uppercase relative">
                <span className="text-white">SIMO</span>{" "}
                <span className="gold-gradient-text">PROTEIN</span>
                <span className="absolute -bottom-1 left-0 w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37] group-hover:scale-150 transition-all duration-300" />
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`font-sans text-sm font-semibold transition-all relative py-1 ${
                      isActive 
                        ? "text-[#D4AF37]" 
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span 
                        layoutId="activeNavLine"
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#996515] to-[#D4AF37]" 
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Utilities / Icons */}
            <div className="flex items-center gap-4 text-white">
              {/* Search Toggle */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-neutral-400 hover:text-[#D4AF37] transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Shopping Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-neutral-400 hover:text-[#D4AF37] transition-colors relative cursor-pointer"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-black rounded-full flex items-center justify-center font-heading shadow-[0_0_8px_#D4AF37]">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Hidden Admin Entry Link (If user/admin is logged in, show Dashboard link) */}
              {user?.isAdmin && (
                <Link
                  href="/admin"
                  className="p-2 text-[#D4AF37] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  title="لوحة التحكم"
                >
                  <LayoutDashboard size={20} />
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Expandable Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 w-full bg-[#0B0B0B]/95 border-b border-[#D4AF37]/30 py-6 z-50 px-4 shadow-[0_10px_40px_rgba(0,0,0,0.9)]"
          >
            <div className="max-w-3xl mx-auto flex items-center gap-4">
              <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center border-b-2 border-[#D4AF37] py-2">
                <Search size={22} className="text-[#D4AF37] ml-3" />
                <input
                  type="text"
                  placeholder="ابحث عن المكملات الغذائية، الأحزمة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-white w-full font-sans font-semibold text-lg placeholder-neutral-600"
                  autoFocus
                />
              </form>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-full border border-neutral-800 text-neutral-400 hover:text-[#D4AF37] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 w-3/4 max-w-sm h-full bg-[#121212] border-l border-[#D4AF37]/15 p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-heading font-black text-xl tracking-tighter uppercase text-white">
                  SIMO <span className="gold-gradient-text">PROTEIN</span>
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-md text-neutral-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-6 font-sans text-base font-bold">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`hover:text-[#D4AF37] py-2 border-b border-neutral-900 ${
                      pathname === link.href ? "text-[#D4AF37]" : "text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {user?.isAdmin && (
                <div className="mt-auto border-t border-neutral-900 pt-6">
                  <div className="flex flex-col gap-4">
                    <p className="text-neutral-500 text-xs font-bold font-sans">
                      أهلاً، مدير المتجر
                    </p>
                    <Link
                      href="/admin"
                      className="text-[#D4AF37] hover:underline text-sm font-bold font-sans"
                    >
                      لوحة التحكم
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="text-[#ea3838] flex items-center gap-2 text-sm mt-2 text-right cursor-pointer"
                    >
                      <LogOut size={16} /> تسجيل الخروج
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 w-full sm:w-[450px] h-full bg-[#121212] border-l border-[#D4AF37]/20 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#D4AF37]/15 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[#D4AF37]" />
                  <span className="font-sans font-bold text-lg text-white">سلة التسوق</span>
                  <span className="bg-neutral-800 text-xs px-2 py-0.5 rounded-full text-white font-bold">{cartCount}</span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-md text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center space-y-4">
                    <ShoppingBag size={48} className="text-neutral-700 stroke-[1.5]" />
                    <p className="font-sans font-bold text-neutral-400 text-sm">سلتك فارغة حالياً</p>
                    <p className="text-xs text-neutral-500 max-w-[220px]">أضف بعض المنتجات الفاخرة لتبدأ تمرينك بقوة!</p>
                    <Link href="/shop" onClick={() => setIsCartOpen(false)}>
                      <GoldButton variant="outline" size="sm" className="mt-4">
                        تصفح المنتجات
                      </GoldButton>
                    </Link>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedFlavor}`}
                      className="flex gap-4 p-3 bg-neutral-900/60 rounded-lg border border-neutral-800/40 relative group"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 bg-neutral-900 rounded overflow-hidden relative flex-shrink-0 border border-neutral-800">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 text-right">
                        <h4 className="text-xs font-bold text-white truncate font-sans">
                          {item.product.name}
                        </h4>
                        <div className="flex flex-wrap gap-x-2 mt-1 text-[10px] text-neutral-405 font-sans">
                          <span>الحجم: <strong className="text-neutral-300">{item.selectedSize}</strong></span>
                          {item.selectedFlavor && item.selectedFlavor !== "Standard" && (
                            <span>النكهة: <strong className="text-[#D4AF37]">{item.selectedFlavor}</strong></span>
                          )}
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between mt-3 flex-row-reverse">
                          <div className="flex items-center border border-neutral-800 rounded bg-black">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedFlavor, item.quantity - 1)}
                              className="px-2 py-1 text-neutral-400 hover:text-white"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="px-2 text-xs font-bold font-sans text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedFlavor, item.quantity + 1)}
                              className="px-2 py-1 text-neutral-400 hover:text-white"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          <span className="text-sm font-sans font-bold text-white">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedFlavor)}
                        className="absolute top-2 left-2 text-neutral-500 hover:text-[#ea3838] transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer Total */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-[#D4AF37]/15 bg-neutral-900/30 space-y-4">
                  <div className="flex justify-between items-center flex-row-reverse">
                    <span className="text-sm font-bold text-neutral-400 font-sans">المجموع الفرعي</span>
                    <span className="text-lg font-sans font-black text-[#D4AF37]">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 text-right">التوصيل مجاني لجميع الطلبات في المغرب.</p>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link href="/cart" className="w-full" onClick={() => setIsCartOpen(false)}>
                      <GoldButton variant="outline" size="sm" className="w-full text-center">
                        عرض السلة
                      </GoldButton>
                    </Link>
                    <Link href="/checkout" className="w-full" onClick={() => setIsCartOpen(false)}>
                      <GoldButton size="sm" className="w-full text-center">
                        إتمام الطلب
                      </GoldButton>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

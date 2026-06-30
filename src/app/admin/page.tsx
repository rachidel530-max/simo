"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, ShoppingBag, DollarSign, 
  Trash2, Plus, Edit2, CheckCircle2, ClipboardList, FolderTree, Settings, Tag, ArrowRight, Loader2, Sparkles, Phone, Eye, Package
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { GoldButton } from "@/components/shared/gold-button";
import { 
  dbGetProducts, dbUpsertProduct, dbDeleteProduct,
  dbGetCategories, dbAddCategory, dbDeleteCategory,
  dbGetOrders, dbUpdateOrderStatus, Order,
  dbGetStoreInfo, dbSaveStoreInfo, StoreInfo,
  dbGetSocialLinks, dbSaveSocialLinks, SocialLinks,
  dbGetBanners, dbSaveBanners, HomepageBanner, Category
} from "@/utils/supabase";
import { Product } from "@/data/products";

export default function AdminPage() {
  const { refreshOrders } = useAuth();
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "categories" | "settings">("overview");
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Store details states
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({ name: "", phone: "", email: "", address: "" });
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({ whatsapp: "", instagram: "", facebook: "", tiktok: "" });
  const [banners, setBanners] = useState<HomepageBanner[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form states - Products CRUD
  const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    description: "",
    price: 39.99,
    originalPrice: "",
    category: "",
    stock: 20,
    image: "",
    sizes: "",
    flavors: "",
    benefits: "",
    ingredients: "",
    isFeatured: false,
    isBestSeller: false,
    isNew: false
  });

  // Form states - Categories
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");
  const [categoryBg, setCategoryBg] = useState("");

  // Load all dashboard content
  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const prods = await dbGetProducts();
      const cats = await dbGetCategories();
      const ords = await dbGetOrders();
      const info = await dbGetStoreInfo();
      const social = await dbGetSocialLinks();
      const bans = await dbGetBanners();

      setProductsList(prods);
      setCategories(cats);
      setOrders(ords);
      setStoreInfo(info);
      setSocialLinks(social);
      setBanners(bans);

      if (cats.length > 0 && !productForm.category) {
        setProductForm(prev => ({ ...prev, category: cats[0].name }));
      }
    } catch (e) {
      console.error("Failed to load admin panel data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const triggerNotification = (message: string) => {
    setActionSuccess(message);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // 1. ORDER ACTIONS
  const handleOrderStatusChange = async (orderId: string, status: Order["status"]) => {
    await dbUpdateOrderStatus(orderId, status);
    const ords = await dbGetOrders();
    setOrders(ords);
    refreshOrders(); // sync with context
    triggerNotification("تم تحديث حالة الطلب بنجاح.");
  };

  // 2. PRODUCT ACTIONS
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.category) return;

    const sizesArr = productForm.sizes ? productForm.sizes.split(",").map(s => s.trim()) : ["Standard"];
    const flavorsArr = productForm.flavors ? productForm.flavors.split(",").map(f => f.trim()) : ["Standard"];
    const benefitsArr = productForm.benefits ? productForm.benefits.split("\n").map(b => b.trim()).filter(Boolean) : [];
    const ingredientsArr = productForm.ingredients ? productForm.ingredients.split(",").map(i => i.trim()).filter(Boolean) : [];

    const id = isEditingProduct ? productForm.id : `prod-${Date.now()}`;
    const payload: Product = {
      id,
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
      category: productForm.category,
      stock: Number(productForm.stock),
      image: productForm.image || "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=300",
      sizes: sizesArr,
      flavors: flavorsArr,
      benefits: benefitsArr,
      ingredients: ingredientsArr,
      isFeatured: productForm.isFeatured,
      isBestSeller: productForm.isBestSeller,
      isNew: productForm.isNew,
      rating: isEditingProduct ? isEditingProduct.rating : 5.0,
      reviewsCount: isEditingProduct ? isEditingProduct.reviewsCount : 0
    };

    await dbUpsertProduct(payload);
    await loadAllData();
    
    // Reset product form
    setProductForm({
      id: "",
      name: "",
      description: "",
      price: 39.99,
      originalPrice: "",
      category: categories[0]?.name || "",
      stock: 20,
      image: "",
      sizes: "",
      flavors: "",
      benefits: "",
      ingredients: "",
      isFeatured: false,
      isBestSeller: false,
      isNew: false
    });
    
    setIsEditingProduct(null);
    setShowProductForm(false);
    triggerNotification("تم حفظ المنتج بنجاح.");
  };

  const handleEditProduct = (prod: Product) => {
    setIsEditingProduct(prod);
    setProductForm({
      id: prod.id,
      name: prod.name,
      description: prod.description,
      price: prod.price,
      originalPrice: prod.originalPrice ? String(prod.originalPrice) : "",
      category: prod.category,
      stock: prod.stock,
      image: prod.image,
      sizes: prod.sizes.join(", "),
      flavors: prod.flavors ? prod.flavors.join(", ") : "",
      benefits: prod.benefits.join("\n"),
      ingredients: prod.ingredients.join(", "),
      isFeatured: prod.isFeatured || false,
      isBestSeller: prod.isBestSeller || false,
      isNew: prod.isNew || false
    });
    setShowProductForm(true);
  };

  const handleDeleteProductClick = async (id: string) => {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً؟")) {
      await dbDeleteProduct(id);
      await loadAllData();
      triggerNotification("تم حذف المنتج بنجاح.");
    }
  };

  // 3. CATEGORY ACTIONS
  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName || !categorySlug) return;
    
    const catBgImage = categoryBg || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300";
    await dbAddCategory({
      name: categoryName,
      slug: categorySlug,
      icon: categoryIcon || "⚡",
      bg_image: catBgImage
    });

    setCategoryName("");
    setCategorySlug("");
    setCategoryIcon("");
    setCategoryBg("");
    await loadAllData();
    triggerNotification("تمت إضافة الفئة بنجاح.");
  };

  const handleDeleteCategoryClick = async (id: string) => {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذه الفئة؟")) {
      await dbDeleteCategory(id);
      await loadAllData();
      triggerNotification("تم حذف الفئة بنجاح.");
    }
  };

  // 4. SITE SETTINGS ACTIONS
  const handleSaveStoreInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await dbSaveStoreInfo(storeInfo);
    window.dispatchEvent(new Event("settings-updated"));
    triggerNotification("تم حفظ معلومات الاتصال بنجاح.");
  };

  const handleSaveSocialLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    await dbSaveSocialLinks(socialLinks);
    window.dispatchEvent(new Event("settings-updated"));
    triggerNotification("تم حفظ روابط التواصل الاجتماعي بنجاح.");
  };

  const handleSaveBanners = async (e: React.FormEvent, index: number) => {
    e.preventDefault();
    const updated = [...banners];
    await dbSaveBanners(updated);
    triggerNotification("تم حفظ بنرات الصفحة الرئيسية.");
  };

  // Analytics calculations
  const totalRevenue = orders.reduce((sum, order) => {
    return order.status !== "Cancelled" ? sum + order.total : sum;
  }, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === "Pending").length;
  const productsInStockCount = productsList.length;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={36} className="text-[#D4AF37] animate-spin" />
        <p className="text-neutral-400 font-sans text-xs">جاري تحميل لوحة التحكم الإدارية...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 text-right">
      
      {/* Action Notification */}
      {actionSuccess && (
        <div className="fixed bottom-5 left-5 z-50 bg-[#121212] border border-[#D4AF37] text-white p-4 rounded shadow-2xl flex items-center gap-2">
          <span>{actionSuccess}</span>
          <CheckCircle2 size={16} className="text-[#D4AF37]" />
        </div>
      )}

      {/* Header Overview */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-900 pb-6 gap-4 flex-row-reverse">
        <div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-white">لوحة تحكم المتجر</h1>
          <p className="text-[10px] text-neutral-500 font-sans mt-1">تسيير المنتجات، الطلبات، الأقسام وإعدادات الشحن</p>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex gap-2 font-sans text-xs font-bold border border-neutral-900 rounded bg-[#121212] p-1 flex-row-reverse">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded transition-all flex items-center gap-1.5 flex-row-reverse ${
              activeTab === "overview" ? "bg-[#D4AF37] text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            <ClipboardList size={14} /> نظرة عامة والطلبات
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded transition-all flex items-center gap-1.5 flex-row-reverse ${
              activeTab === "products" ? "bg-[#D4AF37] text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            <ShoppingBag size={14} /> المنتجات
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 rounded transition-all flex items-center gap-1.5 flex-row-reverse ${
              activeTab === "categories" ? "bg-[#D4AF37] text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            <FolderTree size={14} /> الأقسام
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded transition-all flex items-center gap-1.5 flex-row-reverse ${
              activeTab === "settings" ? "bg-[#D4AF37] text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Settings size={14} /> الإعدادات والبنرات
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & ORDERS */}
      {activeTab === "overview" && (
        <div className="space-y-10 font-sans">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue */}
            <div className="bg-[#121212] border border-neutral-900 p-5 rounded-lg flex items-center justify-between flex-row-reverse shadow-md">
              <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded border border-[#D4AF37]/20 flex-shrink-0">
                <DollarSign size={20} />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-500 font-bold block mb-1">المبيعات الإجمالية</span>
                <span className="text-xl font-bold text-white">${totalRevenue.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Total Orders */}
            <div className="bg-[#121212] border border-neutral-900 p-5 rounded-lg flex items-center justify-between flex-row-reverse shadow-md">
              <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded border border-[#D4AF37]/20 flex-shrink-0">
                <ClipboardList size={20} />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-500 font-bold block mb-1">عدد الطلبات الإجمالي</span>
                <span className="text-xl font-bold text-white">{totalOrdersCount} طلب</span>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="bg-[#121212] border border-neutral-900 p-5 rounded-lg flex items-center justify-between flex-row-reverse shadow-md">
              <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded border border-[#D4AF37]/20 flex-shrink-0 animate-pulse">
                <TrendingUp size={20} />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-500 font-bold block mb-1">طلبات معلقة للتأكيد</span>
                <span className="text-xl font-bold text-[#D4AF37]">{pendingOrdersCount} معلق</span>
              </div>
            </div>

            {/* Total products */}
            <div className="bg-[#121212] border border-neutral-900 p-5 rounded-lg flex items-center justify-between flex-row-reverse shadow-md">
              <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded border border-[#D4AF37]/20 flex-shrink-0">
                <Package size={20} />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-500 font-bold block mb-1">المنتجات النشطة</span>
                <span className="text-xl font-bold text-white">{productsInStockCount} مكمل</span>
              </div>
            </div>
          </div>

          {/* Orders Management Table */}
          <div className="bg-[#121212] border border-neutral-900 rounded-lg p-6 space-y-4">
            <h3 className="font-bold text-base text-white border-b border-neutral-900 pb-3">إدارة طلبات المشترين (تأكيد الشحن)</h3>

            {orders.length === 0 ? (
              <p className="text-neutral-500 text-xs py-8 text-center">لا توجد أي طلبيات في المتجر حالياً.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-neutral-900 text-neutral-500 pb-2">
                      <th className="py-3 px-4 font-bold">رقم الطلبية</th>
                      <th className="py-3 px-4 font-bold">اسم العميل</th>
                      <th className="py-3 px-4 font-bold">رقم الهاتف</th>
                      <th className="py-3 px-4 font-bold">المدينة / العنوان</th>
                      <th className="py-3 px-4 font-bold">المجموع</th>
                      <th className="py-3 px-4 font-bold">حالة الطلب</th>
                      <th className="py-3 px-4 font-bold text-left">التحكم بالحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-neutral-900/60 hover:bg-neutral-900/30 transition-all">
                        <td className="py-4 px-4 font-bold text-white">{order.id}</td>
                        <td className="py-4 px-4 font-bold text-neutral-200">{order.customer_name}</td>
                        <td className="py-4 px-4 font-bold text-neutral-400">
                          <a href={`https://wa.me/${order.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] flex items-center gap-1 justify-end flex-row-reverse">
                            <Phone size={12} className="text-[#25D366]" /> {order.phone}
                          </a>
                        </td>
                        <td className="py-4 px-4 text-neutral-400 truncate max-w-[150px]">{order.address}</td>
                        <td className="py-4 px-4 text-[#D4AF37] font-bold">${order.total.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.status === "Pending" ? "bg-amber-500/10 text-amber-500" :
                            order.status === "Shipped" ? "bg-blue-500/10 text-blue-500" :
                            order.status === "Delivered" ? "bg-[#25D366]/10 text-[#25D366]" :
                            "bg-red-500/10 text-red-500"
                          }`}>
                            {order.status === "Pending" ? "معلق" :
                             order.status === "Shipped" ? "تم الشحن" :
                             order.status === "Delivered" ? "تم التوصيل" : "ملغى"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-left">
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value as any)}
                            className="bg-black border border-neutral-800 text-[10px] px-2 py-1 rounded text-white focus:border-[#D4AF37] outline-none cursor-pointer text-right"
                          >
                            <option value="Pending">معلق (Pending)</option>
                            <option value="Shipped">تم الشحن (Shipped)</option>
                            <option value="Delivered">تم التوصيل (Delivered)</option>
                            <option value="Cancelled">ملغى (Cancelled)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CRUD */}
      {activeTab === "products" && (
        <div className="space-y-8 font-sans">
          
          {/* Actions & Header */}
          <div className="flex justify-between items-center border-b border-neutral-900 pb-4 flex-row-reverse">
            <h3 className="font-bold text-base text-white">إدارة مكملات ومنتجات المتجر</h3>
            <GoldButton 
              size="sm" 
              onClick={() => {
                setIsEditingProduct(null);
                setProductForm({
                  id: "",
                  name: "",
                  description: "",
                  price: 39.99,
                  originalPrice: "",
                  category: categories[0]?.name || "",
                  stock: 20,
                  image: "",
                  sizes: "",
                  flavors: "",
                  benefits: "",
                  ingredients: "",
                  isFeatured: false,
                  isBestSeller: false,
                  isNew: false
                });
                setShowProductForm(!showProductForm);
              }}
              className="flex-row-reverse"
            >
              <Plus size={14} /> <span>{showProductForm ? "إغلاق النموذج" : "إضافة منتج جديد"}</span>
            </GoldButton>
          </div>

          {/* Add / Edit Product Form Container */}
          {showProductForm && (
            <form onSubmit={handleProductSubmit} className="bg-[#121212] border border-neutral-900 p-6 rounded-lg space-y-6 text-right">
              <h4 className="font-bold text-sm text-[#D4AF37] border-b border-neutral-900 pb-2">
                {isEditingProduct ? `تعديل المنتج: ${isEditingProduct.name}` : "تعبئة تفاصيل منتج جديد"}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 block">اسم المنتج بالكامل *</label>
                  <input
                    type="text"
                    required
                    placeholder="ON Whey Gold Standard 2.27kg"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 block">سعر البيع ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                  />
                </div>

                {/* Original Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 block">السعر الأصلي قبل الخصم ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="اتركه فارغاً إن لم يكن هناك خصم"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 block">قسم المنتج *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-black border border-neutral-805 text-xs px-3 py-2.5 rounded text-white focus:border-[#D4AF37] pr-2 text-right cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Stock count */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 block">الكمية المتوفرة بالمخزن *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                  />
                </div>

                {/* Image Upload/Url */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 block">صورة المنتج (رابط أو ملف) *</label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="bg-neutral-900 border border-neutral-805 text-[10px] p-1 rounded text-neutral-400 cursor-pointer w-1/3"
                    />
                    <input
                      type="text"
                      placeholder="أو الصق رابط صورة مباشر"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-2/3 bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sizes selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 block">الأحجام المتاحة (افصل بينها بفاصلة ",")</label>
                  <input
                    type="text"
                    placeholder="900 جرام, 2.27 كجم"
                    value={productForm.sizes}
                    onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                    className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                  />
                </div>

                {/* Flavors selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 block">النكهات المتاحة (افصل بينها بفاصلة ",")</label>
                  <input
                    type="text"
                    placeholder="Double Rich Chocolate, Gourmet Vanilla, Delicious Strawberry"
                    value={productForm.flavors}
                    onChange={(e) => setProductForm({ ...productForm, flavors: e.target.value })}
                    className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Benefits */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 block">الفوائد (كل فائدة في سطر مستقل)</label>
                  <textarea
                    rows={4}
                    placeholder="بناء عضلات صافية وسريعة&#10;امتصاص فائق فور التمرين&#10;خالٍ من اللاكتوز والدهون"
                    value={productForm.benefits}
                    onChange={(e) => setProductForm({ ...productForm, benefits: e.target.value })}
                    className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right resize-none"
                  />
                </div>

                {/* Ingredients */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 block">المكونات الدقيقة (افصل بينها بفاصلة ",")</label>
                  <textarea
                    rows={4}
                    placeholder="بروتين معزول محلل, ليسيثين الصويا, نكهات كاكاو طبيعية, سوكارلوز"
                    value={productForm.ingredients}
                    onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
                    className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right resize-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 block">وصف تفصيلي للمنتج *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="اكتب وصفاً جذاباً وشاملاً لمواصفات وجودة هذا المكمل الرياضي الفاخر..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right resize-none"
                />
              </div>

              {/* Badges and Boolean checks */}
              <div className="flex gap-6 justify-end pt-2">
                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <span>منتج جديد</span>
                  <input
                    type="checkbox"
                    checked={productForm.isNew}
                    onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                    className="accent-[#D4AF37] h-4 w-4"
                  />
                </label>
                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <span>الأكثر مبيعاً</span>
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                    className="accent-[#D4AF37] h-4 w-4"
                  />
                </label>
                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <span>منتج مميز (في الهيرو والبنرات)</span>
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="accent-[#D4AF37] h-4 w-4"
                  />
                </label>
              </div>

              {/* Form Action submit */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingProduct(null);
                    setShowProductForm(false);
                  }}
                  className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:text-white rounded text-xs font-bold cursor-pointer"
                >
                  إلغاء التعديل
                </button>
                <GoldButton type="submit" size="sm" className="font-black">
                  {isEditingProduct ? "حفظ وتحديث المنتج" : "إنشاء وإضافة المنتج للمتجر"}
                </GoldButton>
              </div>
            </form>
          )}

          {/* Product Items List Grid */}
          <div className="bg-[#121212] border border-neutral-900 rounded-lg p-6 space-y-4">
            <h4 className="font-bold text-sm text-white">كتالوج المنتجات الفعلي بالمخزن</h4>
            
            {productsList.length === 0 ? (
              <p className="text-neutral-500 text-xs py-8 text-center">لا توجد أي مكملات مضافة حالياً.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsList.map((prod) => (
                  <div key={prod.id} className="bg-neutral-950 p-4 border border-neutral-900 rounded flex gap-4 text-right justify-start items-center flex-row-reverse relative group">
                    <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded overflow-hidden flex-shrink-0">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] text-[#D4AF37] font-bold block">{prod.category}</span>
                      <h4 className="text-xs font-bold text-white truncate mt-0.5 leading-relaxed">{prod.name}</h4>
                      <div className="flex items-baseline gap-2 mt-1 justify-end flex-row-reverse">
                        <span className="text-xs text-white font-bold">${prod.price}</span>
                        <span className="text-[10px] text-neutral-500">متبقي: {prod.stock} قطع</span>
                      </div>
                    </div>

                    {/* Float edit / delete controls */}
                    <div className="absolute top-2 left-2 flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditProduct(prod)}
                        className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-[#D4AF37]"
                        title="تعديل تفاصيل المنتج"
                      >
                        <Edit2 size={11} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProductClick(prod.id)}
                        className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-[#ea3838]"
                        title="حذف المنتج نهائياً"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGEMENT */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
          {/* Add Category Form (1/3) */}
          <form onSubmit={handleAddCategorySubmit} className="bg-[#121212] border border-neutral-900 p-6 rounded-lg space-y-4 text-right h-fit lg:col-span-1">
            <h4 className="font-bold text-sm text-[#D4AF37] border-b border-neutral-900 pb-2">إضافة قسم (فئة) جديد</h4>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 block">اسم القسم بالعربية *</label>
              <input
                type="text"
                required
                placeholder="واي بروتين"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 block">معرف الرابط (Slug) بالإنجليزية *</label>
              <input
                type="text"
                required
                placeholder="whey-protein"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 block">أيقونة القسم (Emoji)</label>
              <input
                type="text"
                placeholder="⚡"
                value={categoryIcon}
                onChange={(e) => setCategoryIcon(e.target.value)}
                className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 block">رابط خلفية القسم الجمالية</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/photo-..."
                value={categoryBg}
                onChange={(e) => setCategoryBg(e.target.value)}
                className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
              />
            </div>

            <GoldButton type="submit" size="sm" className="w-full font-black mt-2">
              حفظ وإضافة الفئة
            </GoldButton>
          </form>

          {/* Categories Grid List (2/3) */}
          <div className="bg-[#121212] border border-neutral-900 p-6 rounded-lg space-y-4 lg:col-span-2 text-right">
            <h4 className="font-bold text-sm text-white border-b border-neutral-900 pb-2">فئات وأقسام المتجر المعتمدة</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="bg-neutral-950 p-4 border border-neutral-900 rounded flex items-center justify-between flex-row-reverse">
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <span className="text-xl">{c.icon || "⚡"}</span>
                    <div className="text-right">
                      <h5 className="text-xs font-bold text-white">{c.name}</h5>
                      <span className="text-[9px] text-neutral-500">{c.slug}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteCategoryClick(c.id)}
                    className="p-1.5 rounded hover:bg-red-500/10 text-neutral-500 hover:text-[#ea3838] transition-all cursor-pointer"
                    title="حذف القسم"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STORE SETTINGS & HOMEPAGE BANNERS */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans text-right">
          
          {/* Store Info & Social Links Form */}
          <div className="space-y-6">
            
            {/* Store details form */}
            <form onSubmit={handleSaveStoreInfo} className="bg-[#121212] border border-neutral-900 p-6 rounded-lg space-y-4">
              <h4 className="font-bold text-sm text-[#D4AF37] border-b border-neutral-900 pb-2">بيانات ومعلومات الاتصال بالمتجر</h4>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 block">اسم المتجر</label>
                <input
                  type="text"
                  required
                  value={storeInfo.name}
                  onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                  className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 block">رقم هاتف الاتصال والواتساب</label>
                <input
                  type="text"
                  required
                  value={storeInfo.phone}
                  onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                  className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 block">البريد الإلكتروني للعملاء</label>
                <input
                  type="email"
                  required
                  value={storeInfo.email}
                  onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                  className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 block">العنوان المكتوب بالفوتير</label>
                <input
                  type="text"
                  required
                  value={storeInfo.address}
                  onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
                  className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                />
              </div>

              <GoldButton type="submit" size="sm" className="font-black">
                حفظ معلومات الاتصال
              </GoldButton>
            </form>

            {/* Social Links Form */}
            <form onSubmit={handleSaveSocialLinks} className="bg-[#121212] border border-neutral-900 p-6 rounded-lg space-y-4">
              <h4 className="font-bold text-sm text-[#D4AF37] border-b border-neutral-900 pb-2">روابط التواصل والواتساب</h4>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 block">رابط WhatsApp المباشر</label>
                <input
                  type="text"
                  required
                  value={socialLinks.whatsapp}
                  onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
                  className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 block">حساب Instagram</label>
                <input
                  type="text"
                  required
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 block">صفحة Facebook</label>
                <input
                  type="text"
                  required
                  value={socialLinks.facebook}
                  onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                  className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 block">حساب TikTok</label>
                <input
                  type="text"
                  required
                  value={socialLinks.tiktok}
                  onChange={(e) => setSocialLinks({ ...socialLinks, tiktok: e.target.value })}
                  className="w-full bg-black border border-neutral-805 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                />
              </div>

              <GoldButton type="submit" size="sm" className="font-black">
                حفظ روابط التواصل
              </GoldButton>
            </form>

          </div>

          {/* Homepage Banners Form Panel */}
          <div className="bg-[#121212] border border-neutral-900 p-6 rounded-lg space-y-6">
            <h4 className="font-bold text-sm text-[#D4AF37] border-b border-neutral-900 pb-2">بنرات الصفحة الرئيسية (Hero)</h4>
            
            {banners.map((banner, idx) => (
              <form key={idx} onSubmit={(e) => handleSaveBanners(e, idx)} className="bg-neutral-950 p-4 border border-neutral-900 rounded space-y-4">
                <span className="text-[10px] text-[#D4AF37] font-bold block">بنر رقم {idx + 1}</span>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 block">العنوان العريض</label>
                  <input
                    type="text"
                    required
                    value={banner.title}
                    onChange={(e) => {
                      const updated = [...banners];
                      updated[idx].title = e.target.value;
                      setBanners(updated);
                    }}
                    className="w-full bg-black border border-neutral-850 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 block">العنوان الفرعي الوصفي</label>
                  <input
                    type="text"
                    required
                    value={banner.subtitle}
                    onChange={(e) => {
                      const updated = [...banners];
                      updated[idx].subtitle = e.target.value;
                      setBanners(updated);
                    }}
                    className="w-full bg-black border border-neutral-850 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 block">رابط صورة البنر الخلفية</label>
                  <input
                    type="text"
                    required
                    value={banner.image}
                    onChange={(e) => {
                      const updated = [...banners];
                      updated[idx].image = e.target.value;
                      setBanners(updated);
                    }}
                    className="w-full bg-black border border-neutral-850 text-xs px-3 py-2 rounded text-white focus:border-[#D4AF37] text-right"
                  />
                </div>

                <div className="flex justify-end">
                  <GoldButton type="submit" size="sm" className="font-bold py-1.5 text-[10px]">
                    تعديل وحفظ البنر
                  </GoldButton>
                </div>
              </form>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}

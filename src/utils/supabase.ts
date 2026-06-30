import { createClient } from "@supabase/supabase-js";
import { products as seedProducts, categoriesList as seedCategories, Product } from "@/data/products";
export type { Product };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = () => {
  return supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
};

// Initialize Supabase Client (if keys are available)
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  bg_image?: string;
}

// Interfaces
export interface OrderItem {
  id: string;
  name: string;
  size: string;
  flavor: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItem[];
  total: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
}

export interface StoreInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface SocialLinks {
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

export interface HomepageBanner {
  image: string;
  title: string;
  subtitle: string;
}

// LOCAL FALLBACK DB METHODS (Using localStorage)
const getLocalProducts = (): Product[] => {
  if (typeof window === "undefined") return seedProducts;
  const stored = localStorage.getItem("simo_products");
  if (!stored) {
    localStorage.setItem("simo_products", JSON.stringify(seedProducts));
    return seedProducts;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return seedProducts;
  }
};

const saveLocalProducts = (prods: Product[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("simo_products", JSON.stringify(prods));
  }
};

const getLocalCategories = (): Category[] => {
  if (typeof window === "undefined") return seedCategories;
  const stored = localStorage.getItem("simo_categories");
  if (!stored) {
    localStorage.setItem("simo_categories", JSON.stringify(seedCategories));
    return seedCategories;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return seedCategories;
  }
};

const saveLocalCategories = (cats: Category[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("simo_categories", JSON.stringify(cats));
  }
};

const getLocalOrders = (): Order[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("simo_orders");
  if (!stored) {
    const mockOrders: Order[] = [
      {
        id: "ORD-9481",
        created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
        customer_name: "أمين المرابط",
        email: "amine@gmail.com",
        phone: "+212612345678",
        address: "12 شارع الزرقطوني، شقة 4",
        city: "Casablanca",
        items: [
          { id: "iso100-hydrolyzed", name: "Dymatize ISO 100 Hydrolyzed", size: "2.3 كجم (5.0 رطل)", flavor: "Gourmet Chocolate", price: 89.99, quantity: 1 },
          { id: "gold-shaker-insulated", name: "SIMO Premium Stainless Steel Shaker", size: "750 مل (25 أونصة)", flavor: "Luxury Gold", price: 39.99, quantity: 1 }
        ],
        total: 129.98,
        status: "Delivered"
      },
      {
        id: "ORD-1092",
        created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
        customer_name: "ياسين السيمو",
        email: "yassine@simo.com",
        phone: "+212698765432",
        address: "شارع محمد الخامس، رقم 45",
        city: "Rabat",
        items: [
          { id: "creapure-creatine", name: "SIMO Creapure Creatine Monohydrate", size: "500 جرام (100 جرعة)", flavor: "Unflavored", price: 34.99, quantity: 2 },
          { id: "gold-lever-belt-10mm", name: "SIMO Gold Edition 10mm Lever Belt", size: "Medium (32-38)", flavor: "Standard Black & Gold", price: 99.99, quantity: 1 }
        ],
        total: 169.97,
        status: "Pending"
      }
    ];
    localStorage.setItem("simo_orders", JSON.stringify(mockOrders));
    return mockOrders;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const saveLocalOrders = (orders: Order[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("simo_orders", JSON.stringify(orders));
  }
};

const getLocalSetting = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  const stored = localStorage.getItem(`simo_setting_${key}`);
  if (!stored) {
    localStorage.setItem(`simo_setting_${key}`, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultValue;
  }
};

const saveLocalSetting = <T>(key: string, value: T): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`simo_setting_${key}`, JSON.stringify(value));
  }
};

const DEFAULT_STORE_INFO: StoreInfo = {
  name: "SIMO PROTEIN",
  phone: "+212612345678",
  email: "info@simoprotein.com",
  address: "شارع الجيش الملكي، الدار البيضاء، المغرب"
};

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  whatsapp: "https://wa.me/212612345678",
  instagram: "https://instagram.com/simoprotein",
  facebook: "https://facebook.com/simoprotein",
  tiktok: "https://tiktok.com/@simoprotein"
};

const DEFAULT_BANNERS: HomepageBanner[] = [
  {
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200",
    title: "وقود القوة القصوى",
    subtitle: "مكملات غذائية ومعدات رياضية فاخرة مصممة للأبطال لتحقيق الأرقام القياسية"
  },
  {
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=1200",
    title: "نقاء 100% واي بروتين",
    subtitle: "بناء العضلات وسرعة الاستشفاء بأجود أنواع البروتين المعزول"
  }
];

// EXPORTED UNIFIED API (Checks Supabase first, falls back to LocalStorage)

// Products CRUD
export const dbGetProducts = async (): Promise<Product[]> => {
  if (supabase) {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      // map fields if necessary
      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        description: d.description || "",
        price: d.price,
        originalPrice: d.original_price || undefined,
        category: d.category,
        rating: d.rating || 5.0,
        reviewsCount: d.reviews_count || 0,
        image: d.image || "",
        sizes: d.sizes || [],
        flavors: d.flavors || [],
        benefits: d.benefits || [],
        ingredients: d.ingredients || [],
        isNew: d.is_new,
        isFeatured: d.is_featured,
        isBestSeller: d.is_best_seller,
        stock: d.stock || 0
      }));
    }
  }
  return getLocalProducts();
};

export const dbUpsertProduct = async (product: Product): Promise<boolean> => {
  if (supabase) {
    const payload = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.originalPrice || null,
      category: product.category,
      rating: product.rating,
      reviews_count: product.reviewsCount,
      image: product.image,
      sizes: product.sizes,
      flavors: product.flavors || [],
      benefits: product.benefits,
      ingredients: product.ingredients,
      is_new: product.isNew || false,
      is_featured: product.isFeatured || false,
      is_best_seller: product.isBestSeller || false,
      stock: product.stock
    };
    const { error } = await supabase.from("products").upsert(payload);
    if (!error) return true;
    console.error("Supabase upsert product error:", error);
  }
  
  // Local fallback
  const prods = getLocalProducts();
  const index = prods.findIndex(p => p.id === product.id);
  if (index > -1) {
    prods[index] = product;
  } else {
    prods.unshift(product);
  }
  saveLocalProducts(prods);
  return true;
};

export const dbDeleteProduct = async (id: string): Promise<boolean> => {
  if (supabase) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) return true;
    console.error("Supabase delete product error:", error);
  }
  const prods = getLocalProducts();
  const filtered = prods.filter(p => p.id !== id);
  saveLocalProducts(filtered);
  return true;
};

// Categories CRUD
export const dbGetCategories = async (): Promise<Category[]> => {
  if (supabase) {
    const { data, error } = await supabase.from("categories").select("*");
    if (!error && data) return data;
  }
  return getLocalCategories();
};

export const dbAddCategory = async (category: { name: string; slug: string; icon: string; bg_image?: string }): Promise<boolean> => {
  const id = `cat-${Date.now()}`;
  const newCat = { id, ...category };
  if (supabase) {
    const { error } = await supabase.from("categories").insert({
      id: newCat.id,
      name: newCat.name,
      slug: newCat.slug,
      icon: newCat.icon,
      bg_image: newCat.bg_image || ""
    });
    if (!error) return true;
  }
  const cats = getLocalCategories();
  cats.push(newCat);
  saveLocalCategories(cats);
  return true;
};

export const dbDeleteCategory = async (id: string): Promise<boolean> => {
  if (supabase) {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) return true;
  }
  const cats = getLocalCategories();
  const filtered = cats.filter((c: Category) => c.id !== id);
  saveLocalCategories(filtered);
  return true;
};

// Orders CRUD
export const dbGetOrders = async (): Promise<Order[]> => {
  if (supabase) {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        created_at: d.created_at,
        customer_name: d.customer_name,
        email: d.email || undefined,
        phone: d.phone,
        address: d.address,
        city: d.city,
        items: d.items,
        total: d.total,
        status: d.status
      }));
    }
  }
  return getLocalOrders();
};

export const dbCreateOrder = async (order: Omit<Order, "created_at" | "status">): Promise<Order> => {
  const newOrder: Order = {
    ...order,
    created_at: new Date().toISOString(),
    status: "Pending"
  };
  if (supabase) {
    const { error } = await supabase.from("orders").insert({
      id: newOrder.id,
      customer_name: newOrder.customer_name,
      email: newOrder.email || null,
      phone: newOrder.phone,
      address: newOrder.address,
      city: newOrder.city,
      items: newOrder.items,
      total: newOrder.total,
      status: newOrder.status
    });
    if (!error) return newOrder;
    console.error("Supabase insert order error:", error);
  }
  const orders = getLocalOrders();
  orders.unshift(newOrder);
  saveLocalOrders(orders);
  return newOrder;
};

export const dbUpdateOrderStatus = async (orderId: string, status: Order["status"]): Promise<boolean> => {
  if (supabase) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (!error) return true;
  }
  const orders = getLocalOrders();
  const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
  saveLocalOrders(updated);
  return true;
};

// Settings
export const dbGetStoreInfo = async (): Promise<StoreInfo> => {
  if (supabase) {
    const { data, error } = await supabase.from("settings").select("value").eq("key", "store_info").single();
    if (!error && data && data.value) return data.value as StoreInfo;
  }
  return getLocalSetting("store_info", DEFAULT_STORE_INFO);
};

export const dbSaveStoreInfo = async (info: StoreInfo): Promise<boolean> => {
  if (supabase) {
    const { error } = await supabase.from("settings").upsert({ key: "store_info", value: info, updated_at: new Date().toISOString() });
    if (!error) return true;
  }
  saveLocalSetting("store_info", info);
  return true;
};

export const dbGetSocialLinks = async (): Promise<SocialLinks> => {
  if (supabase) {
    const { data, error } = await supabase.from("settings").select("value").eq("key", "social_links").single();
    if (!error && data && data.value) return data.value as SocialLinks;
  }
  return getLocalSetting("social_links", DEFAULT_SOCIAL_LINKS);
};

export const dbSaveSocialLinks = async (links: SocialLinks): Promise<boolean> => {
  if (supabase) {
    const { error } = await supabase.from("settings").upsert({ key: "social_links", value: links, updated_at: new Date().toISOString() });
    if (!error) return true;
  }
  saveLocalSetting("social_links", links);
  return true;
};

export const dbGetBanners = async (): Promise<HomepageBanner[]> => {
  if (supabase) {
    const { data, error } = await supabase.from("settings").select("value").eq("key", "homepage_banners").single();
    if (!error && data && data.value) return data.value as HomepageBanner[];
  }
  return getLocalSetting("homepage_banners", DEFAULT_BANNERS);
};

export const dbSaveBanners = async (banners: HomepageBanner[]): Promise<boolean> => {
  if (supabase) {
    const { error } = await supabase.from("settings").upsert({ key: "homepage_banners", value: banners, updated_at: new Date().toISOString() });
    if (!error) return true;
  }
  saveLocalSetting("homepage_banners", banners);
  return true;
};

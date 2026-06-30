-- SQL SCHEMA FOR SIMO PROTEIN STORE --

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    bg_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DOUBLE PRECISION NOT NULL,
    original_price DOUBLE PRECISION,
    category TEXT NOT NULL,
    rating DOUBLE PRECISION DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    image TEXT,
    sizes TEXT[] DEFAULT '{}'::TEXT[],
    flavors DEFAULT '{}'::TEXT[],
    benefits TEXT[] DEFAULT '{}'::TEXT[],
    ingredients TEXT[] DEFAULT '{}'::TEXT[],
    is_new BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    items JSONB NOT NULL,
    total DOUBLE PRECISION NOT NULL,
    status TEXT DEFAULT 'Pending'::TEXT NOT NULL -- Pending, Shipped, Delivered, Cancelled
);

-- 4. Create Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable Row-Level Security (RLS) on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 6. Setup Public Read Access policies
CREATE POLICY "Allow public read access to categories" ON public.categories 
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to products" ON public.products 
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to settings" ON public.settings 
    FOR SELECT USING (true);

-- 7. Setup Public Order Insert Access policy
CREATE POLICY "Allow public to insert orders" ON public.orders 
    FOR INSERT WITH CHECK (true);

-- 8. Setup Full Access for Authenticated Admin Users
-- This allows admin to perform any CRUD operation
CREATE POLICY "Allow authenticated admin full access to categories" ON public.categories 
    USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin full access to products" ON public.products 
    USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin full access to orders" ON public.orders 
    USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin full access to settings" ON public.settings 
    USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 9. Insert Initial Core Settings
INSERT INTO public.settings (key, value) VALUES 
('store_info', '{"name": "SIMO PROTEIN", "phone": "+212612345678", "email": "info@simoprotein.com", "address": "شارع الجيش الملكي، الدار البيضاء، المغرب"}'),
('social_links', '{"whatsapp": "https://wa.me/212612345678", "instagram": "https://instagram.com/simoprotein", "facebook": "https://facebook.com/simoprotein", "tiktok": "https://tiktok.com/@simoprotein"}'),
('homepage_banners', '[
    {"image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200", "title": "وقود القوة القصوى", "subtitle": "مكملات غذائية ومعدات رياضية فاخرة مصممة للأبطال لتحقيق الأرقام القياسية"},
    {"image": "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=1200", "title": "نقاء 100% واي بروتين", "subtitle": "بناء العضلات وسرعة الاستشفاء بأجود أنواع البروتين المعزول"}
]')
ON CONFLICT (key) DO NOTHING;

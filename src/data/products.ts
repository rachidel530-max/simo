export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviewsCount: number;
  image: string;
  sizes: string[];
  flavors?: string[];
  benefits: string[];
  ingredients: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  stock: number;
}

export const categoriesList = [
  { name: "واي بروتين", slug: "whey-protein", icon: "⚡", bg: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=400" },
  { name: "بروتين معزول (Isolate)", slug: "isolate", icon: "💪", bg: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=400" },
  { name: "ماس جينر", slug: "mass-gainer", icon: "🔥", bg: "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=400" },
  { name: "كرياتين", slug: "creatine", icon: "💊", bg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400" },
  { name: "أحزمة رياضية", slug: "belts", icon: "🏋️‍♂️", bg: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=400" },
  { name: "إكسسوارات الجيم", slug: "accessories", icon: "🎒", bg: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400" }
];

export const products: Product[] = [
  {
    id: "whey-gold-standard",
    name: "Optimum Nutrition Whey Gold Standard",
    description: "واي بروتين جولد ستاندرد الأصلي، المكمل الغذائي الأكثر مبيعاً عالمياً لبناء العضلات الخالية من الدهون. يحتوي على 24 جراماً من البروتين النقي مع كميات ضئيلة من الدهون والكربوهيدرات لسرعة الاستشفاء العضلي بعد التمرين الشاق.",
    price: 79.99,
    originalPrice: 94.99,
    category: "واي بروتين",
    rating: 4.9,
    reviewsCount: 245,
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=600",
    sizes: ["900 جرام (2.0 رطل)", "2.27 كجم (5.0 رطل)"],
    flavors: ["Double Rich Chocolate", "Delicious Strawberry", "Vanilla Ice Cream"],
    benefits: [
      "يدعم البناء والاستشفاء العضلي السريع",
      "يمد العضلات بـ 24 جم من البروتين النقي لكل حصة",
      "يحتوي على أكثر من 5 جم من الأحماض الأمينية المتشعبة (BCAA)",
      "سريع الذوبان وسهل الهضم لامتصاص مثالي"
    ],
    ingredients: [
      "مزيج بروتين مصل الحليب (عزل، تركيز، ببتيدات)",
      "نكهات طبيعية واصطناعية",
      "ليسيثين الصويا لتسهيل الخلط",
      "سوكارلوز لتحلية خالية من السعرات"
    ],
    isFeatured: true,
    isBestSeller: true,
    stock: 35
  },
  {
    id: "iso100-hydrolyzed",
    name: "Dymatize ISO 100 Hydrolyzed",
    description: "أيزو 100 بروتين هيدرولايزد معزول ومحلل فائق النقاء لبناء العضلات بصفاء تام. خالٍ تماماً من اللاكتوز والدهون والجلوتين، سريع الامتصاص، ويعتبر الخيار الأول للرياضيين المحترفين الباحثين عن جودة لا تضاهى.",
    price: 89.99,
    originalPrice: 104.99,
    category: "بروتين معزول (Isolate)",
    rating: 4.95,
    reviewsCount: 312,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600",
    sizes: ["725 جرام (1.6 رطل)", "2.3 كجم (5.0 رطل)"],
    flavors: ["Gourmet Chocolate", "Fudge Brownie", "Smooth Banana"],
    benefits: [
      "25 جم من بروتين مصل الحليب المعزول والمحلل بنسبة 100%",
      "خالٍ تماماً من السكر والدهون واللاكتوز والجلوتين",
      "سرعة استشفاء فائقة بفضل الهضم الفوري للغاية",
      "مناسب جداً لفترات التنشيف الصارم للبطولات"
    ],
    ingredients: [
      "بروتين مصل الحليب المحلل والمعزول",
      "مسحوق الكاكاو المعالج بالقلويات",
      "ملح ونكهات طبيعية",
      "مستحلب ليسيثين الصويا"
    ],
    isFeatured: true,
    isBestSeller: true,
    stock: 20
  },
  {
    id: "serious-mass-gainer",
    name: "Optimum Nutrition Serious Mass",
    description: "سيريوس ماس جينر، التركيبة الأقوى لزيادة الوزن والكتلة العضلية للذين يعانون من صعوبة اكتساب الحجم. يحتوي على أكثر من 1250 سعرة حرارية و50 جراماً من البروتين لكل حصة لمد عضلاتك بالوقود الضخم.",
    price: 64.99,
    originalPrice: 79.99,
    category: "ماس جينر",
    rating: 4.7,
    reviewsCount: 189,
    image: "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=600",
    sizes: ["2.7 كجم (6.0 رطل)", "5.4 كجم (12.0 رطل)"],
    flavors: ["Chocolate Fudge", "Creamy Vanilla", "Banana Bread"],
    benefits: [
      "1250+ سعرة حرارية لتسهيل زيادة الوزن وبناء الكتلة",
      "50 جم من مزيج البروتينات المتنوعة لتغذية مستمرة",
      "أكثر من 250 جم من الكربوهيدرات المعقدة للطاقة والنشاط",
      "مدعم بـ 25 فيتاميناً ومعدناً أساسياً لتقوية الجسم"
    ],
    ingredients: [
      "مالتوديكسترين كمصدر رئيسي للكربوهيدرات المعقدة",
      "مزيج البروتينات (مصل الحليب، الكازين، زلال البيض)",
      "أحادي هيدرات الكرياتين النقي",
      "مزيج المعادن والفيتامينات الدقيقة"
    ],
    isFeatured: false,
    isBestSeller: true,
    stock: 15
  },
  {
    id: "creapure-creatine",
    name: "SIMO Creapure Creatine Monohydrate",
    description: "كرياتين مونوهيدرات نقي 100% مصنوع من أجود خامات Creapure الألمانية. المكمل الأكثر فاعلية لزيادة القوة الانفجارية، رفع الأداء الرياضي في التمارين عالية الكثافة، وزيادة الضخ العضلي المائي داخل الخلايا.",
    price: 34.99,
    originalPrice: 42.99,
    category: "كرياتين",
    rating: 4.98,
    reviewsCount: 420,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600",
    sizes: ["250 جرام (50 جرعة)", "500 جرام (100 جرعة)"],
    flavors: ["Unflavored", "Blue Raspberry", "Green Apple"],
    benefits: [
      "يزيد بشكل ملحوظ القوة العضلية والأداء الانفجاري",
      "يعزز تكوين الـ ATP لإعادة شحن العضلات بالطاقة فوراً",
      "خامات ميكرونية فائقة النقاوة تذوب بالماء بدون أي تكتل",
      "HPLC-Tested لضمان نقاء كيميائي بنسبة 100%"
    ],
    ingredients: [
      "100% مسحوق كرياتين مونوهيدرات ميكروني ألماني (Creapure)"
    ],
    isFeatured: true,
    isBestSeller: true,
    stock: 50
  },
  {
    id: "gold-lever-belt-10mm",
    name: "SIMO Gold Edition 10mm Lever Belt",
    description: "حزام رفع الأثقال الذهبي الاحترافي بسمك 10 ملم مع قفل رافعة فولاذي متين. مصنوع يدوياً من الجلد الطبيعي الممتاز لتوفير الدعم المطلق لأسفل الظهر أثناء تمارين السكوات والديدليفت الثقيلة.",
    price: 99.99,
    originalPrice: 129.99,
    category: "أحزمة رياضية",
    rating: 4.92,
    reviewsCount: 95,
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=600",
    sizes: ["Small (26-32)", "Medium (32-38)", "Large (38-44)"],
    flavors: ["Standard Black & Gold"],
    benefits: [
      "سمك 10 ملم مثالي للدعم دون إعاقة الحركة",
      "قفل رافعة فولاذي مطلي بالذهب قابل للتعديل لتثبيت فوري",
      "مصنوع من جلد البقر الطبيعي متعدد الطبقات لقوة تحمل قصوى",
      "تطريز ذهبي فاخر يمنحك مظهراً مميزاً وصارماً في الصالة"
    ],
    ingredients: [
      "جلد طبيعي ممتاز 100%",
      "قفل رافعة فولاذي معزز غير قابل للكسر",
      "تطريز بخيوط النايلون الذهبية المقاومة للاهتراء"
    ],
    isFeatured: true,
    isBestSeller: false,
    stock: 8
  },
  {
    id: "gold-shaker-insulated",
    name: "SIMO Premium Stainless Steel Shaker",
    description: "شيكر بروتين فاخر مصنوع من الفولاذ المقاوم للصدأ مزدوج الجدران والمعزول حرارياً لحفظ برودة مشروبك حتى 24 ساعة. مزود بغطاء ذهبي مانع للتسرب وشبكة خلط مدمجة لتجنب أي تكتلات.",
    price: 39.99,
    originalPrice: 49.99,
    category: "إكسسوارات الجيم",
    rating: 4.8,
    reviewsCount: 156,
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600",
    sizes: ["750 مل (25 أونصة)"],
    flavors: ["Matte Black", "Luxury Gold"],
    benefits: [
      "فولاذ مقاوم للصدأ صحي وخالٍ تماماً من البيسفينول (BPA)",
      "عزل حراري مزدوج يحافظ على المشروبات باردة طوال اليوم",
      "غطاء محكم الإغلاق يمنع أي تسريب تماماً أثناء الرج الصاخب",
      "لا يمتص الروائح الكريهة ويدوم مدى الحياة مقارنة بالشيكر البلاستيكي"
    ],
    ingredients: [
      "فولاذ مقاوم للصدأ درجة 18/8 مناسب للمواد الغذائية",
      "غطاء من مادة البولي بروبيلين الخالية من BPA"
    ],
    isFeatured: false,
    isBestSeller: false,
    stock: 40
  }
];

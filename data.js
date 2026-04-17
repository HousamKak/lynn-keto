// ============================================================
// LYNN KETO — Bilingual data (ar / en)
// ============================================================

const PERSON = {
  name: "LYNN HAMAD",
  weight: 63,
  height: 163,
  age: 21,
  gender: { ar: "أنثى", en: "Female" },
  bmi: 23.71,
  ibw: 55.41,
  waterCupsPerDay: 8,
  durationDays: 28
};

// Reusable fragments
const NUTS = { ar: "6 لوز / 12 فستق حلبي / 10 فول سوداني / 6 بندق", en: "6 almonds / 12 pistachios / 10 peanuts / 6 hazelnuts" };
const OLIVES_10_8 = { ar: "10 زيتون أخضر / 8 زيتون أسود", en: "10 green olives / 8 black olives" };
const OLIVES_10_6 = { ar: "10 زيتون أخضر / 6 زيتون أسود", en: "10 green olives / 6 black olives" };
const SALAD_2TSP  = { ar: "+ كوب سلطة مع 2 ملعقة صغيرة زيت", en: "+ 1 cup salad with 2 tsp oil" };
const SALAD_3TSP  = { ar: "+ كوب سلطة مع 3 ملعقة صغيرة زيت", en: "+ 1 cup salad with 3 tsp oil" };

const VEGETABLES = [
  { ar:"السبانخ", en:"Spinach" },{ ar:"الهليون", en:"Asparagus" },
  { ar:"الباذنجان", en:"Eggplant" },{ ar:"البندورة", en:"Tomato" },
  { ar:"الفطر", en:"Mushroom" },{ ar:"الخس", en:"Lettuce" },
  { ar:"الزهرة (القرنبيط)", en:"Cauliflower" },{ ar:"الخيار", en:"Cucumber" },
  { ar:"الكايل", en:"Kale" },{ ar:"الكرفس", en:"Celery" },
  { ar:"البصل الأخضر", en:"Green onion" },{ ar:"الكوسى", en:"Zucchini" },
  { ar:"الملفوف", en:"Cabbage" },{ ar:"البروكلي", en:"Broccoli" },
  { ar:"النعناع", en:"Mint" },{ ar:"الزنجبيل", en:"Ginger" },
  { ar:"الفلفل الأخضر", en:"Green pepper" },{ ar:"الزعتر (ملعقة طعام)", en:"Thyme (1 tbsp)" }
];

const SAUCES = [
  { name:{ar:"المايونيز",en:"Mayonnaise"}, qty:{ar:"حسب الكميات المذكورة لاحقاً",en:"As specified below"} },
  { name:{ar:"الصويا صوص (Kikoman)",en:"Soy sauce (Kikoman)"}, qty:{ar:"ملعقتا طعام فقط",en:"2 tbsp only"} },
  { name:{ar:"RANCH رانش",en:"Ranch"}, qty:{ar:"ملعقتا طعام فقط",en:"2 tbsp only"} },
  { name:{ar:"الحامض (الليمون)",en:"Lemon juice"}, qty:{ar:"ملعقتا طعام فقط",en:"2 tbsp only"} },
  { name:{ar:"الخردل",en:"Mustard"}, qty:{ar:"ملعقتا طعام فقط",en:"2 tbsp only"} },
  { name:{ar:"الخل الأبيض",en:"White vinegar"}, qty:{ar:"حسب الحاجة",en:"As needed"} },
  { name:{ar:"الخل البلسميك",en:"Balsamic vinegar"}, qty:{ar:"ملعقة طعام فقط",en:"1 tbsp only"} },
  { name:{ar:"الصلصة",en:"Tomato sauce"}, qty:{ar:"1/4 كوب",en:"1/4 cup"} }
];

const DRINKS = [
  { ar:"المياه مع الحامض (ملعقة طعام) والسكر الاصطناعي", en:"Water with lemon (1 tbsp) + artificial sweetener" },
  { ar:"الشاي الأخضر بالنعناع", en:"Green tea with mint" },
  { ar:"اليانسون", en:"Anise" },
  { ar:"الشاي / الشاي بالنعناع", en:"Tea / tea with mint" },
  { ar:"البابونج", en:"Chamomile" },
  { ar:"الزنجبيل", en:"Ginger tea" },
  { ar:"القهوة", en:"Coffee" },
  { ar:"كوب من حليب اللوز غير المحلى", en:"1 cup unsweetened almond milk" },
  { ar:"كوب من حليب جوز الهند غير المحلى", en:"1 cup unsweetened coconut milk" },
  { ar:"المياه الغازية", en:"Sparkling water" },
  { ar:"المشروبات الغازية دايت (كوب)", en:"Diet soda (1 cup)" }
];

// ---------- BREAKFAST (11) ----------
const BREAKFAST = [
  { id:"b1", num:{ar:"الأول",en:"First"}, items:[
    {ar:"1 بيضة مسلوقة (بيض + ملح + قرفة)", en:"1 boiled egg (egg + salt + cinnamon)"},
    OLIVES_10_8, NUTS
  ]},
  { id:"b2", num:{ar:"الثاني",en:"Second"}, items:[
    {ar:"1 بيضة مع سبانخ وفلفل حلو", en:"1 egg with spinach and bell pepper"},
    {ar:"1 ملعقة صغيرة زيت / زبدة", en:"1 tsp oil / butter"},
    NUTS
  ]},
  { id:"b3", num:{ar:"الثالث",en:"Third"}, items:[
    {ar:"1 بيضة + 1 مكدوس", en:"1 egg + 1 makdous (pickled eggplant)"},
    NUTS
  ]},
  { id:"b4", num:{ar:"الرابع",en:"Fourth"}, items:[
    {ar:"1 بيضة مع فطر", en:"1 egg with mushrooms"},
    {ar:"1 ملعقة صغيرة زيت / زبدة", en:"1 tsp oil / butter"},
    NUTS
  ]},
  { id:"b5", num:{ar:"الخامس",en:"Fifth"}, items:[
    {ar:"2 شرائح حبش + 1 شريحة جبنة", en:"2 turkey slices + 1 cheese slice"},
    OLIVES_10_6, NUTS
  ]},
  { id:"b6", num:{ar:"السادس",en:"Sixth"}, items:[
    {ar:"2 شرائح مرتديلا ملفوفة بالخس + 1 ملعقة صغيرة مايونيز", en:"2 mortadella slices wrapped in lettuce + 1 tsp mayo"},
    NUTS
  ]},
  { id:"b7", num:{ar:"السابع",en:"Seventh"}, items:[
    {ar:"30 غرام حلومي + 1 ملعقة صغيرة زيت / زبدة", en:"30g halloumi + 1 tsp oil / butter"},
    NUTS
  ]},
  { id:"b8", num:{ar:"الثامن",en:"Eighth"}, items:[
    {ar:"2 شرائح حبش ملفوفة بالخس + 1 ملعقة صغيرة مايونيز", en:"2 turkey slices wrapped in lettuce + 1 tsp mayo"},
    NUTS
  ]},
  { id:"b9", num:{ar:"التاسع",en:"Ninth"}, items:[
    {ar:"2 شرائح مرتديلا + 1 شريحة جبنة (مع هاليبينوس وفلفل حلو)", en:"2 mortadella slices + 1 cheese slice (with jalapeño & bell pepper)"},
    OLIVES_10_8, NUTS
  ]},
  { id:"b10", num:{ar:"العاشر",en:"Tenth"}, items:[
    {ar:"1 بيضة + 1/3 أفوكادو", en:"1 egg + 1/3 avocado"}
  ]},
  { id:"b11", num:{ar:"الحادي عشر",en:"Eleventh"}, items:[
    {ar:"2 ملعقة طعام لبنة", en:"2 tbsp labneh"},
    OLIVES_10_8, NUTS
  ]}
];

// ---------- LUNCH (20) ----------
const LUNCH = [
  { id:"l1", num:{ar:"الأول",en:"First"}, title:{ar:"ستيك بالجبنة",en:"Cheesy steak"}, items:[
    {ar:"90 غرام ستيك مشوي (ملح وبهار) على نار خفيفة", en:"90g grilled steak (salt & pepper) on low heat"},
    {ar:"1 ملعقة صغيرة زيت/زبدة (تُضاف عند الانتهاء)", en:"1 tsp oil/butter (added at end)"},
    {ar:"2 شرائح جبنة تُترك حتى تذوب ثم ملح وفلفل أسود", en:"2 cheese slices until melted + salt & black pepper"},
    {ar:"2 ملعقة صغيرة مايونيز", en:"2 tsp mayonnaise"},
    SALAD_2TSP
  ]},
  { id:"l2", num:{ar:"الثاني",en:"Second"}, title:{ar:"ستيك بكريمة الفطر",en:"Steak with mushroom cream"}, items:[
    {ar:"120 غرام ستيك مشوي", en:"120g grilled steak"},
    {ar:"5 ملعقة طعام كريمة طبخ كاملة الدسم", en:"5 tbsp full-fat cooking cream"},
    {ar:"2 ملعقة صغيرة زيت / زبدة", en:"2 tsp oil / butter"},
    {ar:"أضيفي الستيك مع الفطر (ملح وبهار)، ثم كريمة الطبخ لثوانٍ", en:"Add steak with mushrooms (salt & pepper), then cooking cream for a few seconds"}
  ]},
  { id:"l3", num:{ar:"الثالث",en:"Third"}, title:{ar:"برغر دجاج/لحمة مع الملفوف",en:"Chicken/beef burger with coleslaw"}, items:[
    {ar:"90 غرام دجاج/لحمة البرغر", en:"90g chicken/beef burger"},
    {ar:"1 شريحة جبنة (لتذوب فوقها)", en:"1 cheese slice (melted on top)"},
    {ar:"1 ملعقة صغيرة زيت/زبدة", en:"1 tsp oil/butter"},
    {ar:"+ سلطة ملفوف: ملفوف + 5 ملعقة صغيرة مايونيز + قليل من السكر الاصطناعي + قليل من الخل + رشة ملح", en:"+ Coleslaw: cabbage + 5 tsp mayo + a little artificial sweetener + a little vinegar + pinch of salt"}
  ], note:{ar:"الدجاج غير مغطى بالكعك.",en:"Chicken not coated in breading."}},
  { id:"l4", num:{ar:"الرابع",en:"Fourth"}, title:{ar:"صدر دجاج مشوي مع الفطر",en:"Grilled chicken breast with mushrooms"}, items:[
    {ar:"120 غرام صدر دجاج مشوي", en:"120g grilled chicken breast"},
    {ar:"1 ملعقة صغيرة زيت/زبدة", en:"1 tsp oil/butter"},
    {ar:"مع الفطر الطبيعي (ملح وبهار) وصوص الثوم", en:"With fresh mushrooms (salt & pepper) and garlic sauce"},
    {ar:"+ كوب سلطة مع 1 و 1/2 ملعقة طعام زيت", en:"+ 1 cup salad with 1½ tbsp oil"}
  ]},
  { id:"l5", num:{ar:"الخامس",en:"Fifth"}, title:{ar:"شاورما لحم",en:"Beef shawarma"}, items:[
    {ar:"120 غرام لحمة شاورما", en:"120g beef shawarma"},
    {ar:"انقعي مع: خل + بهار شاورما + 1 ملعقة صغيرة زيت + ملح + بهار أسود + سبع بهارات + بصل", en:"Marinate with: vinegar + shawarma spice + 1 tsp oil + salt + black pepper + seven-spice blend + onion"},
    {ar:"ضعي في البراد 12 ساعة على الأقل، ثم اشويها على نار خفيفة", en:"Refrigerate at least 12 hours, then cook on low heat"},
    {ar:"2 ملعقة طعام طراطور", en:"2 tbsp tahini sauce (taratour)"},
    SALAD_3TSP
  ]},
  { id:"l6", num:{ar:"السادس",en:"Sixth"}, title:{ar:"شاورما دجاج",en:"Chicken shawarma"}, items:[
    {ar:"120 غرام دجاج شاورما", en:"120g chicken shawarma"},
    {ar:"انقعي مع: خل + بهار شاورما + 1 ملعقة صغيرة زيت + ملح + بهار أسود + سبع بهارات + ثوم", en:"Marinate with: vinegar + shawarma spice + 1 tsp oil + salt + black pepper + seven-spice blend + garlic"},
    {ar:"ضعي في البراد 12 ساعة على الأقل، ثم اشويها على نار خفيفة", en:"Refrigerate at least 12 hours, then cook on low heat"},
    {ar:"2 ملعقة طعام صوص الثوم", en:"2 tbsp garlic sauce"},
    SALAD_2TSP
  ]},
  { id:"l7", num:{ar:"السابع",en:"Seventh"}, title:{ar:"فروج مشوي على الفحم",en:"Charcoal grilled chicken"}, items:[
    {ar:"1/2 فروج مشوي على الفحم", en:"1/2 charcoal grilled chicken"},
    {ar:"2 ملعقة طعام صوص الثوم", en:"2 tbsp garlic sauce"},
    SALAD_2TSP
  ]},
  { id:"l8", num:{ar:"الثامن",en:"Eighth"}, title:{ar:"سلطة سيزر بالدجاج",en:"Chicken Caesar salad"}, items:[
    {ar:"90 غرام دجاج", en:"90g chicken"},
    {ar:"5 ملعقة طعام صوص السيزر", en:"5 tbsp Caesar dressing"},
    {ar:"30 غرام جبنة مبروشة", en:"30g grated cheese"}
  ]},
  { id:"l9", num:{ar:"التاسع",en:"Ninth"}, title:{ar:"شيش طاووق",en:"Shish taouk"}, items:[
    {ar:"120 غرام شيش طاووق (منزلي أو جاهز)", en:"120g shish taouk (homemade or ready)"},
    {ar:"2 ملعقة طعام صوص الثوم", en:"2 tbsp garlic sauce"},
    SALAD_2TSP
  ]},
  { id:"l10", num:{ar:"العاشر",en:"Tenth"}, title:{ar:"لحمة مشوية",en:"Grilled beef"}, items:[
    {ar:"120 غرام لحمة مشوية (منزلية أو جاهزة)", en:"120g grilled beef (homemade or ready)"},
    {ar:"2 ملعقة طعام حمص/متبل باذنجان", en:"2 tbsp hummus / baba ghanoush"},
    SALAD_3TSP
  ]},
  { id:"l11", num:{ar:"الحادي عشر",en:"Eleventh"}, title:{ar:"كفتة مشوية",en:"Grilled kofta"}, items:[
    {ar:"120 غرام كفتة مشوية", en:"120g grilled kofta"},
    {ar:"2 ملعقة طعام حمص/متبل باذنجان", en:"2 tbsp hummus / baba ghanoush"},
    SALAD_3TSP
  ]},
  { id:"l12", num:{ar:"الثاني عشر",en:"Twelfth"}, title:{ar:"تاكو بالخس",en:"Lettuce tacos"}, items:[
    {ar:"90 غرام لحمة مفرومة", en:"90g ground beef"},
    {ar:"1 ملعقة صغيرة زيت / زبدة", en:"1 tsp oil / butter"},
    {ar:"1/3 أفوكادو", en:"1/3 avocado"},
    {ar:"1/4 كوب جبنة مبروشة", en:"1/4 cup grated cheese"},
    {ar:"1/4 كوب صوص تاكو + بندورة + خس", en:"1/4 cup taco sauce + tomato + lettuce"}
  ]},
  { id:"l13", num:{ar:"الثالث عشر",en:"Thirteenth"}, title:{ar:"فاهيتا بالخس",en:"Lettuce fajita"}, items:[
    {ar:"120 غرام فاهيتا (بصل + فطر + فلفل حلو مقطعة)", en:"120g fajita (diced onion + mushrooms + bell pepper)"},
    {ar:"1 ملعقة صغيرة زيت/زبدة للخضار", en:"1 tsp oil/butter for vegetables"},
    {ar:"1 ملعقة صغيرة زيت/زبدة للدجاج المقطع", en:"1 tsp oil/butter for diced chicken"},
    {ar:"بهار الفاهيتا + بهار الثوم + بهار أسود", en:"Fajita seasoning + garlic powder + black pepper"},
    {ar:"1/2 أفوكادو", en:"1/2 avocado"}
  ]},
  { id:"l14", num:{ar:"الرابع عشر",en:"Fourteenth"}, title:{ar:"فيلي ستيك بالخس",en:"Philly cheesesteak lettuce wrap"}, items:[
    {ar:"90 غرام ستيك مقطع شرائح رفيعة", en:"90g thinly sliced steak"},
    {ar:"1 ملعقة صغيرة زيت/زبدة للخضار + 1 ملعقة صغيرة للستيك", en:"1 tsp oil/butter for vegetables + 1 tsp for steak"},
    {ar:"بصل + فلفل حلو + بهار الفيلادلفيا + ملح + بهار أسود", en:"Onion + bell pepper + Philadelphia seasoning + salt + black pepper"},
    {ar:"1 شريحة جبنة تذوب فوق الستيك", en:"1 cheese slice melted over the steak"},
    {ar:"4 ملعقة صغيرة مايونيز", en:"4 tsp mayonnaise"}
  ]},
  { id:"l15", num:{ar:"الخامس عشر",en:"Fifteenth"}, title:{ar:"سلطة التونا",en:"Tuna salad"}, items:[
    {ar:"120 غرام تونا", en:"120g tuna"},
    {ar:"كوب خس مقطع + 1/4 كوب فلفل حلو مقطع", en:"1 cup chopped lettuce + 1/4 cup chopped bell pepper"},
    {ar:"8 زيتون أسود + 1/4 كوب بصل أخضر", en:"8 black olives + 1/4 cup green onion"},
    {ar:"5 ملعقة صغيرة مايونيز + ملح + بهار", en:"5 tsp mayonnaise + salt + pepper"}
  ]},
  { id:"l16", num:{ar:"السادس عشر",en:"Sixteenth"}, title:{ar:"سمك فيليه",en:"Fish fillet"}, items:[
    {ar:"120 غرام سمك فيليه", en:"120g fish fillet"},
    {ar:"انقعيه ساعة مع ثوم + 1 ملعقة طعام زيت + 1 ملعقة صغيرة بهار الحبق + ملح + بهار أسود + حامض + بقدونس مفروم", en:"Marinate 1 hour with garlic + 1 tbsp oil + 1 tsp basil + salt + black pepper + lemon + chopped parsley"},
    {ar:"1 ملعقة صغيرة زيت/زبدة في الوعاء", en:"1 tsp oil/butter in the pan"},
    {ar:"2 ملعقة طعام طراطور", en:"2 tbsp tahini sauce (taratour)"},
    SALAD_2TSP
  ]},
  { id:"l17", num:{ar:"السابع عشر",en:"Seventeenth"}, title:{ar:"قريدس (روبيان)",en:"Shrimp"}, items:[
    {ar:"120 غرام قريدس", en:"120g shrimp"},
    {ar:"انقعيه ساعة مع ثوم + 1 ملعقة طعام زيت + 1 ملعقة صغيرة بهار حبق + ملح + بهار + حر + 1 ملعقة طعام صلصة طماطم + 1 ملعقة طعام خل أحمر", en:"Marinate 1 hour with garlic + 1 tbsp oil + 1 tsp basil + salt + pepper + chili + 1 tbsp tomato sauce + 1 tbsp red vinegar"},
    {ar:"1 ملعقة صغيرة زيت/زبدة في الوعاء، ثم الفرن", en:"1 tsp oil/butter in pan, then oven"},
    SALAD_2TSP
  ]},
  { id:"l18", num:{ar:"الثامن عشر",en:"Eighteenth"}, title:{ar:"سلطة الكراب/السلمون والأفوكادو",en:"Crab/salmon & avocado salad"}, items:[
    {ar:"120 غرام كراب أو سلمون", en:"120g crab or salmon"},
    {ar:"3 ملعقة صغيرة مايونيز + ملعقة طعام حامض + ملعقة صغيرة كمون + 1/2 ملعقة صغيرة بابريكا", en:"3 tsp mayonnaise + 1 tbsp lemon + 1 tsp cumin + 1/2 tsp paprika"},
    {ar:"ملح وبهار", en:"Salt and pepper"},
    {ar:"2/3 أفوكادو مكعبات", en:"2/3 avocado diced"}
  ]},
  { id:"l19", num:{ar:"التاسع عشر",en:"Nineteenth"}, title:{ar:"كلمار",en:"Calamari"}, items:[
    {ar:"120 غرام سمك الكلمار", en:"120g calamari"},
    {ar:"انقعيه ساعة مع ثوم + 3 ملعقة صغيرة زيت + 1 ملعقة صغيرة بهار حبق + ملح + بهار أسود + حامض + حر", en:"Marinate 1 hour with garlic + 3 tsp oil + 1 tsp basil + salt + black pepper + lemon + chili"},
    {ar:"1 ملعقة صغيرة زيت/زبدة في الوعاء، ثم الفرن", en:"1 tsp oil/butter in pan, then oven"},
    SALAD_2TSP
  ]},
  { id:"l20", num:{ar:"العشرون",en:"Twentieth"}, title:{ar:"ساشيمي",en:"Sashimi"}, items:[
    {ar:"120 غرام ساشيمي سلمون أو تونا", en:"120g salmon or tuna sashimi"},
    {ar:"3/4 أفوكادو", en:"3/4 avocado"},
    SALAD_2TSP
  ]}
];

// ---------- DINNER (same as breakfast) ----------
const DINNER = BREAKFAST.map(b => ({ ...b, id: "d" + b.id.slice(1) }));

// ---------- SNACK 1 (7) ----------
const SNACK1 = [
  { id:"s1-1", num:{ar:"الأول",en:"First"}, items:[{ar:"كوب من الجلو لايت (Jello diet)",en:"1 cup Jello diet"}] },
  { id:"s1-4", num:{ar:"الرابع",en:"Fourth"}, items:[{ar:"3 علكات خالية من السكر محلاة بالـ xylitol",en:"3 pieces sugar-free gum sweetened with xylitol"}] },
  { id:"s1-5", num:{ar:"الخامس",en:"Fifth"}, items:[{ar:"3 حلوى (بونبون) خالية من السكر محلاة بالـ xylitol",en:"3 sugar-free candies (bon-bons) sweetened with xylitol"}] },
  { id:"s1-6", num:{ar:"السادس",en:"Sixth"}, items:[
    {ar:"1 شوكولا كاندريل dark (هذا النوع هو المسموح فقط)", en:"1 Canderel dark chocolate (this type only)"},
    {ar:"أو شوكولا 20 غرام Lindt 85% or 90% cocoa", en:"Or 20g Lindt 85% or 90% cocoa chocolate"}
  ]},
  { id:"s1-7", num:{ar:"السابع",en:"Seventh"}, items:[{ar:"2 ملعقة صغيرة كوفي مايت كامل الدسم + نسكافيه",en:"2 tsp full-fat Coffee-Mate + Nescafé"}] },
  { id:"s1-8", num:{ar:"الثامن",en:"Eighth"}, items:[{ar:"1/4 كوب فراولة أو توت بري + 1 ملعقة طعام كريمة خالية من السكر",en:"1/4 cup strawberries or cranberries + 1 tbsp sugar-free cream"}] }
];

// ---------- SNACK 2 (6) ----------
const SNACK2 = [
  { id:"s2-1", num:{ar:"الأول",en:"First"}, items:[{ar:"1/2 كوب من بزر دوار الشمس",en:"1/2 cup sunflower seeds"}] },
  { id:"s2-2", num:{ar:"الثاني",en:"Second"}, items:[{ar:"10 حبات فول سوداني",en:"10 peanuts"}] },
  { id:"s2-3", num:{ar:"الثالث",en:"Third"}, items:[{ar:"16 حبة لوز",en:"16 almonds"}] },
  { id:"s2-4", num:{ar:"الرابع",en:"Fourth"}, items:[{ar:"20 حبة فستق حلبي",en:"20 pistachios"}] },
  { id:"s2-5", num:{ar:"الخامس",en:"Fifth"}, items:[{ar:"4 ملعقة صغيرة زبدة الفول السوداني",en:"4 tsp peanut butter"}] },
  { id:"s2-6", num:{ar:"السادس",en:"Sixth"}, items:[{ar:"12 حبة بندق",en:"12 hazelnuts"}] }
];

// ---------- Fat exchange ----------
const FAT_EXCHANGE = [
  [{ar:"زيتون أخضر",en:"Green olives"}, {ar:"10 حبات",en:"10 pieces"}],
  [{ar:"زيتون أسود",en:"Black olives"}, {ar:"8 حبات",en:"8 pieces"}],
  [{ar:"لوز",en:"Almonds"}, {ar:"6 حبات",en:"6 pieces"}],
  [{ar:"بندق",en:"Hazelnuts"}, {ar:"6 حبات",en:"6 pieces"}],
  [{ar:"فول سوداني",en:"Peanuts"}, {ar:"10 حبات",en:"10 pieces"}],
  [{ar:"فستق حلبي",en:"Pistachios"}, {ar:"12 حبة",en:"12 pieces"}],
  [{ar:"زيت",en:"Oil"}, {ar:"1 ملعقة صغيرة",en:"1 tsp"}],
  [{ar:"زبدة",en:"Butter"}, {ar:"1 ملعقة صغيرة",en:"1 tsp"}],
  [{ar:"صنوبر",en:"Pine nuts"}, {ar:"30 حبة",en:"30 pieces"}],
  [{ar:"سمسم",en:"Sesame"}, {ar:"1 ملعقة طعام",en:"1 tbsp"}],
  [{ar:"بذور الشيا",en:"Chia seeds"}, {ar:"1 ملعقة شاي",en:"1 tsp"}],
  [{ar:"بذور الفلاكس",en:"Flax seeds"}, {ar:"1 ملعقة طعام",en:"1 tbsp"}],
  [{ar:"مايونيز",en:"Mayonnaise"}, {ar:"1 ملعقة صغيرة",en:"1 tsp"}],
  [{ar:"صوص بستو",en:"Pesto sauce"}, {ar:"1 ملعقة صغيرة",en:"1 tsp"}]
];

// ---------- Shopping list ----------
const SHOPPING = [
  { title:{ar:"🥬 الخضار المسموحة",en:"🥬 Allowed vegetables"}, items:[
    {ar:"سبانخ",en:"Spinach"},{ar:"هليون",en:"Asparagus"},{ar:"باذنجان",en:"Eggplant"},
    {ar:"بندورة (طماطم)",en:"Tomato"},{ar:"فطر (مشروم)",en:"Mushroom"},{ar:"خس",en:"Lettuce"},
    {ar:"زهرة (قرنبيط)",en:"Cauliflower"},{ar:"خيار",en:"Cucumber"},{ar:"كايل",en:"Kale"},
    {ar:"كرفس",en:"Celery"},{ar:"بصل أخضر",en:"Green onion"},{ar:"بصل أبيض",en:"White onion"},
    {ar:"كوسى",en:"Zucchini"},{ar:"ملفوف (أبيض)",en:"White cabbage"},{ar:"بروكلي",en:"Broccoli"},
    {ar:"نعناع طازج",en:"Fresh mint"},{ar:"زنجبيل طازج",en:"Fresh ginger"},{ar:"فلفل أخضر",en:"Green pepper"},
    {ar:"فلفل حلو (أحمر)",en:"Red bell pepper"},{ar:"زعتر أخضر",en:"Fresh thyme"},
    {ar:"هاليبينو (فلفل حار)",en:"Jalapeño"},{ar:"ثوم",en:"Garlic"},{ar:"بقدونس",en:"Parsley"},
    {ar:"ليمون (حامض)",en:"Lemon"}
  ]},
  { title:{ar:"🥩 اللحوم والدواجن والأسماك",en:"🥩 Meat, poultry & fish"}, items:[
    {ar:"بيض",en:"Eggs"},{ar:"لحم ستيك (بقري)",en:"Beef steak"},{ar:"لحمة مفرومة",en:"Ground beef"},
    {ar:"لحمة بلرغ",en:"Burger beef"},{ar:"صدر دجاج",en:"Chicken breast"},{ar:"فخاذ دجاج",en:"Chicken thighs"},
    {ar:"أجنحة دجاج",en:"Chicken wings"},{ar:"فروج كامل",en:"Whole chicken"},{ar:"لحمة شاورما",en:"Beef shawarma meat"},
    {ar:"دجاج شاورما",en:"Chicken shawarma meat"},{ar:"كفتة",en:"Kofta"},{ar:"شيش طاووق",en:"Shish taouk"},
    {ar:"سمك فيليه",en:"Fish fillet"},{ar:"سمك سلمون",en:"Salmon"},{ar:"ساشيمي سلمون / تونا",en:"Salmon / tuna sashimi"},
    {ar:"تونا معلبة",en:"Canned tuna"},{ar:"قريدس (روبيان)",en:"Shrimp"},{ar:"كلمار (حبار)",en:"Calamari"},
    {ar:"كراب (سرطان البحر)",en:"Crab"},{ar:"شرائح حبش (ديك رومي مدخن)",en:"Smoked turkey slices"},
    {ar:"شرائح مرتديلا",en:"Mortadella slices"}
  ]},
  { title:{ar:"🧀 الأجبان ومنتجات الألبان",en:"🧀 Cheese & dairy"}, items:[
    {ar:"جبنة قشقوان",en:"Kashkaval cheese"},{ar:"جبنة تشيدر",en:"Cheddar cheese"},
    {ar:"جبنة عكاوي",en:"Akkawi cheese"},{ar:"جبنة دوبل كريم",en:"Double cream cheese"},
    {ar:"جبنة فيتا",en:"Feta cheese"},{ar:"جبنة موزاريلا",en:"Mozzarella cheese"},
    {ar:"جبنة كريمية (فيلادلفيا)",en:"Cream cheese (Philadelphia)"},{ar:"جبنة مبروشة (بارميزان)",en:"Grated cheese (Parmesan)"},
    {ar:"جبنة حلومي",en:"Halloumi cheese"},{ar:"لبنة",en:"Labneh"},
    {ar:"كريمة طبخ كاملة الدسم",en:"Full-fat cooking cream"},{ar:"كريمة خالية من السكر",en:"Sugar-free cream"}
  ]},
  { title:{ar:"🥜 المكسرات والبذور",en:"🥜 Nuts & seeds"}, items:[
    {ar:"لوز",en:"Almonds"},{ar:"فستق حلبي",en:"Pistachios"},{ar:"فول سوداني",en:"Peanuts"},
    {ar:"بندق",en:"Hazelnuts"},{ar:"صنوبر",en:"Pine nuts"},{ar:"بزر دوار الشمس",en:"Sunflower seeds"},
    {ar:"سمسم",en:"Sesame"},{ar:"بذور الشيا",en:"Chia seeds"},{ar:"بذور الفلاكس (الكتان)",en:"Flax seeds"},
    {ar:"زبدة الفول السوداني",en:"Peanut butter"}
  ]},
  { title:{ar:"🫒 الزيتون والزيوت والدهون",en:"🫒 Olives, oils & fats"}, items:[
    {ar:"زيتون أخضر",en:"Green olives"},{ar:"زيتون أسود",en:"Black olives"},
    {ar:"زيت زيتون",en:"Olive oil"},{ar:"زبدة",en:"Butter"}
  ]},
  { title:{ar:"🥣 الصلصات والتوابل",en:"🥣 Sauces & spices"}, items:[
    {ar:"مايونيز كامل الدسم",en:"Full-fat mayonnaise"},{ar:"صويا صوص Kikoman",en:"Kikkoman soy sauce"},
    {ar:"صوص رانش (Ranch)",en:"Ranch dressing"},{ar:"خردل",en:"Mustard"},{ar:"خل أبيض",en:"White vinegar"},
    {ar:"خل بلسميك",en:"Balsamic vinegar"},{ar:"خل أحمر",en:"Red vinegar"},{ar:"صلصة طماطم",en:"Tomato sauce"},
    {ar:"صوص الثوم",en:"Garlic sauce"},{ar:"صوص السيزر",en:"Caesar dressing"},{ar:"صوص طراطور",en:"Tahini sauce (taratour)"},
    {ar:"صوص بستو (Pesto)",en:"Pesto sauce"},{ar:"صوص تاكو",en:"Taco sauce"},{ar:"ملح",en:"Salt"},
    {ar:"فلفل أسود",en:"Black pepper"},{ar:"فلفل أحمر حار (شطة)",en:"Chili pepper"},
    {ar:"بهار شاورما",en:"Shawarma seasoning"},{ar:"سبع بهارات",en:"Seven-spice blend"},
    {ar:"بهار الفاهيتا",en:"Fajita seasoning"},{ar:"بهار الثوم",en:"Garlic powder"},
    {ar:"بهار الفيلادلفيا",en:"Philadelphia seasoning"},{ar:"بابريكا",en:"Paprika"},{ar:"كمون",en:"Cumin"},
    {ar:"قرفة",en:"Cinnamon"},{ar:"بهار الحبق",en:"Basil seasoning"},{ar:"متبل الحمص",en:"Hummus"},
    {ar:"متبل الباذنجان",en:"Baba ghanoush"},{ar:"مكدوس",en:"Makdous (pickled eggplant)"}
  ]},
  { title:{ar:"☕ المشروبات",en:"☕ Drinks"}, items:[
    {ar:"شاي أخضر",en:"Green tea"},{ar:"شاي أسود",en:"Black tea"},{ar:"يانسون",en:"Anise"},
    {ar:"بابونج",en:"Chamomile"},{ar:"قهوة",en:"Coffee"},{ar:"نسكافيه",en:"Nescafé"},
    {ar:"كوفي مايت كامل الدسم",en:"Full-fat Coffee-Mate"},{ar:"حليب اللوز غير المحلى",en:"Unsweetened almond milk"},
    {ar:"حليب جوز الهند غير المحلى",en:"Unsweetened coconut milk"},{ar:"مياه غازية (صودا)",en:"Sparkling water (soda)"},
    {ar:"مشروبات غازية دايت",en:"Diet sodas"},
    {ar:"سكر اصطناعي (Canderel/Sucralose)",en:"Artificial sweetener (Canderel/Sucralose)"}
  ]},
  { title:{ar:"🍓 الفواكه المسموحة",en:"🍓 Allowed fruits"}, items:[
    {ar:"أفوكادو",en:"Avocado"},{ar:"فراولة",en:"Strawberries"},{ar:"توت بري",en:"Cranberries"}
  ]},
  { title:{ar:"🍫 السناكات والمنتجات الخاصة",en:"🍫 Special snacks"}, items:[
    {ar:"جلو لايت (Jelly Diet)",en:"Jello Diet"},
    {ar:"علكة خالية من السكر محلاة بالـ Xylitol",en:"Sugar-free gum with Xylitol"},
    {ar:"حلوى بونبون خالية من السكر محلاة بالـ Xylitol",en:"Sugar-free candies with Xylitol"},
    {ar:"شوكولا كاندريل dark (Canderel Dark)",en:"Canderel Dark chocolate"},
    {ar:"شوكولا Lindt 85% أو 90% كاكاو",en:"Lindt 85% or 90% cocoa chocolate"}
  ]}
];

// ---------- UI Strings ----------
const UI = {
  // Header
  appTitle: { ar:"🥗 نظام الكيتو — Lynn", en:"🥗 Keto Plan — Lynn" },
  appSub: { ar:"VIRTUAL DIET · Be wise, Choose right", en:"VIRTUAL DIET · Be wise, Choose right" },
  dayBadge: { ar:"اليوم {n} من {total}", en:"Day {n} of {total}" },
  notStarted: { ar:"لم يبدأ بعد", en:"Not started yet" },

  // Tabs
  tab_today: { ar:"🏠 اليوم", en:"🏠 Today" },
  tab_weight: { ar:"⚖️ الوزن", en:"⚖️ Weight" },
  tab_calendar: { ar:"📅 التقويم", en:"📅 Calendar" },
  tab_breakfast: { ar:"🍳 الفطور", en:"🍳 Breakfast" },
  tab_lunch: { ar:"🍽️ الغداء", en:"🍽️ Lunch" },
  tab_dinner: { ar:"🌙 العشاء", en:"🌙 Dinner" },
  tab_snacks: { ar:"🥜 السناكات", en:"🥜 Snacks" },
  tab_shopping: { ar:"🛒 المشتريات", en:"🛒 Shopping" },
  tab_allowed: { ar:"✅ المسموحات", en:"✅ Allowed" },
  tab_photos: { ar:"📸 الصور", en:"📸 Photos" },
  tab_favorites: { ar:"❤️ المفضلة", en:"❤️ Favorites" },
  tab_settings: { ar:"⚙️ الإعدادات", en:"⚙️ Settings" },

  // Today
  todayHeader: { ar:"🏠 يومك اليوم", en:"🏠 Your day today" },
  stat_day: { ar:"اليوم من 28", en:"Day of 28" },
  stat_streak: { ar:"أيام متتالية", en:"Streak days" },
  stat_water: { ar:"كاسات ماء", en:"Water cups" },
  stat_meals: { ar:"وجبات اليوم", en:"Meals today" },
  water_header: { ar:"💧 شرب الماء", en:"💧 Water intake" },
  water_sub: { ar:"اضغطي على الكاس لتملي — الهدف 8 كاسات يومياً", en:"Tap a cup to fill it — target is 8 cups per day" },
  meals_today: { ar:"🍽️ وجبات اليوم", en:"🍽️ Today's meals" },
  timing_header: { ar:"⏰ التوقيتات المقترحة", en:"⏰ Suggested schedule" },
  timing_note: { ar:"لا يوجد مواقيت محددة — وزّعي الوجبات حسب رغبتك خلال النهار.", en:"No fixed times — spread meals throughout the day as you wish." },
  time_breakfast: { ar:"💧 ماء + 🍳 الفطور", en:"💧 Water + 🍳 Breakfast" },
  time_snack1: { ar:"🥜 السناك الأول", en:"🥜 First snack" },
  time_lunch: { ar:"🍽️ الغداء", en:"🍽️ Lunch" },
  time_snack2: { ar:"🥤 السناك الثاني", en:"🥤 Second snack" },
  time_dinner: { ar:"🌙 العشاء", en:"🌙 Dinner" },
  t_range_1: { ar:"7-9 ص", en:"7-9 AM" },
  t_range_2: { ar:"11 ص", en:"11 AM" },
  t_range_3: { ar:"1-2 م", en:"1-2 PM" },
  t_range_4: { ar:"4:30 م", en:"4:30 PM" },
  t_range_5: { ar:"7:30 م", en:"7:30 PM" },

  meal_breakfast: { ar:"الفطور", en:"Breakfast" },
  meal_lunch: { ar:"الغداء", en:"Lunch" },
  meal_dinner: { ar:"العشاء", en:"Dinner" },
  meal_snack1: { ar:"سناك 1", en:"Snack 1" },
  meal_snack2: { ar:"سناك 2", en:"Snack 2" },
  meal_done: { ar:"✅ تم", en:"✅ Done" },
  meal_not_done: { ar:"لم يتم بعد", en:"Not done yet" },
  btn_done: { ar:"✓ تم", en:"✓ Done" },
  btn_undo: { ar:"إلغاء", en:"Undo" },

  // Weight
  weight_header: { ar:"⚖️ متابعة الوزن", en:"⚖️ Weight tracking" },
  weight_current: { ar:"الوزن الحالي", en:"Current weight" },
  weight_lost: { ar:"الفاقد (كغ)", en:"Lost (kg)" },
  weight_goal: { ar:"الهدف (IBW)", en:"Goal (IBW)" },
  weight_togo: { ar:"باقي للهدف", en:"Remaining" },
  weight_input: { ar:"الوزن (كغ)", en:"Weight (kg)" },
  btn_add: { ar:"إضافة", en:"Add" },
  chart_weight: { ar:"الوزن (كغ)", en:"Weight (kg)" },
  chart_goal: { ar:"الهدف (IBW)", en:"Goal (IBW)" },

  // Calendar
  cal_header: { ar:"📅 تقويم 28 يوم", en:"📅 28-day calendar" },
  cal_note: { ar:"كل مربع يعرض عدد الوجبات + الماء التي أتممتيها ذلك اليوم. اضغطي على أي يوم لعرض التفاصيل.", en:"Each square shows meals + water completed that day. Tap a day for details." },
  cal_legend: { ar:"اللون الأخضر = يوم مكتمل 6/6 · الأصفر = يوم جزئي · الرمادي = لم يُسجّل", en:"Green = fully complete 6/6 · Yellow = partial · Gray = not logged" },
  cal_no_start: { ar:"حددي تاريخ بدء النظام من الإعدادات أولاً.", en:"Set the start date from Settings first." },

  // Meals
  pick_for_me: { ar:"🎲 اختاري لي", en:"🎲 Pick for me" },
  breakfast_note: { ar:"اختاري خياراً واحداً + جدول الخضار. جميع الأجبان مسموحة.", en:"Choose one option + the vegetable list. All cheeses allowed." },
  lunch_note: { ar:"شرائح الجبنة: موزاريلا أو تشيدر كاملة الدسم. المايونيز كامل الدسم. الدجاج: صدر/فخذ/جناح.", en:"Cheese slices: full-fat mozzarella or cheddar. Full-fat mayonnaise. Chicken: breast/thigh/wing." },
  dinner_note: { ar:"مطابقة لخيارات الفطور. جميع الأجبان مسموحة.", en:"Identical to breakfast options. All cheeses allowed." },
  option_label: { ar:"الخيار", en:"Option" },

  // Shopping
  shop_header: { ar:"🛒 قائمة المشتريات", en:"🛒 Shopping list" },
  shop_sub: { ar:"ضعي علامة على كل شيء اشتريتيه — تُحفظ تلقائياً.", en:"Tick everything you've bought — saved automatically." },
  shop_reset: { ar:"مسح الكل", en:"Clear all" },
  shop_check_all: { ar:"تحديد الكل", en:"Check all" },
  shop_reset_confirm: { ar:"مسح جميع العلامات؟", en:"Clear all checks?" },

  // Allowed
  allowed_header: { ar:"✅ المسموحات", en:"✅ Allowed items" },
  allowed_veg: { ar:"الخضار المسموحة", en:"Allowed vegetables" },
  allowed_sauce: { ar:"الصوصات المسموحة", en:"Allowed sauces" },
  allowed_drinks: { ar:"المشروبات المسموحة", en:"Allowed drinks" },
  allowed_sweetener: { ar:"السكر الاصطناعي", en:"Artificial sweetener" },
  sweetener_text: { ar:"يمكن استعماله يومياً بكمية: <strong>حبتان</strong> أو <strong>ظرفان</strong> أو <strong>ملعقتي شاي</strong>.", en:"Daily allowance: <strong>2 tablets</strong>, <strong>2 sachets</strong>, or <strong>2 tsp</strong>." },
  fat_header: { ar:"🔄 جدول استبدال الدهون", en:"🔄 Fat exchange table" },
  fat_note: { ar:"يجب تناول كل حصص الدهون. يمكن استبدال أي خيار بآخر من الجدول.", en:"All fat portions must be eaten. Any item can be swapped with another from the table." },
  col_sauce: { ar:"الصوص", en:"Sauce" },
  col_qty: { ar:"الكمية", en:"Quantity" },
  col_option: { ar:"الخيار", en:"Option" },
  col_equiv: { ar:"الكمية المعادلة", en:"Equivalent amount" },

  // Photos
  photo_header: { ar:"📸 يوميات الصور", en:"📸 Photo diary" },
  photo_sub: { ar:"احفظي صور \"قبل / أثناء / بعد\" — كل الصور محفوظة محلياً على جهازك فقط.", en:"Save \"before / during / after\" photos — all stored locally on your device only." },
  photo_add: { ar:"📷 إضافة صورة", en:"📷 Add photo" },
  photo_full: { ar:"لا توجد مساحة كافية لحفظ الصورة. احذفي بعض الصور القديمة.", en:"Not enough storage. Delete some old photos." },
  photo_delete_confirm: { ar:"حذف هذه الصورة؟", en:"Delete this photo?" },

  // Favorites
  fav_header: { ar:"❤️ الوجبات المفضلة", en:"❤️ Favorite meals" },
  fav_sub: { ar:"الخيارات التي أضفتيها بالقلب من صفحات الوجبات.", en:"Options you've hearted from the meal pages." },
  fav_empty: { ar:"لا توجد وجبات مفضلة بعد. اضغطي 🤍 على أي خيار في صفحات الوجبات لإضافته.", en:"No favorites yet. Tap 🤍 on any meal option to add it." },

  // Settings
  settings_header: { ar:"⚙️ الإعدادات", en:"⚙️ Settings" },
  start_date: { ar:"تاريخ بدء النظام", en:"Plan start date" },
  start_date_saved_label: { ar:"التاريخ المحفوظ:", en:"Saved date:" },
  start_date_none: { ar:"لم يُحفظ بعد", en:"Not saved yet" },
  start_date_active_label: { ar:"النظام نشط منذ", en:"Plan active since" },
  start_date_locked_hint: { ar:"لا يمكن تغيير تاريخ البدء بعد حفظه. لإعادة تشغيل النظام، استخدمي زر \"مسح جميع البيانات\" في الأسفل.", en:"The start date cannot be changed once saved. To restart the plan, use the \"Reset all data\" button below." },
  btn_save: { ar:"حفظ", en:"Save" },
  start_saved: { ar:"تم حفظ تاريخ البدء ✅", en:"Start date saved ✅" },
  choose_date: { ar:"اختاري تاريخ", en:"Choose a date" },
  person_info: { ar:"المعلومات الشخصية", en:"Personal info" },
  info_name: { ar:"الاسم", en:"Name" },
  info_weight: { ar:"الوزن الابتدائي", en:"Starting weight" },
  info_height: { ar:"الطول", en:"Height" },
  info_age: { ar:"العمر", en:"Age" },
  info_bmi: { ar:"BMI", en:"BMI" },
  info_ibw: { ar:"IBW", en:"IBW" },
  info_water: { ar:"الماء", en:"Water" },
  info_duration: { ar:"المدة", en:"Duration" },
  export_import: { ar:"تصدير / استيراد", en:"Export / import" },
  btn_export: { ar:"📤 تصدير البيانات", en:"📤 Export data" },
  btn_import: { ar:"📥 استيراد", en:"📥 Import" },
  btn_print: { ar:"🖨️ طباعة", en:"🖨️ Print" },
  import_confirm: { ar:"سيتم استبدال جميع البيانات الحالية. متابعة؟", en:"All current data will be replaced. Continue?" },
  invalid_file: { ar:"ملف غير صالح", en:"Invalid file" },
  danger_zone: { ar:"منطقة الخطر", en:"Danger zone" },
  btn_reset_all: { ar:"🗑️ مسح جميع البيانات", en:"🗑️ Reset all data" },
  reset_confirm1: { ar:"هل أنت متأكدة؟ سيتم حذف كل البيانات ولا يمكن استرجاعها.", en:"Are you sure? All data will be deleted and cannot be recovered." },
  reset_confirm2: { ar:"تأكيد أخير — حذف كل شيء؟", en:"Final confirmation — delete everything?" },

  // Misc
  kg: { ar:"كغ", en:"kg" },
  cm: { ar:"سم", en:"cm" },
  years: { ar:"سنة", en:"years" },
  days: { ar:"يوم", en:"days" },
  cups_day: { ar:"كاسات/يوم", en:"cups/day" },
  water_cups: { ar:"كاسات ماء", en:"water cups" },
  modal_close: { ar:"إغلاق", en:"Close" },
  modal_pick_again: { ar:"🎲 اختيار آخر", en:"🎲 Pick again" },
  modal_random_title: { ar:"اختيار عشوائي", en:"Random pick" },
  day_label: { ar:"اليوم", en:"Day" },
  date_value_invalid: { ar:"أدخلي تاريخ ووزن صحيح", en:"Enter a valid date and weight" },
  btn_lang: { ar:"EN", en:"عربي" },

  // Empty states
  empty_weight_title: { ar:"لم تسجلي وزنك بعد", en:"No weight logged yet" },
  empty_weight_sub: { ar:"سجّلي وزنك الأول لتبدأ متابعة تقدمك على المخطط.", en:"Log your first weight to start tracking progress on the chart." },
  empty_favs_title: { ar:"لا توجد وجبات مفضلة بعد", en:"No favorite meals yet" },
  empty_favs_sub: { ar:"اضغطي على أيقونة القلب في أي خيار من الوجبات لحفظه هنا.", en:"Tap the heart icon on any meal option to save it here for quick access." },
  empty_photos_title: { ar:"لا توجد صور بعد", en:"No photos yet" },
  empty_photos_sub: { ar:"احفظي صور 'قبل' و 'بعد' لرؤية تقدمك البصري خلال 28 يوماً.", en:"Save 'before' and 'after' photos to see your visual progress across 28 days." },

  // Install banner
  install_title: { ar:"أضيفي التطبيق إلى الشاشة الرئيسية", en:"Add to your home screen" },
  install_sub: { ar:"استخدمي التطبيق كأنه تطبيق حقيقي — بدون فتح المتصفح.", en:"Use it like a real app — without opening the browser." },
  install_cta: { ar:"تثبيت", en:"Install" },
  install_ios_hint: { ar:"اضغطي على زر المشاركة في سفاري ثم 'إضافة إلى الشاشة الرئيسية'.", en:"Tap the Share button in Safari, then 'Add to Home Screen'." },
  dismiss: { ar:"لاحقاً", en:"Later" },

  // Milestones & celebrations
  milestone_3_title: { ar:"3 أيام متتالية! 🎉", en:"3-day streak! 🎉" },
  milestone_3_sub: { ar:"بدأتِ بقوة. استمري!", en:"Strong start. Keep going!" },
  milestone_7_title: { ar:"أسبوع كامل! 🔥", en:"A full week! 🔥" },
  milestone_7_sub: { ar:"ربع الطريق. أنتِ رائعة.", en:"Quarter of the way there. You're amazing." },
  milestone_14_title: { ar:"أسبوعان متتاليان! ⭐", en:"Two weeks in a row! ⭐" },
  milestone_14_sub: { ar:"نصف الطريق — استمري على هذا النحو.", en:"Halfway there — keep this momentum." },
  milestone_28_title: { ar:"أتممتِ الـ 28 يوماً! 👑", en:"28 days complete! 👑" },
  milestone_28_sub: { ar:"أنتِ بطلة. هذا إنجاز حقيقي.", en:"You're a champion. This is a real achievement." },

  // Weekly insights
  insights_header: { ar:"📊 هذا الأسبوع", en:"📊 This week" },
  insights_days: { ar:"أيام مكتملة", en:"Days complete" },
  insights_water: { ar:"كاسات ماء", en:"Water cups" },
  insights_weight_change: { ar:"تغيّر الوزن", en:"Weight change" },
  insights_empty: { ar:"لا توجد بيانات هذا الأسبوع بعد.", en:"No data for this week yet." }
};

// ============================================================
// LYNN PLAN: diet & workout plan data (ar / en)
// Source: "My Diet & Workout Plan" (PCOS + insulin resistance)
// ============================================================

const PROFILE = {
  name: "Lynn Hamad",
  age: 22,
  height: 163,
  startWeight: 62.5,
  condition: { ar: "تكيّس المبايض + مقاومة الإنسولين", en: "PCOS + insulin resistance" },
  medication: { ar: "ميتفورمين 500 ملغ", en: "Metformin 500 mg" }
};

const GOAL = {
  ar: "خسارة دهون الجسم، بناء العضل، وتحسين حساسية الإنسولين.",
  en: "Lose body fat, build muscle, improve insulin sensitivity."
};

// Daily targets. `aim` is the value the plan picked inside the range.
const TARGETS = {
  kcal:    { min: 1850, max: 1950, aim: 1950, unit: "kcal" },
  protein: { min: 110,  max: 125,  aim: 125,  unit: "g" },
  carbs:   { min: 170,  max: 200,  aim: 200,  unit: "g" },
  fat:     { min: 65,   max: 80,   aim: 80,   unit: "g" },
  fiber:   { min: 30,   max: 35,   aim: 35,   unit: "g" },
  waterMl: { min: 2000, max: 2500, aim: 2500, unit: "ml" },
  vegG:    { min: 300,  max: 400,  aim: 400,  unit: "g" },
  fruit:   { min: 2,    max: 2,    aim: 2,    unit: "" },
  sleep:   { min: 7,    max: 9,    aim: 8,    unit: "h" }
};

const GLASS_ML = 250;
const GLASSES = 10; // 10 x 250 ml = 2.5 L

const SLOTS = [
  { key: "breakfast", icon: "sunrise", name: { ar: "الفطور", en: "Breakfast" }, kcal: [350, 400] },
  { key: "snack1",    icon: "apple",   name: { ar: "سناك 1", en: "Snack 1" },   kcal: [150, 200] },
  { key: "lunch",     icon: "bowl",    name: { ar: "الغداء", en: "Lunch" },     kcal: [500, 550] },
  { key: "snack2",    icon: "cookie",  name: { ar: "سناك 2", en: "Snack 2" },   kcal: [150, 200] },
  { key: "dinner",    icon: "moon",    name: { ar: "العشاء", en: "Dinner" },    kcal: [450, 550] }
];

// ------------------------------------------------------------
// Foods. Nutrition is an ESTIMATE from typical label values,
// per 100 g / 100 ml (unit g/ml) or per piece (unit pc).
// Lynn can override labneh, cottage cheese, protein powder,
// milk and bread with her own labels in Settings.
// fruitG: grams that count as one fruit serving.
// ------------------------------------------------------------
const FOODS = {
  cottage:  { name:{ar:"جبنة كوتيج قليلة الدسم",en:"low-fat cottage cheese"}, unit:"g",  kcal:72,  p:12.4, c:2.7,  f:1.0,  fib:0,    group:"protein", label:true },
  labneh:   { name:{ar:"لبنة قليلة الدسم",en:"low-fat labneh"},           unit:"g",  kcal:110, p:8,    c:4.5,  f:6.5,  fib:0,    group:"protein", label:true },
  powder:   { name:{ar:"بروتين بودرة",en:"protein powder"},               unit:"g",  kcal:380, p:78,   c:8,    f:5,    fib:0,    group:"protein", label:true },
  milk:     { name:{ar:"حليب",en:"milk"},                                 unit:"ml", kcal:47,  p:3.4,  c:4.9,  f:1.5,  fib:0,    group:"protein", label:true },
  fish:     { name:{ar:"سمك أبيض مطبوخ",en:"cooked white fish"},          unit:"g",  kcal:105, p:23,   c:0,    f:0.9,  fib:0,    group:"protein" },
  lentils:  { name:{ar:"عدس مطبوخ",en:"cooked lentils"},                  unit:"g",  kcal:116, p:9,    c:20,   f:0.4,  fib:7.9,  group:"carb" },

  bread:    { name:{ar:"خبز قمح كامل",en:"whole-wheat bread"},            unit:"g",  kcal:250, p:12.5, c:42,   f:3.5,  fib:6,    group:"carb", label:true },
  potato:   { name:{ar:"بطاطا مسلوقة",en:"boiled potatoes"},              unit:"g",  kcal:87,  p:1.9,  c:20,   f:0.1,  fib:1.8,  group:"carb" },
  rice:     { name:{ar:"رز مطبوخ",en:"cooked rice"},                      unit:"g",  kcal:130, p:2.7,  c:28,   f:0.3,  fib:0.4,  group:"carb" },
  pasta:    { name:{ar:"معكرونة مطبوخة",en:"cooked pasta"},               unit:"g",  kcal:158, p:5.8,  c:31,   f:0.9,  fib:1.8,  group:"carb" },
  oats:     { name:{ar:"شوفان (ناشف)",en:"oats, dry"},                    unit:"g",  kcal:389, p:16.9, c:66,   f:6.9,  fib:10.6, group:"carb" },

  oil:      { name:{ar:"زيت زيتون",en:"olive oil"},                       unit:"g",  kcal:884, p:0,    c:0,    f:100,  fib:0,    group:"fat" },
  almonds:  { name:{ar:"لوز",en:"almonds"},                               unit:"g",  kcal:579, p:21,   c:22,   f:50,   fib:12.5, group:"fat" },
  walnuts:  { name:{ar:"جوز",en:"walnuts"},                               unit:"g",  kcal:654, p:15.2, c:13.7, f:65.2, fib:6.7,  group:"fat" },
  pb:       { name:{ar:"زبدة فول سوداني",en:"peanut butter"},             unit:"g",  kcal:588, p:25,   c:20,   f:50,   fib:6,    group:"fat" },
  avocado:  { name:{ar:"أفوكادو",en:"avocado"},                           unit:"g",  kcal:160, p:2,    c:8.5,  f:14.7, fib:6.7,  group:"fat" },

  apple:    { name:{ar:"تفاحة",en:"apple"},                               unit:"pc", kcal:95,  p:0.5,  c:25,   f:0.3,  fib:4.4,  group:"fruit", fruitPc:1 },
  pear:     { name:{ar:"إجاصة",en:"pear"},                                unit:"pc", kcal:101, p:0.6,  c:27,   f:0.2,  fib:5.5,  group:"fruit", fruitPc:1 },
  banana:   { name:{ar:"موزة",en:"banana"},                               unit:"pc", kcal:105, p:1.3,  c:27,   f:0.4,  fib:3.1,  group:"fruit", fruitPc:1 },
  bananaS:  { name:{ar:"موزة صغيرة",en:"small banana"},                   unit:"pc", kcal:90,  p:1.1,  c:23,   f:0.3,  fib:2.6,  group:"fruit", fruitPc:1 },
  orange:   { name:{ar:"برتقالة",en:"orange"},                            unit:"pc", kcal:62,  p:1.2,  c:15.4, f:0.2,  fib:3.1,  group:"fruit", fruitPc:1 },
  peach:    { name:{ar:"درّاقة",en:"peach"},                              unit:"pc", kcal:59,  p:1.4,  c:14,   f:0.4,  fib:2.3,  group:"fruit", fruitPc:1 },
  kiwi:     { name:{ar:"كيوي",en:"kiwi"},                                 unit:"pc", kcal:42,  p:0.8,  c:10,   f:0.4,  fib:2.1,  group:"fruit", fruitPc:0.5 },
  berries:  { name:{ar:"توت",en:"berries"},                               unit:"g",  kcal:57,  p:0.7,  c:14.5, f:0.3,  fib:2.4,  group:"fruit", fruitG:100 },
  strawb:   { name:{ar:"فراولة",en:"strawberries"},                       unit:"g",  kcal:32,  p:0.7,  c:7.7,  f:0.3,  fib:2,    group:"fruit", fruitG:150 },
  blueb:    { name:{ar:"توت أزرق",en:"blueberries"},                      unit:"g",  kcal:57,  p:0.7,  c:14.5, f:0.3,  fib:2.4,  group:"fruit", fruitG:100 },
  grapes:   { name:{ar:"عنب",en:"grapes"},                                unit:"g",  kcal:69,  p:0.7,  c:18,   f:0.2,  fib:0.9,  group:"fruit", fruitG:100 },
  melon:    { name:{ar:"بطيخ",en:"watermelon"},                           unit:"g",  kcal:30,  p:0.6,  c:7.6,  f:0.2,  fib:0.4,  group:"fruit", fruitG:200 },

  veg:      { name:{ar:"خضار",en:"vegetables"},                           unit:"g",  kcal:25,  p:1.5,  c:5,    f:0.2,  fib:2.2,  group:"veg" },
  salad:    { name:{ar:"سلطة",en:"salad"},                                unit:"g",  kcal:18,  p:1.2,  c:3.3,  f:0.2,  fib:1.6,  group:"veg" },
  cuctom:   { name:{ar:"خيار / بندورة",en:"cucumber/tomato"},             unit:"g",  kcal:16,  p:0.8,  c:3.4,  f:0.2,  fib:1,    group:"veg" },
  cucumber: { name:{ar:"خيار",en:"cucumber"},                             unit:"g",  kcal:15,  p:0.7,  c:3.6,  f:0.1,  fib:0.5,  group:"veg" }
};

// q = amount (g / ml / pieces). noQty = show name only (plan gave no amount;
// 100 g is assumed for the estimate).
const I = (f, q, extra) => Object.assign({ f, q }, extra || {});

const LUNCH_STD = [I("fish",150), I("potato",200), I("veg",200), I("oil",15)];
const DINNER_180 = [I("lentils",180), I("cottage",150), I("bread",40), I("salad",200), I("oil",10)];
const DINNER_200 = [I("lentils",200), I("cottage",150), I("bread",40), I("salad",200), I("oil",10)];
const SMOOTHIE = { ar: "سموذي الفطور", en: "Breakfast smoothie" };

// Index 0 = Monday ... 6 = Sunday
const PLAN = [
  { day:{ar:"الاثنين",en:"Monday"}, meals:{
    breakfast:{ items:[I("cottage",150), I("bread",50), I("cuctom",150), I("walnuts",10)] },
    snack1:   { items:[I("apple",1), I("pb",15)] },
    lunch:    { items:LUNCH_STD },
    snack2:   { items:[I("powder",25), I("milk",200)] },
    dinner:   { items:[I("lentils",180), I("cottage",120), I("bread",40), I("salad",150), I("oil",10)] }
  }},
  { day:{ar:"الثلاثاء",en:"Tuesday"}, meals:{
    breakfast:{ items:[I("labneh",100), I("bread",60), I("veg",150), I("walnuts",10), I("milk",200)] },
    snack1:   { items:[I("pear",1), I("almonds",15)] },
    lunch:    { items:LUNCH_STD },
    snack2:   { items:[I("powder",25), I("berries",100)] },
    dinner:   { items:DINNER_200 }
  }},
  { day:{ar:"الأربعاء",en:"Wednesday"}, meals:{
    breakfast:{ title:SMOOTHIE, items:[I("milk",250), I("powder",30), I("bananaS",1), I("pb",15)] },
    snack1:   { items:[I("bread",50), I("labneh",80), I("cucumber",100,{noQty:true})] },
    lunch:    { items:LUNCH_STD },
    snack2:   { items:[I("apple",1), I("walnuts",20)] },
    dinner:   { items:DINNER_200 }
  }},
  { day:{ar:"الخميس",en:"Thursday"}, meals:{
    breakfast:{ items:[I("cottage",150), I("bread",60), I("veg",150), I("oil",10)] },
    snack1:   { items:[I("banana",1), I("pb",15)] },
    lunch:    { items:LUNCH_STD },
    snack2:   { items:[I("powder",25), I("milk",200)] },
    dinner:   { items:DINNER_180 }
  }},
  { day:{ar:"الجمعة",en:"Friday"}, meals:{
    breakfast:{ items:[I("labneh",100), I("bread",60), I("veg",150), I("walnuts",10), I("milk",200)] },
    snack1:   { items:[I("apple",1), I("almonds",15)] },
    lunch:    { items:LUNCH_STD },
    snack2:   { items:[I("powder",25), I("bananaS",1)] },
    dinner:   { items:DINNER_200 }
  }},
  { day:{ar:"السبت",en:"Saturday"}, meals:{
    breakfast:{ title:SMOOTHIE, items:[I("milk",250), I("powder",30), I("banana",1), I("pb",15)] },
    snack1:   { items:[I("bread",50), I("labneh",80), I("cucumber",100,{noQty:true})] },
    lunch:    { items:LUNCH_STD },
    snack2:   { items:[I("pear",1), I("walnuts",20)] },
    dinner:   { items:DINNER_200 }
  }},
  { day:{ar:"الأحد",en:"Sunday"}, meals:{
    breakfast:{ items:[I("cottage",150), I("bread",60), I("veg",150), I("walnuts",15)] },
    snack1:   { items:[I("banana",1), I("pb",10)] },
    lunch:    { items:LUNCH_STD },
    snack2:   { items:[I("powder",25), I("milk",200)] },
    dinner:   { items:DINNER_200 }
  }}
];

const PORTION_RULES = {
  ar: "السمك والبطاطا والعدس تُوزن مطبوخة. الخبز والمكسرات والبروتين بودرة تُوزن كما هي في العبوة. استعملي اللبنة وجبنة الكوتيج قليلة الدسم قدر الإمكان.",
  en: "Fish, potatoes and lentils are weighed cooked. Bread, nuts and protein powder are weighed as packaged. Use low-fat labneh and cottage cheese where possible."
};
const PLAN_NOTE = {
  ar: "هذا قالب وجبات وليس قائمة محسوبة سعرة بسعرة. افحصي ملصقات اللبنة وجبنة الكوتيج والبروتين بودرة. بعض الأيام قد تكون أقل من هدف السعرات أو البروتين، فعدّلي الكميات.",
  en: "This is a meal template, not a verified calorie-by-calorie menu. Check the labels of labneh, cottage cheese and protein powder. Some days may fall below the calorie or protein targets, so adjust portions accordingly."
};
const EXTRA_NOTE = {
  ar: "أضيفي حصة صغيرة إضافية عند الحاجة للوصول إلى سعرات اليوم.",
  en: "Add a small extra portion when needed to reach daily calories."
};
const TARGETS_NOTE = {
  ar: "هذه أهداف بداية. عدّليها حسب طاقتك، تعافيك من التمارين، وتقدّمك.",
  en: "These are starting targets. Adjust based on energy, workout recovery and progress."
};

// ------------------------------------------------------------
// Food substitutions. `range` is what the plan lists, `q` the
// amount it picked (used for the estimate and for "add extra").
// ------------------------------------------------------------
const SWAPS = [
  { key:"protein", icon:"fish", title:{ar:"البروتين",en:"Protein"},
    sub:{ar:"كل حصة تعطي تقريباً 20-25 غ بروتين",en:"Each portion gives roughly 20-25 g protein"},
    items:[
      { f:"fish",    range:"100-120", q:120 },
      { f:"cottage", range:"180-220", q:220 },
      { f:"powder",  range:"25-30",   q:30 },
      { f:"lentils", range:"250",     q:250 },
      { f:"milk",    range:"600-700", q:700 }
    ],
    notes:[
      {ar:"اللبنة والجبنة العادية تختلف كمية البروتين فيها. افحصي الملصق.",en:"Labneh and ordinary cheese contain variable protein. Check the label."},
      {ar:"العدس والحليب فيهم نشويات كمان، فهم مش معادلين للسمك بالسعرات.",en:"Lentils and milk also provide carbohydrates, so they are not calorie-equivalent to fish."}
    ]},
  { key:"carb", icon:"wheat", title:{ar:"النشويات",en:"Carbohydrates"},
    sub:{ar:"كل حصة تعطي تقريباً 25-30 غ نشويات",en:"Each gives approximately 25-30 g carbohydrates"},
    items:[
      { f:"bread",   range:"55-60",   q:60 },
      { f:"potato",  range:"140-160", q:160 },
      { f:"rice",    range:"95-110",  q:110 },
      { f:"pasta",   range:"90-100",  q:100 },
      { f:"oats",    range:"40-45",   q:45 },
      { f:"lentils", range:"125-140", q:130 }
    ]},
  { key:"fat", icon:"droplet", title:{ar:"الدهون الصحية",en:"Healthy fats"},
    sub:{ar:"كل حصة تقريباً 90-120 سعرة",en:"Approximately 90-120 kcal per serving"},
    items:[
      { f:"oil",     range:"10",    q:10 },
      { f:"almonds", range:"18-20", q:20 },
      { f:"walnuts", range:"15-17", q:16 },
      { f:"pb",      range:"18-20", q:20 },
      { f:"avocado", range:"65-75", q:75 }
    ]},
  { key:"fruit", icon:"apple", title:{ar:"الفاكهة",en:"Fruit"},
    sub:{ar:"اختاري تقريباً حصتين باليوم",en:"Choose approximately two servings daily"},
    items:[
      { f:"apple",  q:1, medium:true },
      { f:"banana", q:1, medium:true },
      { f:"orange", q:1, medium:true },
      { f:"pear",   q:1, medium:true },
      { f:"strawb", range:"150", q:150 },
      { f:"blueb",  range:"100", q:100 },
      { f:"grapes", range:"100", q:100 },
      { f:"kiwi",   q:2, medium:true },
      { f:"melon",  range:"200", q:200 },
      { f:"peach",  q:1, medium:true }
    ]}
];

const VEG_FREE = [
  {ar:"خيار",en:"Cucumber"},{ar:"بندورة",en:"Tomato"},{ar:"خس",en:"Lettuce"},
  {ar:"بروكلي",en:"Broccoli"},{ar:"كوسا",en:"Zucchini"},{ar:"جزر",en:"Carrots"},
  {ar:"سبانخ",en:"Spinach"},{ar:"فليفلة",en:"Peppers"},{ar:"فطر",en:"Mushrooms"},
  {ar:"ملفوف",en:"Cabbage"},{ar:"قرنبيط",en:"Cauliflower"}
];
const VEG_NOTE = {
  ar: "الهدف 300-400 غ خضار على الأقل باليوم. اختاري بحرية من القائمة. احسبي الزيت والصلصات والجبنة المضافة لحالها.",
  en: "Aim for at least 300-400 g daily. Choose freely from the list. Count added oil, dressings and cheese separately."
};

// ------------------------------------------------------------
// Weekly grocery list
// ------------------------------------------------------------
const GROCERY = [
  { key:"protein", title:{ar:"بروتين وألبان",en:"Protein & dairy"}, items:[
    { id:"g-fish",    name:{ar:"سمك أبيض",en:"White fish"},          qty:{ar:"~1.2-1.4 كغ (نيء)",en:"~1.2-1.4 kg raw"} },
    { id:"g-cottage", name:{ar:"جبنة كوتيج",en:"Cottage cheese"},     qty:{ar:"~1.8 كغ",en:"~1.8 kg"} },
    { id:"g-labneh",  name:{ar:"لبنة",en:"Labneh"},                   qty:{ar:"~450 غ",en:"~450 g"} },
    { id:"g-milk",    name:{ar:"حليب",en:"Milk"},                     qty:{ar:"~1.5 ل",en:"~1.5 L"} },
    { id:"g-powder",  name:{ar:"بروتين بودرة",en:"Protein powder"},   qty:{ar:"~200 غ",en:"~200 g"} }
  ]},
  { key:"carb", title:{ar:"نشويات",en:"Carbohydrates"}, items:[
    { id:"g-bread",   name:{ar:"خبز قمح كامل",en:"Whole-wheat bread"}, qty:{ar:"~650 غ",en:"~650 g"} },
    { id:"g-lentils", name:{ar:"عدس ناشف",en:"Dry lentils"},           qty:{ar:"~550 غ",en:"~550 g"} },
    { id:"g-potato",  name:{ar:"بطاطا",en:"Potatoes"},                 qty:{ar:"~1.6 كغ",en:"~1.6 kg"} }
  ]},
  { key:"fruit", title:{ar:"فاكهة",en:"Fruit"}, items:[
    { id:"g-banana",  name:{ar:"موز",en:"Bananas"},  qty:{ar:"5",en:"5"} },
    { id:"g-apple",   name:{ar:"تفاح",en:"Apples"},  qty:{ar:"4",en:"4"} },
    { id:"g-pear",    name:{ar:"إجاص",en:"Pears"},   qty:{ar:"2",en:"2"} },
    { id:"g-berries", name:{ar:"توت",en:"Berries"},  qty:{ar:"100 غ",en:"100 g"} }
  ]},
  { key:"veg", title:{ar:"خضار",en:"Vegetables"},
    note:{ar:"اشتري تقريباً 3-3.5 كغ خضار مشكّلة.",en:"Buy approximately 3-3.5 kg mixed vegetables."}, items:[
    { id:"g-cucumber", name:{ar:"خيار",en:"Cucumbers"} },
    { id:"g-tomato",   name:{ar:"بندورة",en:"Tomatoes"} },
    { id:"g-lettuce",  name:{ar:"خس",en:"Lettuce"} },
    { id:"g-broccoli", name:{ar:"بروكلي",en:"Broccoli"} },
    { id:"g-zucchini", name:{ar:"كوسا",en:"Zucchini"} },
    { id:"g-carrot",   name:{ar:"جزر",en:"Carrots"} },
    { id:"g-spinach",  name:{ar:"سبانخ",en:"Spinach"} },
    { id:"g-pepper",   name:{ar:"فليفلة",en:"Bell peppers"} }
  ]},
  { key:"fat", title:{ar:"دهون وإضافات",en:"Fats & extras"}, items:[
    { id:"g-oil",     name:{ar:"زيت زيتون",en:"Olive oil"},             qty:{ar:"~200 مل",en:"~200 ml"} },
    { id:"g-walnuts", name:{ar:"جوز",en:"Walnuts"},                     qty:{ar:"~100 غ",en:"~100 g"} },
    { id:"g-almonds", name:{ar:"لوز",en:"Almonds"},                     qty:{ar:"~30 غ",en:"~30 g"} },
    { id:"g-pb",      name:{ar:"زبدة فول سوداني",en:"Peanut butter"},   qty:{ar:"~60 غ",en:"~60 g"} },
    { id:"g-spices",  name:{ar:"حامض، ثوم، بهارات",en:"Lemon, garlic, spices"} }
  ]}
];

// ------------------------------------------------------------
// Weekly meal prep. weekday: 0 = Sunday, 3 = Wednesday (JS getDay)
// ------------------------------------------------------------
const PREP = [
  { key:"sun", weekday:0, title:{ar:"الأحد",en:"Sunday"}, tasks:[
    {ar:"اطبخي عدس يكفي 3-4 أيام.",en:"Cook lentils for 3-4 days."},
    {ar:"قسّمي السمك وجمّدي الحصص الزائدة.",en:"Portion fish and freeze extra servings."},
    {ar:"اغسلي الخضار.",en:"Wash vegetables."},
    {ar:"قسّمي الخبز والمكسرات.",en:"Portion bread and nuts."},
    {ar:"جهّزي مكونات السموذي.",en:"Prepare ingredients for smoothies."}
  ]},
  { key:"wed", weekday:3, title:{ar:"الأربعاء",en:"Wednesday"}, tasks:[
    {ar:"جهّزي دفعة عدس جديدة.",en:"Prepare another batch of lentils."},
    {ar:"جدّدي الخضار.",en:"Restock vegetables."},
    {ar:"اسلقي بطاطا لليومين أو الثلاثة الجايين.",en:"Cook potatoes for the next 2-3 days."},
    {ar:"فكّي السمك بأمان بالبراد.",en:"Thaw fish safely in the refrigerator."}
  ]}
];
const PREP_NOTE = {
  ar: "حطّي الأكل المطبوخ بالبراد فوراً، وجمّدي الحصص اللي ما رح تنأكل خلال 3-4 أيام.",
  en: "Refrigerate cooked foods promptly and freeze portions that won't be eaten within 3-4 days."
};

// ------------------------------------------------------------
// Workout. Indexed by JS getDay (0 = Sunday).
// ------------------------------------------------------------
const WORKOUT = {
  name: { ar: "ضحى ضرغام: تمرين كامل للجسم 22 دقيقة", en: "Doha Dergham: 22-minute full-body workout" },
  link: "https://www.youtube.com/results?search_query=Doha+Dergham+22+minute+full+body+workout",
  schedule: ["rest", "workout", "workout", "recovery", "workout", "workout", "workout"],
  types: {
    workout:  { icon:"dumbbell", name:{ar:"تمرين",en:"Workout"} },
    recovery: { icon:"activity", name:{ar:"مشي خفيف / إطالة",en:"Recovery walk / stretching"} },
    rest:     { icon:"bed",      name:{ar:"راحة",en:"Rest"} }
  },
  notes: [
    {ar:"ابدئي بثلاث تمارين بالأسبوع إذا لزم، وزيدي تدريجياً.",en:"Start with three workouts weekly if needed and build up gradually."},
    {ar:"السعرات المحروقة تقريباً 70-120 سعرة بكل جلسة.",en:"Estimated calories burned: 70-120 kcal per session."},
    {ar:"لبناء عضل أفضل، أضيفي تدريجياً تمارين مقاومة 2-3 مرات بالأسبوع.",en:"For better muscle development, gradually add resistance training 2-3 times weekly."}
  ]
};

// ------------------------------------------------------------
// PCOS + insulin resistance rules
// ------------------------------------------------------------
const RULES = [
  {ar:"اجمعي الخبز والبطاطا وباقي النشويات مع بروتين.",en:"Pair bread, potatoes and other carbohydrates with protein."},
  {ar:"الفاكهة الكاملة أفضل من العصير.",en:"Prefer whole fruit over juice."},
  {ar:"كلي عدس وخضار بشكل منتظم.",en:"Eat lentils and vegetables regularly."},
  {ar:"الهدف 30-35 غ ألياف، زيديها تدريجياً.",en:"Aim for 30-35 g fiber, increasing gradually."},
  {ar:"امشي 10-15 دقيقة بعد الوجبات قدر الإمكان.",en:"Walk for 10-15 minutes after meals when possible."},
  {ar:"تجنّبي المشروبات المحلاة بالسكر معظم الوقت.",en:"Avoid sugar-sweetened drinks most of the time."},
  {ar:"لا تلغي النشويات.",en:"Do not eliminate carbohydrates."},
  {ar:"تجنّبي الحرمان القاسي من السعرات.",en:"Avoid aggressive calorie restriction."},
  {ar:"نامي 7-9 ساعات.",en:"Sleep 7-9 hours."},
  {ar:"استمري على الميتفورمين تماماً كما هو موصوف.",en:"Continue metformin exactly as prescribed."}
];
const METFORMIN_NOTE = {
  ar: "ميتفورمين 500 ملغ: خذيه حسب الوصفة، وعادةً مع الأكل لتخفيف انزعاج المعدة. لا تغيّري الجرعة أو عدد المرات بدون استشارة طبية. اسألي طبيبك عن فحص فيتامين B12 بشكل دوري.",
  en: "Metformin 500 mg: take according to the prescription, generally with food to reduce stomach upset. Do not change the dose or frequency without medical advice. Ask your clinician about periodic vitamin B12 monitoring."
};

const PROGRESS = {
  waistDueDays: 14,     // "every 2-4 weeks"
  waistOverdueDays: 28,
  note: { ar: "كل 2-4 أسابيع: قيسي محيط الخصر.", en: "Every 2-4 weeks: measure waist circumference." }
};

// ------------------------------------------------------------
// UI strings
// ------------------------------------------------------------
const UI = {
  appTitle: { ar:"خطة Lynn", en:"Lynn's Plan" },
  appSub: { ar:"أكل · حركة · توازن", en:"Eat well · Move · Balance" },
  docTitle: { ar:"خطة Lynn: أكل وتمارين", en:"Lynn's Plan: diet & workout" },
  btn_lang: { ar:"EN", en:"عربي" },
  weekBadge: { ar:"الأسبوع {w} · اليوم {d}", en:"Week {w} · Day {d}" },

  tab_today: { ar:"اليوم", en:"Today" },
  tab_plan: { ar:"الخطة", en:"Plan" },
  tab_swaps: { ar:"البدائل", en:"Swaps" },
  tab_shop: { ar:"تسوّق وتحضير", en:"Shop & prep" },
  tab_move: { ar:"الحركة", en:"Move" },
  tab_progress: { ar:"التقدّم", en:"Progress" },
  tab_calendar: { ar:"التقويم", en:"Calendar" },
  tab_guide: { ar:"الدليل", en:"Guide" },
  tab_settings: { ar:"الإعدادات", en:"Settings" },

  // Today
  today: { ar:"اليوم", en:"Today" },
  back_today: { ar:"رجوع لليوم", en:"Back to today" },
  past_day: { ar:"عم تعدّلي يوم سابق", en:"Editing a past day" },
  checklist: { ar:"قائمة اليوم", en:"Daily checklist" },
  goals_met: { ar:"{n} من {t} أهداف", en:"{n} of {t} goals" },
  streak: { ar:"{n} أيام متتالية", en:"{n}-day streak" },
  streak_hint: { ar:"يوم ناجح = 7 أهداف أو أكثر", en:"Good day = 7+ goals met" },
  meals: { ar:"وجبات اليوم", en:"Today's meals" },
  meals_of: { ar:"وجبات {day}", en:"{day}'s meals" },
  meal_target: { ar:"الهدف {a}-{b} سعرة", en:"Target {a}-{b} kcal" },
  meal_est: { ar:"≈ {k} سعرة · {p} غ بروتين", en:"≈ {k} kcal · {p} g protein" },
  mark_eaten: { ar:"تم الأكل", en:"Eaten" },
  tap_to_mark: { ar:"اضغطي لتسجيل الوجبة", en:"Tap to mark eaten" },
  nutrition: { ar:"تغذية اليوم (تقديري)", en:"Today's nutrition (estimate)" },
  nutrition_hint: { ar:"محسوب من الوجبات اللي علّمتيها والإضافات. القيم تقريبية حسب ملصقات شائعة.", en:"Calculated from the meals you ticked plus extras. Values are approximate, based on typical labels." },
  short_kcal: { ar:"ناقصك تقريباً {n} سعرة. أضيفي حصة صغيرة.", en:"About {n} kcal short. Add a small extra portion." },
  short_protein: { ar:"ناقصك تقريباً {n} غ بروتين.", en:"About {n} g protein short." },
  over_kcal: { ar:"فوق الهدف بتقريباً {n} سعرة.", en:"About {n} kcal over target." },
  in_range: { ar:"ضمن الهدف ✓", en:"In range ✓" },
  extras: { ar:"حصص إضافية", en:"Extra portions" },
  extras_none: { ar:"ما في إضافات اليوم.", en:"No extras today." },
  add: { ar:"إضافة", en:"Add" },
  remove: { ar:"حذف", en:"Remove" },
  water: { ar:"الماء", en:"Water" },
  water_sub: { ar:"كل كاسة 250 مل · الهدف 2-2.5 ل", en:"Each glass is 250 ml · goal 2-2.5 L" },
  habits: { ar:"عادات اليوم", en:"Today's habits" },
  workout_today: { ar:"حركة اليوم", en:"Today's movement" },
  done: { ar:"تم ✓", en:"Done ✓" },
  mark_done: { ar:"علّمي كمنجز", en:"Mark done" },
  rest_day: { ar:"يوم راحة. الراحة جزء من الخطة.", en:"Rest day. Rest is part of the plan." },
  metformin: { ar:"الميتفورمين", en:"Metformin" },
  metformin_sub: { ar:"حسب الوصفة، مع الأكل", en:"As prescribed, with food" },
  taken: { ar:"أُخذ ✓", en:"Taken ✓" },
  mark_taken: { ar:"علّمي كمأخوذ", en:"Mark taken" },
  sleep: { ar:"النوم (الليلة الماضية)", en:"Sleep (last night)" },
  sleep_unset: { ar:"غير مسجّل", en:"Not logged" },
  hours: { ar:"ساعات", en:"hours" },
  walks: { ar:"مشي بعد الأكل", en:"Post-meal walks" },
  walks_sub: { ar:"10-15 دقيقة بعد الوجبات", en:"10-15 min after meals" },
  prep_today: { ar:"يوم التحضير", en:"Prep day" },

  // checklist items
  ck_kcal: { ar:"السعرات", en:"Calories" },
  ck_protein: { ar:"البروتين", en:"Protein" },
  ck_fiber: { ar:"الألياف", en:"Fiber" },
  ck_water: { ar:"الماء", en:"Water" },
  ck_veg: { ar:"الخضار", en:"Vegetables" },
  ck_fruit: { ar:"الفاكهة", en:"Fruit" },
  ck_move: { ar:"تمرين أو تعافي", en:"Workout or recovery" },
  ck_metformin: { ar:"الميتفورمين", en:"Metformin" },
  ck_sleep: { ar:"النوم", en:"Sleep" },
  carbs: { ar:"النشويات", en:"Carbs" },
  fat: { ar:"الدهون", en:"Fat" },
  servings: { ar:"حصص", en:"servings" },

  // Plan
  plan_title: { ar:"خطة الأيام السبعة", en:"My 7-day meal plan" },
  day_total: { ar:"مجموع اليوم (تقديري)", en:"Day total (estimate)" },
  daily_structure: { ar:"توزيع الوجبات", en:"Daily meal structure" },

  // Swaps
  swaps_title: { ar:"بدائل الأكل", en:"Food substitutions" },
  swaps_sub: { ar:"بدّلي أي صنف بوجبة بصنف من نفس المجموعة.", en:"Swap any item in a meal for one from the same group." },
  col_food: { ar:"الصنف", en:"Food" },
  col_portion: { ar:"الكمية", en:"Portion" },
  col_kcal: { ar:"≈ سعرات", en:"≈ kcal" },
  medium: { ar:"وسط", en:"medium" },
  veg_title: { ar:"الخضار", en:"Vegetables" },

  // Shop & prep
  grocery_title: { ar:"قائمة التسوّق الأسبوعية", en:"Weekly grocery list" },
  grocery_progress: { ar:"{n} من {t} بالسلة", en:"{n} of {t} in the basket" },
  new_week: { ar:"أسبوع جديد (مسح العلامات)", en:"New week (clear ticks)" },
  new_week_confirm: { ar:"مسح كل العلامات من قائمة التسوّق؟", en:"Clear all ticks on the grocery list?" },
  prep_title: { ar:"التحضير الأسبوعي", en:"Weekly meal prep" },
  prep_for: { ar:"تحضير {day} {date}", en:"{day} prep, {date}" },

  // Move
  move_title: { ar:"برنامج التمارين", en:"Workout schedule" },
  this_week: { ar:"هذا الأسبوع: {n} من {t} تمارين", en:"This week: {n} of {t} workouts" },
  open_video: { ar:"افتحي التمارين على يوتيوب", en:"Find the workout on YouTube" },

  // Progress
  progress_title: { ar:"التقدّم", en:"Progress" },
  weight: { ar:"الوزن", en:"Weight" },
  waist: { ar:"الخصر", en:"Waist" },
  start_w: { ar:"وزن البداية", en:"Start weight" },
  current_w: { ar:"الوزن الحالي", en:"Current weight" },
  change: { ar:"التغيير", en:"Change" },
  waist_last: { ar:"آخر قياس خصر", en:"Last waist" },
  waist_change: { ar:"تغيير الخصر", en:"Waist change" },
  waist_next: { ar:"قياس الخصر الجاي", en:"Next waist check" },
  waist_due_now: { ar:"صار وقته", en:"Due now" },
  waist_overdue: { ar:"متأخر", en:"Overdue" },
  waist_in: { ar:"بعد {n} يوم", en:"In {n} days" },
  waist_first: { ar:"سجّلي أول قياس", en:"Log your first one" },
  log_weight: { ar:"تسجيل الوزن (كغ)", en:"Log weight (kg)" },
  log_waist: { ar:"تسجيل الخصر (سم)", en:"Log waist (cm)" },
  no_entries: { ar:"ما في قياسات بعد.", en:"No entries yet." },
  progress_body_note: { ar:"الهدف خسارة دهون وبناء عضل، فالخصر مؤشر أهم من الميزان لحاله.", en:"The goal is fat loss plus muscle gain, so your waist tells you more than the scale alone." },

  // Calendar
  cal_title: { ar:"التقويم", en:"Calendar" },
  cal_legend: { ar:"اللون = عدد الأهداف المحققة. اضغطي على يوم لتعديله.", en:"Color = goals met. Tap a day to open it." },

  // Guide
  guide_goal: { ar:"الهدف", en:"Goal" },
  guide_details: { ar:"معلوماتي", en:"My details" },
  guide_targets: { ar:"الأهداف اليومية", en:"Daily targets" },
  guide_rules: { ar:"قواعد تكيّس المبايض ومقاومة الإنسولين", en:"PCOS + insulin resistance rules" },
  guide_portions: { ar:"قواعد الكميات", en:"Portion rules" },
  guide_progress: { ar:"متابعة التقدّم", en:"Progress check" },
  col_nutrient: { ar:"العنصر", en:"Nutrient" },
  col_target: { ar:"الهدف", en:"Target" },
  years: { ar:"سنة", en:"years" },

  // Settings
  settings_title: { ar:"الإعدادات", en:"Settings" },
  language: { ar:"اللغة", en:"Language" },
  start_date: { ar:"تاريخ بدء الخطة", en:"Plan start date" },
  save: { ar:"حفظ", en:"Save" },
  saved: { ar:"تم الحفظ ✓", en:"Saved ✓" },
  profile: { ar:"المعلومات الشخصية", en:"Profile" },
  age: { ar:"العمر", en:"Age" },
  height: { ar:"الطول (سم)", en:"Height (cm)" },
  start_weight: { ar:"وزن البداية (كغ)", en:"Start weight (kg)" },
  labels_title: { ar:"ملصقات منتجاتك", en:"Your product labels" },
  labels_sub: { ar:"الخطة بتقول افحصي الملصقات. حطّي القيم لكل 100 غ (أو 100 مل للحليب) من العبوة لتصير الحسابات أدق.", en:"The plan says to check labels. Enter the per 100 g values (100 ml for milk) from your packs so the estimates get more accurate." },
  l_kcal: { ar:"سعرات", en:"kcal" },
  l_p: { ar:"بروتين", en:"protein" },
  l_c: { ar:"نشويات", en:"carbs" },
  l_f: { ar:"دهون", en:"fat" },
  reset_labels: { ar:"رجوع للقيم الافتراضية", en:"Reset to defaults" },
  backup: { ar:"نسخة احتياطية", en:"Backup" },
  export: { ar:"تصدير", en:"Export" },
  import: { ar:"استيراد", en:"Import" },
  imported: { ar:"تم الاستيراد ✓", en:"Imported ✓" },
  import_bad: { ar:"الملف غير صالح", en:"That file isn't a valid backup" },
  danger: { ar:"منطقة الخطر", en:"Danger zone" },
  reset_all: { ar:"مسح كل البيانات", en:"Erase all data" },
  reset_confirm: { ar:"متأكدة؟ رح تنمسح كل البيانات من هالجهاز.", en:"Are you sure? All data on this device will be erased." },

  milestone: { ar:"{n} أيام ناجحة ورا بعض!", en:"{n} good days in a row!" },
  milestone_sub: { ar:"استمري، عم تعملي شي حلو لجسمك.", en:"Keep going, you're doing something good for your body." }
};

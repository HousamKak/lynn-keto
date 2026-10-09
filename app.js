// ============================================================
// LYNN PLAN: app logic
// All data stays in localStorage on this device.
// ============================================================

const LS_KEY = "lynn-plan-v1";
const LANG_KEY = "lynn-plan-lang";

function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

let lang = lsGet(LANG_KEY) || "en";

// ---------- i18n ----------
function t(x) { return x ? (x[lang] != null ? x[lang] : (x.en || "")) : ""; }
function tUI(key, vars) {
  let s = t(UI[key]) || key;
  if (vars) Object.keys(vars).forEach(k => { s = s.split("{" + k + "}").join(vars[k]); });
  return s;
}
const UNITS = {
  kcal: { ar: "سعرة", en: "kcal" },
  g: { ar: "غ", en: "g" },
  ml: { ar: "مل", en: "ml" },
  L: { ar: "ل", en: "L" },
  h: { ar: "س", en: "h" },
  kg: { ar: "كغ", en: "kg" },
  cm: { ar: "سم", en: "cm" }
};
function u(key) { return t(UNITS[key]); }
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function num(n, d) { return (+n).toFixed(d || 0).replace(/\.0+$/, ""); }

// ---------- State ----------
function defaultState() {
  return {
    startDate: null,
    days: {},        // iso -> { meals:{slot:true}, extras:[{f,q}], water, workout, metformin, sleep, walks }
    weights: [],     // { date, kg }
    waists: [],      // { date, cm }
    grocery: {},     // itemId -> true
    prep: {},        // iso -> { taskIndex: true }
    labels: {},      // foodId -> { kcal, p, c, f }
    profile: {},     // { age, height, startWeight }
    milestones: []
  };
}
function loadState() {
  try {
    const raw = lsGet(LS_KEY);
    if (!raw) return defaultState();
    return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) { return defaultState(); }
}
let state = loadState();
function save() { lsSet(LS_KEY, JSON.stringify(state)); }

// ---------- Dates ----------
function isoOf(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function parseIso(iso) { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); }
function todayIso() { return isoOf(new Date()); }
function addDays(iso, n) { const d = parseIso(iso); d.setDate(d.getDate() + n); return isoOf(d); }
function daysBetween(a, b) { return Math.round((parseIso(b) - parseIso(a)) / 86400000); }
function jsDay(iso) { return parseIso(iso).getDay(); }          // 0 = Sunday
function planIdx(iso) { return (jsDay(iso) + 6) % 7; }           // 0 = Monday
function mondayOf(iso) { return addDays(iso, -planIdx(iso)); }

const AR_MONTHS = ["كانون الثاني","شباط","آذار","نيسان","أيار","حزيران","تموز","آب","أيلول","تشرين الأول","تشرين الثاني","كانون الأول"];
const EN_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function monthName(m) { return (lang === "ar" ? AR_MONTHS : EN_MONTHS)[m]; }
function formatDate(iso, withYear) {
  const d = parseIso(iso);
  return d.getDate() + " " + monthName(d.getMonth()) + (withYear === false ? "" : " " + d.getFullYear());
}

if (!state.startDate) { state.startDate = todayIso(); save(); }
let viewDate = todayIso();
let planDay = planIdx(todayIso());
let calMonth = todayIso().slice(0, 7);

// ---------- Profile ----------
function profile() {
  const p = Object.assign({}, PROFILE);
  Object.keys(state.profile || {}).forEach(k => { if (state.profile[k] != null && state.profile[k] !== "") p[k] = state.profile[k]; });
  return p;
}

// ---------- Nutrition ----------
function food(id) { return Object.assign({}, FOODS[id], state.labels[id] || {}); }
function itemMacros(it) {
  const f = food(it.f);
  const m = f.unit === "pc" ? it.q : it.q / 100;
  return {
    kcal: f.kcal * m, p: f.p * m, c: f.c * m, f: f.f * m, fib: f.fib * m,
    veg: f.group === "veg" ? it.q : 0,
    fruit: f.group === "fruit" ? (f.fruitPc ? it.q * f.fruitPc : it.q / f.fruitG) : 0
  };
}
function sumMacros(items) {
  const s = { kcal:0, p:0, c:0, f:0, fib:0, veg:0, fruit:0 };
  items.forEach(it => { const m = itemMacros(it); Object.keys(s).forEach(k => { s[k] += m[k]; }); });
  return s;
}
function qtyText(q, unit) {
  if (unit === "pc") return String(q);
  return q + " " + u(unit);
}
function itemText(it) {
  const f = food(it.f);
  const name = t(f.name);
  if (it.noQty) return cap(name);
  return qtyText(it.q, f.unit) + " " + name;
}

// ---------- Days ----------
function emptyDay() { return { meals:{}, extras:[], water:0, workout:false, metformin:false, sleep:null, walks:0 }; }
function getDay(iso) { return Object.assign(emptyDay(), state.days[iso] || {}); }
function editDay(iso, fn) {
  const d = getDay(iso);
  fn(d);
  state.days[iso] = d;
  save();
  if (iso === todayIso()) maybeCelebrate();
  renderToday();
}
function planFor(iso) { return PLAN[planIdx(iso)]; }
function workoutType(iso) { return WORKOUT.schedule[jsDay(iso)]; }

function eatenItems(iso) {
  const d = getDay(iso), p = planFor(iso);
  const items = [];
  SLOTS.forEach(s => { if (d.meals[s.key]) items.push(...p.meals[s.key].items); });
  return items.concat(d.extras || []);
}
function plannedItems(iso) {
  const d = getDay(iso), p = planFor(iso);
  const items = [];
  SLOTS.forEach(s => items.push(...p.meals[s.key].items));
  return items.concat(d.extras || []);
}

function checklist(iso) {
  const d = getDay(iso);
  const tot = sumMacros(eatenItems(iso));
  const T = TARGETS;
  const waterMl = d.water * GLASS_ML;
  const wt = workoutType(iso);
  const range = (a, b, unit) => a + "-" + b + (unit ? " " + u(unit) : "");
  return [
    { key:"kcal", icon:"flame", met: tot.kcal >= T.kcal.min - 50 && tot.kcal <= T.kcal.max + 50,
      val: Math.round(tot.kcal) + " / " + range(T.kcal.min, T.kcal.max) },
    { key:"protein", icon:"fish", met: tot.p >= T.protein.min,
      val: Math.round(tot.p) + " / " + range(T.protein.min, T.protein.max, "g") },
    { key:"fiber", icon:"wheat", met: tot.fib >= T.fiber.min,
      val: Math.round(tot.fib) + " / " + range(T.fiber.min, T.fiber.max, "g") },
    { key:"water", icon:"droplet", met: waterMl >= T.waterMl.min,
      val: num(waterMl / 1000, 2) + " / 2-2.5 " + u("L") },
    { key:"veg", icon:"bowl", met: tot.veg >= T.vegG.min,
      val: Math.round(tot.veg) + " / " + range(T.vegG.min, T.vegG.max, "g") },
    { key:"fruit", icon:"apple", met: tot.fruit >= T.fruit.min - 0.05,
      val: num(tot.fruit, 1) + " / " + T.fruit.min },
    { key:"move", icon: WORKOUT.types[wt].icon, met: wt === "rest" || d.workout,
      val: t(WORKOUT.types[wt].name) },
    { key:"metformin", icon:"pill", met: !!d.metformin, val: d.metformin ? tUI("taken") : "" },
    { key:"sleep", icon:"bed", met: d.sleep != null && d.sleep >= T.sleep.min && d.sleep <= T.sleep.max,
      val: d.sleep != null ? num(d.sleep, 1) + " " + u("h") + " / 7-9" : tUI("sleep_unset") }
  ];
}
function score(iso) { return checklist(iso).filter(c => c.met).length; }
const GOOD_DAY = 7;

function currentStreak() {
  let iso = todayIso();
  let n = 0;
  if (score(iso) < GOOD_DAY) iso = addDays(iso, -1); // today still in progress
  while (iso >= state.startDate && state.days[iso] && score(iso) >= GOOD_DAY) { n++; iso = addDays(iso, -1); }
  return n;
}

// ---------- Toast / confetti ----------
function toast(title, sub, variant) {
  const host = document.getElementById("toastHost");
  const el = document.createElement("div");
  el.className = "toast" + (variant ? " " + variant : "");
  el.innerHTML = '<div class="toast-title">' + esc(title) + "</div>" + (sub ? '<div class="toast-sub">' + esc(sub) + "</div>" : "");
  host.appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 280); }, 3600);
}
function confettiBurst() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const host = document.getElementById("confettiHost");
  const colors = ["#2F6B5A", "#E07A5F", "#F2CC8F", "#81B29A", "#3D405B"];
  for (let i = 0; i < 70; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    const dur = 2200 + Math.random() * 1400;
    p.style.left = Math.random() * 100 + "vw";
    p.style.setProperty("--dx", (Math.random() - 0.5) * 300 + "px");
    p.style.setProperty("--rot", (Math.random() - 0.5) * 1080 + "deg");
    p.style.setProperty("--dur", dur + "ms");
    p.style.background = colors[i % colors.length];
    p.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    host.appendChild(p);
    setTimeout(() => p.remove(), dur + 400);
  }
}
const MILESTONES = [3, 7, 14, 21, 30, 60, 90];
function maybeCelebrate() {
  const s = currentStreak();
  if (MILESTONES.includes(s) && !state.milestones.includes(s)) {
    state.milestones.push(s);
    save();
    toast(tUI("milestone", { n: s }), tUI("milestone_sub"), "celebrate");
    confettiBurst();
  }
}

// ---------- Small render helpers ----------
const $ = id => document.getElementById(id);
function icon(name) { return ICONS[name] || ""; }
function rangeLabel(a, b) { return a === b ? String(a) : a + "-" + b; }

// ============================================================
// TODAY
// ============================================================
function renderToday() {
  const iso = viewDate;
  const isToday = iso === todayIso();
  const p = planFor(iso);
  const d = getDay(iso);

  $("dayWeekday").textContent = isToday ? tUI("today") + " · " + t(p.day) : t(p.day);
  $("dayDate").textContent = formatDate(iso);
  $("nextDay").disabled = isToday;
  $("prevDay").disabled = iso <= state.startDate;
  $("pastBanner").hidden = isToday;

  // Score ring + checklist
  const ck = checklist(iso);
  const met = ck.filter(c => c.met).length;
  $("scoreNum").textContent = met;
  $("ringFg").style.strokeDasharray = (met / ck.length * 100).toFixed(1) + " 100";
  $("scoreTitle").textContent = tUI("goals_met", { n: met, t: ck.length });
  const st = currentStreak();
  $("streakText").textContent = st > 0 ? tUI("streak", { n: st }) + " · " + tUI("streak_hint") : tUI("streak_hint");
  $("checklist").innerHTML = ck.map(c =>
    '<div class="ck' + (c.met ? " met" : "") + '"><span class="ck-icon">' + (c.met ? icon("tick") : icon(c.icon)) + "</span>" +
    '<span class="ck-body"><span class="ck-label">' + esc(tUI("ck_" + c.key)) + "</span>" +
    '<span class="ck-val"><bdi>' + esc(c.val) + "</bdi></span></span></div>"
  ).join("");

  // Prep day card
  const prep = PREP.find(x => x.weekday === jsDay(iso));
  const prepEl = $("todayPrep");
  if (prep) {
    prepEl.hidden = false;
    prepEl.innerHTML = '<h3>' + icon("clipboard") + esc(tUI("prep_today")) + ": " + esc(t(prep.title)) + "</h3>" + prepListHtml(prep, iso);
  } else prepEl.hidden = true;

  // Meals
  $("mealsHeader").textContent = isToday ? tUI("meals") : tUI("meals_of", { day: t(p.day) });
  $("todayMeals").innerHTML = SLOTS.map(s => {
    const meal = p.meals[s.key];
    const m = sumMacros(meal.items);
    const done = !!d.meals[s.key];
    return '<button type="button" class="meal' + (done ? " done" : "") + '" data-slot="' + s.key + '" aria-pressed="' + done + '">' +
      '<span class="meal-icon">' + (done ? icon("tick") : icon(s.icon)) + "</span>" +
      '<span class="meal-body">' +
        '<span class="meal-head"><span class="meal-name">' + esc(t(s.name)) + (meal.title ? " · " + esc(t(meal.title)) : "") + "</span>" +
        '<span class="meal-kcal"><bdi>≈ ' + Math.round(m.kcal) + " " + u("kcal") + "</bdi></span></span>" +
        '<span class="meal-items">' + meal.items.map(it => "<span>" + esc(itemText(it)) + "</span>").join("") + "</span>" +
        '<span class="meal-foot">' + esc(tUI("meal_target", { a: s.kcal[0], b: s.kcal[1] })) + " · " +
          esc(Math.round(m.p) + " " + u("g") + " " + tUI("ck_protein").toLowerCase()) +
          '<span class="meal-state">' + esc(done ? tUI("mark_eaten") + " ✓" : tUI("tap_to_mark")) + "</span></span>" +
      "</span></button>";
  }).join("");

  // Water
  let w = "";
  for (let i = 1; i <= GLASSES; i++) {
    w += '<button type="button" class="glass' + (i <= d.water ? " full" : "") + (i * GLASS_ML === TARGETS.waterMl.min ? " goal" : "") +
      '" data-glass="' + i + '" aria-label="' + i * GLASS_ML + ' ml"><span class="glass-fill"></span></button>';
  }
  $("waterRow").innerHTML = w;
  $("waterLabel").innerHTML = "<bdi>" + num(d.water * GLASS_ML / 1000, 2) + " " + u("L") + "</bdi>";

  // Habits
  const wt = workoutType(iso);
  const wtInfo = WORKOUT.types[wt];
  let h = '<div class="habit"><span class="habit-icon">' + icon(wtInfo.icon) + '</span><span class="habit-body"><span class="habit-name">' +
    esc(tUI("workout_today")) + ": " + esc(t(wtInfo.name)) + '</span><span class="habit-sub">' +
    esc(wt === "rest" ? tUI("rest_day") : (wt === "workout" ? t(WORKOUT.name) : tUI("walks_sub"))) + "</span></span>";
  if (wt !== "rest") h += '<button type="button" class="toggle' + (d.workout ? " on" : "") + '" data-habit="workout">' + esc(d.workout ? tUI("done") : tUI("mark_done")) + "</button>";
  h += "</div>";
  h += '<div class="habit"><span class="habit-icon">' + icon("pill") + '</span><span class="habit-body"><span class="habit-name">' +
    esc(tUI("metformin")) + '</span><span class="habit-sub">' + esc(tUI("metformin_sub")) + "</span></span>" +
    '<button type="button" class="toggle' + (d.metformin ? " on" : "") + '" data-habit="metformin">' + esc(d.metformin ? tUI("taken") : tUI("mark_taken")) + "</button></div>";
  h += '<div class="habit"><span class="habit-icon">' + icon("bed") + '</span><span class="habit-body"><span class="habit-name">' +
    esc(tUI("sleep")) + '</span><span class="habit-sub">7-9 ' + esc(tUI("hours")) + "</span></span>" +
    stepper("sleep", d.sleep == null ? tUI("sleep_unset") : num(d.sleep, 1) + " " + u("h")) + "</div>";
  h += '<div class="habit"><span class="habit-icon">' + icon("footprints") + '</span><span class="habit-body"><span class="habit-name">' +
    esc(tUI("walks")) + '</span><span class="habit-sub">' + esc(tUI("walks_sub")) + "</span></span>" +
    stepper("walks", String(d.walks || 0)) + "</div>";
  $("habits").innerHTML = h;

  // Nutrition
  const tot = sumMacros(eatenItems(iso));
  const bars = [
    ["ck_kcal", tot.kcal, TARGETS.kcal, "kcal"],
    ["ck_protein", tot.p, TARGETS.protein, "g"],
    ["carbs", tot.c, TARGETS.carbs, "g"],
    ["fat", tot.f, TARGETS.fat, "g"],
    ["ck_fiber", tot.fib, TARGETS.fiber, "g"]
  ];
  $("nutritionBars").innerHTML = bars.map(([k, v, T, unit]) => {
    const scale = T.max * 1.15;
    const st = v < T.min ? "under" : (v > T.max ? "over" : "ok");
    return '<div class="nbar ' + st + '"><div class="nbar-head"><span>' + esc(tUI(k)) + '</span><bdi>' + Math.round(v) + " / " +
      rangeLabel(T.min, T.max) + " " + esc(u(unit)) + "</bdi></div>" +
      '<div class="nbar-track"><div class="nbar-zone" style="inset-inline-start:' + (T.min / scale * 100) + "%;width:" + ((T.max - T.min) / scale * 100) + '%"></div>' +
      '<div class="nbar-fill" style="width:' + Math.min(100, v / scale * 100) + '%"></div></div></div>';
  }).join("");

  const planned = sumMacros(plannedItems(iso));
  let msg = "";
  if (planned.kcal < TARGETS.kcal.min - 50) msg += '<div class="note warn">' + esc(tUI("short_kcal", { n: Math.round(TARGETS.kcal.min - planned.kcal) })) + "</div>";
  else if (tot.kcal > TARGETS.kcal.max + 50) msg += '<div class="note warn">' + esc(tUI("over_kcal", { n: Math.round(tot.kcal - TARGETS.kcal.max) })) + "</div>";
  if (planned.p < TARGETS.protein.min) msg += '<div class="note warn">' + esc(tUI("short_protein", { n: Math.round(TARGETS.protein.min - planned.p) })) + "</div>";
  $("nutritionMsg").innerHTML = msg;

  // Extras
  $("extrasList").innerHTML = (d.extras || []).length
    ? (d.extras || []).map((it, i) => '<div class="row"><span>' + esc(itemText(it)) + ' <span class="muted"><bdi>≈ ' + Math.round(itemMacros(it).kcal) + " " + u("kcal") +
        '</bdi></span></span><button type="button" class="icon-btn sm" data-extra-del="' + i + '" aria-label="' + esc(tUI("remove")) + '">' + icon("x") + "</button></div>").join("")
    : '<p class="hint">' + esc(tUI("extras_none")) + "</p>";
}

function stepper(key, label) {
  return '<span class="stepper"><button type="button" class="icon-btn sm" data-step="' + key + '" data-dir="-1" aria-label="-">' + icon("minus") +
    '</button><span class="stepper-val"><bdi>' + esc(label) + '</bdi></span><button type="button" class="icon-btn sm" data-step="' + key + '" data-dir="1" aria-label="+">' + icon("plus") + "</button></span>";
}

function extraOptions() {
  const groups = SWAPS.map(g => ({ title: t(g.title), items: g.items.map(it => ({ f: it.f, q: it.q })) }));
  groups.push({ title: tUI("veg_title"), items: [{ f: "veg", q: 100 }, { f: "salad", q: 150 }] });
  return groups;
}
function renderExtraSelect() {
  $("extraSelect").innerHTML = extraOptions().map(g =>
    '<optgroup label="' + esc(g.title) + '">' + g.items.map(it =>
      '<option value="' + it.f + ":" + it.q + '">' + esc(itemText(it)) + " (≈ " + Math.round(itemMacros(it).kcal) + " " + u("kcal") + ")</option>"
    ).join("") + "</optgroup>").join("");
  $("extraNote").textContent = t(EXTRA_NOTE);
}

function bindToday() {
  $("todayMeals").addEventListener("click", e => {
    const b = e.target.closest("[data-slot]");
    if (!b) return;
    editDay(viewDate, d => { d.meals[b.dataset.slot] = !d.meals[b.dataset.slot]; });
  });
  $("waterRow").addEventListener("click", e => {
    const b = e.target.closest("[data-glass]");
    if (!b) return;
    const n = +b.dataset.glass;
    editDay(viewDate, d => { d.water = d.water === n ? n - 1 : n; });
  });
  $("habits").addEventListener("click", e => {
    const tg = e.target.closest("[data-habit]");
    if (tg) { const k = tg.dataset.habit; editDay(viewDate, d => { d[k] = !d[k]; }); return; }
    const sb = e.target.closest("[data-step]");
    if (!sb) return;
    const dir = +sb.dataset.dir;
    if (sb.dataset.step === "sleep") {
      editDay(viewDate, d => {
        if (d.sleep == null) { d.sleep = dir > 0 ? 7 : null; return; }
        const v = d.sleep + dir * 0.5;
        d.sleep = v < 0 ? null : Math.min(14, v);
      });
    } else {
      editDay(viewDate, d => { d.walks = Math.max(0, Math.min(5, (d.walks || 0) + dir)); });
    }
  });
  $("extraAdd").addEventListener("click", () => {
    const [f, q] = $("extraSelect").value.split(":");
    editDay(viewDate, d => { d.extras = (d.extras || []).concat([{ f, q: +q }]); });
  });
  $("extrasList").addEventListener("click", e => {
    const b = e.target.closest("[data-extra-del]");
    if (!b) return;
    editDay(viewDate, d => { d.extras.splice(+b.dataset.extraDel, 1); });
  });
  $("todayPrep").addEventListener("change", onPrepChange);
  $("prevDay").addEventListener("click", () => { viewDate = addDays(viewDate, -1); renderToday(); });
  $("nextDay").addEventListener("click", () => { if (viewDate < todayIso()) { viewDate = addDays(viewDate, 1); renderToday(); } });
  $("backToday").addEventListener("click", () => { viewDate = todayIso(); renderToday(); });
}

// ============================================================
// PLAN
// ============================================================
function mealCardHtml(slot, meal) {
  const m = sumMacros(meal.items);
  const inRange = m.kcal >= slot.kcal[0] - 25 && m.kcal <= slot.kcal[1] + 25;
  return '<div class="card plan-meal"><div class="card-head"><h3><span class="h-icon">' + icon(slot.icon) + "</span>" + esc(t(slot.name)) +
    (meal.title ? ' <span class="muted">· ' + esc(t(meal.title)) + "</span>" : "") + '</h3><span class="pill' + (inRange ? " ok" : "") + '"><bdi>≈ ' +
    Math.round(m.kcal) + " " + u("kcal") + "</bdi></span></div>" +
    '<ul class="bullets">' + meal.items.map(it => "<li>" + esc(itemText(it)) + "</li>").join("") + "</ul>" +
    '<p class="hint">' + esc(tUI("meal_target", { a: slot.kcal[0], b: slot.kcal[1] })) + " · " +
    "<bdi>" + Math.round(m.p) + " " + u("g") + "</bdi> " + esc(tUI("ck_protein").toLowerCase()) + "</p></div>";
}
function totalsTableHtml(tot) {
  const rows = [
    ["ck_kcal", tot.kcal, TARGETS.kcal, "kcal"],
    ["ck_protein", tot.p, TARGETS.protein, "g"],
    ["carbs", tot.c, TARGETS.carbs, "g"],
    ["fat", tot.f, TARGETS.fat, "g"],
    ["ck_fiber", tot.fib, TARGETS.fiber, "g"]
  ];
  return '<table><thead><tr><th>' + esc(tUI("col_nutrient")) + "</th><th>≈</th><th>" + esc(tUI("col_target")) + "</th></tr></thead><tbody>" +
    rows.map(([k, v, T, unit]) => {
      const st = v < T.min ? "under" : (v > T.max ? "over" : "ok");
      return '<tr class="' + st + '"><td>' + esc(tUI(k)) + "</td><td><bdi>" + Math.round(v) + "</bdi></td><td><bdi>" + rangeLabel(T.min, T.max) + " " + esc(u(unit)) + "</bdi></td></tr>";
    }).join("") + "</tbody></table>";
}
function renderPlan() {
  $("planDays").innerHTML = PLAN.map((p, i) =>
    '<button type="button" class="chip' + (i === planDay ? " active" : "") + (i === planIdx(todayIso()) ? " is-today" : "") +
    '" data-day="' + i + '" role="tab" aria-selected="' + (i === planDay) + '">' + esc(t(p.day)) + "</button>").join("");
  const p = PLAN[planDay];
  $("planMeals").innerHTML = SLOTS.map(s => mealCardHtml(s, p.meals[s.key])).join("");
  const items = [];
  SLOTS.forEach(s => items.push(...p.meals[s.key].items));
  $("planTotals").innerHTML = totalsTableHtml(sumMacros(items));
  $("planNote").textContent = t(PLAN_NOTE);
  $("portionRules").textContent = t(PORTION_RULES);
}

// ============================================================
// SWAPS
// ============================================================
function renderSwaps() {
  const groups = SWAPS.map(g => {
    const rows = g.items.map(it => {
      const f = food(it.f);
      const m = itemMacros(it);
      const portion = it.medium
        ? it.q + " " + tUI("medium")
        : (it.range || it.q) + " " + u(f.unit);
      const pick = it.range && String(it.range) !== String(it.q) ? ' <span class="muted">(' + it.q + " " + u(f.unit) + ")</span>" : "";
      return "<tr><td>" + esc(cap(t(f.name))) + "</td><td><bdi>" + esc(portion) + "</bdi>" + pick + "</td><td><bdi>" + Math.round(m.kcal) + "</bdi></td></tr>";
    }).join("");
    return '<div class="card"><h3><span class="h-icon">' + icon(g.icon) + "</span>" + esc(t(g.title)) + "</h3>" +
      '<p class="hint">' + esc(t(g.sub)) + "</p>" +
      "<table><thead><tr><th>" + esc(tUI("col_food")) + "</th><th>" + esc(tUI("col_portion")) + "</th><th>" + esc(tUI("col_kcal")) + "</th></tr></thead><tbody>" + rows + "</tbody></table>" +
      (g.notes ? g.notes.map(n => '<div class="note">' + esc(t(n)) + "</div>").join("") : "") + "</div>";
  });
  groups.push('<div class="card"><h3><span class="h-icon">' + icon("bowl") + "</span>" + esc(tUI("veg_title")) + "</h3>" +
    '<p class="hint">' + esc(t(VEG_NOTE)) + '</p><div class="pills">' + VEG_FREE.map(v => '<span class="pill">' + esc(t(v)) + "</span>").join("") + "</div></div>");
  $("swapGroups").innerHTML = groups.join("");
}

// ============================================================
// SHOP & PREP
// ============================================================
function prepDateFor(prep, fromIso) {
  // most recent occurrence of prep.weekday on or before fromIso
  const back = (jsDay(fromIso) - prep.weekday + 7) % 7;
  return addDays(fromIso, -back);
}
function prepListHtml(prep, iso) {
  const done = state.prep[iso] || {};
  return '<div class="checks">' + prep.tasks.map((task, i) => {
    const id = "prep-" + iso + "-" + i;
    return '<label class="check' + (done[i] ? " on" : "") + '" for="' + id + '"><input type="checkbox" id="' + id + '" data-prep="' + iso + '" data-idx="' + i + '"' +
      (done[i] ? " checked" : "") + "><span>" + esc(t(task)) + "</span></label>";
  }).join("") + "</div>";
}
function onPrepChange(e) {
  const cb = e.target.closest("[data-prep]");
  if (!cb) return;
  const iso = cb.dataset.prep;
  state.prep[iso] = state.prep[iso] || {};
  if (cb.checked) state.prep[iso][cb.dataset.idx] = true; else delete state.prep[iso][cb.dataset.idx];
  save();
  renderShop();
  renderToday();
}
function renderShop() {
  let total = 0, have = 0;
  $("groceryList").innerHTML = GROCERY.map(g => {
    return '<div class="shop-group"><h4>' + esc(t(g.title)) + "</h4>" + (g.note ? '<p class="hint">' + esc(t(g.note)) + "</p>" : "") +
      '<div class="checks">' + g.items.map(it => {
        total++;
        const on = !!state.grocery[it.id];
        if (on) have++;
        return '<label class="check' + (on ? " on" : "") + '" for="' + it.id + '"><input type="checkbox" id="' + it.id + '" data-grocery="' + it.id + '"' + (on ? " checked" : "") + ">" +
          "<span>" + esc(t(it.name)) + (it.qty ? ' <span class="muted"><bdi>' + esc(t(it.qty)) + "</bdi></span>" : "") + "</span></label>";
      }).join("") + "</div></div>";
  }).join("");
  $("groceryCount").textContent = tUI("grocery_progress", { n: have, t: total });
  $("groceryFill").style.width = (have / total * 100) + "%";

  const now = todayIso();
  $("prepLists").innerHTML = PREP.map(prep => {
    const iso = prepDateFor(prep, now);
    return '<div class="shop-group"><h4>' + esc(tUI("prep_for", { day: t(prep.title), date: formatDate(iso, false) })) + "</h4>" + prepListHtml(prep, iso) + "</div>";
  }).join("");
  $("prepNote").textContent = t(PREP_NOTE);
}
function bindShop() {
  $("groceryList").addEventListener("change", e => {
    const cb = e.target.closest("[data-grocery]");
    if (!cb) return;
    if (cb.checked) state.grocery[cb.dataset.grocery] = true; else delete state.grocery[cb.dataset.grocery];
    save();
    renderShop();
  });
  $("prepLists").addEventListener("change", onPrepChange);
  $("groceryReset").addEventListener("click", () => {
    if (!confirm(tUI("new_week_confirm"))) return;
    state.grocery = {};
    save();
    renderShop();
  });
}

// ============================================================
// MOVE
// ============================================================
function renderMove() {
  $("workoutName").innerHTML = '<span class="h-icon">' + icon("dumbbell") + "</span>" + esc(t(WORKOUT.name));
  $("workoutLink").innerHTML = esc(tUI("open_video")) + " " + icon("external");
  $("workoutLink").href = WORKOUT.link;
  const mon = mondayOf(todayIso());
  let planned = 0, doneN = 0;
  $("weekStrip").innerHTML = PLAN.map((p, i) => {
    const iso = addDays(mon, i);
    const type = workoutType(iso);
    const d = getDay(iso);
    if (type === "workout") { planned++; if (d.workout) doneN++; }
    const future = iso > todayIso();
    const done = type !== "rest" && d.workout;
    const clickable = type !== "rest" && !future;
    return '<button type="button" class="wday ' + type + (done ? " done" : "") + (iso === todayIso() ? " today" : "") + (future ? " future" : "") +
      '"' + (clickable ? ' data-wday="' + iso + '"' : " disabled") + ">" +
      '<span class="wday-name">' + esc(t(p.day).slice(0, lang === "ar" ? 10 : 3)) + "</span>" +
      '<span class="wday-icon">' + (done ? icon("tick") : icon(WORKOUT.types[type].icon)) + "</span>" +
      '<span class="wday-type">' + esc(t(WORKOUT.types[type].name).split(" / ")[0]) + "</span></button>";
  }).join("");
  $("weekCount").textContent = tUI("this_week", { n: doneN, t: planned });
  $("workoutNotes").innerHTML = WORKOUT.notes.map(n => "<li>" + esc(t(n)) + "</li>").join("");
}
function bindMove() {
  $("weekStrip").addEventListener("click", e => {
    const b = e.target.closest("[data-wday]");
    if (!b) return;
    const iso = b.dataset.wday;
    const d = getDay(iso);
    d.workout = !d.workout;
    state.days[iso] = d;
    save();
    renderMove();
    renderToday();
  });
}

// ============================================================
// PROGRESS
// ============================================================
const charts = {};
function sortedEntries(arr) { return arr.slice().sort((a, b) => a.date.localeCompare(b.date)); }
function renderProgress() {
  const pr = profile();
  const ws = sortedEntries(state.weights);
  const zs = sortedEntries(state.waists);
  const cur = ws.length ? ws[ws.length - 1].kg : null;
  const delta = cur != null ? cur - pr.startWeight : null;
  const lastWaist = zs.length ? zs[zs.length - 1] : null;
  const waistDelta = zs.length > 1 ? zs[zs.length - 1].cm - zs[0].cm : null;
  let next;
  if (!lastWaist) next = tUI("waist_first");
  else {
    const age = daysBetween(lastWaist.date, todayIso());
    if (age >= PROGRESS.waistOverdueDays) next = tUI("waist_overdue");
    else if (age >= PROGRESS.waistDueDays) next = tUI("waist_due_now");
    else next = tUI("waist_in", { n: PROGRESS.waistDueDays - age });
  }
  const sign = v => (v > 0 ? "+" : "") + num(v, 1);
  const stat = (lbl, val, cls) => '<div class="stat' + (cls ? " " + cls : "") + '"><span class="stat-val"><bdi>' + esc(val) + '</bdi></span><span class="stat-lbl">' + esc(lbl) + "</span></div>";
  $("progressStats").innerHTML =
    stat(tUI("start_w"), num(pr.startWeight, 1) + " " + u("kg")) +
    stat(tUI("current_w"), cur != null ? num(cur, 1) + " " + u("kg") : "-") +
    stat(tUI("change"), delta != null ? sign(delta) + " " + u("kg") : "-", delta != null && delta < 0 ? "good" : "") +
    stat(tUI("waist_last"), lastWaist ? num(lastWaist.cm, 1) + " " + u("cm") : "-") +
    stat(tUI("waist_change"), waistDelta != null ? sign(waistDelta) + " " + u("cm") : "-", waistDelta != null && waistDelta < 0 ? "good" : "") +
    stat(tUI("waist_next"), next, lastWaist && daysBetween(lastWaist.date, todayIso()) >= PROGRESS.waistDueDays ? "due" : "");
  $("waistNote").textContent = t(PROGRESS.note);

  const listHtml = (arr, key, unit, kind) => arr.length
    ? arr.slice().reverse().map(e => '<div class="row"><span>' + esc(formatDate(e.date)) + '</span><span class="row-end"><bdi>' + num(e[key], 1) + " " + u(unit) +
        '</bdi><button type="button" class="icon-btn sm" data-del-' + kind + '="' + e.date + '" aria-label="' + esc(tUI("remove")) + '">' + icon("trash") + "</button></span></div>").join("")
    : '<p class="hint">' + esc(tUI("no_entries")) + "</p>";
  $("weightEntries").innerHTML = listHtml(ws, "kg", "kg", "weight");
  $("waistEntries").innerHTML = listHtml(zs, "cm", "cm", "waist");
  if ($("progress").classList.contains("active")) renderCharts();
}
function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
function renderCharts() {
  if (typeof Chart === "undefined") return;
  const draw = (id, arr, key, color) => {
    const pts = sortedEntries(arr);
    if (charts[id]) charts[id].destroy();
    const canvas = $(id);
    canvas.parentElement.hidden = pts.length < 2;
    if (pts.length < 2) return;
    charts[id] = new Chart(canvas, {
      type: "line",
      data: { labels: pts.map(e => formatDate(e.date, false)), datasets: [{ data: pts.map(e => e[key]), borderColor: color, backgroundColor: color, tension: 0.3, pointRadius: 3, borderWidth: 2 }] },
      options: {
        maintainAspectRatio: false, animation: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { reverse: lang === "ar", ticks: { color: cssVar("--muted") }, grid: { display: false } },
          y: { position: lang === "ar" ? "right" : "left", ticks: { color: cssVar("--muted") }, grid: { color: cssVar("--divider") } }
        }
      }
    });
  };
  draw("weightChart", state.weights, "kg", cssVar("--primary"));
  draw("waistChart", state.waists, "cm", cssVar("--accent"));
}
function upsertEntry(arr, date, key, value) {
  const i = arr.findIndex(e => e.date === date);
  const e = { date }; e[key] = value;
  if (i >= 0) arr[i] = e; else arr.push(e);
}
function bindProgress() {
  $("weightDate").value = todayIso();
  $("waistDate").value = todayIso();
  $("addWeight").addEventListener("click", () => {
    const v = parseFloat($("weightInput").value);
    const date = $("weightDate").value || todayIso();
    if (!(v > 20 && v < 300)) return;
    upsertEntry(state.weights, date, "kg", v);
    save(); $("weightInput").value = ""; renderProgress(); toast(tUI("saved"));
  });
  $("addWaist").addEventListener("click", () => {
    const v = parseFloat($("waistInput").value);
    const date = $("waistDate").value || todayIso();
    if (!(v > 30 && v < 250)) return;
    upsertEntry(state.waists, date, "cm", v);
    save(); $("waistInput").value = ""; renderProgress(); toast(tUI("saved"));
  });
  $("progress").addEventListener("click", e => {
    const w = e.target.closest("[data-del-weight]");
    const z = e.target.closest("[data-del-waist]");
    if (w) state.weights = state.weights.filter(x => x.date !== w.dataset.delWeight);
    else if (z) state.waists = state.waists.filter(x => x.date !== z.dataset.delWaist);
    else return;
    save(); renderProgress();
  });
}

// ============================================================
// CALENDAR
// ============================================================
const AR_DOW = ["ن","ث","ر","خ","ج","س","ح"];
const EN_DOW = ["M","T","W","T","F","S","S"];
function renderCalendar() {
  const [y, m] = calMonth.split("-").map(Number);
  $("monthLabel").textContent = monthName(m - 1) + " " + y;
  const first = isoOf(new Date(y, m - 1, 1));
  const daysIn = new Date(y, m, 0).getDate();
  const lead = planIdx(first);
  const now = todayIso();
  let h = (lang === "ar" ? AR_DOW : EN_DOW).map(x => '<div class="cal-dow">' + x + "</div>").join("");
  for (let i = 0; i < lead; i++) h += '<div class="cal-cell empty"></div>';
  for (let dnum = 1; dnum <= daysIn; dnum++) {
    const iso = isoOf(new Date(y, m - 1, dnum));
    const future = iso > now;
    const before = iso < state.startDate;
    let lvl = "none", sc = 0;
    if (!future && !before && state.days[iso]) {
      sc = score(iso);
      lvl = sc >= 8 ? "4" : sc >= GOOD_DAY ? "3" : sc >= 5 ? "2" : sc >= 1 ? "1" : "0";
    }
    const disabled = future || before;
    h += '<button type="button" class="cal-cell" data-level="' + lvl + '"' + (iso === now ? ' data-today="1"' : "") +
      (disabled ? " disabled" : ' data-cal="' + iso + '"') + ' aria-label="' + esc(formatDate(iso)) + (lvl !== "none" ? ", " + sc + "/9" : "") + '">' +
      "<span>" + dnum + "</span>" + (lvl !== "none" ? '<small>' + sc + "</small>" : "") + "</button>";
  }
  $("calGrid").innerHTML = h;
  $("nextMonth").disabled = calMonth >= now.slice(0, 7);
}
function bindCalendar() {
  const shift = n => {
    const [y, m] = calMonth.split("-").map(Number);
    calMonth = isoOf(new Date(y, m - 1 + n, 1)).slice(0, 7);
    renderCalendar();
  };
  $("prevMonth").addEventListener("click", () => shift(-1));
  $("nextMonth").addEventListener("click", () => shift(1));
  $("calGrid").addEventListener("click", e => {
    const b = e.target.closest("[data-cal]");
    if (!b) return;
    viewDate = b.dataset.cal;
    switchToTab("today");
  });
}

// ============================================================
// GUIDE
// ============================================================
function renderGuide() {
  const pr = profile();
  $("guideGoal").textContent = t(GOAL);
  const stat = (lbl, val) => '<div class="stat"><span class="stat-val"><bdi>' + esc(val) + '</bdi></span><span class="stat-lbl">' + esc(lbl) + "</span></div>";
  $("guideDetails").innerHTML =
    stat(tUI("age"), pr.age + " " + tUI("years")) +
    stat(tUI("height").replace(/ \(.*\)/, ""), pr.height + " " + u("cm")) +
    stat(tUI("start_weight").replace(/ \(.*\)/, ""), num(pr.startWeight, 1) + " " + u("kg")) +
    stat("", t(pr.condition)) +
    stat("", t(pr.medication));
  const T = TARGETS;
  const row = (k, T, unit) => "<tr><td>" + esc(tUI(k)) + "</td><td><bdi>" + rangeLabel(T.min.toLocaleString("en"), T.max.toLocaleString("en")) + " " + esc(u(unit)) + "</bdi></td></tr>";
  $("guideTargets").innerHTML = "<table><thead><tr><th>" + esc(tUI("col_nutrient")) + "</th><th>" + esc(tUI("col_target")) + "</th></tr></thead><tbody>" +
    row("ck_kcal", T.kcal, "kcal") + row("ck_protein", T.protein, "g") + row("carbs", T.carbs, "g") + row("fat", T.fat, "g") + row("ck_fiber", T.fiber, "g") +
    "<tr><td>" + esc(tUI("ck_water")) + "</td><td><bdi>2-2.5 " + esc(u("L")) + "</bdi></td></tr></tbody></table>";
  $("targetsNote").textContent = t(TARGETS_NOTE);
  $("guideStructure").innerHTML = "<table><tbody>" + SLOTS.map(s => "<tr><td>" + esc(t(s.name)) + "</td><td><bdi>" + s.kcal[0] + "-" + s.kcal[1] + " " + esc(u("kcal")) + "</bdi></td></tr>").join("") +
    "</tbody></table><p class=\"hint\">" + esc(t(EXTRA_NOTE)) + "</p>";
  $("guideRules").innerHTML = RULES.map(r => "<li>" + esc(t(r)) + "</li>").join("");
  $("metforminNote").textContent = t(METFORMIN_NOTE);
  $("guidePortions").textContent = t(PORTION_RULES);
  $("guideProgress").textContent = t(PROGRESS.note);
}

// ============================================================
// SETTINGS
// ============================================================
const LABEL_FOODS = Object.keys(FOODS).filter(k => FOODS[k].label);
function renderSettings() {
  $("startDateInput").value = state.startDate;
  const pr = profile();
  $("pAge").value = pr.age;
  $("pHeight").value = pr.height;
  $("pWeight").value = pr.startWeight;
  $("labelForms").innerHTML = LABEL_FOODS.map(id => {
    const f = food(id);
    const field = (k) => '<label><span>' + esc(tUI("l_" + k)) + '</span><input type="number" step="0.1" min="0" data-label="' + id + '" data-k="' + k + '" value="' + f[k] + '"></label>';
    return '<div class="label-food"><h4>' + esc(cap(t(f.name))) + ' <span class="muted">/ 100 ' + esc(u(f.unit)) + "</span></h4>" +
      '<div class="form-grid four">' + field("kcal") + field("p") + field("c") + field("f") + "</div></div>";
  }).join("");
}
function bindSettings() {
  $("saveStart").addEventListener("click", () => {
    const v = $("startDateInput").value;
    if (!v) return;
    state.startDate = v > todayIso() ? todayIso() : v;
    save(); renderAll(); toast(tUI("saved"));
  });
  $("saveProfile").addEventListener("click", () => {
    const n = id => { const v = parseFloat($(id).value); return isNaN(v) ? null : v; };
    state.profile = { age: n("pAge"), height: n("pHeight"), startWeight: n("pWeight") };
    save(); renderAll(); toast(tUI("saved"));
  });
  $("saveLabels").addEventListener("click", () => {
    const labels = {};
    document.querySelectorAll("[data-label]").forEach(inp => {
      const id = inp.dataset.label, k = inp.dataset.k, v = parseFloat(inp.value);
      if (isNaN(v) || v === FOODS[id][k]) return;
      labels[id] = labels[id] || {};
      labels[id][k] = v;
    });
    state.labels = labels;
    save(); renderAll(); toast(tUI("saved"));
  });
  $("resetLabels").addEventListener("click", () => { state.labels = {}; save(); renderAll(); });
  $("exportData").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "lynn-plan-backup-" + todayIso() + ".json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $("importData").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        if (!data || typeof data !== "object" || typeof data.days !== "object") throw new Error("bad");
        state = Object.assign(defaultState(), data);
        save(); renderAll(); toast(tUI("imported"));
      } catch (err) { toast(tUI("import_bad")); }
      e.target.value = "";
    };
    r.readAsText(file);
  });
  $("resetAll").addEventListener("click", () => {
    if (!confirm(tUI("reset_confirm"))) return;
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
    location.reload();
  });
}

// ============================================================
// Shell: tabs, language, header
// ============================================================
function switchToTab(name) {
  document.querySelectorAll(".tab").forEach(tb => {
    const on = tb.dataset.tab === name;
    tb.classList.toggle("active", on);
    tb.setAttribute("aria-selected", on ? "true" : "false");
  });
  document.querySelectorAll("main > section").forEach(s => s.classList.toggle("active", s.id === name));
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (name === "today") renderToday();
  if (name === "progress") renderCharts();
  if (name === "calendar") renderCalendar();
  if (name === "move") renderMove();
}
function renderHeader() {
  const n = daysBetween(state.startDate, todayIso());
  $("weekBadge").textContent = n >= 0 ? tUI("weekBadge", { w: Math.floor(n / 7) + 1, d: n + 1 }) : "";
}
function applyLanguage() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = tUI("docTitle");
  $("langToggle").textContent = tUI("btn_lang");
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const txt = tUI(el.dataset.i18n);
    if (el.dataset.icon) el.innerHTML = icon(el.dataset.icon) + '<span class="tab-label">' + esc(txt) + "</span>";
    else el.textContent = txt;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => { el.placeholder = tUI(el.dataset.i18nPlaceholder); });
  const back = lang === "ar" ? "chevR" : "chevL", fwd = lang === "ar" ? "chevL" : "chevR";
  ["prevDay", "prevMonth"].forEach(id => { $(id).innerHTML = icon(back); });
  ["nextDay", "nextMonth"].forEach(id => { $(id).innerHTML = icon(fwd); });
  renderAll();
}
function renderAll() {
  renderHeader();
  renderExtraSelect();
  renderToday();
  renderPlan();
  renderSwaps();
  renderShop();
  renderMove();
  renderProgress();
  renderCalendar();
  renderGuide();
  renderSettings();
}

document.querySelectorAll(".tab").forEach(tb => tb.addEventListener("click", () => switchToTab(tb.dataset.tab)));
$("planDays").addEventListener("click", e => {
  const b = e.target.closest("[data-day]");
  if (!b) return;
  planDay = +b.dataset.day;
  renderPlan();
});
$("langToggle").addEventListener("click", () => {
  lang = lang === "ar" ? "en" : "ar";
  lsSet(LANG_KEY, lang);
  applyLanguage();
});
bindToday();
bindShop();
bindMove();
bindProgress();
bindCalendar();
bindSettings();
applyLanguage();

// Day rolls over while the app stays open (e.g. PWA left running overnight)
let lastSeenToday = todayIso();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") return;
  const now = todayIso();
  if (now === lastSeenToday) return;
  if (viewDate === lastSeenToday || viewDate > now) viewDate = now;
  lastSeenToday = now;
  renderAll();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

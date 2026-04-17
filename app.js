// ============================================================
// LYNN KETO — App logic (bilingual ar/en)
// ============================================================

const LS_KEY = "lynn-keto-v1";
const LANG_KEY = "lynn-keto-lang";

let lang = localStorage.getItem(LANG_KEY) || "ar";

// ---------- i18n helpers ----------
function t(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  return x[lang] ?? x.ar ?? x.en ?? "";
}
function tUI(key, vars) {
  let s = t(UI[key]);
  if (vars) Object.entries(vars).forEach(([k,v]) => { s = s.replace("{"+k+"}", v); });
  return s;
}
function localizedNumber(n) {
  return String(n);
}

// ---------- Storage ----------
function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch (e) { return defaultState(); }
}
function saveState() { localStorage.setItem(LS_KEY, JSON.stringify(state)); }
function defaultState() {
  return {
    startDate: null,
    days: {},
    weights: [],
    favorites: [],
    shopping: {},
    photos: []
  };
}
let state = loadState();

// ---------- Date helpers ----------
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}
const AR_MONTHS = ["كانون الثاني","شباط","آذار","نيسان","أيار","حزيران","تموز","آب","أيلول","تشرين الأول","تشرين الثاني","كانون الأول"];
const AR_DAYS = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const EN_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const EN_DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function formatDate(iso) {
  const d = new Date(iso);
  const date = d.getDate();
  const year = d.getFullYear();
  if (lang === "en") {
    return `${EN_DAYS[d.getDay()]}, ${date} ${EN_MONTHS[d.getMonth()]} ${year}`;
  }
  return `${AR_DAYS[d.getDay()]}، ${date} ${AR_MONTHS[d.getMonth()]} ${year}`;
}
function dayNumber() {
  if (!state.startDate) return null;
  return daysBetween(state.startDate, today()) + 1;
}
function ensureDay(iso) {
  if (!state.days[iso]) {
    state.days[iso] = { water: 0, meals: { breakfast:false, lunch:false, dinner:false, snack1:false, snack2:false } };
  }
  return state.days[iso];
}

// ---------- Language switch ----------
function applyLanguage() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
  document.title = lang === "en" ? "Keto Plan — Lynn Hamad" : "نظام الكيتو - Lynn Hamad";
  document.getElementById("langToggle").textContent = t(UI.btn_lang);
  // Apply static UI strings via data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (UI[key]) el.textContent = t(UI[key]);
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const key = el.dataset.i18nHtml;
    if (UI[key]) el.innerHTML = t(UI[key]);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (UI[key]) el.placeholder = t(UI[key]);
  });
  renderAll();
}

// ---------- Tabs ----------
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (tab.dataset.tab === "weight") renderWeightChart();
    if (tab.dataset.tab === "calendar") renderCalendar();
    if (tab.dataset.tab === "favorites") renderFavorites();
  });
});

// ---------- TODAY ----------
function renderToday() {
  const iso = today();
  const dayData = ensureDay(iso);

  document.getElementById("todayDate").textContent = formatDate(iso);
  const n = dayNumber();
  document.getElementById("statDay").textContent = n ? localizedNumber(n) : "—";
  document.getElementById("dayBadge").textContent = n
    ? tUI("dayBadge", { n: localizedNumber(n), total: localizedNumber(PERSON.durationDays) })
    : t(UI.notStarted);
  document.getElementById("statWater").textContent = `${localizedNumber(dayData.water)}/8`;
  const mealCount = Object.values(dayData.meals).filter(Boolean).length;
  document.getElementById("statMeals").textContent = `${localizedNumber(mealCount)}/5`;
  document.getElementById("statStreak").textContent = `${localizedNumber(currentStreak())} 🔥`;

  const dayScore = mealCount + (dayData.water >= 8 ? 1 : 0);
  document.getElementById("dayProgress").style.width = ((dayScore/6)*100) + "%";

  // Water cups
  const wt = document.getElementById("waterTracker");
  wt.innerHTML = "";
  for (let i = 1; i <= 8; i++) {
    const cup = document.createElement("div");
    cup.className = "water-cup" + (i <= dayData.water ? " filled" : "");
    cup.textContent = i <= dayData.water ? "💧" : "";
    cup.addEventListener("click", () => {
      dayData.water = dayData.water >= i ? i - 1 : i;
      saveState(); renderToday();
    });
    wt.appendChild(cup);
  }

  // Meals
  const mealOrder = [
    ["breakfast","🍳","meal_breakfast"],
    ["snack1","🥤","meal_snack1"],
    ["lunch","🍽️","meal_lunch"],
    ["snack2","🥜","meal_snack2"],
    ["dinner","🌙","meal_dinner"]
  ];
  const mealsDiv = document.getElementById("todayMeals");
  mealsDiv.innerHTML = "";
  mealOrder.forEach(([key, icon, uiKey]) => {
    const done = dayData.meals[key];
    const row = document.createElement("div");
    row.className = "meal-check" + (done ? " done" : "");
    row.innerHTML = `
      <span class="meal-icon">${icon}</span>
      <div class="meal-body">
        <div class="meal-title">${t(UI[uiKey])}</div>
        <div class="meal-sub">${done ? t(UI.meal_done) : t(UI.meal_not_done)}</div>
      </div>
      <div class="meal-actions">
        <button class="btn-sm" data-random="${key}">🎲</button>
        <button class="btn-sm ${done ? "" : "success"}" data-toggle="${key}">${done ? t(UI.btn_undo) : t(UI.btn_done)}</button>
      </div>
    `;
    mealsDiv.appendChild(row);
  });
  mealsDiv.querySelectorAll("[data-toggle]").forEach(b => {
    b.addEventListener("click", () => {
      const k = b.dataset.toggle;
      dayData.meals[k] = !dayData.meals[k];
      saveState(); renderToday();
    });
  });
  mealsDiv.querySelectorAll("[data-random]").forEach(b => {
    b.addEventListener("click", () => openRandom(b.dataset.random));
  });
}
function currentStreak() {
  if (!state.startDate) return 0;
  let streak = 0;
  let d = new Date(today());
  while (true) {
    const iso = d.toISOString().slice(0,10);
    const dd = state.days[iso];
    if (!dd) break;
    const count = Object.values(dd.meals).filter(Boolean).length;
    if (count >= 3 && dd.water >= 6) streak++;
    else break;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// ---------- MEAL LISTS ----------
function renderMealList(containerId, meals) {
  const c = document.getElementById(containerId);
  c.innerHTML = "";
  meals.forEach(m => {
    const fav = state.favorites.includes(m.id);
    const div = document.createElement("div");
    div.className = "option" + (fav ? " fav" : "");
    const title = m.title ? ` — ${t(m.title)}` : "";
    div.innerHTML = `
      <div class="option-header">
        <div class="option-title">${t(UI.option_label)} ${t(m.num)}${title}</div>
        <button class="fav-btn ${fav ? "active" : ""}" data-fav="${m.id}">${fav ? "❤️" : "🤍"}</button>
      </div>
      <div class="option-body">
        <ul>${m.items.map(x => `<li>${t(x)}</li>`).join("")}</ul>
        ${m.note ? `<div class="note">${t(m.note)}</div>` : ""}
      </div>
    `;
    c.appendChild(div);
  });
  c.querySelectorAll("[data-fav]").forEach(b => {
    b.addEventListener("click", () => {
      const id = b.dataset.fav;
      const idx = state.favorites.indexOf(id);
      if (idx === -1) state.favorites.push(id);
      else state.favorites.splice(idx, 1);
      saveState();
      renderAllMealLists();
      renderFavorites();
    });
  });
}
function renderAllMealLists() {
  renderMealList("breakfastList", BREAKFAST);
  renderMealList("lunchList", LUNCH);
  renderMealList("dinnerList", DINNER);
  renderMealList("snack1List", SNACK1);
  renderMealList("snack2List", SNACK2);
}

// ---------- Random picker ----------
const MEAL_POOL = { breakfast: BREAKFAST, lunch: LUNCH, dinner: DINNER, snack1: SNACK1, snack2: SNACK2 };
const MEAL_LABEL_KEY = { breakfast:"meal_breakfast", lunch:"meal_lunch", dinner:"meal_dinner", snack1:"meal_snack1", snack2:"meal_snack2" };
const MEAL_ICON = { breakfast:"🍳", lunch:"🍽️", dinner:"🌙", snack1:"🥤", snack2:"🥜" };
let currentRandomCategory = null;

function openRandom(cat) {
  currentRandomCategory = cat;
  document.getElementById("modalPickAgain").style.display = "";
  pickRandom();
  document.getElementById("modal").classList.add("show");
}
function pickRandom() {
  const pool = MEAL_POOL[currentRandomCategory];
  const pick = pool[Math.floor(Math.random() * pool.length)];
  const label = `${MEAL_ICON[currentRandomCategory]} ${t(UI[MEAL_LABEL_KEY[currentRandomCategory]])}`;
  const titleStr = pick.title ? t(pick.title) : `${t(UI.option_label)} ${t(pick.num)}`;
  document.getElementById("modalTitle").textContent = `${label} — ${titleStr}`;
  document.getElementById("modalBody").innerHTML = `
    <ul style="padding-inline-start:18px">${pick.items.map(x => `<li style="margin-bottom:4px">${t(x)}</li>`).join("")}</ul>
    ${pick.note ? `<div class="note">${t(pick.note)}</div>` : ""}
  `;
}
document.getElementById("modalClose").addEventListener("click", () => {
  document.getElementById("modal").classList.remove("show");
});
document.getElementById("modalPickAgain").addEventListener("click", pickRandom);
document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") e.target.classList.remove("show");
});

// ---------- SHOPPING ----------
function renderShopping() {
  const c = document.getElementById("shoppingList");
  c.innerHTML = "";
  SHOPPING.forEach(category => {
    const div = document.createElement("div");
    div.className = "shop-category";
    div.innerHTML = `<h4>${t(category.title)}</h4>`;
    category.items.forEach(item => {
      const key = item.ar; // stable across languages
      const checked = !!state.shopping[key];
      const wrap = document.createElement("div");
      wrap.className = "checkbox-wrap";
      const id = "shop-" + btoa(unescape(encodeURIComponent(key))).replace(/=/g,"");
      wrap.innerHTML = `
        <input type="checkbox" id="${id}" ${checked ? "checked" : ""} />
        <label for="${id}">${t(item)}</label>
      `;
      wrap.querySelector("input").addEventListener("change", e => {
        state.shopping[key] = e.target.checked;
        saveState();
      });
      div.appendChild(wrap);
    });
    c.appendChild(div);
  });
}
document.getElementById("shopResetBtn").addEventListener("click", () => {
  if (!confirm(t(UI.shop_reset_confirm))) return;
  state.shopping = {}; saveState(); renderShopping();
});
document.getElementById("shopCheckAllBtn").addEventListener("click", () => {
  SHOPPING.forEach(cat => cat.items.forEach(it => { state.shopping[it.ar] = true; }));
  saveState(); renderShopping();
});

// ---------- ALLOWED ----------
function renderAllowed() {
  document.getElementById("vegPills").innerHTML = VEGETABLES.map(v => `<li>${t(v)}</li>`).join("");
  document.getElementById("drinksPills").innerHTML = DRINKS.map(d => `<li>${t(d)}</li>`).join("");
  document.getElementById("saucesTable").innerHTML = SAUCES.map(s =>
    `<tr><td>${t(s.name)}</td><td>${t(s.qty)}</td></tr>`
  ).join("");
  document.getElementById("fatTable").innerHTML = FAT_EXCHANGE.map(([n,q]) =>
    `<tr><td>${t(n)}</td><td>${t(q)}</td></tr>`
  ).join("");
}

// ---------- WEIGHT ----------
document.getElementById("weightDate").value = today();
document.getElementById("addWeight").addEventListener("click", () => {
  const date = document.getElementById("weightDate").value;
  const kg = parseFloat(document.getElementById("weightInput").value);
  if (!date || !kg || isNaN(kg)) { alert(t(UI.date_value_invalid)); return; }
  state.weights = state.weights.filter(w => w.date !== date);
  state.weights.push({ date, kg });
  state.weights.sort((a,b) => a.date.localeCompare(b.date));
  saveState();
  document.getElementById("weightInput").value = "";
  renderWeight();
});

function renderWeight() {
  if (state.weights.length === 0) {
    document.getElementById("currentWeight").textContent = "—";
    document.getElementById("weightLost").textContent = "—";
    document.getElementById("toGoal").textContent = "—";
  } else {
    const last = state.weights[state.weights.length - 1];
    const first = state.weights[0];
    document.getElementById("currentWeight").textContent = last.kg.toFixed(1);
    document.getElementById("weightLost").textContent = (first.kg - last.kg).toFixed(1);
    document.getElementById("toGoal").textContent = Math.max(0, (last.kg - PERSON.ibw)).toFixed(1);
  }
  const entries = document.getElementById("weightEntries");
  entries.innerHTML = "";
  [...state.weights].reverse().forEach(w => {
    const row = document.createElement("div");
    row.className = "weight-row";
    row.innerHTML = `
      <span>${formatDate(w.date)}</span>
      <span><strong>${w.kg.toFixed(1)} ${t(UI.kg)}</strong>
        <button class="del" data-date="${w.date}">🗑️</button>
      </span>
    `;
    entries.appendChild(row);
  });
  entries.querySelectorAll(".del").forEach(b => {
    b.addEventListener("click", () => {
      state.weights = state.weights.filter(w => w.date !== b.dataset.date);
      saveState(); renderWeight(); renderWeightChart();
    });
  });
  renderWeightChart();
}
let chartInstance = null;
function renderWeightChart() {
  if (!window.Chart) return;
  const ctx = document.getElementById("weightChart");
  if (!ctx) return;
  if (chartInstance) chartInstance.destroy();
  const labels = state.weights.map(w => w.date.slice(5));
  const data = state.weights.map(w => w.kg);
  const ibwLine = state.weights.map(() => PERSON.ibw);
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: t(UI.chart_weight), data, borderColor:"#d62828", backgroundColor:"rgba(214,40,40,.1)", tension:.3, fill:true },
        { label: t(UI.chart_goal), data: ibwLine, borderColor:"#2d6a4f", borderDash:[6,4], fill:false, pointRadius:0 }
      ]
    },
    options: { responsive:true, plugins:{ legend:{ position:"bottom" } } }
  });
}

// ---------- CALENDAR ----------
function renderCalendar() {
  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";
  if (!state.startDate) {
    grid.innerHTML = `<div style="grid-column:1/-1" class="note">${t(UI.cal_no_start)}</div>`;
    return;
  }
  const start = new Date(state.startDate);
  const todayIso = today();
  for (let i = 0; i < PERSON.durationDays; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0,10);
    const dd = state.days[iso];
    let score = 0;
    if (dd) score = Object.values(dd.meals).filter(Boolean).length + (dd.water >= 8 ? 1 : 0);
    const cell = document.createElement("div");
    cell.className = "cal-day";
    cell.dataset.score = score;
    cell.textContent = localizedNumber(i+1);
    if (iso === todayIso) cell.classList.add("today");
    if (iso > todayIso) cell.classList.add("future");
    cell.title = `${iso} — ${score}/6`;
    cell.addEventListener("click", () => {
      if (iso > todayIso) return;
      showDayDetails(iso, i+1);
    });
    grid.appendChild(cell);
  }
}
function showDayDetails(iso, dayNum) {
  const dd = state.days[iso] || { water: 0, meals: {} };
  const mealKeys = { breakfast:"meal_breakfast", snack1:"meal_snack1", lunch:"meal_lunch", snack2:"meal_snack2", dinner:"meal_dinner" };
  const mealsHtml = Object.entries(mealKeys).map(([k, uiKey]) =>
    `<li>${dd.meals[k] ? "✅" : "⬜"} ${t(UI[uiKey])}</li>`
  ).join("");
  document.getElementById("modalTitle").textContent = `${t(UI.day_label)} ${localizedNumber(dayNum)} — ${formatDate(iso)}`;
  document.getElementById("modalBody").innerHTML = `
    <p>💧 <strong>${localizedNumber(dd.water)}/8</strong> ${t(UI.water_cups)}</p>
    <ul style="padding-inline-start:18px">${mealsHtml}</ul>
  `;
  document.getElementById("modalPickAgain").style.display = "none";
  document.getElementById("modal").classList.add("show");
}

// ---------- FAVORITES ----------
function renderFavorites() {
  const all = [...BREAKFAST, ...LUNCH, ...DINNER, ...SNACK1, ...SNACK2];
  const favs = all.filter(m => state.favorites.includes(m.id));
  const c = document.getElementById("favoritesList");
  if (favs.length === 0) {
    c.innerHTML = `<div class="note">${t(UI.fav_empty)}</div>`;
    return;
  }
  c.innerHTML = "";
  favs.forEach(m => {
    const div = document.createElement("div");
    div.className = "option fav";
    const title = m.title ? ` — ${t(m.title)}` : "";
    div.innerHTML = `
      <div class="option-header">
        <div class="option-title">${mealCategoryOf(m.id)} — ${t(UI.option_label)} ${t(m.num)}${title}</div>
        <button class="fav-btn active" data-fav="${m.id}">❤️</button>
      </div>
      <div class="option-body">
        <ul>${m.items.map(x => `<li>${t(x)}</li>`).join("")}</ul>
      </div>
    `;
    c.appendChild(div);
  });
  c.querySelectorAll("[data-fav]").forEach(b => {
    b.addEventListener("click", () => {
      const id = b.dataset.fav;
      state.favorites = state.favorites.filter(x => x !== id);
      saveState(); renderFavorites(); renderAllMealLists();
    });
  });
}
function mealCategoryOf(id) {
  if (id.startsWith("b")) return "🍳 " + t(UI.meal_breakfast);
  if (id.startsWith("l")) return "🍽️ " + t(UI.meal_lunch);
  if (id.startsWith("d")) return "🌙 " + t(UI.meal_dinner);
  if (id.startsWith("s1")) return "🥤 " + t(UI.meal_snack1);
  if (id.startsWith("s2")) return "🥜 " + t(UI.meal_snack2);
  return "";
}

// ---------- PHOTOS ----------
document.getElementById("photoInput").addEventListener("change", async e => {
  const file = e.target.files[0]; if (!file) return;
  const compressed = await compressImage(file, 800);
  state.photos.push({ id: Date.now().toString(), date: today(), data: compressed });
  try { saveState(); renderPhotos(); }
  catch (err) { alert(t(UI.photo_full)); state.photos.pop(); }
  e.target.value = "";
});
function compressImage(file, maxWidth) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
function renderPhotos() {
  const grid = document.getElementById("photoGrid");
  grid.innerHTML = "";
  [...state.photos].reverse().forEach(p => {
    const div = document.createElement("div");
    div.className = "photo-item";
    div.innerHTML = `<img src="${p.data}" alt="" /><div class="date">${p.date}</div><button class="del" data-id="${p.id}">✕</button>`;
    grid.appendChild(div);
  });
  grid.querySelectorAll(".del").forEach(b => {
    b.addEventListener("click", () => {
      if (!confirm(t(UI.photo_delete_confirm))) return;
      state.photos = state.photos.filter(p => p.id !== b.dataset.id);
      saveState(); renderPhotos();
    });
  });
}

// ---------- SETTINGS ----------
document.getElementById("startDateInput").value = state.startDate || today();
document.getElementById("saveStartDate").addEventListener("click", () => {
  const v = document.getElementById("startDateInput").value;
  if (!v) { alert(t(UI.choose_date)); return; }
  state.startDate = v;
  saveState(); renderToday(); renderCalendar(); renderStartDateDisplay();
  alert(t(UI.start_saved));
});
function renderStartDateDisplay() {
  const setter = document.getElementById("startDateSetter");
  const locked = document.getElementById("startDateLocked");
  const lockedVal = document.getElementById("startDateLockedValue");
  if (!setter || !locked) return;
  if (state.startDate) {
    setter.style.display = "none";
    locked.style.display = "block";
    lockedVal.textContent = formatDate(state.startDate);
  } else {
    setter.style.display = "";
    locked.style.display = "none";
  }
}
function renderPersonInfo() {
  const c = document.getElementById("personInfo");
  const items = [
    [t(UI.info_name), PERSON.name],
    [t(UI.info_weight), PERSON.weight + " " + t(UI.kg)],
    [t(UI.info_height), PERSON.height + " " + t(UI.cm)],
    [t(UI.info_age), PERSON.age + " " + t(UI.years)],
    [t(UI.info_bmi), PERSON.bmi],
    [t(UI.info_ibw), PERSON.ibw + " " + t(UI.kg)],
    [t(UI.info_water), PERSON.waterCupsPerDay + " " + t(UI.cups_day)],
    [t(UI.info_duration), PERSON.durationDays + " " + t(UI.days)]
  ];
  c.innerHTML = items.map(([l,v]) => `<div class="info-item"><span>${l}</span><strong>${v}</strong></div>`).join("");
}
document.getElementById("exportData").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `lynn-keto-${today()}.json`; a.click();
  URL.revokeObjectURL(url);
});
document.getElementById("importData").addEventListener("change", async e => {
  const file = e.target.files[0]; if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!confirm(t(UI.import_confirm))) return;
    state = { ...defaultState(), ...data };
    saveState(); location.reload();
  } catch { alert(t(UI.invalid_file)); }
});
document.getElementById("resetAll").addEventListener("click", () => {
  if (!confirm(t(UI.reset_confirm1))) return;
  if (!confirm(t(UI.reset_confirm2))) return;
  localStorage.removeItem(LS_KEY); state = defaultState(); saveState(); location.reload();
});

// ---------- Language toggle button ----------
document.getElementById("langToggle").addEventListener("click", () => {
  lang = lang === "ar" ? "en" : "ar";
  localStorage.setItem(LANG_KEY, lang);
  applyLanguage();
});

// ---------- Render all ----------
function renderAll() {
  renderToday();
  renderAllMealLists();
  renderShopping();
  renderAllowed();
  renderWeight();
  renderCalendar();
  renderFavorites();
  renderPhotos();
  renderPersonInfo();
  renderStartDateDisplay();
}

// ---------- INIT ----------
applyLanguage();

// ---------- Service Worker ----------
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

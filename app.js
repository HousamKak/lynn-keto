// ============================================================
// LYNN KETO — App logic
// ============================================================

const LS_KEY = "lynn-keto-v1";

// ---------- Storage ----------
function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch (e) {
    console.error("loadState", e);
    return defaultState();
  }
}
function saveState() {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}
function defaultState() {
  return {
    startDate: null,        // "YYYY-MM-DD"
    days: {},               // { "YYYY-MM-DD": { water: 0, meals: { breakfast:bool, lunch:bool, dinner:bool, snack1:bool, snack2:bool } } }
    weights: [],            // [{ date, kg }]
    favorites: [],          // [mealId, ...]
    shopping: {},           // { itemKey: bool }
    photos: []              // [{ id, date, data (base64) }]
  };
}

let state = loadState();

// ---------- Date helpers ----------
function today() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
function daysBetween(a, b) {
  const da = new Date(a); const db = new Date(b);
  return Math.round((db - da) / 86400000);
}
function formatArDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("ar-EG", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
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

// ---------- TODAY tab ----------
function renderToday() {
  const iso = today();
  const dayData = ensureDay(iso);

  document.getElementById("todayDate").textContent = formatArDate(iso);
  const n = dayNumber();
  document.getElementById("statDay").textContent = n ? `${n}` : "—";
  document.getElementById("dayBadge").textContent = n ? `اليوم ${n} من ${PERSON.durationDays}` : "لم يبدأ بعد";
  document.getElementById("statWater").textContent = `${dayData.water}/8`;
  const mealCount = Object.values(dayData.meals).filter(Boolean).length;
  document.getElementById("statMeals").textContent = `${mealCount}/5`;
  document.getElementById("statStreak").textContent = `${currentStreak()} 🔥`;

  const dayScore = mealCount + (dayData.water >= 8 ? 1 : 0);
  const pct = (dayScore / 6) * 100;
  document.getElementById("dayProgress").style.width = pct + "%";

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

  // Meal checklist
  const mealOrder = [
    ["breakfast","🍳","الفطور"],
    ["snack1","🥤","سناك ١"],
    ["lunch","🍽️","الغداء"],
    ["snack2","🥜","سناك ٢"],
    ["dinner","🌙","العشاء"]
  ];
  const mealsDiv = document.getElementById("todayMeals");
  mealsDiv.innerHTML = "";
  mealOrder.forEach(([key, icon, label]) => {
    const done = dayData.meals[key];
    const row = document.createElement("div");
    row.className = "meal-check" + (done ? " done" : "");
    row.innerHTML = `
      <span class="meal-icon">${icon}</span>
      <div class="meal-body">
        <div class="meal-title">${label}</div>
        <div class="meal-sub">${done ? "✅ تم" : "لم يتم بعد"}</div>
      </div>
      <div class="meal-actions">
        <button class="btn-sm" data-random="${key}">🎲</button>
        <button class="btn-sm ${done ? "" : "success"}" data-toggle="${key}">${done ? "إلغاء" : "✓ تم"}</button>
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
    const title = m.title ? ` — ${m.title}` : "";
    div.innerHTML = `
      <div class="option-header">
        <div class="option-title">الخيار ${m.num}${title}</div>
        <button class="fav-btn ${fav ? "active" : ""}" data-fav="${m.id}" title="مفضلة">${fav ? "❤️" : "🤍"}</button>
      </div>
      <div class="option-body">
        <ul>${m.items.map(x => `<li>${x}</li>`).join("")}</ul>
        ${m.note ? `<div class="note">${m.note}</div>` : ""}
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
const MEAL_POOL = {
  breakfast: BREAKFAST, lunch: LUNCH, dinner: DINNER,
  snack1: SNACK1, snack2: SNACK2
};
const MEAL_LABEL = {
  breakfast: "🍳 فطور", lunch: "🍽️ غداء", dinner: "🌙 عشاء",
  snack1: "🥤 سناك ١", snack2: "🥜 سناك ٢"
};
let currentRandomCategory = null;

function openRandom(cat) {
  currentRandomCategory = cat;
  pickRandom();
  document.getElementById("modal").classList.add("show");
}
function pickRandom() {
  const pool = MEAL_POOL[currentRandomCategory];
  const pick = pool[Math.floor(Math.random() * pool.length)];
  document.getElementById("modalTitle").textContent = `${MEAL_LABEL[currentRandomCategory]} — ${pick.title ? pick.title : "الخيار " + pick.num}`;
  document.getElementById("modalBody").innerHTML = `
    <ul style="padding-right:18px">${pick.items.map(x => `<li style="margin-bottom:4px">${x}</li>`).join("")}</ul>
    ${pick.note ? `<div class="note">${pick.note}</div>` : ""}
  `;
}
document.querySelectorAll("[data-random]").forEach(b => {
  b.addEventListener("click", () => openRandom(b.dataset.random));
});
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
  Object.entries(SHOPPING).forEach(([category, items]) => {
    const div = document.createElement("div");
    div.className = "shop-category";
    div.innerHTML = `<h4>${category}</h4>`;
    items.forEach(item => {
      const key = category + "|" + item;
      const checked = !!state.shopping[key];
      const wrap = document.createElement("div");
      wrap.className = "checkbox-wrap";
      const id = "shop-" + btoa(unescape(encodeURIComponent(key))).replace(/=/g,"");
      wrap.innerHTML = `
        <input type="checkbox" id="${id}" ${checked ? "checked" : ""} />
        <label for="${id}">${item}</label>
      `;
      wrap.querySelector("input").addEventListener("change", (e) => {
        state.shopping[key] = e.target.checked;
        saveState();
      });
      div.appendChild(wrap);
    });
    c.appendChild(div);
  });
}
document.getElementById("shopResetBtn").addEventListener("click", () => {
  if (!confirm("مسح جميع العلامات؟")) return;
  state.shopping = {};
  saveState(); renderShopping();
});
document.getElementById("shopCheckAllBtn").addEventListener("click", () => {
  Object.entries(SHOPPING).forEach(([cat, items]) => {
    items.forEach(it => { state.shopping[cat + "|" + it] = true; });
  });
  saveState(); renderShopping();
});

// ---------- ALLOWED ----------
function renderAllowed() {
  document.getElementById("vegPills").innerHTML = VEGETABLES.map(v => `<li>${v}</li>`).join("");
  document.getElementById("drinksPills").innerHTML = DRINKS.map(d => `<li>${d}</li>`).join("");
  document.getElementById("saucesTable").innerHTML = SAUCES.map(s =>
    `<tr><td>${s.name}</td><td>${s.qty}</td></tr>`
  ).join("");
  document.getElementById("fatTable").innerHTML = FAT_EXCHANGE.map(([n,q]) =>
    `<tr><td>${n}</td><td>${q}</td></tr>`
  ).join("");
}

// ---------- WEIGHT ----------
document.getElementById("weightDate").value = today();
document.getElementById("addWeight").addEventListener("click", () => {
  const date = document.getElementById("weightDate").value;
  const kg = parseFloat(document.getElementById("weightInput").value);
  if (!date || !kg || isNaN(kg)) { alert("أدخلي تاريخ ووزن صحيح"); return; }
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
      <span>${formatArDate(w.date)}</span>
      <span><strong>${w.kg.toFixed(1)} كغ</strong>
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

  // Generate labels including IBW line
  const labels = state.weights.map(w => w.date.slice(5));
  const data = state.weights.map(w => w.kg);
  const ibwLine = state.weights.map(() => PERSON.ibw);

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "الوزن (كغ)",
          data,
          borderColor: "#d62828",
          backgroundColor: "rgba(214,40,40,.1)",
          tension: .3,
          fill: true
        },
        {
          label: "الهدف (IBW)",
          data: ibwLine,
          borderColor: "#2d6a4f",
          borderDash: [6,4],
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
      scales: { y: { beginAtZero: false } }
    }
  });
}

// ---------- CALENDAR ----------
function renderCalendar() {
  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";
  if (!state.startDate) {
    grid.innerHTML = `<div style="grid-column:1/-1" class="note">حددي تاريخ بدء النظام من الإعدادات أولاً.</div>`;
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
    if (dd) {
      score = Object.values(dd.meals).filter(Boolean).length + (dd.water >= 8 ? 1 : 0);
    }
    const cell = document.createElement("div");
    cell.className = "cal-day";
    cell.dataset.score = score;
    cell.textContent = (i+1);
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
  const mealNames = { breakfast:"الفطور", snack1:"سناك ١", lunch:"الغداء", snack2:"سناك ٢", dinner:"العشاء" };
  const mealsHtml = Object.entries(mealNames).map(([k, l]) =>
    `<li>${dd.meals[k] ? "✅" : "⬜"} ${l}</li>`
  ).join("");
  document.getElementById("modalTitle").textContent = `اليوم ${dayNum} — ${formatArDate(iso)}`;
  document.getElementById("modalBody").innerHTML = `
    <p>💧 <strong>${dd.water}/8</strong> كاسات ماء</p>
    <ul style="padding-right:18px">${mealsHtml}</ul>
  `;
  document.getElementById("modalPickAgain").style.display = "none";
  document.getElementById("modal").classList.add("show");
  setTimeout(() => {
    const btn = document.getElementById("modalPickAgain");
    const handler = () => { btn.style.display = ""; btn.removeEventListener("click", handler); };
    document.getElementById("modalClose").addEventListener("click", handler, { once: true });
  }, 0);
}

// ---------- FAVORITES ----------
function renderFavorites() {
  const all = [...BREAKFAST, ...LUNCH, ...DINNER, ...SNACK1, ...SNACK2];
  const favs = all.filter(m => state.favorites.includes(m.id));
  const c = document.getElementById("favoritesList");
  if (favs.length === 0) {
    c.innerHTML = `<div class="note">لا توجد وجبات مفضلة بعد. اضغطي 🤍 على أي خيار في صفحات الوجبات لإضافته.</div>`;
    return;
  }
  c.innerHTML = "";
  favs.forEach(m => {
    const div = document.createElement("div");
    div.className = "option fav";
    const title = m.title ? ` — ${m.title}` : "";
    div.innerHTML = `
      <div class="option-header">
        <div class="option-title">${mealCategoryOf(m.id)} — الخيار ${m.num}${title}</div>
        <button class="fav-btn active" data-fav="${m.id}">❤️</button>
      </div>
      <div class="option-body">
        <ul>${m.items.map(x => `<li>${x}</li>`).join("")}</ul>
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
  if (id.startsWith("b")) return "🍳 فطور";
  if (id.startsWith("l")) return "🍽️ غداء";
  if (id.startsWith("d")) return "🌙 عشاء";
  if (id.startsWith("s1")) return "🥤 سناك ١";
  if (id.startsWith("s2")) return "🥜 سناك ٢";
  return "";
}

// ---------- PHOTOS ----------
document.getElementById("photoInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const compressed = await compressImage(file, 800);
  state.photos.push({ id: Date.now().toString(), date: today(), data: compressed });
  try {
    saveState();
    renderPhotos();
  } catch (err) {
    alert("لا توجد مساحة كافية لحفظ الصورة. احذفي بعض الصور القديمة.");
    state.photos.pop();
  }
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
    div.innerHTML = `
      <img src="${p.data}" alt="photo" />
      <div class="date">${p.date}</div>
      <button class="del" data-id="${p.id}">✕</button>
    `;
    grid.appendChild(div);
  });
  grid.querySelectorAll(".del").forEach(b => {
    b.addEventListener("click", () => {
      if (!confirm("حذف هذه الصورة؟")) return;
      state.photos = state.photos.filter(p => p.id !== b.dataset.id);
      saveState(); renderPhotos();
    });
  });
}

// ---------- SETTINGS ----------
document.getElementById("startDateInput").value = state.startDate || today();
document.getElementById("saveStartDate").addEventListener("click", () => {
  const v = document.getElementById("startDateInput").value;
  if (!v) { alert("اختاري تاريخ"); return; }
  state.startDate = v;
  saveState(); renderToday(); renderCalendar();
  alert("تم حفظ تاريخ البدء ✅");
});
function renderPersonInfo() {
  const c = document.getElementById("personInfo");
  const items = [
    ["الاسم", PERSON.name],
    ["الوزن الابتدائي", PERSON.weight + " كغ"],
    ["الطول", PERSON.height + " سم"],
    ["العمر", PERSON.age + " سنة"],
    ["BMI", PERSON.bmi],
    ["IBW", PERSON.ibw + " كغ"],
    ["الماء", PERSON.waterCupsPerDay + " كاسات/يوم"],
    ["المدة", PERSON.durationDays + " يوم"]
  ];
  c.innerHTML = items.map(([l,v]) => `<div class="info-item"><span>${l}</span><strong>${v}</strong></div>`).join("");
}
document.getElementById("exportData").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lynn-keto-${today()}.json`;
  a.click();
  URL.revokeObjectURL(url);
});
document.getElementById("importData").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const txt = await file.text();
    const data = JSON.parse(txt);
    if (!confirm("سيتم استبدال جميع البيانات الحالية. متابعة؟")) return;
    state = { ...defaultState(), ...data };
    saveState();
    location.reload();
  } catch (err) {
    alert("ملف غير صالح");
  }
});
document.getElementById("resetAll").addEventListener("click", () => {
  if (!confirm("هل أنت متأكدة؟ سيتم حذف كل البيانات ولا يمكن استرجاعها.")) return;
  if (!confirm("تأكيد أخير — حذف كل شيء؟")) return;
  localStorage.removeItem(LS_KEY);
  state = defaultState();
  saveState();
  location.reload();
});

// ---------- INIT ----------
function initAll() {
  renderToday();
  renderAllMealLists();
  renderShopping();
  renderAllowed();
  renderWeight();
  renderCalendar();
  renderFavorites();
  renderPhotos();
  renderPersonInfo();
}
initAll();

// ---------- Service Worker ----------
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

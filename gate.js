// ============================================================
// Password gate — daily (resets at midnight), logs each login
// Password: daisy
// ============================================================
(function () {
  const UNLOCK_DATE_KEY = "lynn-keto-unlock-date";
  const LOGIN_LOG_KEY = "lynn-keto-login-log";
  const LEGACY_UNLOCK_KEY = "lynn-keto-unlocked";
  const PASSWORD = "daisy";

  // Clean up legacy key from previous version
  if (localStorage.getItem(LEGACY_UNLOCK_KEY)) {
    localStorage.removeItem(LEGACY_UNLOCK_KEY);
  }

  // Reset-everything escape hatch: visit ?clear=1
  if (new URLSearchParams(location.search).get("clear") === "1") {
    localStorage.removeItem(UNLOCK_DATE_KEY);
    localStorage.removeItem(LOGIN_LOG_KEY);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        Promise.all(regs.map(r => r.unregister())).then(() => {
          if (window.caches) caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k)))).then(() => {
            location.replace(location.pathname);
          });
        });
      });
    } else {
      location.replace(location.pathname);
    }
    return;
  }

  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function logLogin() {
    try {
      const raw = localStorage.getItem(LOGIN_LOG_KEY);
      const log = raw ? JSON.parse(raw) : [];
      log.push(new Date().toISOString());
      // Keep only last 200 entries to bound storage growth
      if (log.length > 200) log.splice(0, log.length - 200);
      localStorage.setItem(LOGIN_LOG_KEY, JSON.stringify(log));
    } catch (e) {}
  }

  function unlock(persist) {
    if (persist) {
      localStorage.setItem(UNLOCK_DATE_KEY, todayStr());
      logLogin();
    }
    document.body.classList.remove("locked");
  }

  // Already unlocked today on this device → skip gate
  if (localStorage.getItem(UNLOCK_DATE_KEY) === todayStr()) {
    unlock(false);
    return;
  }

  // Different day (or never) — force re-login
  localStorage.removeItem(UNLOCK_DATE_KEY);

  const input = document.getElementById("gateInput");
  const btn = document.getElementById("gateSubmit");
  const err = document.getElementById("gateError");
  const iconEl = document.getElementById("gateIcon");
  if (iconEl && typeof ICONS !== "undefined") iconEl.innerHTML = ICONS.lock;
  if (!input || !btn) return;

  setTimeout(() => { try { input.focus(); } catch(e){} }, 80);

  function tryUnlock() {
    const val = (input.value || "").trim().toLowerCase();
    if (val === PASSWORD) {
      err.textContent = "";
      unlock(true);
    } else {
      err.textContent = "Wrong password — try again";
      input.value = "";
      input.focus();
      input.classList.add("shake");
      setTimeout(() => input.classList.remove("shake"), 400);
    }
  }

  btn.addEventListener("click", tryUnlock);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") tryUnlock(); });
})();

// ============================================================
// Password gate — daily (resets at midnight), logs each login
// Password: daisy
// ============================================================
(function () {
  const UNLOCK_DATE_KEY = "lynn-keto-unlock-date";
  const LOGIN_LOG_KEY = "lynn-keto-login-log";
  const PASSWORD = "daisy";

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

// ============================================================
// Password gate — client-side only (friction barrier, not real security)
// Password: daisy
// ============================================================
(function () {
  const PASS_KEY = "lynn-keto-unlocked";
  const PASSWORD = "daisy";

  function unlock(persist) {
    if (persist) localStorage.setItem(PASS_KEY, "1");
    document.body.classList.remove("locked");
  }

  // Already unlocked on this device → skip gate
  if (localStorage.getItem(PASS_KEY) === "1") {
    unlock(false);
    return;
  }

  // Wait for DOM (should already be ready since script is at end of body)
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

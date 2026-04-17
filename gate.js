// ============================================================
// Password gate — client-side only (not real security, just a friction barrier)
// ============================================================
(function () {
  const PASS_KEY = "lynn-keto-unlocked";
  // Obfuscated password hash (not cryptographically secure, just avoids plaintext in source).
  // password = "daisy"
  const EXPECTED_HASH = "5aedef2-5";

  function tinyHash(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return Math.abs(h).toString(16) + "-" + s.length.toString(16);
  }

  const overlay = document.getElementById("gateOverlay");
  const input = document.getElementById("gateInput");
  const btn = document.getElementById("gateSubmit");
  const err = document.getElementById("gateError");

  function unlock() {
    localStorage.setItem(PASS_KEY, "1");
    overlay.classList.add("hide");
    setTimeout(() => overlay.remove(), 300);
  }

  if (localStorage.getItem(PASS_KEY) === "1") {
    unlock();
    return;
  }

  overlay.classList.add("show");
  setTimeout(() => input.focus(), 50);

  function tryUnlock() {
    const val = input.value.trim().toLowerCase();
    if (tinyHash(val) === EXPECTED_HASH) {
      err.textContent = "";
      unlock();
    } else {
      err.textContent = "Wrong password";
      input.value = "";
      input.focus();
    }
  }

  btn.addEventListener("click", tryUnlock);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") tryUnlock(); });
})();

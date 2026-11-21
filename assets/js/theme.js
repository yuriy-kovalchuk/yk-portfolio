// Applies the stored appearance before the first paint, so switching between
// light and dark never flashes the wrong scheme. No dependency, no build step.
const STORAGE_KEY = "appearance";
const root = document.documentElement;

function storedChoice() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "system";
  } catch {
    return "system"; // private mode or storage disabled: follow the OS
  }
}

function applyChoice(choice) {
  if (choice === "light" || choice === "dark") {
    root.dataset.theme = choice;
  } else {
    delete root.dataset.theme;
  }
}

applyChoice(storedChoice());

addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-theme-form]");
  if (!form) return;

  form.hidden = false;
  const choice = storedChoice();
  const current = form.querySelector(`input[value="${CSS.escape(choice)}"]`) || form.elements.theme[0];
  current.checked = true;

  form.addEventListener("change", (event) => {
    const value = event.target.value;
    if (!["system", "light", "dark"].includes(value)) return;
    try {
      if (value === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // The choice still applies to this page view; that is the fallback.
    }
    applyChoice(value);
  });
});

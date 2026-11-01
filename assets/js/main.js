document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector("#mobile-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");
  if (menuButton && mobileMenu) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.addEventListener("click", () => {
      const open = !mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden", open);
      mobileMenu.classList.toggle("flex", !open);
      menuButton.setAttribute("aria-expanded", String(!open));
    });
    mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      mobileMenu.classList.add("hidden"); mobileMenu.classList.remove("flex");
      menuButton.setAttribute("aria-expanded", "false");
    }));
  }

  const themeButton = document.querySelector("#theme-toggle");
  const themeIcon = document.querySelector("#theme-icon");
  const themeLabel = document.querySelector("#theme-label");
  const applyTheme = theme => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (themeIcon) themeIcon.textContent = theme === "dark" ? "☀" : "☾";
    if (themeLabel) themeLabel.textContent = theme === "dark" ? "Light mode" : "Dark mode";
    if (themeButton) themeButton.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  };
  let savedTheme = "light";
  try { savedTheme = localStorage.getItem("jenny-portfolio-theme") || "light"; } catch (e) {}
  applyTheme(savedTheme);
  if (themeButton) themeButton.addEventListener("click", () => {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("jenny-portfolio-theme", next); } catch (e) {}
  });

  const filters = [...document.querySelectorAll(".filter-btn")];
  const cards = [...document.querySelectorAll(".project-card")];
  filters.forEach(button => button.addEventListener("click", () => {
    const category = button.dataset.category || "all";
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle("bg-forest", active); item.classList.toggle("text-white", active);
      item.classList.toggle("bg-white", !active); item.classList.toggle("border", !active);
      item.classList.toggle("border-line", !active); item.setAttribute("aria-pressed", String(active));
    });
    cards.forEach(card => { card.hidden = category !== "all" && card.dataset.category !== category; });
  }));
  document.querySelectorAll("[data-current-year]").forEach(node => node.textContent = new Date().getFullYear());
});

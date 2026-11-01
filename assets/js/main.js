document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector("#mobile-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");
  const isMobileViewport = () => window.matchMedia("(max-width: 767px)").matches;

  const setMenuOpen = (open) => {
    if (!menuButton || !mobileMenu) return;
    const shouldOpen = Boolean(open && isMobileViewport());
    mobileMenu.classList.toggle("is-open", shouldOpen);
    // Keep legacy utility classes in sync, but visibility is controlled by is-open CSS.
    mobileMenu.classList.toggle("hidden", !shouldOpen);
    mobileMenu.classList.toggle("flex", shouldOpen);
    menuButton.setAttribute("aria-expanded", String(shouldOpen));
    menuButton.setAttribute("aria-label", shouldOpen ? "Close navigation menu" : "Open navigation menu");
  };

  if (menuButton && mobileMenu) {
    menuButton.type = "button";
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-controls", "mobile-menu");
    menuButton.setAttribute("aria-label", "Open navigation menu");

    menuButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("click", (event) => {
      if (menuButton.getAttribute("aria-expanded") === "true" &&
          !mobileMenu.contains(event.target) && !menuButton.contains(event.target)) {
        setMenuOpen(false);
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") setMenuOpen(false);
    });
    window.addEventListener("resize", () => setMenuOpen(false));
    window.addEventListener("orientationchange", () => setMenuOpen(false));
  }

  // Mark the current page in the navigation for clearer orientation.
  const currentFile = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#mobile-menu a.nav-link").forEach(link => {
    const targetFile = new URL(link.href, location.href).pathname.split("/").pop() || "index.html";
    if (targetFile === currentFile) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  // Respect the visitor's saved preference; otherwise use the device setting.
  const themeButton = document.querySelector("#theme-toggle");
  const themeIcon = document.querySelector("#theme-icon");
  const themeLabel = document.querySelector("#theme-label");
  const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const applyTheme = theme => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (themeIcon) themeIcon.textContent = theme === "dark" ? "☀" : "☾";
    if (themeLabel) themeLabel.textContent = theme === "dark" ? "Light mode" : "Dark mode";
    if (themeButton) themeButton.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    document.documentElement.style.colorScheme = theme;
  };
  let savedTheme = null;
  try { savedTheme = localStorage.getItem("jenny-portfolio-theme"); } catch (error) { /* storage may be unavailable */ }
  applyTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));
  if (themeButton) themeButton.addEventListener("click", () => {
    const nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    applyTheme(nextTheme);
    try { localStorage.setItem("jenny-portfolio-theme", nextTheme); } catch (error) { /* preference remains active for this visit */ }
  });

  // Project category filters.
  const filters = [...document.querySelectorAll(".filter-btn")];
  const cards = [...document.querySelectorAll(".project-card")];
  filters.forEach(button => button.addEventListener("click", () => {
    const category = button.dataset.category || "all";
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle("bg-forest", active);
      item.classList.toggle("text-white", active);
      item.classList.toggle("bg-white", !active);
      item.classList.toggle("border", !active);
      item.classList.toggle("border-line", !active);
      item.setAttribute("aria-pressed", String(active));
    });
    cards.forEach(card => { card.hidden = category !== "all" && card.dataset.category !== category; });
  }));

  // A compact, touch-friendly back-to-top button appears after scrolling.
  const backToTop = document.createElement("button");
  backToTop.id = "back-to-top";
  backToTop.type = "button";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.setAttribute("title", "Back to top");
  backToTop.textContent = "↑";
  document.body.appendChild(backToTop);
  const updateBackToTop = () => backToTop.classList.toggle("is-visible", window.scrollY > 420);
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  document.querySelectorAll("[data-current-year]").forEach(node => node.textContent = new Date().getFullYear());
});

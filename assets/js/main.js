(() => {
  "use strict";

  const init = () => {
    const menuButton = document.getElementById("mobile-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const themeButton = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const themeLabel = document.getElementById("theme-label");
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    // Navigation: keep desktop links visible; use a single class on mobile.
    const closeMenu = () => {
      if (!menuButton || !mobileMenu) return;
      mobileMenu.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
      const icon = menuButton.querySelector("[aria-hidden='true']");
      if (icon) icon.textContent = "☰";
    };
    const openMenu = () => {
      if (!menuButton || !mobileMenu || !mobileQuery.matches) return;
      mobileMenu.classList.add("menu-open");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Close navigation menu");
      const icon = menuButton.querySelector("[aria-hidden='true']");
      if (icon) icon.textContent = "×";
    };

    if (menuButton && mobileMenu) {
      menuButton.type = "button";
      menuButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        mobileMenu.classList.contains("menu-open") ? closeMenu() : openMenu();
      });
      mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
      });
      document.addEventListener("click", (event) => {
        if (mobileMenu.classList.contains("menu-open") &&
            !mobileMenu.contains(event.target) &&
            !menuButton.contains(event.target)) closeMenu();
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
      });
      const syncNavigation = () => {
        closeMenu();
        if (mobileQuery.matches) {
          mobileMenu.classList.remove("desktop-nav");
        } else {
          mobileMenu.classList.add("desktop-nav");
        }
      };
      window.addEventListener("resize", syncNavigation);
      if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", syncNavigation);
      syncNavigation();
    }

    // Current-page marker.
    const currentFile = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("#mobile-menu a.nav-link").forEach((link) => {
      const targetFile = new URL(link.href, location.href).pathname.split("/").pop() || "index.html";
      if (targetFile === currentFile) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    // Theme toggle.
    const systemDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    let savedTheme = null;
    try { savedTheme = localStorage.getItem("jenny-portfolio-theme"); } catch (_) {}
    const applyTheme = (theme) => {
      const dark = theme === "dark";
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
      if (themeIcon) themeIcon.textContent = dark ? "☀" : "☾";
      if (themeLabel) themeLabel.textContent = dark ? "Light mode" : "Dark mode";
      if (themeButton) themeButton.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    };
    applyTheme(savedTheme || (systemDark ? "dark" : "light"));
    if (themeButton) {
      themeButton.type = "button";
      themeButton.addEventListener("click", (event) => {
        event.preventDefault();
        const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem("jenny-portfolio-theme", next); } catch (_) {}
      });
    }

    // Project filters.
    const filters = Array.from(document.querySelectorAll(".filter-btn"));
    const cards = Array.from(document.querySelectorAll(".project-card"));
    filters.forEach((button) => button.addEventListener("click", () => {
      const category = button.dataset.category || "all";
      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle("bg-forest", active);
        item.classList.toggle("text-white", active);
        item.classList.toggle("bg-white", !active);
        item.classList.toggle("border", !active);
        item.classList.toggle("border-line", !active);
        item.setAttribute("aria-pressed", String(active));
      });
      cards.forEach((card) => {
        card.hidden = category !== "all" && card.dataset.category !== category;
      });
    }));

    // Back-to-top.
    let backToTop = document.getElementById("back-to-top");
    if (!backToTop) {
      backToTop = document.createElement("button");
      backToTop.id = "back-to-top";
      backToTop.type = "button";
      backToTop.setAttribute("aria-label", "Back to top");
      backToTop.title = "Back to top";
      backToTop.textContent = "↑";
      document.body.appendChild(backToTop);
    }
    const updateBackToTop = () => backToTop.classList.toggle("is-visible", window.scrollY > 420);
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    document.querySelectorAll("[data-current-year]").forEach((node) => {
      node.textContent = new Date().getFullYear();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

(() => {
  "use strict";

  const init = () => {
    const root = document.documentElement;
    const menuButton = document.getElementById("mobile-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const themeButton = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const themeLabel = document.getElementById("theme-label");
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    // Navigation: one function controls hidden, class, and accessibility state.
    const setMenuOpen = (open) => {
      if (!menuButton || !mobileMenu) return;
      const shouldOpen = Boolean(open && mobileQuery.matches);
      mobileMenu.hidden = !shouldOpen;
      mobileMenu.classList.toggle("is-open", shouldOpen);
      menuButton.setAttribute("aria-expanded", String(shouldOpen));
      menuButton.setAttribute("aria-label", shouldOpen ? "Close navigation menu" : "Open navigation menu");
      menuButton.textContent = shouldOpen ? "×" : "☰";
    };

    if (menuButton && mobileMenu) {
      menuButton.type = "button";
      mobileMenu.hidden = true;
      menuButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setMenuOpen(mobileMenu.hidden);
      });

      mobileMenu.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (link) setMenuOpen(false);
      });

      document.addEventListener("click", (event) => {
        if (!mobileQuery.matches || mobileMenu.hidden) return;
        if (!mobileMenu.contains(event.target) && !menuButton.contains(event.target)) {
          setMenuOpen(false);
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setMenuOpen(false);
      });

      const syncNavigation = () => {
        if (mobileQuery.matches) {
          setMenuOpen(false);
          menuButton.hidden = false;
        } else {
          mobileMenu.hidden = false;
          mobileMenu.classList.remove("is-open");
          menuButton.setAttribute("aria-expanded", "false");
          menuButton.hidden = true;
        }
      };
      syncNavigation();
      window.addEventListener("resize", syncNavigation, { passive: true });
      if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", syncNavigation);
      else if (mobileQuery.addListener) mobileQuery.addListener(syncNavigation);
    }

    // Highlight the current page.
    const currentFile = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("#mobile-menu a.nav-link").forEach((link) => {
      const targetFile = new URL(link.href, location.href).pathname.split("/").pop() || "index.html";
      if (targetFile === currentFile) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    // Theme: initialize from saved preference, then system preference.
    let savedTheme = null;
    try { savedTheme = localStorage.getItem("jenny-portfolio-theme"); } catch (_) {}
    const systemDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const applyTheme = (theme) => {
      const dark = theme === "dark";
      root.classList.toggle("dark", dark);
      root.dataset.theme = dark ? "dark" : "light";
      root.style.colorScheme = dark ? "dark" : "light";
      if (themeIcon) themeIcon.textContent = dark ? "☀" : "☾";
      if (themeLabel) themeLabel.textContent = dark ? "Light mode" : "Dark mode";
      if (themeButton) {
        themeButton.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
        themeButton.setAttribute("aria-pressed", String(dark));
        themeButton.title = dark ? "Switch to light mode" : "Switch to dark mode";
      }
    };

    applyTheme(savedTheme === "dark" || savedTheme === "light"
      ? savedTheme : (systemDark ? "dark" : "light"));

    if (themeButton) {
      themeButton.type = "button";
      themeButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const next = root.classList.contains("dark") ? "light" : "dark";
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

    // Back-to-top button.
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

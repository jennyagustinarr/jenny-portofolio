(() => {
  "use strict";

  const init = () => {
    const menuButton = document.getElementById("mobile-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const themeButton = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const themeLabel = document.getElementById("theme-label");
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    // Reliable responsive navigation: one state source (the hidden property).
    const syncNavigation = () => {
      const isMobile = mobileQuery.matches;
      if (isMobile) {
        mobileMenu.hidden = true;
        menuButton.hidden = false;
      } else {
        mobileMenu.hidden = false;
        menuButton.hidden = true;
      }
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
    };

    if (menuButton && mobileMenu) {
      menuButton.type = "button";
      menuButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const willOpen = mobileMenu.hidden;
        mobileMenu.hidden = !willOpen;
        menuButton.setAttribute("aria-expanded", String(willOpen));
        menuButton.setAttribute("aria-label", willOpen ? "Close navigation menu" : "Open navigation menu");
        menuButton.textContent = willOpen ? "×" : "☰";
      });

      mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          if (mobileQuery.matches) {
            mobileMenu.hidden = true;
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
            menuButton.textContent = "☰";
          }
        });
      });

      document.addEventListener("click", (event) => {
        if (mobileQuery.matches && !mobileMenu.hidden &&
            !mobileMenu.contains(event.target) && !menuButton.contains(event.target)) {
          mobileMenu.hidden = true;
          menuButton.setAttribute("aria-expanded", "false");
          menuButton.setAttribute("aria-label", "Open navigation menu");
          menuButton.textContent = "☰";
        }
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && mobileQuery.matches) {
          mobileMenu.hidden = true;
          menuButton.setAttribute("aria-expanded", "false");
          menuButton.setAttribute("aria-label", "Open navigation menu");
          menuButton.textContent = "☰";
        }
      });

      syncNavigation();
      window.addEventListener("resize", syncNavigation, { passive: true });
      if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", syncNavigation);
    }

    // Current-page marker.
    const currentFile = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("#mobile-menu a.nav-link").forEach((link) => {
      const targetFile = new URL(link.href, location.href).pathname.split("/").pop() || "index.html";
      if (targetFile === currentFile) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    // Theme toggle: apply to the document root and persist the user's choice.
    let savedTheme = null;
    try { savedTheme = localStorage.getItem("jenny-portfolio-theme"); } catch (_) {}
    const systemDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const applyTheme = (theme) => {
      const isDark = theme === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
      if (themeIcon) themeIcon.textContent = isDark ? "☀" : "☾";
      if (themeLabel) themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
      if (themeButton) {
        themeButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
        themeButton.setAttribute("aria-pressed", String(isDark));
      }
    };

    applyTheme(savedTheme === "dark" || savedTheme === "light"
      ? savedTheme : (systemDark ? "dark" : "light"));

    if (themeButton) {
      themeButton.type = "button";
      themeButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
        applyTheme(nextTheme);
        try { localStorage.setItem("jenny-portfolio-theme", nextTheme); } catch (_) {}
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

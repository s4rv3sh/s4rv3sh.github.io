// Handle scroll-based reveal animations using IntersectionObserver
const revealElements = document.querySelectorAll(".reveal");

let observer = null;
if ("IntersectionObserver" in window) {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  // Fallback for very old browsers
  revealElements.forEach((el) => el.classList.add("visible"));
}

// Smooth scroll for internal navigation using JavaScript for consistent behavior
function smoothScrollTo(targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const headerOffset = document.querySelector(".header")?.offsetHeight || 0;
  const targetPosition =
    target.getBoundingClientRect().top + window.scrollY - headerOffset - 10;

  window.scrollTo({
    top: targetPosition,
    behavior: "smooth",
  });
}

function initNavigation() {
  // Hero primary button scrolls to projects
  document.querySelectorAll("[data-scroll-target]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      const targetSelector = trigger.getAttribute("data-scroll-target");
      if (!targetSelector) return;
      event.preventDefault();
      smoothScrollTo(targetSelector);
    });
  });

  // Navigation links smooth scroll
  document.querySelectorAll(".nav-link[href^='#']").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      event.preventDefault();
      smoothScrollTo(href);
    });
  });
}

// Batman-style ripple effects on primary and ghost buttons
function attachRipple(button) {
  button.addEventListener("click", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    button.style.setProperty("--ripple-x", `${x}px`);
    button.style.setProperty("--ripple-y", `${y}px`);

    button.classList.remove("rippling");
    // Force reflow to restart animation
    // eslint-disable-next-line no-unused-expressions
    button.offsetHeight;
    button.classList.add("rippling");

    setTimeout(() => {
      button.classList.remove("rippling");
    }, 450);
  });
}

function initAnimations() {
  document.querySelectorAll(".btn").forEach(attachRipple);

  // Subtle glow follow for cards
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--glow-x", `${x}%`);
      card.style.setProperty("--glow-y", `${y}%`);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Dynamic year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // Initialize Animations
  initAnimations();

  // Initialize Navigation
  initNavigation();
});

const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const pageYear = document.getElementById("year");

function setHeaderState() {
  if (!header) {
    return;
  }
  header.classList.toggle("scrolled", window.scrollY > 12);
}

function closeMenu() {
  body.classList.remove("nav-open");
  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
  }
}

function toggleMenu() {
  const isOpen = body.classList.toggle("nav-open");
  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  }
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", toggleMenu);

  document.addEventListener("click", (event) => {
    if (!body.classList.contains("nav-open")) {
      return;
    }
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }
    if (!nav.contains(target) && !menuToggle.contains(target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href.length < 2) {
      return;
    }
    const target = document.querySelector(href);
    if (!target) {
      return;
    }
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, io) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

if (pageYear) {
  pageYear.textContent = String(new Date().getFullYear());
}

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

// Dropdown toggle behavior for nav
document.querySelectorAll('.dropdown-toggle').forEach((btn) => {
  const parent = btn.closest('.nav-item.dropdown');
  const menu = btn.nextElementSibling;

  btn.addEventListener('click', (e) => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    if (parent) parent.classList.toggle('open', !expanded);
  });

  btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const first = menu && menu.querySelector('a');
      if (first) first.focus();
    }
    if (e.key === 'Escape') {
      btn.setAttribute('aria-expanded', 'false');
      if (parent) parent.classList.remove('open');
      btn.focus();
    }
  });
});

// Close open dropdowns when clicking outside
document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Node)) return;
  document.querySelectorAll('.nav-item.dropdown.open').forEach((d) => {
    if (!d.contains(target)) {
      d.classList.remove('open');
      const btn = d.querySelector('.dropdown-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });
});

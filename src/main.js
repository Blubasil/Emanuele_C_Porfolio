import { slides, menuItems } from "./data/slides.js";

const portfolio = document.getElementById("portfolio");
const siteHeader = document.querySelector(".site-header");
const siteFooter = document.querySelector(".site-footer");
const menuEl = document.querySelector(".site-header__menu");
const navList = document.querySelector(".page-nav__list");
const progressBar = document.querySelector(".site-header__progress-bar");
const heading1 = document.querySelector("[data-heading-1]");
const heading2 = document.querySelector("[data-heading-2]");
const pageNumEl = document.querySelector("[data-page-num]");
const btnPrev = document.querySelector(".nav-btn--prev");
const btnNext = document.querySelector(".nav-btn--next");
const menuToggle = document.querySelector(".site-header__toggle");
const siteNav = document.getElementById("site-menu");

let lastIndex = 0;
let headerAnimating = false;

function pad(n) {
  return String(n).padStart(2, "0");
}

function buildMenu() {
  for (const item of menuItems) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#slide-${item.target}`;
    a.className = "site-header__link";
    a.textContent = item.label;
    a.dataset.menuKey = item.key;
    a.dataset.target = String(item.target);
    li.append(a);
    menuEl.append(li);
  }
}

function buildSlides() {
  for (const slide of slides) {
    const section = document.createElement("section");
    section.className = "slide";
    section.id = `slide-${slide.id}`;
    section.dataset.page = String(slide.id);
    section.dataset.theme = slide.theme;
    section.dataset.menuKey = slide.menuKey;
    if (slide.id === 6) section.classList.add("slide--gallery");
    section.setAttribute("aria-label", `${pad(slide.id)} — ${slide.heading.join(" ")}`);

    const frame = document.createElement("div");
    frame.className = "slide__frame";

    const img = document.createElement("img");
    img.src = `/assets/pages/page-${pad(slide.id)}.webp`;
    img.alt = `Portfolio page ${pad(slide.id)}: ${slide.heading.join(" ")}`;
    img.width = 2048;
    img.height = 1536;
    img.loading = slide.id <= 2 ? "eager" : "lazy";
    img.decoding = "async";

    frame.append(img);
    section.append(frame);
    portfolio.append(section);

    const li = document.createElement("li");
    const dot = document.createElement("a");
    dot.href = `#slide-${slide.id}`;
    dot.className = "page-nav__dot";
    dot.setAttribute("aria-label", `Page ${pad(slide.id)}`);
    dot.dataset.page = String(slide.id);
    li.append(dot);
    navList.append(li);
  }
}

function getSlides() {
  return [...document.querySelectorAll(".slide")];
}

function getActiveIndex() {
  const mid = window.innerHeight * 0.42;
  const list = getSlides();
  let best = 0;
  let bestDist = Infinity;
  list.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const dist = Math.abs(center - mid);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best;
}

function setHeaderTheme(theme) {
  siteHeader.dataset.theme = theme;
  siteFooter.dataset.theme = theme;
  document.body.dataset.theme = theme;
}

function animateHeaderMeta(line1, line2, page, direction) {
  const same =
    heading1.textContent === line1 &&
    heading2.textContent === line2 &&
    pageNumEl.textContent === pad(page);
  if (headerAnimating || same) return;

  headerAnimating = true;
  siteHeader.classList.remove("is-advance", "is-retreat");
  siteHeader.classList.add("is-header-changing", direction >= 0 ? "is-advance" : "is-retreat");

  window.setTimeout(() => {
    heading1.textContent = line1;
    heading2.textContent = line2;
    pageNumEl.textContent = pad(page);
    siteHeader.classList.remove("is-header-changing", "is-advance", "is-retreat");
    headerAnimating = false;
  }, 240);
}

function updateUI(index) {
  const slide = slides[index];
  const direction = index - lastIndex;

  progressBar.style.width = `${(slide.id / slides.length) * 100}%`;
  setHeaderTheme(slide.theme);
  animateHeaderMeta(slide.heading[0], slide.heading[1], slide.id, direction);

  document.querySelectorAll(".site-header__link").forEach((link) => {
    const active = link.dataset.menuKey === slide.menuKey;
    link.classList.toggle("is-active", active);
    link.setAttribute("aria-current", active ? "page" : "false");
  });

  document.querySelectorAll(".page-nav__dot").forEach((dot, i) => {
    dot.classList.toggle("is-active", i === index);
  });

  if (index !== lastIndex) {
    siteHeader.classList.add("is-scrolling");
    window.clearTimeout(updateUI._scrollTimer);
    updateUI._scrollTimer = window.setTimeout(() => {
      siteHeader.classList.remove("is-scrolling");
    }, 400);
    lastIndex = index;
  }
}

function scrollToIndex(index) {
  const list = getSlides();
  const clamped = Math.max(0, Math.min(list.length - 1, index));
  list[clamped].scrollIntoView({ behavior: "smooth", block: "start" });
  closeMobileMenu();
}

function closeMobileMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

function toggleMobileMenu() {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", open ? "false" : "true");
  siteNav.classList.toggle("is-open", !open);
  document.body.classList.toggle("menu-open", !open);
  requestAnimationFrame(syncChromeHeights);
}

function setupSlideObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.35, rootMargin: "-8% 0px -8% 0px" }
  );
  getSlides().forEach((el) => observer.observe(el));
}

let scrollTicking = false;
function onScroll() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    updateUI(getActiveIndex());
    scrollTicking = false;
  });
}

function onKeydown(e) {
  const idx = getActiveIndex();
  if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
    e.preventDefault();
    scrollToIndex(idx + 1);
  } else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
    e.preventDefault();
    scrollToIndex(idx - 1);
  } else if (e.key === "Home") {
    e.preventDefault();
    scrollToIndex(0);
  } else if (e.key === "End") {
    e.preventDefault();
    scrollToIndex(slides.length - 1);
  } else if (e.key === "Escape") {
    closeMobileMenu();
  }
}

function syncChromeHeights() {
  document.documentElement.style.setProperty("--header-h", `${siteHeader.offsetHeight}px`);
  document.documentElement.style.setProperty("--footer-h", `${siteFooter.offsetHeight}px`);
}

buildMenu();
buildSlides();
setupSlideObserver();
updateUI(0);
syncChromeHeights();

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("keydown", onKeydown);
window.addEventListener("resize", () => {
  closeMobileMenu();
  syncChromeHeights();
});

btnPrev.addEventListener("click", () => scrollToIndex(getActiveIndex() - 1));
btnNext.addEventListener("click", () => scrollToIndex(getActiveIndex() + 1));
menuToggle.addEventListener("click", toggleMobileMenu);

menuEl.addEventListener("click", (e) => {
  const link = e.target.closest(".site-header__link");
  if (!link) return;
  e.preventDefault();
  scrollToIndex(Number(link.dataset.target) - 1);
});

navList.addEventListener("click", (e) => {
  const dot = e.target.closest(".page-nav__dot");
  if (!dot) return;
  e.preventDefault();
  scrollToIndex(Number(dot.dataset.page) - 1);
});

siteHeader.querySelector(".site-header__brand").addEventListener("click", (e) => {
  e.preventDefault();
  scrollToIndex(0);
});

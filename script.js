/* eslint-disable no-use-before-define */

/**
 * Requirements implemented:
 * - Sticky header bar appears after first fold, hides when scrolling back up
 * - Hero image carousel with hover zoom preview
 * - Applications horizontal carousel with prev/next controls
 * - FAQ accordion (only one open at a time) with smooth animation
 * - Manufacturing process tabs swap panel content
 * - Accessible, semantic interactions; no external libraries
 */

const HERO_IMAGES = [
  {
    id: "hero-1",
    alt: "Workers installing HDPE pipe",
    src: "./assets/images/hero--1.svg",
    thumb: "./assets/images/image.png",
  },
  {
    id: "hero-2",
    alt: "Workers installing HDPE pipe",
    src: "./assets/images/hero--1.svg",
    thumb: "./assets/images/image.png",
  },
  {
    id: "hero-3",
    alt: "Workers installing HDPE pipe",
    src: "./assets/images/hero--1.svg",
    thumb: "./assets/images/image.png",
  },
  {
    id: "hero-4",
    alt: "Workers installing HDPE pipe",
    src: "./assets/images/hero--1.svg",
    thumb: "./assets/images/image.png",
  },
  {
    id: "hero-5",
    alt: "Workers installing HDPE pipe",
    src: "./assets/images/hero--1.svg",
    thumb: "./assets/images/image.png",
  },
  {
    id: "hero-6",
    alt: "Workers installing HDPE pipe",
    src: "./assets/images/hero--1.svg",
    thumb: "./assets/images/image.png",
  },
];

const PROCESS_STEPS = {
  raw: {
    title: "High-Grade Raw Material Selection",
    text: "Our state-of-the-art extrusion technology ensures consistent quality, optimal material properties, and dimensional accuracy in every pipe we manufacture.",
    bullets: ["PE100 grade material", "Optimal molecular weight distribution"],
    image: "./assets/images/hero--1.svg",
    imageAlt: "Raw material selection",
  },
  extrusion: {
    title: "Precision Extrusion",
    text: "Controlled heat, pressure, and screw speed maintain a stable melt flow for uniform wall thickness and pipe consistency.",
    bullets: ["Uniform pipe wall formation", "Stable dimensional control"],
    image: "./assets/images/hero--1.svg",
    imageAlt: "Extrusion process",
  },
  cooling: {
    title: "Calibrated Cooling",
    text: "A carefully managed cooling stage helps preserve roundness, structural stability, and surface finish throughout production.",
    bullets: ["Improved roundness retention", "Consistent outer surface finish"],
    image: "./assets/images/hero--1.svg",
    imageAlt: "Cooling stage",
  },
  sizing: {
    title: "Sizing & Marking",
    text: "Inline measurement systems help maintain dimensional accuracy while ensuring every run remains compliant with specification.",
    bullets: ["Precise diameter control", "Stable wall-thickness verification"],
    image: "./assets/images/hero--1.svg",
    imageAlt: "Sizing and marking",
  },
  qc: {
    title: "Quality Control",
    text: "Each batch goes through inspection and process checks to confirm pressure performance, finish quality, and dimensional reliability.",
    bullets: ["Dimensional inspection", "Performance standard checks"],
    image: "./assets/images/hero--1.svg",
    imageAlt: "Quality control",
  },
  marking: {
    title: "Marking & Identification",
    text: "Clear product marking supports traceability, specification verification, and quick identification during installation.",
    bullets: ["Batch traceability", "Readable product identification"],
    image: "./assets/images/hero--1.svg",
    imageAlt: "Marking and identification",
  },
  cutting: {
    title: "Accurate Cutting",
    text: "Finished pipe lengths are cut to requirement with clean edges and dependable dimensional consistency.",
    bullets: ["Clean finishing edges", "Length accuracy control"],
    image: "./assets/images/hero--1.svg",
    imageAlt: "Cutting stage",
  },
  packing: {
    title: "Packing & Dispatch",
    text: "Secure packing protects the final product during storage and transport while helping maintain quality up to delivery.",
    bullets: ["Protected shipment handling", "Reduced transit damage risk"],
    image: "./assets/images/hero--1.svg",
    imageAlt: "Packing and dispatch",
  },
};

let heroIndex = 0;

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove("hidden");
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.body.classList.add("modal-open");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add("hidden");
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  document.body.classList.remove("modal-open");
}

document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Navigation
  initMobileNav();
  initStickyHeader();

  // Hero
  initHeroCarousel();
  handleStickyPriceBar();

  // Interactive sections
  initFaqAccordion();
  initProcessTabs();
  initAppsCarousel();
  initAppCardImages();
  initImageLightbox();

  // Modals
  initModalBehavior();
});

function initMobileNav() {
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.addEventListener("click", (e) => {
    const a = e.target instanceof Element ? e.target.closest("a") : null;
    if (!a) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.closest(".nav")) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  });
}

// Sticky header logic
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  const heroSection = document.querySelector('.hero');
  if (!header || !heroSection) return;

  const check = () => {
    const rect = heroSection.getBoundingClientRect();
    if (rect.bottom <= 0) {
      header.classList.add('is-sticky');
      header.classList.add('show');
    } else {
      header.classList.remove('show');
      if (window.scrollY <= 10) {
        header.classList.remove('is-sticky');
      }
    }
  };

  window.addEventListener('scroll', throttle(check, 50), { passive: true });
  check();
}

// Hero carousel logic
function initHeroCarousel() {
  const track = document.getElementById("heroTrack");
  const thumbs = document.getElementById("heroThumbs");
  const prev = document.querySelector("[data-hero-prev]");
  const next = document.querySelector("[data-hero-next]");
  const stage = document.getElementById("heroStage");

  if (!track || !thumbs || !prev || !next || !stage) return;
  const thumbButtons = Array.from(thumbs.querySelectorAll(".hero-carousel__thumb"));

  // Slides
  track.innerHTML = "";
  HERO_IMAGES.forEach((item, i) => {
    const slide = document.createElement("div");
    slide.className = "hero-carousel__slide";
    slide.dataset.index = String(i);
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", `${i + 1} of ${HERO_IMAGES.length}`);

    const image = document.createElement("img");
    image.src = item.src;
    image.alt = item.alt;
    image.width = 860;
    image.height = 560;
    slide.appendChild(image);

    track.appendChild(slide);
  });

  // Initial slide
  setHeroImage(0, { animate: false });

  thumbButtons.forEach((button, index) => {
    button.dataset.index = String(index);
    button.addEventListener("click", () => setHeroImage(index));
  });
  syncThumbs();

  prev.addEventListener("click", () =>
    setHeroImage((heroIndex - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)
  );
  next.addEventListener("click", () => setHeroImage((heroIndex + 1) % HERO_IMAGES.length));

  // Keyboard support
  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") setHeroImage((heroIndex - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
    if (e.key === "ArrowRight") setHeroImage((heroIndex + 1) % HERO_IMAGES.length);
  });

  function setHeroImage(index, opts = { animate: true }) {
    heroIndex = index;
    const item = HERO_IMAGES[heroIndex];

    if (!opts.animate) {
      track.style.transition = "none";
    } else {
      track.style.transition = "";
    }
    track.style.transform = `translateX(-${heroIndex * 100}%)`;
    syncSlides();
    syncThumbs();

    if (!opts.animate) {
      // Restore transitions after forcing initial layout.
      requestAnimationFrame(() => {
        track.style.transition = "";
      });
    }
  }

  function syncSlides() {
    const slides = track.querySelectorAll(".hero-carousel__slide");
    slides.forEach((s, i) => {
      const active = i === heroIndex;
      s.classList.toggle("is-active", active);
      s.setAttribute("aria-hidden", active ? "false" : "true");
    });
  }

  function syncThumbs() {
    thumbButtons.forEach((b, i) => {
      b.classList.toggle("is-active", i === heroIndex);
      b.setAttribute("aria-selected", i === heroIndex ? "true" : "false");
    });
  }
}

// FAQ accordion logic
function initFaqAccordion() {
  const list = document.getElementById("faqList");
  if (!list) return;

  const items = Array.from(list.querySelectorAll(".faq-item"));
  const buttons = items.map((it) => it.querySelector(".faq-item__btn")).filter(Boolean);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  items.forEach((it, i) => {
    const btn = it.querySelector(".faq-item__btn");
    const panel = it.querySelector(".faq-item__a");
    if (!btn || !panel) return;
    const btnId = `faq-btn-${i + 1}`;
    const panelId = `faq-panel-${i + 1}`;
    btn.id = btnId;
    btn.setAttribute("aria-controls", panelId);
    panel.id = panelId;
    panel.setAttribute("aria-labelledby", btnId);
  });

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      if (!item) return;

      const isOpen = btn.getAttribute("aria-expanded") === "true";
      items.forEach((it) => {
        if (it !== item) setFaqOpen(it, false);
      });
      setFaqOpen(item, !isOpen);
    });
  });

  items.forEach((it) => {
    const panel = it.querySelector(".faq-item__a");
    if (!panel) return;
    panel.style.overflow = "hidden";
    panel.style.height = panel.hasAttribute("hidden") ? "0px" : "auto";
    panel.style.opacity = panel.hasAttribute("hidden") ? "0" : "1";
    panel.style.transition = reduceMotion
      ? "none"
      : "height 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease";
  });

  function setFaqOpen(item, open) {
    const btn = item.querySelector(".faq-item__btn");
    const panel = item.querySelector(".faq-item__a");
    if (!btn || !panel) return;
    if (btn.getAttribute("aria-expanded") === String(open)) return;

    btn.setAttribute("aria-expanded", String(open));

    if (open) {
      panel.removeAttribute("hidden");
      if (reduceMotion) {
        panel.style.height = "auto";
        panel.style.opacity = "1";
        return;
      }

      panel.style.height = "0px";
      panel.style.opacity = "0";
      void panel.offsetHeight;

      const targetHeight = `${panel.scrollHeight}px`;
      requestAnimationFrame(() => {
        panel.style.height = targetHeight;
        panel.style.opacity = "1";
      });

      panel.addEventListener(
        "transitionend",
        (event) => {
          if (event.propertyName === "height" && btn.getAttribute("aria-expanded") === "true") {
            panel.style.height = "auto";
          }
        },
        { once: true }
      );
    } else {
      if (panel.hasAttribute("hidden")) return;

      if (reduceMotion) {
        panel.style.height = "0px";
        panel.style.opacity = "0";
        panel.setAttribute("hidden", "");
        return;
      }

      const startHeight = `${panel.scrollHeight}px`;
      panel.style.height = startHeight;
      panel.style.opacity = "1";
      void panel.offsetHeight;

      requestAnimationFrame(() => {
        panel.style.height = "0px";
        panel.style.opacity = "0";
      });

      panel.addEventListener(
        "transitionend",
        (event) => {
          if (event.propertyName === "height" && btn.getAttribute("aria-expanded") === "false") {
            panel.setAttribute("hidden", "");
          }
        },
        { once: true }
      );
    }
  }
}

// Apps carousel logic
function initAppsCarousel() {
  const carousel = document.getElementById("appsCarousel");
  const prev = document.querySelector("[data-apps-prev]");
  const next = document.querySelector("[data-apps-next]");
  if (!carousel || !prev || !next) return;

  const scrollByCards = (dir) => {
    const firstCard = carousel.querySelector(".app-card");
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 260;
    carousel.scrollBy({ left: dir * (cardWidth + 16), behavior: "smooth" });
  };

  const flashControl = (button) => {
    button.classList.remove("is-active");
    void button.offsetWidth;
    button.classList.add("is-active");
    window.setTimeout(() => button.classList.remove("is-active"), 220);
  };

  prev.addEventListener("click", () => {
    flashControl(prev);
    scrollByCards(-1);
  });
  next.addEventListener("click", () => {
    flashControl(next);
    scrollByCards(1);
  });

  const updateControls = () => {
    const max = carousel.scrollWidth - carousel.clientWidth - 1;
    prev.disabled = carousel.scrollLeft <= 0;
    next.disabled = carousel.scrollLeft >= max;
    prev.setAttribute("aria-disabled", prev.disabled ? "true" : "false");
    next.setAttribute("aria-disabled", next.disabled ? "true" : "false");
  };

  carousel.addEventListener("scroll", throttle(updateControls, 80), { passive: true });
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") scrollByCards(-1);
    if (e.key === "ArrowRight") scrollByCards(1);
  });
  updateControls();
}

// Process tabs logic
function initProcessTabs() {
  const panel = document.getElementById("processPanel");
  const tabsWrap = document.querySelector(".process__tabs");
  if (!panel || !tabsWrap) return;

  const tabs = Array.from(tabsWrap.querySelectorAll(".tab"));
  const stepKeys = Object.keys(PROCESS_STEPS);
  const setActive = (key) => {
    tabs.forEach((t) => {
      const isActive = t.dataset.tab === key;
      t.classList.toggle("is-active", isActive);
      t.setAttribute("aria-selected", isActive ? "true" : "false");
      t.tabIndex = isActive ? 0 : -1;
    });
    panel.setAttribute("aria-live", "polite");
    renderProcessPanel(key);
  };

  tabsWrap.addEventListener("click", (e) => {
    const btn = e.target instanceof Element ? e.target.closest(".tab") : null;
    if (!btn) return;
    const key = btn.dataset.tab;
    if (!key || !PROCESS_STEPS[key]) return;
    setActive(key);
  });

  tabsWrap.addEventListener("keydown", (e) => {
    const current = e.target instanceof Element ? e.target.closest(".tab") : null;
    if (!current) return;
    const currentIndex = tabs.indexOf(current);
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;
    if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (nextIndex !== currentIndex) {
      e.preventDefault();
      const nextTab = tabs[nextIndex];
      const key = nextTab.dataset.tab;
      if (!key || !PROCESS_STEPS[key]) return;
      setActive(key);
      nextTab.focus();
    }
  });

  // Initial render
  setActive("raw");

  function renderProcessPanel(key) {
    const step = PROCESS_STEPS[key];
    const currentIndex = stepKeys.indexOf(key);
    const prevKey = stepKeys[(currentIndex - 1 + stepKeys.length) % stepKeys.length];
    const nextKey = stepKeys[(currentIndex + 1) % stepKeys.length];
    const stepLabel = tabs[currentIndex]?.textContent?.trim() || key;
    panel.innerHTML = `
      <div class="process__copy">
        <p class="process__step-chip">Step ${currentIndex + 1}/${stepKeys.length}: ${escapeHtml(stepLabel)}</p>
        <h3 class="process__title">${escapeHtml(step.title)}</h3>
        <p class="process__text">${escapeHtml(step.text)}</p>
        <ul class="process__bullets">
          ${step.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>
      </div>
      <figure class="process__media">
        <img src="${step.image}" alt="${escapeHtml(step.imageAlt)}" width="840" height="520" loading="lazy" decoding="async" />
      </figure>
      <div class="process__mobile-nav" aria-label="Process step navigation">
        <button class="process__mobile-btn process__mobile-btn--prev" type="button" data-process-nav="${escapeHtml(prevKey)}">&larr; Previous</button>
        <button class="process__mobile-btn process__mobile-btn--next" type="button" data-process-nav="${escapeHtml(nextKey)}">Next &rarr;</button>
      </div>
    `;

    panel.querySelectorAll("[data-process-nav]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-process-nav");
        if (!next || !PROCESS_STEPS[next]) return;
        setActive(next);
      });
    });
  }
}

function initAppCardImages() {
  const imgs = document.querySelectorAll(".app-card__img");
  const source = "./assets/images/hero--1.svg";

  imgs.forEach((img) => {
    img.src = source;
    img.loading = "lazy";
    img.decoding = "async";
  });
}


function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// (intentionally no hover-preview helpers; hero hover stays subtle)

function throttle(fn, wait) {
  let last = 0;
  let queued = null;
  return function throttled(...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
      return;
    }
    queued = args;
    if (!queued) return;
    // schedule a trailing call
    const remaining = wait - (now - last);
    window.clearTimeout(throttled._t);
    throttled._t = window.setTimeout(() => {
      last = Date.now();
      fn.apply(this, queued);
      queued = null;
    }, remaining);
  };
}

function debounce(fn, wait) {
  let t = null;
  return function debounced(...args) {
    window.clearTimeout(t);
    t = window.setTimeout(() => fn.apply(this, args), wait);
  };
}

function initImageLightbox() {
  const imageMap = {
    img1: "./assets/images/hero--1.svg",
    img2: "./assets/images/hero--1.svg"
  };

  const lightbox = document.getElementById("imageLightbox");
  const lightboxImg = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  
  if (!lightbox || !lightboxImg || !lightboxClose) return;

  document.querySelectorAll("[data-img-lightbox]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const imgKey = btn.getAttribute("data-img-lightbox");
      if (imageMap[imgKey]) {
        lightboxImg.src = imageMap[imgKey];
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
        document.body.classList.add("modal-open");
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    document.body.classList.remove("modal-open");
  };

  lightboxClose.addEventListener("click", closeLightbox);
  
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}

// Modal logic
function initModalBehavior() {
  const quoteButtons = document.querySelectorAll("[data-quote-open]");
  quoteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openModal("quoteModal");
    });
  });

  const datasheetButton = document.getElementById("openDatasheetModal");
  if (datasheetButton) {
    datasheetButton.addEventListener("click", (event) => {
      event.preventDefault();
      openModal("datasheetModal");
    });
  }

  document.querySelectorAll("[data-download-pdf]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const title = button.dataset.downloadTitle || "Download PDF";
      const description = button.dataset.downloadDescription || "Enter your email to receive the PDF link.";
      const key = button.dataset.downloadPdf || "";
      openDownloadPdfModal({ title, description, key });
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      if (modal) closeModal(modal.id);
    });
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal__overlay")) {
        closeModal(modal.id);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal").forEach((modal) => {
        if (!modal.classList.contains("hidden")) {
          closeModal(modal.id);
        }
      });
    }
  });

  const quoteForm = document.getElementById("quoteForm");
  if (quoteForm) {
    quoteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      closeModal("quoteModal");
    });
  }

  const datasheetForm = document.getElementById("datasheetForm");
  if (datasheetForm) {
    datasheetForm.addEventListener("submit", (event) => {
      event.preventDefault();
      closeModal("datasheetModal");
    });
  }

  const downloadPdfForm = document.getElementById("downloadPdfForm");
  if (downloadPdfForm) {
    downloadPdfForm.addEventListener("submit", (event) => {
      event.preventDefault();
      closeModal("downloadPdfModal");
    });
  }
}

function openDownloadPdfModal({ title, description, key }) {
  const modalTitle = document.getElementById("downloadPdfModalTitle");
  const modalText = document.getElementById("downloadPdfModalText");
  const modalInput = document.getElementById("downloadPdfKey");

  if (modalTitle) modalTitle.textContent = title;
  if (modalText) modalText.textContent = description;
  if (modalInput) modalInput.value = key;
  openModal("downloadPdfModal");
}

// Sticky price bar logic
function handleStickyPriceBar() {
  const specsSection = document.getElementById("specs");
  const stickyBar = document.querySelector(".sticky-price-bar");
  const header = document.getElementById("siteHeader");

  if (!specsSection || !stickyBar) return;

  const check = () => {
    const rect = specsSection.getBoundingClientRect();
    const showPriceBar = rect.top <= 0;

    stickyBar.classList.toggle("visible", showPriceBar);
    if (header) {
      header.classList.toggle("price-bar-active", showPriceBar);
    }
  };

  window.addEventListener("scroll", check, { passive: true });
  check();
}

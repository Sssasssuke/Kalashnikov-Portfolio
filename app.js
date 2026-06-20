const data = window.PORTFOLIO_DATA;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const pageLabels = {
  one: "страница",
  few: "страницы",
  many: "страниц",
};

function pluralPages(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return pageLabels.one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return pageLabels.few;
  return pageLabels.many;
}

function setTelegramLinks() {
  $$("[data-telegram]").forEach((link) => {
    link.href = data.telegram;
  });
}

function setupHeader() {
  const header = $("[data-header]");
  const toggle = $("[data-menu-toggle]");
  const nav = $("[data-nav]");
  let lastScrollY = window.scrollY;
  const update = () => {
    if (!header) return;
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY && currentScrollY > 96;

    header.classList.toggle("is-scrolled", currentScrollY > 12);
    header.classList.toggle("is-hidden", scrollingDown && !nav?.classList.contains("is-open"));
    lastScrollY = Math.max(currentScrollY, 0);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });

  toggle?.addEventListener("click", () => {
    nav?.classList.toggle("is-open");
    toggle.classList.toggle("is-open");
  });

  nav?.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      nav.classList.remove("is-open");
      toggle?.classList.remove("is-open");
    }
  });
}

function setupCookieNote() {
  const note = $("[data-cookie-note]");
  if (!note) return;
  const key = "kalashnikov-cookie-note-seen";

  if (sessionStorage.getItem(key) === "true") {
    note.classList.add("is-hidden");
    return;
  }

  sessionStorage.setItem(key, "true");

  $("[data-cookie-close]", note)?.addEventListener("click", () => {
    note.classList.add("is-hidden");
  });
}

function footerMarkup() {
  return `
    <footer class="site-footer">
      <div class="container footer-inner">
        <span>Калашников Александр</span>
        <span class="footer-credit">
          <span>Дизайн - <a href="${data.telegram}" data-telegram target="_blank" rel="noreferrer">@kal4shnikoff</a>.</span>
          <span>Вёрстка - вайбкодинг</span>
        </span>
        <a href="${data.telegram}" data-telegram target="_blank" rel="noreferrer">@kal4shnikoff</a>
      </div>
    </footer>
  `;
}

function ensureSiteFooter() {
  if (!$(".site-footer")) {
    document.body.insertAdjacentHTML("beforeend", footerMarkup());
  }
}

function casePageCount(caseData) {
  return caseData.pageCount || caseData.sections.length;
}

function renderHomeCases() {
  const root = $("[data-home-cases]");
  if (!root) return;

  root.innerHTML = Object.entries(data.cases)
    .map(([key, item]) => {
      return `
        <a class="home-case-card is-${key}" href="${item.page}">
          <div class="home-case-media">
            <img src="${item.preview}" alt="${item.shortTitle}" loading="lazy" />
          </div>
          <div class="home-case-copy">
            <span>${item.kicker}</span>
            <h3>${item.shortTitle}</h3>
            <p>${item.summary}</p>
          </div>
        </a>
      `;
    })
    .join("");
}

function listMarkup(items) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function metricsMarkup(items) {
  return items
    .map((item) => {
      if (typeof item === "object") {
        return `<article><span>${item.label}</span><strong>${item.value}</strong></article>`;
      }
      const parts = item.split(" ");
      const first = parts.shift();
      return `<article><span>${parts.join(" ") || item}</span><strong>${first}</strong></article>`;
    })
    .join("");
}

function standardGalleryMarkup(caseData) {
  return caseData.sections
    .map((section) => {
      const figures = section.images
        .map((image) => {
          const ratio = image.height && image.width ? image.height / image.width : 1;
          const tone = ratio > 2.2 ? "is-long" : ratio < 0.8 ? "is-wide" : "";
          return `
            <figure class="work-card ${tone}">
              <img src="${image.src}" alt="${image.alt}" loading="lazy" data-lightbox-src="${image.src}" data-lightbox-title="${image.alt}" />
            </figure>
          `;
        })
        .join("");

      return `
        <section class="work-group">
          <div class="work-group-head">
            <h3>${section.title}</h3>
          </div>
          <div class="work-grid">${figures}</div>
        </section>
      `;
    })
    .join("");
}

function mtsGalleryMarkup(caseData) {
  const cards = caseData.sections
    .map((section, index) => {
      const image = section.images[0];
      return `
        <article class="mts-page-card">
          <button type="button" data-mts-open="${index}" aria-label="Открыть страницу ${section.title}">
            <img src="${image.previewSrc || image.src}" alt="${section.title}" loading="lazy" />
          </button>
          <h3>${section.title}</h3>
        </article>
      `;
    })
    .join("");

  return `
    <div class="mts-browser" data-mts-gallery>
      <div class="mts-preview-grid" data-mts-grid>${cards}</div>
      <section class="mts-page-viewer" data-mts-viewer hidden>
        <div class="mts-viewer-toolbar">
          <button class="button ghost" type="button" data-mts-back>← Вернуться к превью</button>
          <p data-mts-title></p>
        </div>
        <div class="mts-page-scroll">
          <img data-mts-full data-lightbox-src="" data-lightbox-title="" data-lightbox-collection="mts" data-lightbox-index="0" src="" alt="" />
        </div>
      </section>
    </div>
  `;
}

function presentationGalleryMarkup(caseData) {
  const tabs = (className = "") => caseData.sections
    .map(
      (section, index) => `
        <button class="${className} ${index === 0 ? "is-active" : ""}" type="button" data-presentation-tab="${section.slug}">
          ${section.title}
        </button>
      `,
    )
    .join("");

  const groups = caseData.sections
    .map((section, sectionIndex) => {
      const slides = section.images
        .map(
          (image) => `
            <figure class="slide-card">
              <img src="${image.src}" alt="${image.alt}" loading="lazy" data-lightbox-src="${image.src}" data-lightbox-title="${image.alt}" />
            </figure>
          `,
        )
        .join("");

      return `
        <section class="presentation-group ${sectionIndex === 0 ? "is-active" : ""}" data-presentation-panel="${section.slug}">
          <div class="presentation-head">
            <div>
              <p class="section-kicker">Презентация ${String(sectionIndex + 1).padStart(2, "0")}</p>
              <h3>${section.title}</h3>
            </div>
            <div class="presentation-tabs is-inside" aria-label="Презентации">${tabs("is-inner")}</div>
          </div>
          <div class="slider-shell" data-slider>
            <button class="slider-button prev" type="button" data-slider-prev aria-label="Предыдущий слайд"><span>←</span></button>
            <div class="slider-track" data-slider-track>${slides}</div>
            <button class="slider-button next" type="button" data-slider-next aria-label="Следующий слайд"><span>→</span></button>
            <div class="slider-progress" aria-hidden="true"><span data-slider-progress></span></div>
          </div>
        </section>
      `;
    })
    .join("");

  return `
    <div class="presentation-browser">
      <div class="presentation-tabs is-outside" aria-label="Презентации">${tabs()}</div>
      ${groups}
    </div>
  `;
}

function aiConceptGalleryMarkup(caseData) {
  const cards = caseData.sections
    .map((section) => {
      const image = section.images[0];
      return `
        <article class="ai-concept-card">
          <h3>${section.title}</h3>
          <figure>
            <img src="${image.src}" alt="${image.alt}" loading="lazy" data-lightbox-src="${image.src}" data-lightbox-title="${section.title}" />
          </figure>
        </article>
      `;
    })
    .join("");

  return `<div class="ai-concept-grid">${cards}</div>`;
}

function fashionGalleryMarkup(caseData) {
  const tabs = caseData.sections
    .map(
      (section, index) => `
        <button class="${index === 0 ? "is-active" : ""}" type="button" data-presentation-tab="${section.slug}">
          ${section.title}
        </button>
      `,
    )
    .join("");

  const groups = caseData.sections
    .map((section, sectionIndex) => {
      const images = section.images
        .map(
          (image) => `
            <figure class="fashion-frame">
              <img src="${image.src}" alt="${image.alt}" loading="lazy" data-lightbox-src="${image.src}" data-lightbox-title="${section.title}" />
            </figure>
          `,
        )
        .join("");

      return `
        <section class="presentation-group fashion-group ${sectionIndex === 0 ? "is-active" : ""}" data-presentation-panel="${section.slug}">
          <div class="presentation-head">
            <p class="section-kicker">Направление ${String(sectionIndex + 1).padStart(2, "0")}</p>
            <h3>${section.title}</h3>
          </div>
          <div class="fashion-stack">${images}</div>
        </section>
      `;
    })
    .join("");

  return `
    <div class="presentation-browser fashion-browser">
      <div class="presentation-tabs" aria-label="Направления Фонда моды">${tabs}</div>
      ${groups}
    </div>
  `;
}

function galleryMarkup(key, caseData) {
  if (key === "mts") return mtsGalleryMarkup(caseData);
  if (key === "presentations") return presentationGalleryMarkup(caseData);
  if (key === "ai-concepts") return aiConceptGalleryMarkup(caseData);
  if (key === "fashion-fund") return fashionGalleryMarkup(caseData);
  return standardGalleryMarkup(caseData);
}

function setupMtsGallery() {
  const gallery = $("[data-mts-gallery]");
  if (!gallery) return;

  const key = document.body.dataset.case;
  const caseData = data.cases[key];
  const grid = $("[data-mts-grid]", gallery);
  const viewer = $("[data-mts-viewer]", gallery);
  const pageScroll = $(".mts-page-scroll", gallery);
  const full = $("[data-mts-full]", gallery);
  const title = $("[data-mts-title]", gallery);
  const back = $("[data-mts-back]", gallery);

  const close = () => {
    viewer.hidden = true;
    grid.hidden = false;
    gallery.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  $$("[data-mts-open]", gallery).forEach((button) => {
    button.addEventListener("click", () => {
      const section = caseData.sections[Number(button.dataset.mtsOpen)];
      const image = section.images[0];
      full.src = image.src;
      full.alt = section.title;
      full.dataset.lightboxSrc = image.src;
      full.dataset.lightboxTitle = section.title;
      full.dataset.lightboxIndex = button.dataset.mtsOpen;
      title.textContent = section.title;
      if (pageScroll) pageScroll.scrollTop = 0;
      grid.hidden = true;
      viewer.hidden = false;
      viewer.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  back?.addEventListener("click", close);
}

function setupImageLightbox() {
  const root = $("[data-case-root]");
  if (!root || $("[data-image-lightbox]")) return;

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="image-lightbox" data-image-lightbox hidden>
        <button class="image-lightbox-close" type="button" data-lightbox-close aria-label="Закрыть">×</button>
        <button class="image-lightbox-arrow prev" type="button" data-lightbox-prev aria-label="Предыдущее изображение">←</button>
        <figure>
          <img data-lightbox-image src="" alt="" />
          <figcaption data-lightbox-caption></figcaption>
        </figure>
        <button class="image-lightbox-arrow next" type="button" data-lightbox-next aria-label="Следующее изображение">→</button>
        <div class="image-lightbox-progress" aria-hidden="true"><span data-lightbox-progress></span></div>
      </div>
    `,
  );

  const lightbox = $("[data-image-lightbox]");
  const image = $("[data-lightbox-image]", lightbox);
  const figure = $("figure", lightbox);
  const caption = $("[data-lightbox-caption]", lightbox);
  const close = $("[data-lightbox-close]", lightbox);
  const prev = $("[data-lightbox-prev]", lightbox);
  const next = $("[data-lightbox-next]", lightbox);
  const progress = $("[data-lightbox-progress]", lightbox);
  let images = [];
  let index = 0;
  let swipeStartX = 0;
  let swipeStartY = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let swipePointerId = null;
  let lastPointerSwipeAt = 0;

  $$("[data-lightbox-src]", root).forEach((item) => {
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    item.setAttribute("aria-label", `Увеличить изображение ${item.dataset.lightboxTitle || item.alt || ""}`.trim());
  });

  const visibleImages = () =>
    $$("[data-lightbox-src]", root).filter((item) => {
      if (!item.dataset.lightboxSrc) return false;
      if (item.closest("[hidden]")) return false;
      return Boolean(item.getClientRects().length);
    });

  const show = (nextIndex) => {
    if (!images.length) return;
    index = (nextIndex + images.length) % images.length;
    const current = images[index];
    image.src = current.dataset.lightboxSrc;
    image.alt = current.alt || current.dataset.lightboxTitle || "";
    caption.textContent = current.dataset.lightboxTitle || current.alt || "";
    prev.hidden = images.length < 2;
    next.hidden = images.length < 2;
    if (progress) progress.style.width = `${((index + 1) / images.length) * 100}%`;
  };

  const open = (target) => {
    if (target.dataset.lightboxCollection === "mts" && data.cases.mts) {
      images = data.cases.mts.sections.map((section) => {
        const item = section.images[0];
        return {
          alt: section.title,
          dataset: {
            lightboxSrc: item.src,
            lightboxTitle: section.title,
          },
        };
      });
      index = Number(target.dataset.lightboxIndex || 0);
    } else {
      images = visibleImages();
      index = images.indexOf(target);
    }
    if (index < 0) {
      images = [target];
      index = 0;
    }
    show(index);
    lightbox.hidden = false;
    document.body.classList.add("is-lightbox-open");
  };

  const hide = () => {
    lightbox.hidden = true;
    image.removeAttribute("src");
    document.body.classList.remove("is-lightbox-open");
  };

  root.addEventListener("click", (event) => {
    const target = event.target.closest("[data-lightbox-src]");
    if (!target) return;
    event.preventDefault();
    open(target);
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const target = event.target.closest("[data-lightbox-src]");
    if (!target) return;
    event.preventDefault();
    open(target);
  });

  close.addEventListener("click", hide);
  prev.addEventListener("click", () => show(index - 1));
  next.addEventListener("click", () => show(index + 1));

  const startSwipe = (event) => {
    if (images.length < 2 || event.button > 0) return;
    swipeStartX = event.clientX;
    swipeStartY = event.clientY;
    swipePointerId = event.pointerId;
    figure?.setPointerCapture?.(event.pointerId);
  };

  const finishSwipe = (event) => {
    if (swipePointerId !== event.pointerId) return;
    figure?.releasePointerCapture?.(event.pointerId);
    swipePointerId = null;
    if (images.length < 2) return;
    const deltaX = event.clientX - swipeStartX;
    const deltaY = event.clientY - swipeStartY;
    if (Math.abs(deltaX) < 44 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    lastPointerSwipeAt = Date.now();
    show(deltaX < 0 ? index + 1 : index - 1);
  };

  const finishTouchSwipe = (event) => {
    if (images.length < 2) return;
    if (Date.now() - lastPointerSwipeAt < 350) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    if (Math.abs(deltaX) < 44 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    event.preventDefault();
    show(deltaX < 0 ? index + 1 : index - 1);
  };

  figure?.addEventListener("pointerdown", startSwipe);
  figure?.addEventListener("pointerup", finishSwipe);
  figure?.addEventListener("pointercancel", () => {
    swipePointerId = null;
  });
  lightbox.addEventListener("touchstart", (event) => {
    if (event.target.closest("button")) return;
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });
  lightbox.addEventListener("touchend", finishTouchSwipe, { passive: false });
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) hide();
  });
  window.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") hide();
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });
}

function setupSliders() {
  $$("[data-slider]").forEach((slider) => {
    const track = $("[data-slider-track]", slider);
    const prev = $("[data-slider-prev]", slider);
    const next = $("[data-slider-next]", slider);
    const progress = $("[data-slider-progress]", slider);
    const slides = $$(".slide-card", track);
    let dragStartX = 0;
    let dragStartScroll = 0;
    let isDragging = false;
    let didDrag = false;
    let dragPointerId = null;
    const step = () => Math.max(260, track.clientWidth * 0.82);
    const update = () => {
      if (!progress || !slides.length) return;
      const maxScroll = Math.max(track.scrollWidth - track.clientWidth, 1);
      const ratio = slides.length === 1 ? 1 : track.scrollLeft / maxScroll;
      const current = Math.min(slides.length, Math.max(1, Math.round(ratio * (slides.length - 1)) + 1));
      progress.style.width = `${(current / slides.length) * 100}%`;
    };

    prev?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next?.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    track.addEventListener("pointerdown", (event) => {
      if (event.button > 0) return;
      isDragging = true;
      didDrag = false;
      dragStartX = event.clientX;
      dragStartScroll = track.scrollLeft;
      dragPointerId = event.pointerId;
      track.classList.add("is-dragging");
      track.setPointerCapture?.(event.pointerId);
    });
    track.addEventListener("pointermove", (event) => {
      if (!isDragging || dragPointerId !== event.pointerId) return;
      const deltaX = event.clientX - dragStartX;
      if (Math.abs(deltaX) > 6) didDrag = true;
      if (!didDrag) return;
      event.preventDefault();
      track.scrollLeft = dragStartScroll - deltaX;
    });
    const stopDrag = (event) => {
      if (dragPointerId !== event.pointerId) return;
      isDragging = false;
      dragPointerId = null;
      track.classList.remove("is-dragging");
      track.releasePointerCapture?.(event.pointerId);
    };
    track.addEventListener("pointerup", stopDrag);
    track.addEventListener("pointercancel", stopDrag);
    track.addEventListener("click", (event) => {
      if (!didDrag) return;
      event.preventDefault();
      event.stopPropagation();
      didDrag = false;
    }, true);
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    slider.updateSliderProgress = update;
    update();
  });
}

function setupPresentationTabs() {
  const browser = $("[data-case-root] .presentation-browser");
  if (!browser) return;

  const tabs = $$("[data-presentation-tab]", browser);
  const panels = $$("[data-presentation-panel]", browser);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const slug = tab.dataset.presentationTab;
      tabs.forEach((item) => item.classList.toggle("is-active", item.dataset.presentationTab === slug));
      panels.forEach((panel) => {
        const isActive = panel.dataset.presentationPanel === slug;
        panel.classList.toggle("is-active", isActive);
        if (isActive) {
          const slider = $("[data-slider]", panel);
          $("[data-slider-track]", panel)?.scrollTo({ left: 0, behavior: "smooth" });
          window.setTimeout(() => slider?.updateSliderProgress?.(), 240);
        }
      });
    });
  });
}

function renderCasePage() {
  const root = $("[data-case-root]");
  const key = document.body.dataset.case;
  const caseData = data.cases[key];
  if (!root || !caseData) return;
  const worksTitle =
    key === "mts"
      ? "Промостраницы в превью"
      : key === "presentations"
        ? "Презентации в отдельных каруселях"
      : key === "fashion-fund"
          ? "Материалы по направлениям"
          : key === "ai-concepts"
            ? "AI-серии, которые выглядят как бренд-кампания"
          : "Финальные макеты и визуальные материалы";
  const worksDescription =
    key === "mts"
      ? "Нажмите на превью, чтобы открыть полную страницу в отдельном просмотре и проскроллить ее как настоящий лендинг."
      : key === "presentations"
        ? "Выберите нужную презентацию в крошках: ниже откроется соответствующая карусель со слайдами в правильном порядке."
        : key === "fashion-fund"
          ? "Переключайтесь между BRICS и Московской Неделей Моды: ниже открывается соответствующая длинная лента материалов."
          : key === "ai-concepts"
            ? "Каждый концепт собран как цельная визуальная система: идея, AI-изображения, текстовые акценты и сетка для SMM."
          : "Изображения выводятся целиком, без обрезки и без лишних подписей под каждым макетом.";

  document.title = `${caseData.shortTitle} — кейс Александра Калашникова`;
  root.innerHTML = `
    <section class="case-hero dark-section" id="overview">
      <div class="container case-hero-grid">
        <div class="case-hero-copy">
          <a class="back-link" href="index.html#cases">← Все кейсы</a>
          <p class="kicker">${caseData.kicker}</p>
          <h1>${caseData.heroTitle || caseData.title}</h1>
          <p>${caseData.heroSummary || caseData.summary}</p>
          <div class="case-actions">
            <a class="button primary" href="#works">Смотреть работы</a>
            <a class="button ghost" href="${data.telegram}" target="_blank" rel="noreferrer">Telegram</a>
          </div>
        </div>
        <figure class="case-preview glass-panel">
          <img src="${caseData.preview}" alt="${caseData.shortTitle}" />
          <figcaption>${caseData.kicker}</figcaption>
        </figure>
      </div>
    </section>

    <section class="paper-section case-summary" id="role">
      <div class="container case-summary-grid">
        <div>
          <p class="section-kicker">Моя роль</p>
          <h2>За что отвечал в проекте</h2>
        </div>
        <ul class="role-list">${listMarkup(caseData.role)}</ul>
      </div>
      <div class="container metric-row">${metricsMarkup(caseData.results)}</div>
    </section>

    <section class="dark-section process-section" id="process">
      <div class="container section-head light">
        <p class="section-kicker">Процесс</p>
        <h2>Как доводил работу до результата</h2>
      </div>
      <div class="container process-grid">
        ${caseData.process
          .map(
            (step, index) => `
              <article>
                <span>${String(index + 1).padStart(2, "0")}</span>
                <p>${step}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>

    <section class="paper-section works-section" id="works">
      <div class="container section-head">
        <p class="section-kicker">Работы</p>
        <h2>${worksTitle}</h2>
        <p>${worksDescription}</p>
      </div>
      <div class="container">${galleryMarkup(key, caseData)}</div>
    </section>

    <section class="contact-section paper-section">
      <div class="container contact-panel">
        <div>
          <p class="section-kicker">Контакт</p>
          <h2>Готов обсудить команду, вакансию или проектную задачу</h2>
        </div>
        <a class="button primary" href="${data.telegram}" target="_blank" rel="noreferrer">Написать в Telegram</a>
      </div>
    </section>
  `;

  setupSliders();
  setupPresentationTabs();
  setupMtsGallery();
  setupImageLightbox();
}

setupHeader();
setupCookieNote();
renderHomeCases();
renderCasePage();
ensureSiteFooter();
setTelegramLinks();

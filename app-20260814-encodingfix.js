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

function gdsBrandingGalleryMarkup(caseData) {
  const gds = caseData.gds;
  if (!gds) return standardGalleryMarkup(caseData);

  const posts = gds.posts
    .map((post, index) => {
      const postNumber = post.title.match(/\d+/)?.[0] || String(index + 1).padStart(2, "0");
      return `
        <button class="gds-post-card" type="button" data-gds-post-open="${index}" aria-label="Открыть карусель ${post.title}">
          <img src="${post.preview}" alt="${post.title}" loading="lazy" />
          <span>${postNumber}</span>
        </button>
      `;
    })
    .join("");

  const personaSlides = gds.persona.images
    .map(
      (image) => `
        <figure class="slide-card gds-persona-slide">
          <img src="${image.src}" alt="${image.alt}" loading="lazy" data-lightbox-src="${image.src}" data-lightbox-title="${image.alt}" />
        </figure>
      `,
    )
    .join("");

  return `
    <div class="gds-case-stack">
      <section class="gds-feature">
        <div class="gds-feature-copy">
          <p class="section-kicker">Сайт</p>
          <h3>${gds.landing.title}</h3>
          <p>${gds.landing.text}</p>
          <button class="button primary gds-reveal-button" type="button" data-gds-landing-toggle>Раскрыть макет</button>
        </div>
        <figure class="gds-landing-frame" data-gds-landing-frame>
          <img src="${gds.landing.image.src}" alt="${gds.landing.image.alt}" loading="lazy" />
        </figure>
      </section>

      <section class="gds-feature">
        <div class="gds-feature-copy">
          <p class="section-kicker">Логотип</p>
          <h3>${gds.logo.title}</h3>
          <p>${gds.logo.text}</p>
        </div>
        <figure class="gds-logo-stage">
          <img src="${gds.logo.image.src}" alt="${gds.logo.image.alt}" loading="lazy" data-lightbox-src="${gds.logo.image.src}" data-lightbox-title="${gds.logo.image.alt}" />
        </figure>
      </section>

      <section class="gds-social-shell" data-gds-social>
        <div class="gds-social-head">
          <div>
            <p class="section-kicker">Карусели</p>
            <h3>Сетка для запрещенной в РФ соцсети</h3>
            <p>Восемь серий собраны как единая лента: у каждого поста свой крючок, но все вместе они удерживают один характер бренда.</p>
          </div>
          <div class="gds-social-profile-card">
            <strong>GDS Agency</strong>
            <span>8 posts · visual system · content identity</span>
          </div>
        </div>
        <div class="gds-social-grid">${posts}</div>
        <div class="gds-social-modal" data-gds-modal hidden>
          <div class="gds-social-dialog">
            <div class="gds-social-modal-head">
              <div>
                <strong data-gds-modal-title></strong>
                <span data-gds-modal-count></span>
              </div>
              <button type="button" data-gds-close aria-label="Закрыть">×</button>
            </div>
            <div class="gds-social-track" data-gds-track></div>
            <div class="gds-social-progress" data-gds-dots></div>
          </div>
        </div>
      </section>

      <section class="gds-feature">
        <div class="gds-feature-copy">
          <p class="section-kicker">Презентация</p>
          <h3>${gds.persona.title}</h3>
          <p>${gds.persona.text}</p>
        </div>
        <div class="slider-shell gds-persona-slider" data-slider>
          <button class="slider-button prev" type="button" data-slider-prev aria-label="Предыдущий слайд"><span>←</span></button>
          <div class="slider-track" data-slider-track>${personaSlides}</div>
          <button class="slider-button next" type="button" data-slider-next aria-label="Следующий слайд"><span>→</span></button>
        </div>
      </section>
    </div>
  `;
}


function galleryMarkup(key, caseData) {
  if (key === "mts") return mtsGalleryMarkup(caseData);
  if (key === "ai-concepts") return aiConceptGalleryMarkup(caseData);
  if (key === "fashion-fund") return fashionGalleryMarkup(caseData);
  if (key === "gds-branding") return gdsBrandingGalleryMarkup(caseData);
  return standardGalleryMarkup(caseData);
}

function setupGdsSocialGallery() {
  const gallery = $("[data-gds-social]");
  const landingFrame = $("[data-gds-landing-frame]");
  const landingToggle = $("[data-gds-landing-toggle]");

  landingToggle?.addEventListener("click", () => {
    const expanded = landingFrame?.classList.toggle("is-expanded");
    landingToggle.textContent = expanded ? "Свернуть макет" : "Раскрыть макет";
    if (expanded) landingFrame?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  landingFrame?.addEventListener("wheel", (event) => {
    const atTop = landingFrame.scrollTop <= 0;
    const atBottom = Math.ceil(landingFrame.scrollTop + landingFrame.clientHeight) >= landingFrame.scrollHeight;
    if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
      event.preventDefault();
      window.scrollBy({ top: event.deltaY * 4, behavior: "auto" });
    }
  }, { passive: false });

  if (!gallery) return;

  const key = document.body.dataset.case;
  const posts = data.cases[key]?.gds?.posts || [];
  const modal = $("[data-gds-modal]", gallery);
  const track = $("[data-gds-track]", gallery);
  const title = $("[data-gds-modal-title]", gallery);
  const count = $("[data-gds-modal-count]", gallery);
  const dots = $("[data-gds-dots]", gallery);
  const close = $("[data-gds-close]", gallery);
  let currentSlides = [];
  let dragStartX = 0;
  let dragStartScroll = 0;
  let isDragging = false;
  let dragPointerId = null;

  const activeIndex = () => {
    if (!track || !currentSlides.length) return 0;
    const width = Math.max(track.clientWidth, 1);
    return Math.min(currentSlides.length - 1, Math.max(0, Math.round(track.scrollLeft / width)));
  };

  const updateProgress = () => {
    const index = activeIndex();
    if (count) count.textContent = `${index + 1} / ${currentSlides.length}`;
    if (dots) {
      dots.innerHTML = currentSlides
        .map((_, dotIndex) => `<span class="${dotIndex === index ? "is-active" : ""}"></span>`)
        .join("");
    }
  };

  const open = (postIndex) => {
    const post = posts[postIndex];
    if (!post?.slides?.length || !modal || !track) return;
    currentSlides = post.slides;
    title.textContent = post.title;
    track.innerHTML = currentSlides
      .map(
        (image) => `
          <figure class="gds-social-slide">
            <img src="${image.src}" alt="${image.alt}" draggable="false" />
          </figure>
        `,
      )
      .join("");
    modal.hidden = false;
    document.body.classList.add("is-lightbox-open");
    track.scrollTo({ left: 0, behavior: "instant" });
    requestAnimationFrame(updateProgress);
  };

  const hide = () => {
    if (!modal || !track) return;
    modal.hidden = true;
    track.innerHTML = "";
    currentSlides = [];
    document.body.classList.remove("is-lightbox-open");
  };

  $$("[data-gds-post-open]", gallery).forEach((button) => {
    button.addEventListener("click", () => open(Number(button.dataset.gdsPostOpen || 0)));
  });

  close?.addEventListener("click", hide);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) hide();
  });

  track?.addEventListener("scroll", updateProgress, { passive: true });
  track?.addEventListener("pointerdown", (event) => {
    if (event.button > 0 || currentSlides.length < 2) return;
    isDragging = true;
    dragPointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartScroll = track.scrollLeft;
    track.classList.add("is-dragging");
    track.setPointerCapture?.(event.pointerId);
  });
  track?.addEventListener("pointermove", (event) => {
    if (!isDragging || dragPointerId !== event.pointerId) return;
    event.preventDefault();
    track.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
  });
  const stopDrag = (event) => {
    if (dragPointerId !== event.pointerId) return;
    isDragging = false;
    dragPointerId = null;
    track.classList.remove("is-dragging");
    track.releasePointerCapture?.(event.pointerId);
  };
  track?.addEventListener("pointerup", stopDrag);
  track?.addEventListener("pointercancel", stopDrag);

  window.addEventListener("keydown", (event) => {
    if (!modal || modal.hidden) return;
    if (event.key === "Escape") hide();
  });
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
    let snapTimer = null;
    const slideWidth = () => Math.max(track.clientWidth, 1);
    const activeIndex = () => Math.min(
      Math.max(slides.length - 1, 0),
      Math.max(0, Math.round(track.scrollLeft / slideWidth())),
    );
    const snapTo = (index, behavior = "smooth") => {
      if (!slides.length) return;
      const nextIndex = Math.min(slides.length - 1, Math.max(0, index));
      track.scrollTo({ left: nextIndex * slideWidth(), behavior });
    };
    const scheduleSnap = () => {
      window.clearTimeout(snapTimer);
      if (isDragging || !slides.length) return;
      snapTimer = window.setTimeout(() => snapTo(activeIndex()), 120);
    };
    const update = () => {
      if (!progress || !slides.length) return;
      const maxScroll = Math.max(track.scrollWidth - track.clientWidth, 1);
      const ratio = slides.length === 1 ? 1 : track.scrollLeft / maxScroll;
      const current = Math.min(slides.length, Math.max(1, Math.round(ratio * (slides.length - 1)) + 1));
      progress.style.width = `${(current / slides.length) * 100}%`;
    };

    prev?.addEventListener("click", () => snapTo(activeIndex() - 1));
    next?.addEventListener("click", () => snapTo(activeIndex() + 1));
    track.addEventListener("pointerdown", (event) => {
      if (event.button > 0) return;
      window.clearTimeout(snapTimer);
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
      snapTo(activeIndex());
    };
    track.addEventListener("pointerup", stopDrag);
    track.addEventListener("pointercancel", stopDrag);
    track.addEventListener("click", (event) => {
      if (!didDrag) return;
      event.preventDefault();
      event.stopPropagation();
      didDrag = false;
    }, true);
    track.addEventListener("scroll", () => {
      update();
      scheduleSnap();
    }, { passive: true });
    window.addEventListener("resize", () => {
      snapTo(activeIndex(), "auto");
      update();
    });
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
  const worksCopy = {
    mts: {
      title: "????????????? ? ???????",
      description: "????????? ???????? ?????-???????? ? ?????????? ???????, ??????? ??????? ??? ???: ?? ??????? ?????? ?? ??????? ?????????? ????????.",
    },
    "fashion-fund": {
      title: "???????? ? ?????????? ???????",
      description: "??????????? ??????? BRICS ? ?????????? ?????? ????: key visual, ????????, ?????????, digital-????????? ? ??????????? ??????.",
    },
    "ai-concepts": {
      title: "AI-????? ??? ?????-????????????",
      description: "????????? ?????????? ???????? ??? ??????????? ???????????????? ???????: ?????, AI-???????????, ????????? ?????? ? ???? ??? SMM.",
    },
  };
  const fallbackWorks = worksCopy[key] || {
    title: "????????? ?????? ? ?????????? ?????????",
    description: "????????? ???????? ???????? ???????, ??? ????? ??????, ???? ? ???????? ?????????? ???????.",
  };
  const worksTitle = caseData.worksTitle || fallbackWorks.title;
  const worksDescription = caseData.worksDescription || fallbackWorks.description;

  document.title = `${caseData.shortTitle} — кейс Александра Калашникова`;
  root.innerHTML = `
    <section class="case-hero dark-section" id="overview">
      <div class="container case-hero-grid">
        <div class="case-hero-copy">
          <a class="back-link" href="/#cases">← Все кейсы</a>
          <p class="kicker">${caseData.kicker}</p>
          <h1>${caseData.heroTitle || caseData.title}</h1>
          <p>${caseData.heroSummary || caseData.summary}</p>
          <div class="case-actions">
            <a class="button primary" href="#works">Смотреть работы</a>
            <a class="button ghost" href="${data.telegram}" target="_blank" rel="noreferrer">Telegram</a>
          </div>
        </div>
        <figure class="case-preview glass-panel">
          <img src="${caseData.heroPreview || caseData.preview}" alt="${caseData.shortTitle}" />
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
  setupGdsSocialGallery();
  setupImageLightbox();
}

setupHeader();
setupCookieNote();
renderHomeCases();
renderCasePage();
ensureSiteFooter();
setTelegramLinks();

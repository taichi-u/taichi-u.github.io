// Small progressive enhancements. All content and links work without JavaScript.
const root = document.documentElement;
const header = document.querySelector(".site-header");
const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");
const narrowScreen = matchMedia("(max-width: 820px)");
if (header && menu && nav) {
  header.classList.add("js-nav");
  const closeMenu = (returnFocus = false) => {
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    if (returnFocus) menu.focus();
  };
  const syncMenu = () => {
    menu.hidden = !narrowScreen.matches;
    if (!narrowScreen.matches) closeMenu();
  };
  syncMenu();
  narrowScreen.addEventListener("change", syncMenu);
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open"))
      closeMenu(true);
  });
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) closeMenu();
  });
  header.addEventListener("focusout", () => {
    requestAnimationFrame(() => {
      if (!header.contains(document.activeElement)) closeMenu();
    });
  });
}

// Keep the same section when changing language on the homepage.
for (const link of document.querySelectorAll("[data-language]")) {
  link.addEventListener("click", () => {
    const destination = new URL(link.href);
    destination.hash = location.hash;
    link.href = destination.href;
  });
}

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const motionButtons = document.querySelectorAll(".motion-toggle, [data-motion-control]");
let explicitMotion;
try {
  explicitMotion = localStorage.getItem("portfolio-motion");
} catch {
  /* Storage may be unavailable. */
}
const syncMotion = () => {
  const off = reduceMotion.matches || explicitMotion === "off";
  root.dataset.motion = off ? "off" : "on";
  for (const motionButton of motionButtons) {
    motionButton.hidden = false;
    motionButton.setAttribute("aria-pressed", String(off));
    motionButton.textContent = `${motionButton.dataset.label}: ${off ? motionButton.dataset.off : motionButton.dataset.on}`;
    motionButton.disabled = reduceMotion.matches;
  }
};
reduceMotion.addEventListener("change", syncMotion);
syncMotion();
for (const motionButton of motionButtons) motionButton.addEventListener("click", () => {
  explicitMotion = root.dataset.motion === "off" ? "on" : "off";
  try {
    localStorage.setItem("portfolio-motion", explicitMotion);
  } catch {
    /* Optional preference. */
  }
  syncMotion();
});

// Load 3D after critical content, when a visible page approaches the hero.
const sceneStage = document.querySelector("[data-scene]");
if (sceneStage) {
  const sceneURL = new URL("scene.min.js", document.currentScript.src);
  let pageLoaded = document.readyState === "complete";
  let started = false;
  let sceneObserver;
  const loadScene = () => {
    if (started || !pageLoaded || document.hidden) return;
    // Recheck current bounds: a deep-link jump can follow an observer callback.
    const bounds = sceneStage.getBoundingClientRect();
    if (bounds.bottom < -200 || bounds.top > innerHeight + 200 || !bounds.width || !bounds.height) return;
    started = true;
    sceneObserver?.disconnect();
    document.removeEventListener("visibilitychange", loadScene);
    window.removeEventListener("scroll", loadScene);
    window.removeEventListener("resize", loadScene);
    import(sceneURL.href).catch(error => console.warn("3D background unavailable:", error));
  };
  if ("IntersectionObserver" in window) {
    sceneObserver = new IntersectionObserver(loadScene, { rootMargin: "200px" });
    sceneObserver.observe(sceneStage);
  } else {
    window.addEventListener("scroll", loadScene, { passive: true });
    window.addEventListener("resize", loadScene);
  }
  document.addEventListener("visibilitychange", loadScene);
  if (pageLoaded) requestAnimationFrame(loadScene);
  else window.addEventListener("load", () => {
    pageLoaded = true;
    requestAnimationFrame(loadScene);
  }, { once: true });
}

const filters = document.querySelector(".filters");
const cards = [...document.querySelectorAll(".project-card")];
if (filters && cards.length) {
  filters.hidden = false;
  const count = document.querySelector(".project-count");
  filters.addEventListener("click", (e) => {
    const button = e.target.closest("[data-filter]");
    if (!button) return;
    for (const filter of filters.querySelectorAll("button"))
      filter.setAttribute("aria-pressed", String(filter === button));
    for (const card of cards)
      card.hidden =
        button.dataset.filter !== "all" &&
        !card.dataset.category.split(" ").includes(button.dataset.filter);
    count.textContent = `${String(cards.filter((card) => !card.hidden).length).padStart(2, "0")} ${count.dataset.unit}`;
  });
}

// Native dialogs provide focus trapping and Escape support; real URLs remain as a fallback.
if (
  typeof HTMLDialogElement !== "undefined" &&
  HTMLDialogElement.prototype.showModal
) {
  let trigger;
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-project]");
    if (
      !link ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    )
      return;
    const dialog = document.getElementById(`project-${link.dataset.project}`);
    if (!dialog) return;
    e.preventDefault();
    trigger = link;
    const template = dialog.querySelector("template");
    if (template) {
      dialog.append(template.content.cloneNode(true));
      template.remove();
    }
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add("modal-open");
    dialog.querySelector(".dialog-close")?.focus({ preventScroll: true });
  });
  for (const dialog of document.querySelectorAll(".project-dialog")) {
    let backdropDown = false;
    dialog.addEventListener("pointerdown", (e) => {
      backdropDown = e.target === dialog && outsideDialog(e, dialog);
    });
    dialog.addEventListener("click", (e) => {
      if (backdropDown && e.target === dialog && outsideDialog(e, dialog))
        dialog.close();
      backdropDown = false;
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("modal-open");
      trigger?.focus({ preventScroll: true });
    });
  }
}
function outsideDialog(e, dialog) {
  const r = dialog.getBoundingClientRect();
  return (
    e.clientX < r.left ||
    e.clientX > r.right ||
    e.clientY < r.top ||
    e.clientY > r.bottom
  );
}

// Gallery links open the image directly when JavaScript or dialogs are unavailable.
const galleryCards = [...document.querySelectorAll(".gallery-card")];
const galleryFilters = document.querySelector(".gallery-filters");
if (galleryFilters && galleryCards.length) {
  galleryFilters.hidden = false;
  const status = document.querySelector("#gallery-count");
  galleryFilters.addEventListener("click", (event) => {
    const filter = event.target.closest("[data-gallery-filter]");
    if (!filter) return;
    for (const button of galleryFilters.querySelectorAll("button"))
      button.setAttribute("aria-pressed", String(button === filter));
    for (const card of galleryCards)
      card.hidden = filter.dataset.galleryFilter !== "all" &&
        !card.dataset.category.split(" ").includes(filter.dataset.galleryFilter);
    status.textContent = `${galleryCards.filter(card => !card.hidden).length} ${status.dataset.unit}`;
  });
}

const galleryDialog = document.querySelector("#gallery-dialog");
if (galleryDialog && typeof galleryDialog.showModal === "function") {
  let galleryTrigger;
  let visiblePhotos = [];
  let photoIndex = 0;
  const showPhoto = (index) => {
    photoIndex = (index + visiblePhotos.length) % visiblePhotos.length;
    const card = visiblePhotos[photoIndex];
    const image = document.createElement("img");
    image.src = card.querySelector("[data-gallery-photo]").href;
    image.alt = card.querySelector("img").alt;
    image.width = Number(card.querySelector("img").getAttribute("width"));
    image.height = Number(card.querySelector("img").getAttribute("height"));
    galleryDialog.querySelector(".gallery-dialog-image").replaceChildren(image);
    galleryDialog.querySelector("#gallery-dialog-title").textContent = card.querySelector("h2").textContent;
    galleryDialog.querySelector("#gallery-dialog-caption").textContent = card.querySelector("figcaption p").textContent;
    galleryDialog.querySelector("#gallery-position").textContent = `${photoIndex + 1} / ${visiblePhotos.length}`;
  };
  document.querySelector(".photo-gallery").addEventListener("click", (event) => {
    const link = event.target.closest("[data-gallery-photo]");
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    galleryTrigger = link;
    visiblePhotos = galleryCards.filter(card => !card.hidden);
    showPhoto(visiblePhotos.indexOf(link.closest(".gallery-card")));
    galleryDialog.showModal();
    document.body.classList.add("modal-open");
    galleryDialog.querySelector(".dialog-close").focus({ preventScroll: true });
  });
  galleryDialog.querySelector("[data-gallery-previous]").addEventListener("click", () => showPhoto(photoIndex - 1));
  galleryDialog.querySelector("[data-gallery-next]").addEventListener("click", () => showPhoto(photoIndex + 1));
  galleryDialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(photoIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
    if (event.key === "Tab") {
      const buttons = [...galleryDialog.querySelectorAll("button")];
      const first = buttons[0], last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  let backdropDown = false;
  galleryDialog.addEventListener("pointerdown", (event) => {
    backdropDown = event.target === galleryDialog && outsideDialog(event, galleryDialog);
  });
  galleryDialog.addEventListener("click", (event) => {
    if (backdropDown && event.target === galleryDialog && outsideDialog(event, galleryDialog)) galleryDialog.close();
    backdropDown = false;
  });
  galleryDialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    galleryTrigger?.focus({ preventScroll: true });
  });
}

const copy = document.querySelector(".copy-email");
if (copy && navigator.clipboard && window.isSecureContext) {
  copy.hidden = false;
  const original = copy.innerHTML;
  let copyTimer;
  copy.addEventListener("click", async () => {
    const status = document.querySelector(".copy-status");
    try {
      await navigator.clipboard.writeText(copy.dataset.email);
      copy.textContent = copy.dataset.copied + " ✓";
      status.textContent = copy.dataset.copied;
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => {
        copy.innerHTML = original;
        status.textContent = "";
      }, 2500);
    } catch {
      status.textContent = copy.dataset.error;
    }
  });
}

// One observer updates location cues; scrolling itself remains entirely native.
if ("IntersectionObserver" in window) {
  const links = [...document.querySelectorAll("nav a[data-section]")];
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of links) {
          if (link.dataset.section === entry.target.id)
            link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "-15% 0px -60% 0px", threshold: 0 },
  );
  for (const section of document.querySelectorAll("main > section[id]"))
    observer.observe(section);
  const hero = document.querySelector(".hero");
  if (hero)
    new IntersectionObserver((entries) => {
      const satellite = document.querySelector(".orbit-satellite");
      if (satellite)
        satellite.style.animationPlayState = entries[0].isIntersecting
          ? "running"
          : "paused";
      if (entries[0].isIntersecting)
        links.forEach((link) => link.removeAttribute("aria-current"));
    }).observe(hero);
}

// Search and category filters for the full activity archive.
const archiveControls = document.querySelector(".archive-controls");
if (archiveControls) {
  archiveControls.hidden = false;
  let category = "all";
  const input = document.querySelector("#archive-search");
  const entries = [...document.querySelectorAll(".archive-entry")];
  const status = document.querySelector("#archive-count");
  const applyFilters = () => {
    const term = input.value.trim().toLocaleLowerCase().normalize("NFKC");
    for (const entry of entries) {
      entry.hidden =
        (category !== "all" && entry.dataset.category !== category) ||
        !entry.textContent.toLocaleLowerCase().normalize("NFKC").includes(term);
    }
    document.querySelectorAll(".archive-group").forEach((group) => {
      group.hidden = !group.querySelector(".archive-entry:not([hidden])");
    });
    const n = entries.filter((entry) => !entry.hidden).length;
    status.textContent = `${n} ${status.dataset.unit}`;
    document.querySelector("#archive-empty").hidden = n > 0;
  };
  input.addEventListener("input", applyFilters);
  archiveControls.addEventListener("click", (e) => {
    const filter = e.target.closest("[data-archive-filter]");
    if (filter) {
      category = filter.dataset.archiveFilter;
      archiveControls
        .querySelectorAll("[data-archive-filter]")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === filter)));
      applyFilters();
    }
    if (e.target.closest("[data-reset-search]")) {
      input.value = "";
      category = "all";
      archiveControls
        .querySelectorAll("[data-archive-filter]")
        .forEach((b) =>
          b.setAttribute(
            "aria-pressed",
            String(b.dataset.archiveFilter === "all"),
          ),
        );
      applyFilters();
      input.focus();
    }
  });
}

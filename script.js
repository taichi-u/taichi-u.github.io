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
const motionButton = document.querySelector(".motion-toggle");
let explicitMotion;
try {
  explicitMotion = localStorage.getItem("portfolio-motion");
} catch {
  /* Storage may be unavailable. */
}
const syncMotion = () => {
  const off = reduceMotion.matches || explicitMotion === "off";
  root.dataset.motion = off ? "off" : "on";
  if (motionButton) {
    motionButton.hidden = false;
    motionButton.setAttribute("aria-pressed", String(off));
    motionButton.textContent = `${motionButton.dataset.label}: ${off ? motionButton.dataset.off : motionButton.dataset.on}`;
    motionButton.disabled = reduceMotion.matches;
  }
};
reduceMotion.addEventListener("change", syncMotion);
syncMotion();
motionButton?.addEventListener("click", () => {
  explicitMotion = root.dataset.motion === "off" ? "on" : "off";
  try {
    localStorage.setItem("portfolio-motion", explicitMotion);
  } catch {
    /* Optional preference. */
  }
  syncMotion();
});

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

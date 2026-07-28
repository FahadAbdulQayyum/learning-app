(() => {
  const MotionApi = window.Motion;
  if (!MotionApi) return;

  document.documentElement.classList.add("js-motion");

  const { animate, stagger, hover, press, inView } = MotionApi;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const springSoft = { type: "spring", stiffness: 280, damping: 24 };
  const springPop = { type: "spring", stiffness: 420, damping: 22 };

  function safeAnimate(targets, keyframes, options) {
    if (reduced || !targets || (targets.length !== undefined && !targets.length)) return null;
    try {
      return animate(targets, keyframes, options);
    } catch {
      return null;
    }
  }

  function prepareHidden(els) {
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
    });
  }

  function enterElements(elements, { delay = 0, y = 18, staggerEach = 0.06 } = {}) {
    const els = Array.from(elements).filter(Boolean);
    if (!els.length) return;
    if (reduced) {
      els.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    prepareHidden(els);
    safeAnimate(
      els,
      { opacity: 1, y: [y, 0] },
      {
        ...springSoft,
        delay: stagger(staggerEach, { start: delay }),
      }
    );
  }

  function enterBrand() {
    const letters = document.querySelectorAll(".site-header .brand-letter");
    if (!letters.length) return;
    if (reduced) return;

    letters.forEach((el) => {
      el.style.opacity = "0";
      el.style.filter = "blur(8px)";
    });

    safeAnimate(
      letters,
      { opacity: 1, y: [28, 0], scale: [0.82, 1], filter: ["blur(8px)", "blur(0px)"] },
      {
        type: "spring",
        stiffness: 220,
        damping: 18,
        delay: stagger(0.08),
      }
    );
  }

  function enterHeaderChrome() {
    enterElements(
      document.querySelectorAll(
        ".site-header .thanks, .site-header .slogan, .site-header .welcome, .site-header .tagline, .site-nav, .toolbar"
      ),
      { delay: 0.15, staggerEach: 0.07 }
    );
  }

  function enterList(container, selector = ".sentence, .story-card, .vocab-chip, .grammar-example, .story-paragraph, .verb-tense-card") {
    if (!container) return;
    const items = container.querySelectorAll(selector);
    enterElements(items, { staggerEach: 0.045, y: 16 });
  }

  function popIn(element) {
    if (!element || reduced) return;
    element.style.opacity = "0";
    safeAnimate(element, { opacity: 1, scale: [0.92, 1], y: [12, 0] }, springPop);
  }

  function openPanel(panel) {
    if (!panel || reduced) {
      if (panel) panel.hidden = false;
      return;
    }
    panel.hidden = false;
    panel.style.opacity = "0";
    safeAnimate(panel, { opacity: 1, y: [10, 0], scale: [0.96, 1] }, springPop);
  }

  function bounceTap(element) {
    if (!element || reduced) return;
    safeAnimate(element, { scale: [1, 0.94, 1] }, { duration: 0.28, ease: "easeOut" });
  }

  function bindPressable(root = document) {
    if (reduced || !press) return;
    const selector =
      ".word-chip, .vocab-chip, .nav-btn, .play-sentence, .favourite-btn, .story-card, .voice-fab, .grammar-filter, .favourites-toggle, .verb-tense-row, .verb-infinitive";
    root.querySelectorAll(selector).forEach((el) => {
      if (el.dataset.motionBound) return;
      el.dataset.motionBound = "1";
      press(el, (element) => {
        safeAnimate(element, { scale: 0.96 }, { type: "spring", stiffness: 500, damping: 28 });
        return () => safeAnimate(element, { scale: 1 }, springSoft);
      });
    });
  }

  function bindHoverLift(root = document) {
    if (reduced || !hover) return;
    root.querySelectorAll(".word-chip, .vocab-chip, .story-card").forEach((el) => {
      if (el.dataset.motionHover) return;
      el.dataset.motionHover = "1";
      hover(el, (element) => {
        safeAnimate(element, { y: -2 }, { duration: 0.18 });
        return () => safeAnimate(element, { y: 0 }, { duration: 0.22 });
      });
    });
  }

  function watchInView(root = document) {
    if (reduced || !inView) return;
    root.querySelectorAll(".sentence, .story-card, .grammar-example, .story-paragraph").forEach((el) => {
      if (el.dataset.motionInview) return;
      el.dataset.motionInview = "1";
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      inView(
        el,
        () => {
          safeAnimate(el, { opacity: 1, y: 0 }, springSoft);
        },
        { amount: 0.2 }
      );
    });
  }

  function refresh(root = document) {
    bindPressable(root);
    bindHoverLift(root);
  }

  // Kick off header motion once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      enterBrand();
      enterHeaderChrome();
      refresh();
      popIn(document.querySelector(".voice-fab"));
      popIn(document.querySelector(".app-version"));
    });
  } else {
    enterBrand();
    enterHeaderChrome();
    refresh();
    popIn(document.querySelector(".voice-fab"));
    popIn(document.querySelector(".app-version"));
  }

  window.LautMotion = {
    enterElements,
    enterList,
    enterBrand,
    popIn,
    openPanel,
    bounceTap,
    refresh,
    watchInView,
    reduced,
  };
})();

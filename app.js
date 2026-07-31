(() => {
  const BATCH_SIZE = 8;
  function motion() {
    return window.LautMotion || null;
  }

  if (window.Motion) {
    document.documentElement.classList.add("js-motion");
  }

  function afterPaint(fn) {
    requestAnimationFrame(() => requestAnimationFrame(fn));
  }
  const NAME_KEY = "laut-learner-name";
  const FAV_KEY = "laut-favourite-ids";
  const VOICE_KEY = "laut-voice-gender";

  const versionEl = document.getElementById("app-version");
  if (versionEl && window.LAUT_VERSION) {
    versionEl.textContent = `v${window.LAUT_VERSION}`;
  }

  const listEl = document.getElementById("sentence-list");
  const emptyEl = document.getElementById("empty-state");
  const searchEl = document.getElementById("search");
  const sentinelEl = document.getElementById("scroll-sentinel");
  const loadingEl = document.getElementById("loading-more");
  const welcomeEl = document.getElementById("welcome");
  const nameGateEl = document.getElementById("name-gate");
  const nameFormEl = document.getElementById("name-form");
  const nameInputEl = document.getElementById("learner-name");
  const favouritesToggleEl = document.getElementById("favourites-toggle");
  const favouritesCountEl = document.getElementById("favourites-count");

  /** @type {SpeechSynthesisVoice | null} */
  let germanVoice = null;
  /** @type {"female" | "male" | "unknown"} */
  let germanVoiceGender = "unknown";
  /** @type {"female" | "male"} */
  let voiceGender = loadVoiceGender();
  /** @type {HTMLElement | null} */
  let activeEl = null;

  /** @type {typeof SENTENCES} */
  let queue = [];
  let filterQuery = "";
  let loading = false;
  let renderedCount = 0;
  let showingFavourites = false;
  /** @type {Set<string>} */
  let favouriteIds = loadFavourites();

  const playIcon = `
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 2.5v11l10-5.5-10-5.5z"/>
    </svg>
  `;

  const starIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 17.3 6.2 20.5l1.1-6.5L2.5 9.5l6.6-1L12 2.5l2.9 6 6.6 1-4.8 4.5 1.1 6.5L12 17.3z"/>
    </svg>
  `;

  function loadFavourites() {
    try {
      const raw = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
      if (!Array.isArray(raw)) return new Set();
      return new Set(raw.filter((id) => typeof id === "string"));
    } catch {
      return new Set();
    }
  }

  function saveFavourites() {
    localStorage.setItem(FAV_KEY, JSON.stringify([...favouriteIds]));
  }

  function updateFavouritesCount() {
    favouritesCountEl.textContent = String(favouriteIds.size);
  }

  function isFavourite(id) {
    return favouriteIds.has(id);
  }

  function toggleFavourite(id) {
    if (favouriteIds.has(id)) {
      favouriteIds.delete(id);
    } else {
      favouriteIds.add(id);
    }
    saveFavourites();
    updateFavouritesCount();
  }

  function initThemeToggle() {
    const THEME_KEY = "laut-theme";
    const toggle = document.getElementById("theme-toggle");
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!toggle) return;

    function isDark() {
      return document.documentElement.getAttribute("data-theme") === "dark";
    }

    function applyTheme(dark) {
      document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
      toggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      if (themeMeta) themeMeta.setAttribute("content", dark ? "#0f1a1e" : "#114a52");
    }

    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") {
      applyTheme(saved === "dark");
    } else {
      applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    toggle.addEventListener("click", () => {
      applyTheme(!isDark());
    });
  }

  function showWelcome(name) {
    welcomeEl.textContent = `Welcome ${name}`;
    welcomeEl.hidden = false;
  }

  function closeNameGate() {
    nameGateEl.hidden = true;
    document.body.classList.remove("is-gated");
  }

  function openNameGate() {
    nameGateEl.hidden = false;
    document.body.classList.add("is-gated");
    requestAnimationFrame(() => nameInputEl.focus());
  }

  function initNameGate() {
    const saved = (localStorage.getItem(NAME_KEY) || "").trim();
    if (saved) {
      showWelcome(saved);
      closeNameGate();
      return;
    }

    openNameGate();

    nameFormEl.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = nameInputEl.value.trim();
      if (!name) {
        nameInputEl.focus();
        return;
      }

      localStorage.setItem(NAME_KEY, name);
      showWelcome(name);
      closeNameGate();
    });
  }

  initNameGate();
  initThemeToggle();
  initVoiceSettings();
  initHourlyQuiz();
  updateFavouritesCount();

  function loadVoiceGender() {
    const saved = localStorage.getItem(VOICE_KEY);
    return saved === "male" ? "male" : "female";
  }

  /**
   * @param {SpeechSynthesisVoice} voice
   * @returns {"female" | "male" | "unknown"}
   */
  function classifyVoiceGender(voice) {
    const label = `${voice.name} ${voice.voiceURI}`;
    const femaleHints =
      /anna|katja|hedda|helena|petra|vicki|zira|susan|ingrid|gisela|lena|female|frau|google\s*deutsch|deutsch\s*google/i;
    const maleHints =
      /stefan|markus|georg|yannick|conrad|klaus|ralf|david|martin|hans|male|herr|thomas|michael|andreas/i;

    if (maleHints.test(label)) return "male";
    if (femaleHints.test(label)) return "female";
    return "unknown";
  }

  function getGermanVoices() {
    return speechSynthesis
      .getVoices()
      .filter((v) => /^de(-|_)/i.test(v.lang))
      .sort((a, b) => {
        // Prefer Germany over Austria/Switzerland, then Microsoft/Google quality voices
        const rank = (v) => {
          let score = 0;
          if (/de-DE/i.test(v.lang)) score += 4;
          if (/microsoft|google/i.test(v.name)) score += 2;
          if (/natural|online/i.test(v.name)) score += 1;
          return score;
        };
        return rank(b) - rank(a);
      });
  }

  function pickGermanVoice() {
    const voices = getGermanVoices();
    if (!voices.length) {
      germanVoice = null;
      germanVoiceGender = "unknown";
      updateVoiceLabels();
      return;
    }

    const grouped = {
      female: voices.filter((v) => classifyVoiceGender(v) === "female"),
      male: voices.filter((v) => classifyVoiceGender(v) === "male"),
      unknown: voices.filter((v) => classifyVoiceGender(v) === "unknown"),
    };

    /** @type {SpeechSynthesisVoice | undefined} */
    let chosen;
    /** @type {"female" | "male" | "unknown"} */
    let matched = "unknown";

    if (voiceGender === "male") {
      chosen = grouped.male[0] || grouped.unknown[0] || grouped.female[0];
      matched = chosen ? classifyVoiceGender(chosen) : "unknown";
    } else {
      chosen = grouped.female[0] || grouped.unknown[0] || grouped.male[0];
      matched = chosen ? classifyVoiceGender(chosen) : "unknown";
    }

    germanVoice = chosen || null;
    germanVoiceGender = matched;
    updateVoiceLabels();
  }

  function updateVoiceLabels() {
    const labelEl = document.getElementById("voice-active-label");
    const hintEl = document.getElementById("voice-hint");
    if (!labelEl || !hintEl) return;

    if (!germanVoice) {
      labelEl.textContent = "No German voice found on this device.";
      hintEl.hidden = false;
      hintEl.textContent = "Install a German voice in your system speech settings.";
      return;
    }

    labelEl.textContent = `Using: ${germanVoice.name}`;

    if (voiceGender === "male" && germanVoiceGender !== "male") {
      hintEl.hidden = false;
      hintEl.textContent =
        "No male German voice installed. Using a deeper pitch. For a real male voice, install Microsoft Conrad or Stefan in Windows speech settings.";
    } else if (voiceGender === "female" && germanVoiceGender !== "female") {
      hintEl.hidden = false;
      hintEl.textContent =
        "No female German voice installed. Using a higher pitch. Install Microsoft Katja for a clearer female voice.";
    } else {
      hintEl.hidden = true;
      hintEl.textContent = "";
    }
  }

  pickGermanVoice();
  if (typeof speechSynthesis !== "undefined") {
    speechSynthesis.addEventListener("voiceschanged", pickGermanVoice);
  }

  function initVoiceSettings() {
    const fab = document.getElementById("voice-fab");
    const panel = document.getElementById("voice-panel");
    const options = document.querySelectorAll(".voice-option");
    if (!fab || !panel) return;

    function syncOptions() {
      options.forEach((btn) => {
        const active = btn.getAttribute("data-voice") === voiceGender;
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
      updateVoiceLabels();
    }

    function setOpen(open) {
      fab.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        const m = motion();
        if (m) m.openPanel(panel);
        else panel.hidden = false;
        pickGermanVoice();
        syncOptions();
      } else {
        panel.hidden = true;
      }
    }

    syncOptions();

    fab.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(panel.hidden);
    });

    options.forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-voice") === "male" ? "male" : "female";
        voiceGender = next;
        localStorage.setItem(VOICE_KEY, next);
        pickGermanVoice();
        syncOptions();
        speak("Guten Tag, ich lerne Deutsch.");
      });
    });

    document.addEventListener("click", (event) => {
      const target = /** @type {Node} */ (event.target);
      if (!panel.hidden && !panel.contains(target) && !fab.contains(target)) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function initHourlyQuiz() {
    const QUIZ_KEY = "laut-hourly-quiz";
    const LAST_KEY = "laut-hourly-quiz-last";
    const HOUR_MS = 60 * 60 * 1000;
    const toggle = document.getElementById("hourly-quiz-toggle");
    const modal = document.getElementById("quiz-modal");
    const modalDe = document.getElementById("quiz-modal-de");
    const modalAnswer = document.getElementById("quiz-modal-answer");
    const modalPrompt = document.getElementById("quiz-modal-prompt");
    const revealBtn = document.getElementById("quiz-reveal-btn");
    const closeBtn = document.getElementById("quiz-close-btn");
    if (!toggle || !modal) return;

    /** @type {number | null} */
    let timerId = null;

    function isEnabled() {
      return localStorage.getItem(QUIZ_KEY) === "1";
    }

    function syncToggle() {
      const on = isEnabled();
      toggle.setAttribute("aria-pressed", on ? "true" : "false");
      toggle.textContent = on ? "Hourly quiz is on" : "Enable hourly word quiz";
    }

    function openQuizModal(de, en) {
      modalDe.textContent = de || "";
      modalAnswer.textContent = en || "";
      modalAnswer.hidden = true;
      modalPrompt.hidden = false;
      revealBtn.hidden = false;
      modal.hidden = false;
      document.body.classList.add("is-gated");
      const sheet = modal.querySelector(".quiz-modal-card") || modal.firstElementChild;
      afterPaint(() => motion()?.popIn(sheet));
    }

    function closeQuizModal() {
      modal.hidden = true;
      document.body.classList.remove("is-gated");
      const url = new URL(window.location.href);
      ["quiz", "de", "en"].forEach((key) => url.searchParams.delete(key));
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }

    async function askServiceWorkerToNotify(word) {
      if (!("serviceWorker" in navigator) || Notification.permission !== "granted") return;
      const reg = await navigator.serviceWorker.ready;
      reg.active?.postMessage({ type: "SHOW_QUIZ_NOTIFICATION", word: word || null });
    }

    async function fireQuizNotification() {
      if (!isEnabled() || Notification.permission !== "granted") return;
      if (typeof pickQuizWord !== "function") return;

      const now = Date.now();
      const last = Number(localStorage.getItem(LAST_KEY) || 0);
      if (last && now - last < HOUR_MS - 30 * 1000) return;

      const word = pickQuizWord();
      localStorage.setItem(LAST_KEY, String(now));
      await askServiceWorkerToNotify(word);
    }

    function clearHourlyTimer() {
      if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
      }
    }

    function startHourlyTimer() {
      clearHourlyTimer();
      timerId = window.setInterval(() => {
        fireQuizNotification();
      }, HOUR_MS);
    }

    async function registerPeriodicSync() {
      if (!("serviceWorker" in navigator)) return;
      try {
        const reg = await navigator.serviceWorker.ready;
        if ("periodicSync" in reg) {
          const status = await navigator.permissions.query({
            name: /** @type {PermissionName} */ ("periodic-background-sync"),
          });
          if (status.state === "granted") {
            await /** @type {{ periodicSync: { register: Function } }} */ (reg).periodicSync.register(
              "hourly-vocab-quiz",
              { minInterval: HOUR_MS }
            );
          }
        }
      } catch {
        /* Unsupported or denied — foreground timer still works */
      }
    }

    async function unregisterPeriodicSync() {
      if (!("serviceWorker" in navigator)) return;
      try {
        const reg = await navigator.serviceWorker.ready;
        if ("periodicSync" in reg) {
          await /** @type {{ periodicSync: { unregister: Function } }} */ (reg).periodicSync.unregister(
            "hourly-vocab-quiz"
          );
        }
      } catch {
        /* ignore */
      }
    }

    async function enableQuiz() {
      if (!("Notification" in window)) {
        alert("Notifications are not supported in this browser.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Please allow notifications to get the hourly word quiz.");
        localStorage.setItem(QUIZ_KEY, "0");
        syncToggle();
        return;
      }

      localStorage.setItem(QUIZ_KEY, "1");
      syncToggle();
      startHourlyTimer();
      await registerPeriodicSync();

      // Immediate sample so the feature is obvious
      localStorage.setItem(LAST_KEY, "0");
      await fireQuizNotification();
    }

    async function disableQuiz() {
      localStorage.setItem(QUIZ_KEY, "0");
      syncToggle();
      clearHourlyTimer();
      await unregisterPeriodicSync();
    }

    toggle.addEventListener("click", () => {
      if (isEnabled()) disableQuiz();
      else enableQuiz();
    });

    revealBtn.addEventListener("click", () => {
      modalAnswer.hidden = false;
      modalPrompt.hidden = true;
      revealBtn.hidden = true;
    });

    closeBtn.addEventListener("click", closeQuizModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeQuizModal();
    });

    // Open from notification deep link
    const params = new URLSearchParams(window.location.search);
    if (params.get("quiz") === "1") {
      openQuizModal(params.get("de") || "", params.get("en") || "");
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        const data = event.data || {};
        if (data.type === "OPEN_QUIZ") {
          openQuizModal(data.de || "", data.en || "");
        }
      });
    }

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && isEnabled()) {
        fireQuizNotification();
      }
    });

    syncToggle();
    if (isEnabled() && Notification.permission === "granted") {
      startHourlyTimer();
      registerPeriodicSync();
      fireQuizNotification();
    }
  }

  function speakable(text) {
    return text.replace(/[.,!?;:„“"»«']/g, "").trim();
  }

  function clearSpeakingState() {
    if (activeEl) {
      activeEl.classList.remove("is-speaking");
      activeEl = null;
    }
    document.querySelectorAll(".play-sentence.is-speaking").forEach((btn) => {
      btn.classList.remove("is-speaking");
      const label = btn.dataset.label || "Play sentence";
      btn.innerHTML = `${playIcon}<span>${label}</span>`;
    });
  }

  /**
   * @param {string} text
   * @param {HTMLElement | null} highlightEl
   * @param {HTMLButtonElement | null} playBtn
   * @param {{ soft?: boolean }} [options]
   */
  function speak(text, highlightEl = null, playBtn = null, options = {}) {
    if (!("speechSynthesis" in window)) {
      alert("Speech is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    speechSynthesis.cancel();
    clearSpeakingState();
    pickGermanVoice();

    const soft = Boolean(options.soft);
    const utterance = new SpeechSynthesisUtterance(speakable(text));
    utterance.lang = germanVoice?.lang || "de-DE";

    if (soft) {
      // Calmer delivery for vocabulary taps / titles (less punched emphasis)
      utterance.rate = voiceGender === "male" ? 0.94 : 0.96;
      utterance.pitch =
        voiceGender === "male"
          ? germanVoiceGender === "male"
            ? 1
            : 0.72
          : germanVoiceGender === "female"
            ? 1
            : 1.12;
    } else {
      utterance.rate = voiceGender === "male" ? 0.88 : 0.92;
      if (voiceGender === "male") {
        utterance.pitch = germanVoiceGender === "male" ? 0.95 : 0.62;
      } else {
        utterance.pitch = germanVoiceGender === "female" ? 1.05 : 1.2;
      }
    }

    if (germanVoice) utterance.voice = germanVoice;

    if (highlightEl) {
      activeEl = highlightEl;
      highlightEl.classList.add("is-speaking");
    }

    if (playBtn) {
      if (!playBtn.dataset.label) {
        playBtn.dataset.label = playBtn.querySelector("span")?.textContent?.trim() || "Play sentence";
      }
      playBtn.classList.add("is-speaking");
      playBtn.innerHTML = `${playIcon}<span>Speaking…</span>`;
    }

    const finish = () => clearSpeakingState();
    utterance.onend = finish;
    utterance.onerror = finish;
    speechSynthesis.speak(utterance);
  }

  /** @param {typeof SENTENCES} items */
  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function matchesFilter(sentence, q) {
    if (!q) return true;
    const hay = `${sentence.text} ${sentence.meaning} ${sentence.words.map((w) => `${w.de} ${w.en}`).join(" ")}`.toLowerCase();
    return hay.includes(q);
  }

  function filteredPool() {
    const base = showingFavourites
      ? SENTENCES.filter((s) => favouriteIds.has(s.id))
      : SENTENCES;
    return base.filter((s) => matchesFilter(s, filterQuery));
  }

  function refillQueue() {
    const pool = filteredPool();
    if (!pool.length) {
      queue = [];
      return;
    }
    const endless = !showingFavourites && !filterQuery;
    queue = endless ? shuffle(pool) : pool.slice();
  }

  /**
   * @param {HTMLButtonElement} favBtn
   * @param {string} id
   */
  function syncFavouriteButton(favBtn, id) {
    const active = isFavourite(id);
    favBtn.classList.toggle("is-active", active);
    favBtn.setAttribute("aria-pressed", active ? "true" : "false");
    favBtn.setAttribute("aria-label", active ? "Remove from favourites" : "Save to favourites");
  }

  /**
   * @param {typeof SENTENCES[number]} sentence
   * @param {number} index
   */
  function renderSentence(sentence, index) {
    const article = document.createElement("article");
    article.className = "sentence";
    article.dataset.id = sentence.id;
    article.role = "listitem";
    article.style.animationDelay = `${Math.min((index % BATCH_SIZE) * 0.04, 0.32)}s`;

    const top = document.createElement("div");
    top.className = "sentence-top";

    const meaning = document.createElement("p");
    meaning.className = "full-meaning";
    meaning.textContent = sentence.meaning;

    const actions = document.createElement("div");
    actions.className = "sentence-actions";

    const favBtn = document.createElement("button");
    favBtn.type = "button";
    favBtn.className = "favourite-btn";
    favBtn.innerHTML = starIcon;
    syncFavouriteButton(favBtn, sentence.id);
    favBtn.addEventListener("click", () => {
      toggleFavourite(sentence.id);
      syncFavouriteButton(favBtn, sentence.id);

      // Keep other visible copies of the same sentence in sync
      listEl.querySelectorAll(`.sentence[data-id="${sentence.id}"] .favourite-btn`).forEach((btn) => {
        if (btn !== favBtn) syncFavouriteButton(/** @type {HTMLButtonElement} */ (btn), sentence.id);
      });

      if (showingFavourites && !isFavourite(sentence.id)) {
        article.remove();
        renderedCount = Math.max(0, renderedCount - 1);
        emptyEl.hidden = renderedCount > 0;
        if (renderedCount === 0) {
          emptyEl.textContent = "No favourite sentences yet. Star some while browsing.";
          emptyEl.hidden = false;
        }
      }
    });

    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "play-sentence";
    playBtn.setAttribute("aria-label", `Play sentence: ${sentence.text}`);
    playBtn.innerHTML = `${playIcon}<span>Play sentence</span>`;
    playBtn.addEventListener("click", () => speak(sentence.text, null, playBtn));

    actions.append(favBtn, playBtn);
    top.append(meaning, actions);

    const words = document.createElement("div");
    words.className = "words";

    sentence.words.forEach((word) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "word-chip";
      chip.setAttribute("aria-label", `Pronounce ${speakable(word.de)}`);

      const de = document.createElement("span");
      de.className = "word-de";
      de.textContent = word.de;

      const en = document.createElement("span");
      en.className = "word-en";
      en.textContent = word.en;

      chip.append(de, en);
      chip.addEventListener("click", () => speak(word.de, chip));
      words.append(chip);
    });

    article.append(top, words);
    return article;
  }

  function setLoading(isLoading) {
    loading = isLoading;
    if (loadingEl) loadingEl.hidden = !isLoading;
  }

  function emptyMessage() {
    if (showingFavourites && favouriteIds.size === 0) {
      return "No favourite sentences yet. Star some while browsing.";
    }
    if (showingFavourites) {
      return "No favourites match that filter.";
    }
    return "No sentences match that filter.";
  }

  function loadMore() {
    if (loading) return;

    if (!queue.length) {
      const canLoop = !showingFavourites && !filterQuery && filteredPool().length;
      if (canLoop) {
        refillQueue();
      } else {
        setLoading(false);
        return;
      }
    }

    setLoading(true);

    const batch = queue.splice(0, BATCH_SIZE);
    const added = [];
    batch.forEach((sentence) => {
      const node = renderSentence(sentence, renderedCount);
      listEl.append(node);
      added.push(node);
      renderedCount += 1;
    });

    emptyEl.hidden = renderedCount > 0;
    setLoading(false);

    afterPaint(() => {
      const m = motion();
      if (m) {
        m.enterElements(added, { staggerEach: 0.04, y: 14 });
        m.refresh(listEl);
      }
      if (sentinelEl.getBoundingClientRect().top < window.innerHeight + 120) {
        loadMore();
      }
    });
  }

  function resetFeed() {
    listEl.replaceChildren();
    renderedCount = 0;
    refillQueue();
    emptyEl.textContent = emptyMessage();
    emptyEl.hidden = true;
    loadMore();
    if (renderedCount === 0) {
      emptyEl.hidden = false;
    }
  }

  function setFavouritesMode(on) {
    showingFavourites = on;
    favouritesToggleEl.setAttribute("aria-pressed", on ? "true" : "false");
    favouritesToggleEl.setAttribute(
      "aria-label",
      on ? "Show all sentences" : "Show favourite sentences"
    );
    resetFeed();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadMore();
      }
    },
    { rootMargin: "280px 0px" }
  );

  observer.observe(sentinelEl);

  searchEl.addEventListener("input", () => {
    filterQuery = searchEl.value.trim().toLowerCase();
    resetFeed();
  });

  favouritesToggleEl.addEventListener("click", () => {
    setFavouritesMode(!showingFavourites);
  });

  resetFeed();
  initStories();
  initVocabulary();
  initGrammar();
  initPersonal();
  initLearn();
  initViewNav();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        /* offline install may fail on file:// — needs https or localhost */
      });
    });
  }

  initInstallBanner();

  function initViewNav() {
    const views = {
      learn: document.getElementById("view-learn"),
      practice: document.getElementById("view-practice"),
      stories: document.getElementById("view-stories"),
      vocabulary: document.getElementById("view-vocabulary"),
      grammar: document.getElementById("view-grammar"),
      personal: document.getElementById("view-personal"),
    };
    const navButtons = document.querySelectorAll(".nav-btn[data-view]");

    navButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");

        navButtons.forEach((other) => {
          const active = other === btn;
          other.classList.toggle("is-active", active);
          other.setAttribute("aria-pressed", active ? "true" : "false");
        });

        Object.entries(views).forEach(([name, el]) => {
          if (!el) return;
          const active = name === view;
          el.hidden = !active;
          el.classList.toggle("is-active", active);
        });

        afterPaint(() => {
          const activeView = views[view];
          if (activeView) motion()?.popIn(activeView);
        });

        if (view === "learn") showLearnList();
        if (view === "stories") showStoriesList();
        if (view === "vocabulary") showVocabList();
        if (view === "grammar") showGrammarList();
        if (view === "personal") showPersonalList();
      });
    });
  }

  function initLearn() {
    const listEl = document.getElementById("learn-list");
    if (!listEl || typeof LEARN_LEVELS === "undefined") return;
    renderLearnList();
  }

  function showLearnList() {
    const listEl = document.getElementById("learn-list");
    const readerEl = document.getElementById("learn-reader");
    if (!listEl || !readerEl) return;
    listEl.hidden = false;
    readerEl.hidden = true;
    readerEl.replaceChildren();
  }

  function renderLearnList() {
    const listEl = document.getElementById("learn-list");
    listEl.replaceChildren();

    const intro = document.createElement("div");
    intro.className = "stories-intro learn-intro";
    intro.innerHTML = `
      <p class="learn-kicker">Smart path · CEFR</p>
      <h2>Learn by level</h2>
      <p>Pick your academic level from A1 to C2. Each path has goals, grammar focus, and speakable phrases.</p>
    `;
    listEl.append(intro);

    const bands = [
      { id: "basic", label: "Basic user" },
      { id: "independent", label: "Independent user" },
      { id: "proficient", label: "Proficient user" },
    ];

    bands.forEach((band) => {
      const levels = LEARN_LEVELS.filter((level) => level.band === band.id);
      if (!levels.length) return;

      const group = document.createElement("section");
      group.className = "learn-band";
      group.setAttribute("aria-label", band.label);

      const bandTitle = document.createElement("h3");
      bandTitle.className = "learn-band-title";
      bandTitle.textContent = band.label;
      group.append(bandTitle);

      const grid = document.createElement("div");
      grid.className = "learn-level-grid";

      levels.forEach((level) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = `learn-level-card learn-level-card--${level.code.toLowerCase()}`;
        card.innerHTML = `
          <span class="learn-level-code">${level.code}</span>
          <span class="learn-level-title">${level.title}</span>
          <span class="learn-level-title-de">${level.titleDe}</span>
          <span class="learn-level-tagline">${level.tagline}</span>
          <span class="learn-level-meta">${level.phrases.length} phrases · ${level.focus.length} focus topics</span>
        `;
        card.addEventListener("click", () => openLearnLevel(level.id));
        grid.append(card);
      });

      group.append(grid);
      listEl.append(group);
    });

    afterPaint(() => {
      const m = motion();
      if (!m) return;
      m.enterElements([intro], { y: 12 });
      m.enterList(listEl, ".learn-level-card");
      m.refresh(listEl);
    });
  }

  /** @param {string} levelId */
  function openLearnLevel(levelId) {
    const level = LEARN_LEVELS.find((item) => item.id === levelId);
    if (!level) return;

    const listEl = document.getElementById("learn-list");
    const readerEl = document.getElementById("learn-reader");
    listEl.hidden = true;
    readerEl.hidden = false;
    readerEl.replaceChildren();

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "story-back";
    backBtn.textContent = "← All levels";
    backBtn.addEventListener("click", showLearnList);

    const header = document.createElement("header");
    header.className = "story-header learn-header";
    header.innerHTML = `
      <p class="learn-level-badge learn-level-badge--${level.code.toLowerCase()}">${level.code}</p>
      <h2 class="story-title-en vocab-title-en">${level.title}</h2>
      <p class="learn-level-title-de-lg">${level.titleDe}</p>
      <p class="vocab-section-desc">${level.description}</p>
    `;

    const playAllBtn = document.createElement("button");
    playAllBtn.type = "button";
    playAllBtn.className = "play-sentence story-play-all learn-play-all";
    playAllBtn.innerHTML = `${playIcon}<span>Play all phrases</span>`;
    playAllBtn.addEventListener("click", () => {
      const text = level.phrases.map((p) => p.de).join(". ");
      speak(text, null, playAllBtn, { soft: true });
    });

    readerEl.append(backBtn, header, playAllBtn);

    const canDo = document.createElement("section");
    canDo.className = "learn-panel";
    canDo.innerHTML = `<h3 class="personal-subheading">You can</h3>`;
    const canList = document.createElement("ul");
    canList.className = "learn-bullet-list";
    level.canDo.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      canList.append(li);
    });
    canDo.append(canList);
    readerEl.append(canDo);

    const focus = document.createElement("section");
    focus.className = "learn-panel";
    focus.innerHTML = `<h3 class="personal-subheading">Focus <span class="learn-focus-hint">tap a topic</span></h3>`;
    const chips = document.createElement("div");
    chips.className = "learn-focus-chips";
    level.focus.forEach((focusId) => {
      const topic =
        typeof LEARN_FOCUS_TOPICS !== "undefined" ? LEARN_FOCUS_TOPICS[focusId] : null;
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "learn-focus-chip";
      chip.textContent = topic ? topic.title : focusId;
      chip.setAttribute(
        "aria-label",
        topic ? `Open examples for ${topic.title}` : `Open ${focusId}`
      );
      chip.addEventListener("click", () => openLearnFocus(level.id, focusId));
      chips.append(chip);
    });
    focus.append(chips);
    readerEl.append(focus);

    const grammar = document.createElement("section");
    grammar.className = "learn-panel";
    grammar.innerHTML = `<h3 class="personal-subheading">Grammar targets</h3>`;
    const gList = document.createElement("ul");
    gList.className = "learn-bullet-list";
    level.grammar.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      gList.append(li);
    });
    grammar.append(gList);
    readerEl.append(grammar);

    (level.tips || []).forEach((tip) => {
      const tipEl = document.createElement("p");
      tipEl.className = "grammar-tip personal-tip";
      tipEl.innerHTML = `<strong>Tip:</strong> ${tip}`;
      readerEl.append(tipEl);
    });

    const phrasesHeading = document.createElement("h3");
    phrasesHeading.className = "personal-subheading";
    phrasesHeading.textContent = "Key phrases";
    readerEl.append(phrasesHeading);

    const phraseList = document.createElement("div");
    phraseList.className = "personal-pair-list";
    level.phrases.forEach((phrase) => {
      phraseList.append(renderPersonalPair(phrase, true));
    });
    readerEl.append(phraseList);

    readerEl.scrollIntoView({ behavior: "smooth", block: "start" });
    afterPaint(() => {
      const m = motion();
      if (!m) return;
      m.enterElements([header, playAllBtn], { staggerEach: 0.05, y: 12 });
      m.enterList(phraseList, ".personal-pair");
      m.refresh(readerEl);
    });
  }

  /**
   * @param {string} levelId
   * @param {string} focusId
   */
  function openLearnFocus(levelId, focusId) {
    const level = LEARN_LEVELS.find((item) => item.id === levelId);
    const topic =
      typeof LEARN_FOCUS_TOPICS !== "undefined" ? LEARN_FOCUS_TOPICS[focusId] : null;
    if (!level || !topic) return;

    const listEl = document.getElementById("learn-list");
    const readerEl = document.getElementById("learn-reader");
    listEl.hidden = true;
    readerEl.hidden = false;
    readerEl.replaceChildren();

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "story-back";
    backBtn.textContent = `← Back to ${level.code}`;
    backBtn.addEventListener("click", () => openLearnLevel(levelId));

    const header = document.createElement("header");
    header.className = "story-header learn-header";
    header.innerHTML = `
      <p class="learn-level-badge learn-level-badge--${level.code.toLowerCase()}">${level.code} · Focus</p>
      <h2 class="story-title-en vocab-title-en">${topic.title}</h2>
      <p class="vocab-section-desc">${topic.description}</p>
    `;

    const playAllBtn = document.createElement("button");
    playAllBtn.type = "button";
    playAllBtn.className = "play-sentence story-play-all learn-play-all";
    playAllBtn.innerHTML = `${playIcon}<span>Play all examples</span>`;
    playAllBtn.addEventListener("click", () => {
      const storyText = (topic.story || []).map((p) => p.de).join(" ");
      const sentText = topic.sentences.map((s) => s.text).join(". ");
      speak(`${storyText} ${sentText}`.trim(), null, playAllBtn, { soft: true });
    });

    readerEl.append(backBtn, header, playAllBtn);

    if (topic.story && topic.story.length) {
      const storyBlock = document.createElement("section");
      storyBlock.className = "learn-mini-story";
      storyBlock.innerHTML = `
        <p class="learn-mini-story-kicker">Mini story</p>
        <h3 class="learn-mini-story-title">${topic.storyTitle}</h3>
        <p class="learn-mini-story-title-en">${topic.storyTitleEn}</p>
      `;

      const storyPlay = document.createElement("button");
      storyPlay.type = "button";
      storyPlay.className = "play-sentence";
      storyPlay.innerHTML = `${playIcon}<span>Play story</span>`;
      storyPlay.addEventListener("click", () => {
        speak(topic.story.map((p) => p.de).join(" "), null, storyPlay, { soft: true });
      });
      storyBlock.append(storyPlay);

      topic.story.forEach((para, index) => {
        storyBlock.append(renderLearnExampleSentence({
          id: `${topic.id}-story-${index}`,
          text: para.de,
          meaning: para.en,
          words: para.words,
        }, index));
      });

      readerEl.append(storyBlock);
    }

    const examplesHeading = document.createElement("h3");
    examplesHeading.className = "personal-subheading";
    examplesHeading.textContent = "Example sentences";
    readerEl.append(examplesHeading);

    const feed = document.createElement("div");
    feed.className = "learn-example-feed";
    feed.setAttribute("role", "list");
    topic.sentences.forEach((sentence, index) => {
      feed.append(renderLearnExampleSentence(sentence, index));
    });
    readerEl.append(feed);

    readerEl.scrollIntoView({ behavior: "smooth", block: "start" });
    afterPaint(() => {
      const m = motion();
      if (!m) return;
      m.enterElements([header, playAllBtn], { staggerEach: 0.05, y: 12 });
      m.enterList(readerEl, ".sentence");
      m.refresh(readerEl);
    });
  }

  /**
   * Practice-style sentence card for Learn focus topics (no favourites).
   * @param {{ id: string, text: string, meaning: string, words: Array<{ de: string, en: string }> }} sentence
   * @param {number} index
   */
  function renderLearnExampleSentence(sentence, index) {
    const article = document.createElement("article");
    article.className = "sentence learn-example-sentence";
    article.dataset.id = sentence.id;
    article.role = "listitem";

    const top = document.createElement("div");
    top.className = "sentence-top";

    const meaning = document.createElement("p");
    meaning.className = "full-meaning";
    meaning.textContent = sentence.meaning;

    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "play-sentence";
    playBtn.setAttribute("aria-label", `Play sentence: ${sentence.text}`);
    playBtn.innerHTML = `${playIcon}<span>Play</span>`;
    playBtn.addEventListener("click", () => speak(sentence.text, null, playBtn));

    top.append(meaning, playBtn);

    const words = document.createElement("div");
    words.className = "words";
    sentence.words.forEach((word) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "word-chip";
      chip.setAttribute("aria-label", `Pronounce ${speakable(word.de)}`);

      const de = document.createElement("span");
      de.className = "word-de";
      de.textContent = word.de;

      const en = document.createElement("span");
      en.className = "word-en";
      en.textContent = word.en;

      chip.append(de, en);
      chip.addEventListener("click", () => speak(word.de, chip));
      words.append(chip);
    });

    article.append(top, words);
    void index;
    return article;
  }

  function initPersonal() {
    const listEl = document.getElementById("personal-list");
    if (!listEl || typeof PERSONAL_SECTIONS === "undefined") return;
    renderPersonalList();
  }

  function showPersonalList() {
    const listEl = document.getElementById("personal-list");
    const readerEl = document.getElementById("personal-reader");
    if (!listEl || !readerEl) return;
    listEl.hidden = false;
    readerEl.hidden = true;
    readerEl.replaceChildren();
  }

  function personalSectionSearchText(section) {
    const parts = [section.title, section.titleEn, section.description, ...(section.tips || [])];
    (section.pairs || []).forEach((p) => parts.push(p.de, p.en || "", p.note || ""));
    (section.examples || []).forEach((p) => parts.push(p.de, p.en || ""));
    (section.verbs || []).forEach((v) =>
      parts.push(v.de, v.en, v.present, v.perfect, v.future)
    );
    (section.tables || []).forEach((t) => {
      parts.push(t.caption || "", ...(t.headers || []));
      (t.rows || []).forEach((row) => parts.push(...row));
    });
    return parts.join(" ").toLowerCase();
  }

  function personalSectionCount(section) {
    return (
      (section.pairs?.length || 0) +
      (section.examples?.length || 0) +
      (section.verbs?.length || 0) +
      (section.tables?.length || 0)
    );
  }

  function renderPersonalList() {
    const listEl = document.getElementById("personal-list");
    listEl.replaceChildren();

    const intro = document.createElement("div");
    intro.className = "stories-intro";
    intro.innerHTML = `
      <h2>Personal learning</h2>
      <p>Your notes — phrases, verb tables, cases, prepositions, and connectors. Tap German to hear it.</p>
    `;
    listEl.append(intro);

    const searchWrap = document.createElement("label");
    searchWrap.className = "search-wrap vocab-search-wrap";
    searchWrap.innerHTML = `
      <span class="visually-hidden">Filter personal topics</span>
      <input id="personal-search" type="search" placeholder="Filter personal notes…" autocomplete="off" />
    `;
    listEl.append(searchWrap);

    const cardsHost = document.createElement("div");
    cardsHost.id = "personal-cards";
    cardsHost.className = "vocab-cards";
    listEl.append(cardsHost);

    const searchInput = searchWrap.querySelector("#personal-search");
    const paintCards = (query = "") => {
      const q = query.trim().toLowerCase();
      cardsHost.replaceChildren();

      const sections = PERSONAL_SECTIONS.filter((section) => {
        if (!q) return true;
        return personalSectionSearchText(section).includes(q);
      });

      if (!sections.length) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "No personal topics match that filter.";
        cardsHost.append(empty);
        return;
      }

      sections.forEach((section, index) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "story-card vocab-card";
        card.style.animationDelay = `${Math.min(index * 0.05, 0.3)}s`;
        const count = personalSectionCount(section);
        card.innerHTML = `
          <span class="story-card-meta">${count || "notes"} items</span>
          <span class="story-card-title-en">${section.titleEn}</span>
          <span class="story-card-title vocab-card-title-de">${section.title}</span>
          <span class="story-card-excerpt">${section.description}</span>
        `;
        card.addEventListener("click", () => openPersonalSection(section.id, q));
        cardsHost.append(card);
      });

      afterPaint(() => {
        const m = motion();
        if (!m) return;
        m.enterList(cardsHost, ".story-card");
        m.refresh(cardsHost);
      });
    };

    paintCards();
    searchInput.addEventListener("input", () => paintCards(searchInput.value));
  }

  /**
   * @param {string} sectionId
   * @param {string} [filterQuery]
   */
  function openPersonalSection(sectionId, filterQuery = "") {
    const section = PERSONAL_SECTIONS.find((s) => s.id === sectionId);
    if (!section) return;

    const listEl = document.getElementById("personal-list");
    const readerEl = document.getElementById("personal-reader");
    listEl.hidden = true;
    readerEl.hidden = false;
    readerEl.replaceChildren();

    const q = filterQuery.trim().toLowerCase();
    const matchText = (parts) => !q || parts.join(" ").toLowerCase().includes(q);

    const pairs = (section.pairs || []).filter((p) => matchText([p.de, p.en || "", p.note || ""]));
    const examples = (section.examples || []).filter((p) => matchText([p.de, p.en || ""]));
    const verbs = (section.verbs || []).filter((v) =>
      matchText([v.de, v.en, v.present, v.perfect, v.future])
    );
    const tables = section.tables || [];
    const tips = section.tips || [];

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "story-back";
    backBtn.textContent = "← All personal notes";
    backBtn.addEventListener("click", showPersonalList);

    const header = document.createElement("header");
    header.className = "story-header vocab-header";
    header.innerHTML = `
      <p class="story-meta">Personal learning</p>
      <h2 class="story-title-en vocab-title-en">${section.titleEn}</h2>
      <button type="button" class="vocab-title-de" aria-label="Pronounce ${section.title}">${section.title}</button>
      <p class="vocab-section-desc">${section.description}</p>
    `;
    const titleBtn = header.querySelector(".vocab-title-de");
    titleBtn.addEventListener("click", () => speak(section.title, titleBtn, null, { soft: true }));

    readerEl.append(backBtn, header);

    tips.forEach((tip) => {
      const tipEl = document.createElement("p");
      tipEl.className = "grammar-tip personal-tip";
      tipEl.innerHTML = `<strong>Tip:</strong> ${tip}`;
      readerEl.append(tipEl);
    });

    tables.forEach((table) => {
      readerEl.append(renderPersonalTable(table));
    });

    if (verbs.length) {
      const list = document.createElement("div");
      list.className = "verb-tense-list";
      verbs.forEach((verb) => {
        list.append(
          renderVerbTenseCard({
            de: verb.de,
            en: verb.en,
            present: verb.present,
            past: verb.perfect,
            future: verb.future,
          })
        );
      });
      // Relabel Past → Perfekt for personal core verbs
      list.querySelectorAll(".verb-tense-row--past .tense-pill").forEach((pill) => {
        pill.textContent = "Perfekt";
      });
      readerEl.append(list);
    }

    if (pairs.length) {
      const grid = document.createElement("div");
      grid.className = "personal-pair-list";
      pairs.forEach((pair) => grid.append(renderPersonalPair(pair)));
      readerEl.append(grid);
    }

    if (examples.length) {
      const block = document.createElement("div");
      block.className = "personal-example-list";
      const heading = document.createElement("h3");
      heading.className = "personal-subheading";
      heading.textContent = "Examples";
      block.append(heading);
      examples.forEach((ex) => block.append(renderPersonalPair(ex, true)));
      readerEl.append(block);
    }

    if (!tips.length && !tables.length && !verbs.length && !pairs.length && !examples.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "No items in this topic match that filter.";
      readerEl.append(empty);
    }

    readerEl.scrollIntoView({ behavior: "smooth", block: "start" });
    afterPaint(() => {
      const m = motion();
      if (!m) return;
      m.enterElements([header], { y: 12 });
      m.enterList(readerEl, ".verb-tense-card, .personal-pair, .personal-table");
      m.refresh(readerEl);
    });
  }

  /**
   * @param {PersonalPair} pair
   * @param {boolean} [exampleStyle]
   */
  function renderPersonalPair(pair, exampleStyle = false) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = exampleStyle ? "personal-pair personal-pair--example" : "personal-pair";
    btn.setAttribute("aria-label", `Pronounce ${speakable(pair.de)}`);

    if (pair.en) {
      const en = document.createElement("span");
      en.className = "personal-pair-en";
      en.textContent = pair.en;
      btn.append(en);
    }

    const de = document.createElement("span");
    de.className = "personal-pair-de";
    const gender = getArticleGender(pair);
    if (gender) {
      de.append(...renderGenderedWord(pair.de, gender));
      btn.classList.add(`personal-pair--${gender}`);
    } else {
      de.textContent = pair.de;
    }
    btn.append(de);

    if (pair.note) {
      const note = document.createElement("span");
      note.className = "personal-pair-note";
      note.textContent = pair.note;
      btn.append(note);
    }

    btn.addEventListener("click", () => speak(pair.de, btn, null, { soft: true }));
    return btn;
  }

  /** @param {PersonalTable} table */
  function renderPersonalTable(table) {
    const wrap = document.createElement("div");
    wrap.className = "personal-table";

    if (table.caption) {
      const caption = document.createElement("p");
      caption.className = "personal-table-caption";
      caption.textContent = table.caption;
      wrap.append(caption);
    }

    const el = document.createElement("table");
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    table.headers.forEach((h) => {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = h;
      headRow.append(th);
    });
    thead.append(headRow);
    el.append(thead);

    const tbody = document.createElement("tbody");
    table.rows.forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((cell) => {
        const td = document.createElement("td");
        const speakBtn = document.createElement("button");
        speakBtn.type = "button";
        speakBtn.className = "personal-table-cell";
        speakBtn.textContent = cell;
        if (cell && cell !== "—") {
          speakBtn.addEventListener("click", () => speak(cell, speakBtn, null, { soft: true }));
        } else {
          speakBtn.disabled = true;
        }
        td.append(speakBtn);
        tr.append(td);
      });
      tbody.append(tr);
    });
    el.append(tbody);
    wrap.append(el);
    return wrap;
  }

  function initStories() {
    const listElStories = document.getElementById("stories-list");
    if (!listElStories || typeof STORIES === "undefined") return;
    renderStoriesList();
  }

  function initVocabulary() {
    const listEl = document.getElementById("vocab-list");
    if (!listEl || typeof VOCAB_SECTIONS === "undefined") return;
    renderVocabList();
  }

  function showVocabList() {
    const listEl = document.getElementById("vocab-list");
    const readerEl = document.getElementById("vocab-reader");
    listEl.hidden = false;
    readerEl.hidden = true;
    readerEl.replaceChildren();
  }

  function renderVocabList() {
    const listEl = document.getElementById("vocab-list");
    listEl.replaceChildren();

    const intro = document.createElement("div");
    intro.className = "stories-intro";
    intro.innerHTML = `
      <h2>Vocabulary</h2>
      <p>Themed word lists with English meanings. Tap a word to hear it, or play a whole section.</p>
    `;
    listEl.append(intro);

    const searchWrap = document.createElement("label");
    searchWrap.className = "search-wrap vocab-search-wrap";
    searchWrap.innerHTML = `
      <span class="visually-hidden">Filter vocabulary topics</span>
      <input id="vocab-search" type="search" placeholder="Filter topics or words…" autocomplete="off" />
    `;
    listEl.append(searchWrap);

    const cardsHost = document.createElement("div");
    cardsHost.id = "vocab-cards";
    cardsHost.className = "vocab-cards";
    listEl.append(cardsHost);

    const searchInput = searchWrap.querySelector("#vocab-search");
    const paintCards = (query = "") => {
      const q = query.trim().toLowerCase();
      cardsHost.replaceChildren();

      const sections = VOCAB_SECTIONS.filter((section) => {
        if (!q) return true;
        const hay = `${section.title} ${section.titleEn} ${section.description} ${section.words
          .map((w) => {
            const related = "related" in w && Array.isArray(w.related)
              ? w.related.map((r) => `${r.de} ${r.en} ${r.note || ""}`).join(" ")
              : "";
            return `${w.de} ${w.en} ${w.note || ""} ${w.present || ""} ${w.past || ""} ${w.future || ""} ${related}`;
          })
          .join(" ")}`.toLowerCase();
        return hay.includes(q);
      });

      if (!sections.length) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "No vocabulary topics match that filter.";
        cardsHost.append(empty);
        return;
      }

      sections.forEach((section, index) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "story-card vocab-card";
        card.style.animationDelay = `${Math.min(index * 0.05, 0.3)}s`;
        const countLabel = section.kind === "verbs" ? "verbs" : "words";
        card.innerHTML = `
          <span class="story-card-meta">${section.words.length} ${countLabel}</span>
          <span class="story-card-title-en">${section.titleEn}</span>
          <span class="story-card-title vocab-card-title-de">${section.title}</span>
          <span class="story-card-excerpt">${section.description}</span>
        `;
        card.addEventListener("click", () => openVocabSection(section.id, q));
        cardsHost.append(card);
      });

      afterPaint(() => {
        const m = motion();
        if (!m) return;
        m.enterList(cardsHost, ".story-card");
        m.refresh(cardsHost);
      });
    };

    paintCards();
    searchInput.addEventListener("input", () => paintCards(searchInput.value));
  }

  /**
   * @param {string} sectionId
   * @param {string} [filterQuery]
   */
  function openVocabSection(sectionId, filterQuery = "") {
    const section = VOCAB_SECTIONS.find((s) => s.id === sectionId);
    if (!section) return;

    const listEl = document.getElementById("vocab-list");
    const readerEl = document.getElementById("vocab-reader");
    listEl.hidden = true;
    readerEl.hidden = false;
    readerEl.replaceChildren();

    const q = filterQuery.trim().toLowerCase();
    const words = q
      ? section.words.filter((w) => {
          const related = "related" in w && Array.isArray(w.related)
            ? w.related.map((r) => `${r.de} ${r.en} ${r.note || ""}`).join(" ")
            : "";
          return `${w.de} ${w.en} ${w.note || ""} ${w.present || ""} ${w.past || ""} ${w.future || ""} ${related}`
            .toLowerCase()
            .includes(q);
        })
      : section.words.slice();

    const isVerbs = section.kind === "verbs";

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "story-back";
    backBtn.textContent = "← All vocabulary";
    backBtn.addEventListener("click", showVocabList);

    const header = document.createElement("header");
    header.className = "story-header vocab-header";
    header.innerHTML = `
      <p class="story-meta">${words.length} ${isVerbs ? "verbs" : "words"}</p>
      <h2 class="story-title-en vocab-title-en">${section.titleEn}</h2>
      <button type="button" class="vocab-title-de" aria-label="Pronounce ${section.title}">${section.title}</button>
      <p class="vocab-section-desc">${section.description}</p>
    `;

    const titleBtn = header.querySelector(".vocab-title-de");
    titleBtn.addEventListener("click", () => {
      speak(section.title, titleBtn, null, { soft: true });
    });

    const playAllBtn = document.createElement("button");
    playAllBtn.type = "button";
    playAllBtn.className = "play-sentence story-play-all";
    playAllBtn.innerHTML = `${playIcon}<span>${isVerbs ? "Play all infinitives" : "Play all words"}</span>`;
    playAllBtn.addEventListener("click", () => {
      const fullText = words.map((w) => w.de).join(", ");
      speak(fullText, null, playAllBtn, { soft: true });
    });

    const legend = document.createElement("div");
    legend.className = "gender-legend";
    legend.setAttribute("aria-label", isVerbs ? "Tense and article color guide" : "Article color guide");
    legend.innerHTML = isVerbs
      ? `
      <span class="gender-legend-item tense-legend-present"><strong>Present</strong></span>
      <span class="gender-legend-item tense-legend-past"><strong>Past</strong></span>
      <span class="gender-legend-item tense-legend-future"><strong>Future</strong></span>
      <span class="gender-legend-item gender-der"><strong>der</strong> masculine</span>
      <span class="gender-legend-item gender-die"><strong>die</strong> feminine</span>
      <span class="gender-legend-item gender-das"><strong>das</strong> neuter</span>
    `
      : `
      <span class="gender-legend-item gender-der"><strong>der</strong> masculine</span>
      <span class="gender-legend-item gender-die"><strong>die</strong> feminine</span>
      <span class="gender-legend-item gender-das"><strong>das</strong> neuter</span>
    `;

    if (!words.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = isVerbs
        ? "No verbs in this topic match that filter."
        : "No words in this topic match that filter.";
      readerEl.append(backBtn, header, empty);
      return;
    }

    if (isVerbs) {
      const list = document.createElement("div");
      list.className = "verb-tense-list";
      words.forEach((verb) => list.append(renderVerbTenseCard(verb)));
      readerEl.append(backBtn, header, playAllBtn, legend, list);
      readerEl.scrollIntoView({ behavior: "smooth", block: "start" });
      afterPaint(() => {
        const m = motion();
        if (!m) return;
        m.enterElements([header, playAllBtn, legend], { staggerEach: 0.05, y: 12 });
        m.enterList(list, ".verb-tense-card");
        m.refresh(readerEl);
      });
      return;
    }

    const grid = document.createElement("div");
    grid.className = "vocab-grid";

    words.forEach((word) => {
      const gender = getArticleGender(word);
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = gender ? `vocab-chip vocab-chip--${gender}` : "vocab-chip";
      chip.setAttribute("aria-label", `Pronounce ${speakable(word.de)}`);

      const de = document.createElement("span");
      de.className = "vocab-chip-de";
      de.append(...renderGenderedWord(word.de, gender));

      const en = document.createElement("span");
      en.className = "vocab-chip-en";
      en.textContent = word.en;

      chip.append(de, en);

      if (word.note) {
        const note = document.createElement("span");
        note.className = gender ? `vocab-chip-note vocab-chip-note--${gender}` : "vocab-chip-note";
        note.textContent = word.note;
        chip.append(note);
      }

      chip.addEventListener("click", () => speak(word.de, chip, null, { soft: true }));
      grid.append(chip);
    });

    readerEl.append(backBtn, header, playAllBtn, legend, grid);
    readerEl.scrollIntoView({ behavior: "smooth", block: "start" });
    afterPaint(() => {
      const m = motion();
      if (!m) return;
      m.enterElements([header, playAllBtn, legend], { staggerEach: 0.05, y: 12 });
      m.enterList(grid, ".vocab-chip");
      m.refresh(readerEl);
    });
  }

  /**
   * @param {{ de: string, en: string, present?: string, past?: string, future?: string, related?: Array<{ de: string, en: string, note?: string }> }} verb
   */
  function renderVerbTenseCard(verb) {
    const card = document.createElement("article");
    card.className = "verb-tense-card";

    const top = document.createElement("div");
    top.className = "verb-tense-top";

    const titleWrap = document.createElement("div");
    titleWrap.className = "verb-tense-titles";

    const infinitiveBtn = document.createElement("button");
    infinitiveBtn.type = "button";
    infinitiveBtn.className = "verb-infinitive";
    infinitiveBtn.textContent = verb.de;
    infinitiveBtn.setAttribute("aria-label", `Pronounce ${verb.de}`);
    infinitiveBtn.addEventListener("click", () => speak(verb.de, infinitiveBtn, null, { soft: true }));

    const meaning = document.createElement("p");
    meaning.className = "verb-tense-en";
    meaning.textContent = verb.en;

    titleWrap.append(infinitiveBtn, meaning);

    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "play-sentence";
    playBtn.innerHTML = `${playIcon}<span>Play forms</span>`;
    playBtn.addEventListener("click", () => {
      const forms = [verb.de, verb.present, verb.past, verb.future].filter(Boolean).join(". ");
      speak(forms, null, playBtn, { soft: true });
    });

    top.append(titleWrap, playBtn);

    const forms = document.createElement("div");
    forms.className = "verb-tense-forms";

    /** @type {Array<{ key: "present" | "past" | "future", label: string, value: string | undefined }>} */
    const rows = [
      { key: "present", label: "Present", value: verb.present },
      { key: "past", label: "Past", value: verb.past },
      { key: "future", label: "Future", value: verb.future },
    ];

    rows.forEach((row) => {
      if (!row.value) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `verb-tense-row verb-tense-row--${row.key}`;
      btn.setAttribute("aria-label", `Pronounce ${row.label}: ${row.value}`);
      btn.innerHTML = `
        <span class="tense-pill tense-pill--${row.key}">${row.label}</span>
        <span class="verb-tense-form">${row.value}</span>
      `;
      btn.addEventListener("click", () => speak(row.value, btn, null, { soft: true }));
      forms.append(btn);
    });

    card.append(top, forms);

    if (Array.isArray(verb.related) && verb.related.length) {
      const related = document.createElement("div");
      related.className = "verb-related";
      related.setAttribute("aria-label", "Related nouns");

      verb.related.forEach((word) => {
        const gender = getArticleGender(word);
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = gender ? `vocab-chip vocab-chip--${gender} verb-related-chip` : "vocab-chip verb-related-chip";
        chip.setAttribute("aria-label", `Pronounce ${speakable(word.de)}`);

        const de = document.createElement("span");
        de.className = "vocab-chip-de";
        de.append(...renderGenderedWord(word.de, gender));

        const en = document.createElement("span");
        en.className = "vocab-chip-en";
        en.textContent = word.en;

        chip.append(de, en);
        chip.addEventListener("click", () => speak(word.de, chip, null, { soft: true }));
        related.append(chip);
      });

      card.append(related);
    }

    return card;
  }

  /**
   * @param {{ de: string, note?: string }} word
   * @returns {"der" | "die" | "das" | null}
   */
  function getArticleGender(word) {
    const note = (word.note || "").toLowerCase();
    if (note.includes("masculine")) return "der";
    if (note.includes("feminine")) return "die";
    if (note.includes("neuter")) return "das";

    const match = word.de.trim().match(/^(der|die|das)\b/i);
    if (!match) return null;
    return /** @type {"der" | "die" | "das"} */ (match[1].toLowerCase());
  }

  /**
   * @param {string} text
   * @param {"der" | "die" | "das" | null} gender
   */
  function renderGenderedWord(text, gender) {
    if (!gender) return [document.createTextNode(text)];

    const match = text.match(/^(der|die|das)(\s+)(.+)$/i);
    if (!match) return [document.createTextNode(text)];

    const article = document.createElement("span");
    article.className = `vocab-article vocab-article--${gender}`;
    article.textContent = match[1];

    return [article, document.createTextNode(match[2] + match[3])];
  }

  function showGrammarList() {
    const listEl = document.getElementById("grammar-list");
    const readerEl = document.getElementById("grammar-reader");
    listEl.hidden = false;
    readerEl.hidden = true;
    readerEl.replaceChildren();
  }

  function initGrammar() {
    const listEl = document.getElementById("grammar-list");
    if (!listEl || typeof GRAMMAR_SECTIONS === "undefined") return;
    renderGrammarList();
  }

  function tenseLabel(tense) {
    if (tense === "present") return "Present";
    if (tense === "past") return "Past";
    if (tense === "future") return "Future";
    return "Mixed";
  }

  function renderGrammarList() {
    const listEl = document.getElementById("grammar-list");
    listEl.replaceChildren();

    const intro = document.createElement("div");
    intro.className = "stories-intro";
    intro.innerHTML = `
      <h2>Grammar</h2>
      <p>Build sentences in present, past, and future. Tap words to hear them, and study the pattern under each example.</p>
    `;
    listEl.append(intro);

    const filters = document.createElement("div");
    filters.className = "grammar-filters";
    filters.innerHTML = `
      <button type="button" class="grammar-filter is-active" data-tense="all">All</button>
      <button type="button" class="grammar-filter" data-tense="present">Present</button>
      <button type="button" class="grammar-filter" data-tense="past">Past</button>
      <button type="button" class="grammar-filter" data-tense="future">Future</button>
    `;
    listEl.append(filters);

    const cardsHost = document.createElement("div");
    cardsHost.id = "grammar-cards";
    cardsHost.className = "grammar-cards";
    listEl.append(cardsHost);

    /** @type {string} */
    let activeTense = "all";

    const paintCards = () => {
      cardsHost.replaceChildren();
      const sections = GRAMMAR_SECTIONS.filter((section) => {
        if (activeTense === "all") return true;
        return section.tense === activeTense || section.tense === "mixed";
      });

      sections.forEach((section, index) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "story-card vocab-card";
        card.style.animationDelay = `${Math.min(index * 0.05, 0.3)}s`;
        card.innerHTML = `
          <span class="story-card-meta">
            <span class="tense-pill tense-pill--${section.tense}">${tenseLabel(section.tense)}</span>
            ${section.examples.length} examples
          </span>
          <span class="story-card-title-en">${section.titleEn}</span>
          <span class="story-card-title vocab-card-title-de">${section.title}</span>
          <span class="story-card-excerpt">${section.description}</span>
        `;
        card.addEventListener("click", () => openGrammarSection(section.id));
        cardsHost.append(card);
      });

      afterPaint(() => {
        const m = motion();
        if (!m) return;
        m.enterList(cardsHost, ".story-card");
        m.refresh(cardsHost);
      });
    };

    filters.querySelectorAll(".grammar-filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeTense = btn.getAttribute("data-tense") || "all";
        filters.querySelectorAll(".grammar-filter").forEach((other) => {
          other.classList.toggle("is-active", other === btn);
        });
        paintCards();
      });
    });

    paintCards();
    afterPaint(() => motion()?.refresh(filters));
  }

  /** @param {string} sectionId */
  function openGrammarSection(sectionId) {
    const section = GRAMMAR_SECTIONS.find((s) => s.id === sectionId);
    if (!section) return;

    const listEl = document.getElementById("grammar-list");
    const readerEl = document.getElementById("grammar-reader");
    listEl.hidden = true;
    readerEl.hidden = false;
    readerEl.replaceChildren();

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "story-back";
    backBtn.textContent = "← All grammar";
    backBtn.addEventListener("click", showGrammarList);

    const header = document.createElement("header");
    header.className = "story-header vocab-header";
    header.innerHTML = `
      <p class="story-meta">
        <span class="tense-pill tense-pill--${section.tense}">${tenseLabel(section.tense)}</span>
        ${section.examples.length} examples
      </p>
      <h2 class="story-title-en vocab-title-en">${section.titleEn}</h2>
      <button type="button" class="vocab-title-de" aria-label="Pronounce ${section.title}">${section.title}</button>
      <p class="vocab-section-desc">${section.description}</p>
      <p class="grammar-tip"><strong>Tip:</strong> ${section.tip}</p>
    `;

    const titleBtn = header.querySelector(".vocab-title-de");
    titleBtn.addEventListener("click", () => {
      speak(section.title, titleBtn, null, { soft: true });
    });

    readerEl.append(backBtn, header);

    section.examples.forEach((example, index) => {
      const block = document.createElement("section");
      block.className = "grammar-example";

      const top = document.createElement("div");
      top.className = "grammar-example-top";

      const pattern = document.createElement("p");
      pattern.className = "grammar-pattern";
      pattern.textContent = `${index + 1}. ${example.pattern}`;

      const playBtn = document.createElement("button");
      playBtn.type = "button";
      playBtn.className = "play-sentence play-paragraph";
      playBtn.innerHTML = `${playIcon}<span>Play sentence</span>`;
      playBtn.addEventListener("click", () => speak(example.text, null, playBtn));

      top.append(pattern, playBtn);

      const meaning = document.createElement("p");
      meaning.className = "full-meaning";
      meaning.textContent = example.meaning;

      const words = document.createElement("div");
      words.className = "words story-words";

      example.words.forEach((word) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "word-chip";
        chip.setAttribute("aria-label", `Pronounce ${speakable(word.de)}`);

        const de = document.createElement("span");
        de.className = "word-de";
        de.textContent = word.de;

        const en = document.createElement("span");
        en.className = "word-en";
        en.textContent = word.en;

        chip.append(de, en);
        chip.addEventListener("click", () => speak(word.de, chip, null, { soft: true }));
        words.append(chip);
      });

      block.append(top, meaning, words);
      readerEl.append(block);
    });

    readerEl.scrollIntoView({ behavior: "smooth", block: "start" });
    afterPaint(() => {
      const m = motion();
      if (!m) return;
      m.enterList(readerEl, ".grammar-example, .story-paragraph");
      m.refresh(readerEl);
    });
  }

  function showStoriesList() {
    const listElStories = document.getElementById("stories-list");
    const readerEl = document.getElementById("story-reader");
    listElStories.hidden = false;
    readerEl.hidden = true;
    readerEl.replaceChildren();
  }

  function renderStoriesList() {
    const listElStories = document.getElementById("stories-list");
    listElStories.replaceChildren();

    const intro = document.createElement("div");
    intro.className = "stories-intro";
    intro.innerHTML = `
      <h2>Stories</h2>
      <p>Long reads with every word glossed in English. Tap a word to hear it, or play a whole paragraph.</p>
    `;
    listElStories.append(intro);

    STORIES.forEach((story, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "story-card";
      card.style.animationDelay = `${Math.min(index * 0.05, 0.3)}s`;
      card.innerHTML = `
        <span class="story-card-meta">${story.readingMinutes} min read</span>
        <span class="story-card-title">${story.title}</span>
        <span class="story-card-title-en">${story.titleEn}</span>
        <span class="story-card-excerpt">${story.excerpt}</span>
      `;
      card.addEventListener("click", () => openStory(story.id));
      listElStories.append(card);
    });

    afterPaint(() => {
      const m = motion();
      if (!m) return;
      m.enterList(listElStories, ".story-card");
      m.refresh(listElStories);
    });
  }

  /** @param {string} storyId */
  function openStory(storyId) {
    const story = STORIES.find((s) => s.id === storyId);
    if (!story) return;

    const listElStories = document.getElementById("stories-list");
    const readerEl = document.getElementById("story-reader");
    listElStories.hidden = true;
    readerEl.hidden = false;
    readerEl.replaceChildren();

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "story-back";
    backBtn.textContent = "← All stories";
    backBtn.addEventListener("click", showStoriesList);

    const header = document.createElement("header");
    header.className = "story-header";
    header.innerHTML = `
      <p class="story-meta">${story.readingMinutes} min read</p>
      <h2 class="story-title">${story.title}</h2>
      <p class="story-title-en">${story.titleEn}</p>
    `;

    const playAllBtn = document.createElement("button");
    playAllBtn.type = "button";
    playAllBtn.className = "play-sentence story-play-all";
    playAllBtn.innerHTML = `${playIcon}<span>Play full story</span>`;
    playAllBtn.addEventListener("click", () => {
      const fullText = story.paragraphs
        .map((p) => p.words.map((w) => w.de).join(" "))
        .join(" ");
      speak(fullText, null, playAllBtn);
    });

    readerEl.append(backBtn, header, playAllBtn);

    story.paragraphs.forEach((paragraph, pIndex) => {
      const block = document.createElement("section");
      block.className = "story-paragraph";

      const paraTop = document.createElement("div");
      paraTop.className = "story-paragraph-top";

      const label = document.createElement("p");
      label.className = "story-paragraph-label";
      label.textContent = `Paragraph ${pIndex + 1}`;

      const playParaBtn = document.createElement("button");
      playParaBtn.type = "button";
      playParaBtn.className = "play-sentence play-paragraph";
      playParaBtn.innerHTML = `${playIcon}<span>Play paragraph</span>`;
      const paraText = paragraph.words.map((w) => w.de).join(" ");
      playParaBtn.addEventListener("click", () => speak(paraText, null, playParaBtn));

      paraTop.append(label, playParaBtn);

      const words = document.createElement("div");
      words.className = "words story-words";

      paragraph.words.forEach((word) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "word-chip";
        chip.setAttribute("aria-label", `Pronounce ${speakable(word.de)}`);

        const de = document.createElement("span");
        de.className = "word-de";
        de.textContent = word.de;

        const en = document.createElement("span");
        en.className = "word-en";
        en.textContent = word.en;

        chip.append(de, en);
        chip.addEventListener("click", () => speak(word.de, chip));
        words.append(chip);
      });

      block.append(paraTop, words);
      readerEl.append(block);
    });

    readerEl.scrollIntoView({ behavior: "smooth", block: "start" });
    afterPaint(() => {
      const m = motion();
      if (!m) return;
      m.enterElements([header, playAllBtn], { staggerEach: 0.05, y: 12 });
      m.enterList(readerEl, ".story-paragraph");
      m.refresh(readerEl);
    });
  }
})();

function initInstallBanner() {
  const bannerEl = document.getElementById("install-banner");
  const installBtn = document.getElementById("install-app-btn");
  const dismissBtn = document.getElementById("install-dismiss");
  if (!bannerEl || !installBtn || !dismissBtn) return;

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    /** @type {Navigator & { standalone?: boolean }} */ (window.navigator).standalone === true;

  // Already installed as an app — no prompt needed
  if (isStandalone) {
    bannerEl.hidden = true;
    document.body.classList.remove("has-install-banner");
    return;
  }

  /** @type {BeforeInstallPromptEvent | null} */
  let deferredPrompt = null;
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);

  function showBanner() {
    bannerEl.hidden = false;
    document.body.classList.add("has-install-banner");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (window.LautMotion) window.LautMotion.popIn(bannerEl);
      });
    });
  }

  function hideBanner() {
    bannerEl.hidden = true;
    document.body.classList.remove("has-install-banner");
  }

  // Always show on landing (until closed or installed)
  showBanner();

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = /** @type {BeforeInstallPromptEvent} */ (event);
    showBanner();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    hideBanner();
  });

  dismissBtn.addEventListener("click", () => {
    hideBanner();
  });

  installBtn.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      hideBanner();
      return;
    }

    if (isIos) {
      alert('To install: tap Share, then "Add to Home Screen".');
      return;
    }

    alert("Install is not available in this browser yet. Open Laut in Chrome or Edge, then try again.");
  });
}

/**
 * @typedef {Event & { prompt: () => Promise<void>, userChoice: Promise<{ outcome: string }> }} BeforeInstallPromptEvent
 */

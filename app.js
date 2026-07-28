(() => {
  const BATCH_SIZE = 8;
  const NAME_KEY = "laut-learner-name";
  const FAV_KEY = "laut-favourite-ids";
  const VOICE_KEY = "laut-voice-gender";

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
      panel.hidden = !open;
      fab.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        pickGermanVoice();
        syncOptions();
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
    batch.forEach((sentence) => {
      listEl.append(renderSentence(sentence, renderedCount));
      renderedCount += 1;
    });

    emptyEl.hidden = renderedCount > 0;
    setLoading(false);

    requestAnimationFrame(() => {
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
      practice: document.getElementById("view-practice"),
      stories: document.getElementById("view-stories"),
      vocabulary: document.getElementById("view-vocabulary"),
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

        if (view === "stories") showStoriesList();
        if (view === "vocabulary") showVocabList();
      });
    });
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
          .map((w) => `${w.de} ${w.en} ${w.note || ""}`)
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
        card.innerHTML = `
          <span class="story-card-meta">${section.words.length} words</span>
          <span class="story-card-title-en">${section.titleEn}</span>
          <span class="story-card-title vocab-card-title-de">${section.title}</span>
          <span class="story-card-excerpt">${section.description}</span>
        `;
        card.addEventListener("click", () => openVocabSection(section.id, q));
        cardsHost.append(card);
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
      ? section.words.filter((w) => `${w.de} ${w.en} ${w.note || ""}`.toLowerCase().includes(q))
      : section.words.slice();

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "story-back";
    backBtn.textContent = "← All vocabulary";
    backBtn.addEventListener("click", showVocabList);

    const header = document.createElement("header");
    header.className = "story-header vocab-header";
    header.innerHTML = `
      <p class="story-meta">${words.length} words</p>
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
    playAllBtn.innerHTML = `${playIcon}<span>Play all words</span>`;
    playAllBtn.addEventListener("click", () => {
      const fullText = words.map((w) => w.de).join(", ");
      speak(fullText, null, playAllBtn, { soft: true });
    });

    const legend = document.createElement("div");
    legend.className = "gender-legend";
    legend.setAttribute("aria-label", "Article color guide");
    legend.innerHTML = `
      <span class="gender-legend-item gender-der"><strong>der</strong> masculine</span>
      <span class="gender-legend-item gender-die"><strong>die</strong> feminine</span>
      <span class="gender-legend-item gender-das"><strong>das</strong> neuter</span>
    `;

    const grid = document.createElement("div");
    grid.className = "vocab-grid";

    if (!words.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "No words in this topic match that filter.";
      readerEl.append(backBtn, header, empty);
      return;
    }

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

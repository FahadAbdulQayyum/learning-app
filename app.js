(() => {
  const BATCH_SIZE = 8;
  const NAME_KEY = "laut-learner-name";
  const FAV_KEY = "laut-favourite-ids";

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
  updateFavouritesCount();

  function pickGermanVoice() {
    const voices = speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /^de(-|_)/i.test(v.lang) && /Google|Microsoft|Anna|Helena|Katja/i.test(v.name)) ||
      voices.find((v) => /^de(-|_)/i.test(v.lang)) ||
      null;
    germanVoice = preferred;
  }

  pickGermanVoice();
  if (typeof speechSynthesis !== "undefined") {
    speechSynthesis.addEventListener("voiceschanged", pickGermanVoice);
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
      btn.innerHTML = `${playIcon}<span>Play sentence</span>`;
    });
  }

  /**
   * @param {string} text
   * @param {HTMLElement | null} highlightEl
   * @param {HTMLButtonElement | null} playBtn
   */
  function speak(text, highlightEl = null, playBtn = null) {
    if (!("speechSynthesis" in window)) {
      alert("Speech is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    speechSynthesis.cancel();
    clearSpeakingState();

    const utterance = new SpeechSynthesisUtterance(speakable(text));
    utterance.lang = "de-DE";
    utterance.rate = 0.92;
    if (germanVoice) utterance.voice = germanVoice;

    if (highlightEl) {
      activeEl = highlightEl;
      highlightEl.classList.add("is-speaking");
    }

    if (playBtn) {
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

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        /* offline install may fail on file:// — needs https or localhost */
      });
    });
  }
})();

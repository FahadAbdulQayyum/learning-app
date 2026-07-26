(() => {
  const BATCH_SIZE = 8;
  const listEl = document.getElementById("sentence-list");
  const emptyEl = document.getElementById("empty-state");
  const searchEl = document.getElementById("search");
  const sentinelEl = document.getElementById("scroll-sentinel");
  const loadingEl = document.getElementById("loading-more");

  /** @type {SpeechSynthesisVoice | null} */
  let germanVoice = null;
  /** @type {HTMLElement | null} */
  let activeEl = null;

  /** @type {typeof SENTENCES} */
  let queue = [];
  let filterQuery = "";
  let loading = false;
  let renderedCount = 0;
  let endless = true;

  const playIcon = `
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 2.5v11l10-5.5-10-5.5z"/>
    </svg>
  `;

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
    return SENTENCES.filter((s) => matchesFilter(s, filterQuery));
  }

  function refillQueue() {
    const pool = filteredPool();
    if (!pool.length) {
      queue = [];
      return;
    }
    queue = endless && !filterQuery ? shuffle(pool) : pool.slice();
  }

  /**
   * @param {typeof SENTENCES[number]} sentence
   * @param {number} index
   */
  function renderSentence(sentence, index) {
    const article = document.createElement("article");
    article.className = "sentence";
    article.role = "listitem";
    article.style.animationDelay = `${Math.min((index % BATCH_SIZE) * 0.04, 0.32)}s`;

    const top = document.createElement("div");
    top.className = "sentence-top";

    const meaning = document.createElement("p");
    meaning.className = "full-meaning";
    meaning.textContent = sentence.meaning;

    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "play-sentence";
    playBtn.setAttribute("aria-label", `Play sentence: ${sentence.text}`);
    playBtn.innerHTML = `${playIcon}<span>Play sentence</span>`;
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
    return article;
  }

  function setLoading(isLoading) {
    loading = isLoading;
    if (loadingEl) loadingEl.hidden = !isLoading;
  }

  function loadMore() {
    if (loading) return;

    if (!queue.length) {
      if (endless && !filterQuery && filteredPool().length) {
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

    // Keep filling if the page is still short (tall screens / zoomed out)
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
    emptyEl.hidden = true;
    loadMore();
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
    endless = !filterQuery;
    resetFeed();
  });

  resetFeed();
})();

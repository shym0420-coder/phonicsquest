/* Phonics Quest — main application */

const $ = (sel) => document.querySelector(sel);

const screens = {
  home: $("#screen-home"),
  intro: $("#screen-intro"),
  game: $("#screen-game"),
  complete: $("#screen-complete"),
};

const state = {
  currentLevel: 1,
  wordIndex: 0,
  streak: 0,
  attempts: 0,
  hintsUsed: 0,
  wordStars: [],
  filledSlots: [],
  locked: false,
  progress: loadProgress(),
};

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {
    unlockedLevel: 1,
    levelStars: {},
    totalStars: 0,
  };
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function getLevel(id) {
  return LEVELS.find((l) => l.id === id);
}

function splitWord(wordObj) {
  return getUnits(wordObj);
}

function getShownMask(level, units, wordObj) {
  const n = units.length;
  const mask = new Array(n).fill(false);

  switch (level.mode) {
    case "show-first":
      mask[0] = true;
      break;
    case "show-vowel": {
      const vowels = new Set(["a", "e", "i", "o", "u"]);
      for (let i = 0; i < n; i++) {
        if ([...units[i]].some((c) => vowels.has(c))) {
          mask[i] = true;
          break;
        }
      }
      break;
    }
    case "show-last":
      mask[n - 1] = true;
      break;
    case "show-rime": {
      const rime = wordObj.rime || units.slice(-2).join("");
      let rimeLen = rime.length;
      let shownFromEnd = 0;
      for (let i = n - 1; i >= 0 && shownFromEnd < rimeLen; i--) {
        mask[i] = true;
        shownFromEnd += units[i].length;
      }
      break;
    }
    case "show-digraph-start":
    case "show-blend-start":
      mask[0] = true;
      break;
    case "show-magic-e":
      mask[0] = true;
      mask[n - 1] = true;
      break;
    case "show-first-two":
      if (wordObj.units && wordObj.units.length > 1) {
        mask[0] = true;
      } else {
        mask[0] = true;
        if (n > 1) mask[1] = true;
      }
      break;
    case "challenge":
      if (units.length > 1) {
        mask[0] = true;
      } else {
        mask[0] = true;
        if (n > 4) mask[1] = true;
      }
      break;
    default:
      mask[0] = true;
  }

  return mask;
}

function formatUnitsHtml(units, mask) {
  return units
    .map((u, i) => {
      if (mask[i]) {
        return `<span class="shown">${u}</span>`;
      }
      const blanks = u.length > 1 ? "_".repeat(u.length) : "_";
      return `<span class="blank">${blanks}</span>`;
    })
    .join('<span class="unit-gap"> </span>');
}

function levelStarDisplay(stars, level) {
  const maxStars = level.words.length * 3;
  const filled = maxStars > 0 ? Math.min(3, Math.round((stars / maxStars) * 3)) : 0;
  return "⭐".repeat(filled) + "☆".repeat(3 - filled);
}

function buildDistractors(correctUnits, shownMask) {
  const needed = correctUnits.filter((_, i) => !shownMask[i]);
  const pool = [...needed];
  const chunkMode = needed.some((u) => u.length > 1);

  if (chunkMode) {
    const chunks = [
      "room", "case", "bear", "five", "high", "teddy", "pencil", "dining",
      "living", "play", "ground", "skate", "board", "sand", "box", "book",
      "desk", "ball", "kite", "home", "yard", "sink", "sofa", "slide",
      "train", "robot", "friend", "teacher", "hello", "good", "bye",
    ];
    while (pool.length < needed.length + 3) {
      pool.push(chunks[Math.floor(Math.random() * chunks.length)]);
    }
  } else {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const digraphs = ["sh", "ch", "th", "oo", "ee", "ay", "ow", "ck"];
    while (pool.length < needed.length + 4) {
      const pick =
        Math.random() < 0.2
          ? digraphs[Math.floor(Math.random() * digraphs.length)]
          : letters[Math.floor(Math.random() * letters.length)];
      pool.push(pick);
    }
  }

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

/* ── Speech ── */
let speechSynth = window.speechSynthesis;
let preferredVoice = null;

function initSpeech() {
  const pick = () => {
    const voices = speechSynth.getVoices();
    preferredVoice =
      voices.find((v) => v.lang.startsWith("en") && v.name.includes("Samantha")) ||
      voices.find((v) => v.lang.startsWith("en-US")) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      null;
  };
  pick();
  speechSynth.onvoiceschanged = pick;
}

function speakWord(word, slow = false) {
  speechSynth.cancel();
  const u = new SpeechSynthesisUtterance(word);
  u.lang = "en-US";
  u.rate = slow ? 0.65 : 0.85;
  u.pitch = 1.05;
  if (preferredVoice) u.voice = preferredVoice;

  const btn = $("#btn-play-sound");
  btn.classList.add("playing");
  u.onend = () => btn.classList.remove("playing");
  u.onerror = () => btn.classList.remove("playing");
  speechSynth.speak(u);
}

/* ── Level Map ── */
function renderLevelMap() {
  const map = $("#level-map");
  map.innerHTML = "";

  LEVELS.forEach((level) => {
    const unlocked = level.id <= state.progress.unlockedLevel;
    const stars = state.progress.levelStars[level.id] || 0;
    const isCurrent = level.id === state.progress.unlockedLevel;

    const node = document.createElement("button");
    node.className = "level-node";
    if (!unlocked) node.classList.add("locked");
    if (isCurrent && unlocked) node.classList.add("current");

    const starStr = levelStarDisplay(stars, level);

    node.innerHTML = `
      ${!unlocked ? '<span class="lock-icon">🔒</span>' : ""}
      <span class="level-emoji">${level.emoji || "📖"}</span>
      <span class="level-num">${level.id}</span>
      <span class="level-name">${level.title}</span>
      ${unlocked ? `<span class="level-stars">${starStr}</span>` : ""}
    `;

    if (unlocked) {
      node.addEventListener("click", () => openLevelIntro(level.id));
    }

    map.appendChild(node);
  });

  $("#total-stars-count").textContent = state.progress.totalStars;
}

function openLevelIntro(levelId) {
  state.currentLevel = levelId;
  const level = getLevel(levelId);

  $("#intro-level-badge").textContent = `Level ${level.id}`;
  $("#intro-title").textContent = level.title;
  $("#intro-desc").textContent = level.description;

  const units = splitWord(level.example);
  const mask = getShownMask(level, units, level.example);
  $("#intro-example").innerHTML = formatUnitsHtml(units, mask);

  showScreen("intro");
}

function startLevel() {
  state.wordIndex = 0;
  state.streak = 0;
  state.wordStars = [];
  state.hintsUsed = 0;
  showScreen("game");
  loadWord();
}

/* ── Game ── */
function loadWord() {
  const level = getLevel(state.currentLevel);
  const wordObj = level.words[state.wordIndex];
  const units = splitWord(wordObj);
  const shownMask = getShownMask(level, units, wordObj);

  state.attempts = 0;
  state.hintsUsed = 0;
  state.locked = false;
  state.filledSlots = units.map((u, i) => (shownMask[i] ? u : ""));
  state.shownMask = [...shownMask];
  state.currentUnits = units;
  state.currentWordObj = wordObj;

  $("#game-level-label").textContent = `Level ${level.id} · ${level.title}`;
  $("#game-word-count").textContent = `${state.wordIndex + 1} / ${level.words.length}`;
  $("#progress-fill").style.width = `${(state.wordIndex / level.words.length) * 100}%`;

  $("#word-emoji").textContent = wordObj.emoji;
  $("#feedback").textContent = "";
  $("#feedback").className = "feedback";
  $("#btn-hint").disabled = false;

  updateStreakUI();
  renderSlots();
  renderLetterPool();
  renderSlots();

  setTimeout(() => speakWord(wordObj.word), 400);
}

function updateStreakUI() {
  const badge = $("#streak-badge");
  if (state.streak >= 2) {
    badge.hidden = false;
    $("#streak-count").textContent = state.streak;
  } else {
    badge.hidden = true;
  }
}

function renderSlots() {
  const container = $("#word-slots");
  container.innerHTML = "";

  state.currentUnits.forEach((unit, i) => {
    if (state.currentWordObj.units && i > 0) {
      const gap = document.createElement("span");
      gap.className = "unit-gap";
      gap.textContent = " ";
      container.appendChild(gap);
    }

    const slot = document.createElement("div");
    const isFixed = state.shownMask[i];
    const filled = state.filledSlots[i];

    slot.className = "letter-slot";
    if (isDigraphUnit(unit)) slot.classList.add("digraph");

    if (isFixed) {
      slot.classList.add("fixed");
      slot.textContent = unit;
    } else if (filled) {
      slot.classList.add("filled");
      slot.textContent = filled;
      slot.dataset.index = i;
      slot.addEventListener("click", () => clearSlot(i));
    } else {
      slot.classList.add("empty");
      slot.textContent = "_";
      slot.dataset.index = i;
    }

    container.appendChild(slot);
  });
}

function getNextEmptyIndex() {
  return state.filledSlots.findIndex((f, i) => !state.shownMask[i] && !f);
}

function renderLetterPool() {
  const pool = $("#letter-pool");
  pool.innerHTML = "";

  const distractors = buildDistractors(state.currentUnits, state.shownMask);

  distractors.forEach((letter) => {
    const tile = document.createElement("button");
    tile.className = "letter-tile";
    if (letter.length > 1) tile.classList.add("digraph");
    if (letter.length > 2) tile.classList.add("word-chunk");
    tile.textContent = letter;
    tile.addEventListener("click", () => placeLetter(letter, tile));
    pool.appendChild(tile);
  });
}

function placeLetter(letter, tile) {
  if (state.locked) return;

  const idx = getNextEmptyIndex();
  if (idx === -1) return;

  state.filledSlots[idx] = letter;
  tile.disabled = true;
  tile.dataset.placedAt = idx;
  renderSlots();

  if (getNextEmptyIndex() === -1) {
    checkAnswer();
  }
}

function clearSlot(index) {
  if (state.locked || state.shownMask[index]) return;
  const removed = state.filledSlots[index];
  state.filledSlots[index] = "";
  renderSlots();

  document.querySelectorAll(".letter-tile").forEach((tile) => {
    if (tile.dataset.placedAt === String(index)) {
      tile.disabled = false;
      delete tile.dataset.placedAt;
    }
  });
}

function clearAllSlots() {
  if (state.locked) return;
  state.filledSlots = state.filledSlots.map((f, i) => (state.shownMask[i] ? f : ""));
  document.querySelectorAll(".letter-tile").forEach((tile) => {
    tile.disabled = false;
    delete tile.dataset.placedAt;
  });
  renderSlots();
  $("#feedback").textContent = "";
  $("#feedback").className = "feedback";
}

function checkAnswer() {
  state.attempts++;
  const correct = state.filledSlots.every(
    (f, i) => f.toLowerCase() === state.currentUnits[i].toLowerCase()
  );

  const feedback = $("#feedback");
  const slots = document.querySelectorAll(".letter-slot");

  if (correct) {
    state.locked = true;
    slots.forEach((s) => {
      if (!s.classList.contains("fixed")) s.classList.add("correct");
    });

    const stars = calcStars();
    state.wordStars.push(stars);
    state.streak++;

    feedback.className = "feedback correct";
    const cheers = ["잘했어요! 🎉", "대단해요! ⭐", "완벽해요! 🌟", "멋져요! 👏", "최고예요! 🏆"];
    feedback.textContent = cheers[Math.floor(Math.random() * cheers.length)];

    speakWord(state.currentWordObj.word);
    fireConfetti(stars);

    setTimeout(nextWord, 1600);
  } else {
    state.streak = 0;
    updateStreakUI();
    slots.forEach((s) => {
      if (s.classList.contains("filled")) s.classList.add("wrong");
    });
    feedback.className = "feedback wrong";
    feedback.textContent = "다시 해볼까요? 💪";

    setTimeout(() => {
      slots.forEach((s) => s.classList.remove("wrong"));
      clearAllSlots();
    }, 900);
  }
}

function calcStars() {
  if (state.attempts === 1 && state.hintsUsed === 0) return 3;
  if (state.attempts <= 2 && state.hintsUsed <= 1) return 2;
  return 1;
}

function useHint() {
  if (state.locked || state.hintsUsed >= 2) return;

  const emptyIndices = state.filledSlots
    .map((f, i) => (!state.shownMask[i] && !f ? i : -1))
    .filter((i) => i >= 0);

  if (emptyIndices.length === 0) return;

  const idx = emptyIndices[0];
  state.filledSlots[idx] = state.currentUnits[idx];
  state.shownMask[idx] = true;
  state.hintsUsed++;

  renderSlots();

  if (state.hintsUsed >= 2) $("#btn-hint").disabled = true;

  if (getNextEmptyIndex() === -1) checkAnswer();
}

function nextWord() {
  const level = getLevel(state.currentLevel);
  state.wordIndex++;

  if (state.wordIndex >= level.words.length) {
    finishLevel();
  } else {
    loadWord();
  }
}

function finishLevel() {
  const level = getLevel(state.currentLevel);
  const totalStars = state.wordStars.reduce((a, b) => a + b, 0);
  const maxStars = level.words.length * 3;

  const prev = state.progress.levelStars[state.currentLevel] || 0;
  if (totalStars > prev) {
    state.progress.totalStars += totalStars - prev;
    state.progress.levelStars[state.currentLevel] = totalStars;
  }

  if (state.currentLevel >= state.progress.unlockedLevel && state.currentLevel < 10) {
    state.progress.unlockedLevel = state.currentLevel + 1;
  }

  saveProgress();

  $("#progress-fill").style.width = "100%";
  $("#complete-emoji").textContent = totalStars >= maxStars * 0.8 ? "🏆" : "🎉";
  $("#complete-title").textContent = `${level.title} 클리어!`;

  const avg = totalStars / level.words.length;
  const starDisplay = "⭐".repeat(Math.round(avg)) + "☆".repeat(3 - Math.round(avg));
  $("#stars-earned").textContent = starDisplay.repeat(1);
  $("#stars-earned").textContent = state.wordStars.map((s) => "⭐".repeat(s)).join(" ");

  const messages = [
    `총 ${totalStars}개의 별을 모았어요!`,
    state.streak >= 3 ? `연속 정답 ${state.streak}개! 🔥` : "",
  ].filter(Boolean);
  $("#complete-message").textContent = messages.join(" ");

  const nextBtn = $("#btn-next-level");
  if (state.currentLevel >= 10) {
    nextBtn.textContent = "모든 레벨 완료! 🎊";
    nextBtn.disabled = true;
  } else {
    nextBtn.textContent = "다음 레벨 →";
    nextBtn.disabled = false;
  }

  showScreen("complete");
  fireConfetti(3);
}

/* ── Confetti ── */
const confettiCanvas = $("#confetti-canvas");
const confettiCtx = confettiCanvas.getContext("2d");
let confettiPieces = [];
let confettiAnim = null;

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function fireConfetti(intensity = 2) {
  resizeConfetti();
  const colors = ["#6c5ce7", "#00b894", "#fdcb6e", "#e17055", "#e84393", "#55efc4"];
  const count = 30 + intensity * 20;

  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: -10 - Math.random() * 100,
      w: 6 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 6,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 12,
    });
  }

  if (!confettiAnim) animateConfetti();
}

function animateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiPieces = confettiPieces.filter((p) => p.y < confettiCanvas.height + 20);

  confettiPieces.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.rot += p.vr;

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rot * Math.PI) / 180);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.restore();
  });

  if (confettiPieces.length > 0) {
    confettiAnim = requestAnimationFrame(animateConfetti);
  } else {
    confettiAnim = null;
  }
}

/* ── Events ── */
function bindEvents() {
  $("#btn-intro-back").addEventListener("click", () => {
    showScreen("home");
    renderLevelMap();
  });

  $("#btn-start-level").addEventListener("click", startLevel);

  $("#btn-game-back").addEventListener("click", () => {
    speechSynth.cancel();
    showScreen("home");
    renderLevelMap();
  });

  $("#btn-play-sound").addEventListener("click", () => {
    if (state.currentWordObj) speakWord(state.currentWordObj.word);
  });

  $("#btn-hint").addEventListener("click", useHint);
  $("#btn-clear").addEventListener("click", clearAllSlots);

  $("#btn-replay-level").addEventListener("click", () => {
    startLevel();
  });

  $("#btn-next-level").addEventListener("click", () => {
    if (state.currentLevel < 10) {
      openLevelIntro(state.currentLevel + 1);
    }
  });

  $("#btn-home").addEventListener("click", () => {
    showScreen("home");
    renderLevelMap();
  });

  window.addEventListener("resize", resizeConfetti);
}

/* ── Init ── */
initSpeech();
bindEvents();
renderLevelMap();

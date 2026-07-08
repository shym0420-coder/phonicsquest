/**
 * Phonics Quest — phonics & pronunciation pathway (63 words, 10 levels).
 * Progresses by sound pattern, not by topic theme.
 */
const LEVELS = [
  {
    id: 1,
    title: "CVC 첫소리",
    emoji: "🔤",
    description: "짧은 모음 3글자 단어! 첫 소리를 보고 나머지를 맞혀요. (예: h _ _ → hug)",
    mode: "show-first",
    example: { word: "hug", emoji: "🤗" },
    words: [
      { word: "hug", emoji: "🤗" },
      { word: "bed", emoji: "🛏️" },
      { word: "pen", emoji: "🖊️" },
      { word: "red", emoji: "🔴" },
      { word: "sad", emoji: "😢" },
      { word: "boy", emoji: "👦" },
      { word: "car", emoji: "🚗" },
    ],
  },
  {
    id: 2,
    title: "가운데 모음",
    emoji: "👄",
    description: "짧은 모음 a, e, i, o, u를 듣고 앞·뒤 자음을 맞혀요!",
    mode: "show-vowel",
    example: { word: "ball", emoji: "⚽" },
    words: [
      { word: "ball", emoji: "⚽" },
      { word: "doll", emoji: "🪆" },
      { word: "desk", emoji: "🪑" },
      { word: "pink", emoji: "🩷" },
      { word: "sink", emoji: "🚰" },
      { word: "clock", emoji: "🕐" },
      { word: "block", emoji: "🧱" },
    ],
  },
  {
    id: 3,
    title: "끝소리",
    emoji: "🎯",
    description: "단어의 마지막 소리를 보고, 앞부분을 맞혀요!",
    mode: "show-last",
    example: { word: "book", emoji: "📖" },
    words: [
      { word: "book", emoji: "📖" },
      { word: "yard", emoji: "🌳" },
      { word: "sofa", emoji: "🛋️" },
      { word: "robot", emoji: "🤖" },
      { word: "hello", emoji: "👋" },
      { word: "fridge", emoji: "🧊" },
    ],
  },
  {
    id: 4,
    title: "단어 패밀리",
    emoji: "👨‍👩‍👧",
    description: "같은 끝소리(-ay, -ue, -een…) 패밀리! 끝소리를 보고 앞을 맞혀요.",
    mode: "show-rime",
    example: { word: "gray", emoji: "🩶", rime: "ay" },
    words: [
      { word: "gray", emoji: "🩶", rime: "ay" },
      { word: "blue", emoji: "💙", rime: "ue" },
      { word: "green", emoji: "💚", rime: "een" },
      { word: "yellow", emoji: "💛", rime: "ow" },
      { word: "paint", emoji: "🎨", rime: "aint" },
      { word: "boat", emoji: "⛵", rime: "oat" },
    ],
  },
  {
    id: 5,
    title: "묶음 소리 sh·ch·th",
    emoji: "🤫",
    description: "두 글자가 한 소리! ch, th, ou 같은 묶음을 배워요.",
    mode: "show-digraph",
    example: { word: "child", emoji: "🧒", units: ["ch", "i", "l", "d"] },
    words: [
      { word: "child", emoji: "🧒", units: ["ch", "i", "l", "d"] },
      { word: "chair", emoji: "💺", units: ["ch", "ai", "r"] },
      { word: "teacher", emoji: "👩‍🏫", units: ["t", "ea", "ch", "er"] },
      { word: "bathroom", emoji: "🛁", units: ["b", "a", "th", "room"] },
      { word: "kitchen", emoji: "🍳", units: ["k", "i", "tch", "en"] },
      { word: "house", emoji: "🏠", units: ["h", "ou", "se"] },
    ],
  },
  {
    id: 6,
    title: "블렌드 소리",
    emoji: "🌀",
    description: "자음이 붙어서 나는 소리! br, fr, sl, tr, sw, cr를 맞혀요.",
    mode: "show-blend",
    example: { word: "train", emoji: "🚂", units: ["tr", "ai", "n"] },
    words: [
      { word: "train", emoji: "🚂", units: ["tr", "ai", "n"] },
      { word: "friend", emoji: "🤝", units: ["fr", "ie", "nd"] },
      { word: "slide", emoji: "🛝", units: ["sl", "i", "de"] },
      { word: "swing", emoji: "🪢", units: ["sw", "i", "ng"] },
      { word: "brave", emoji: "💪", units: ["br", "a", "ve"] },
      { word: "crayon", emoji: "🖍️", units: ["cr", "ay", "on"] },
    ],
  },
  {
    id: 7,
    title: "마법의 e",
    emoji: "✨",
    description: "끝에 e가 붙으면 모음이 길어져요! cake처럼 a→/eɪ/ 소리.",
    mode: "show-magic-e",
    example: { word: "bike", emoji: "🚲", units: ["b", "i", "k", "e"] },
    words: [
      { word: "wave", emoji: "👋", units: ["w", "a", "v", "e"] },
      { word: "nice", emoji: "🙂", units: ["n", "i", "c", "e"] },
      { word: "bike", emoji: "🚲", units: ["b", "i", "k", "e"] },
      { word: "kite", emoji: "🪁", units: ["k", "i", "t", "e"] },
      { word: "game", emoji: "🎮", units: ["g", "a", "m", "e"] },
      { word: "table", emoji: "🪑", units: ["t", "a", "b", "le"] },
    ],
  },
  {
    id: 8,
    title: "긴 모음 · 특수 소리",
    emoji: "🎵",
    description: "oo, igh, ir, ur처럼 특별한 모음 소리! 묶음을 보고 나머지를 맞혀요.",
    mode: "show-vowel-team",
    example: { word: "girl", emoji: "👧", units: ["g", "ir", "l"] },
    words: [
      { word: "girl", emoji: "👧", units: ["g", "ir", "l"] },
      { word: "purple", emoji: "💜", units: ["p", "ur", "ple"] },
      { word: "bedroom", emoji: "🛏️", units: ["bed", "room"] },
      { word: "goodbye", emoji: "👋", units: ["good", "bye"] },
      { word: "high five", emoji: "🙌", units: ["high", "five"] },
      { word: "frightened", emoji: "😨", units: ["fr", "igh", "tened"] },
    ],
  },
  {
    id: 9,
    title: "긴 단어 도전",
    emoji: "📏",
    description: "조금 긴 단어! 앞 글자를 보고 소리 단위로 맞춰요.",
    mode: "show-first-two",
    example: { word: "happy", emoji: "😊" },
    words: [
      { word: "happy", emoji: "😊" },
      { word: "scary", emoji: "👻" },
      { word: "pencil", emoji: "✏️" },
      { word: "orange", emoji: "🧡" },
      { word: "backpack", emoji: "🎒" },
      { word: "apartment", emoji: "🏢" },
    ],
  },
  {
    id: 10,
    title: "챔피언 도전",
    emoji: "🏆",
    description: "합성어·긴 단어! 소리를 잘 듣고 글자를 맞혀요.",
    mode: "challenge",
    example: { word: "playground", emoji: "🛝" },
    words: [
      { word: "playground", emoji: "🛝" },
      { word: "skateboard", emoji: "🛹" },
      { word: "sandbox", emoji: "🏖️" },
      { word: "teddy bear", emoji: "🧸", units: ["teddy", "bear"] },
      { word: "pencil case", emoji: "🎒", units: ["pencil", "case"] },
      { word: "dining room", emoji: "🍽️", units: ["dining", "room"] },
      { word: "living room", emoji: "🛋️", units: ["living", "room"] },
    ],
  },
];

const STORAGE_KEY = "phonicsquest-progress-v2";

function getUnits(wordObj) {
  if (wordObj.units) return [...wordObj.units];
  return wordObj.word.split("");
}

function isDigraphUnit(unit) {
  return unit.length > 1;
}

/**
 * Phonics Quest — classic phonics pathway (10 levels).
 * Words chosen for sound patterns, not themes or vocabulary topics.
 */
const LEVELS = [
  {
    id: 1,
    title: "CVC 첫소리",
    description: "짧은 모음 3글자 단어! 첫 소리를 보고 나머지를 맞혀요. (예: d _ _ → dog)",
    mode: "show-first",
    example: { word: "dog" },
    words: [
      { word: "dog" },
      { word: "cat" },
      { word: "pig" },
      { word: "sun" },
      { word: "bus" },
      { word: "hen" },
      { word: "map" },
    ],
  },
  {
    id: 2,
    title: "가운데 모음",
    description: "짧은 모음 a, e, i, o, u를 듣고 앞·뒤 글자를 맞혀요!",
    mode: "show-vowel",
    example: { word: "cat" },
    words: [
      { word: "cat" },
      { word: "dog" },
      { word: "pig" },
      { word: "bed" },
      { word: "cup" },
      { word: "hat" },
      { word: "fox" },
    ],
  },
  {
    id: 3,
    title: "끝소리",
    description: "마지막 소리를 보고 앞 글자를 맞혀요!",
    mode: "show-last",
    example: { word: "pig" },
    words: [
      { word: "pig" },
      { word: "log" },
      { word: "rug" },
      { word: "fan" },
      { word: "pen" },
      { word: "map" },
      { word: "net" },
    ],
  },
  {
    id: 4,
    title: "단어 패밀리",
    description: "같은 끝소리(-at, -og, -ig)를 가진 단어예요. 앞부분을 맞혀요!",
    mode: "show-rime",
    example: { word: "dog", rime: "og" },
    words: [
      { word: "dog", rime: "og" },
      { word: "fog", rime: "og" },
      { word: "cat", rime: "at" },
      { word: "hat", rime: "at" },
      { word: "pig", rime: "ig" },
      { word: "big", rime: "ig" },
    ],
  },
  {
    id: 5,
    title: "긴 CVC 탐험",
    description: "4글자 단어! 첫 글자를 보고 나머지를 맞혀요.",
    mode: "show-first",
    example: { word: "frog" },
    words: [
      { word: "frog" },
      { word: "fish" },
      { word: "duck" },
      { word: "milk" },
      { word: "nest" },
      { word: "lamp" },
    ],
  },
  {
    id: 6,
    title: "묶음 소리 sh·ch·th",
    description: "두 글자가 한 소리! sh, ch, th를 배워요.",
    mode: "show-digraph",
    example: { word: "ship", units: ["sh", "i", "p"] },
    words: [
      { word: "ship", units: ["sh", "i", "p"] },
      { word: "shop", units: ["sh", "o", "p"] },
      { word: "chip", units: ["ch", "i", "p"] },
      { word: "chin", units: ["ch", "i", "n"] },
      { word: "thin", units: ["th", "i", "n"] },
      { word: "bath", units: ["b", "a", "th"] },
    ],
  },
  {
    id: 7,
    title: "블렌드 소리",
    description: "bl, tr, st처럼 자음이 붙는 소리예요!",
    mode: "show-blend",
    example: { word: "blue", units: ["bl", "ue"] },
    words: [
      { word: "blue", units: ["bl", "ue"] },
      { word: "tree", units: ["tr", "ee"] },
      { word: "star", units: ["st", "ar"] },
      { word: "frog", units: ["fr", "o", "g"] },
      { word: "flag", units: ["fl", "a", "g"] },
      { word: "crab", units: ["cr", "a", "b"] },
    ],
  },
  {
    id: 8,
    title: "마법의 e",
    description: "끝에 e가 있으면 모음이 길어져요! cake, bike처럼요.",
    mode: "show-magic-e",
    example: { word: "cake", units: ["c", "a", "k", "e"] },
    words: [
      { word: "cake", units: ["c", "a", "k", "e"] },
      { word: "bike", units: ["b", "i", "k", "e"] },
      { word: "rope", units: ["r", "o", "p", "e"] },
      { word: "kite", units: ["k", "i", "t", "e"] },
      { word: "bone", units: ["b", "o", "n", "e"] },
      { word: "cube", units: ["c", "u", "b", "e"] },
    ],
  },
  {
    id: 9,
    title: "모음팀 · 특수 소리",
    description: "ai, ee, oa, igh처럼 모음이 모여 나는 소리예요!",
    mode: "show-vowel-team",
    example: { word: "rain", units: ["r", "ai", "n"] },
    words: [
      { word: "rain", units: ["r", "ai", "n"] },
      { word: "boat", units: ["b", "oa", "t"] },
      { word: "sheep", units: ["sh", "ee", "p"] },
      { word: "night", units: ["n", "igh", "t"] },
      { word: "light", units: ["l", "igh", "t"] },
      { word: "green", units: ["gr", "ee", "n"] },
    ],
  },
  {
    id: 10,
    title: "챔피언 도전",
    description: "소리만 잘 듣고 글자를 맞혀요! 진짜 챔피언 도전!",
    mode: "challenge",
    example: { word: "smile" },
    words: [
      { word: "smile" },
      { word: "plant" },
      { word: "grape" },
      { word: "train", units: ["tr", "ai", "n"] },
      { word: "dream", units: ["dr", "ea", "m"] },
      { word: "clock" },
    ],
  },
];

const STORAGE_KEY = "phonicsquest-progress-v3";

function getUnits(wordObj) {
  if (wordObj.units) return [...wordObj.units];
  return wordObj.word.split("");
}

function isDigraphUnit(unit) {
  return unit.length > 1;
}

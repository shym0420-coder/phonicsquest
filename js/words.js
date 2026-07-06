/**
 * Phonics Quest — 63 words across 10 levels (phonics difficulty).
 * Multi-word phrases use units: ["teddy", "bear"], etc.
 */
const LEVELS = [
  {
    id: 1,
    title: "안녕, 친구!",
    emoji: "👋",
    description: "짧고 쉬운 단어예요. 첫 글자를 보고 나머지를 맞춰요!",
    mode: "show-first",
    example: { word: "hug", emoji: "🤗" },
    words: [
      { word: "hug", emoji: "🤗" },
      { word: "boy", emoji: "👦" },
      { word: "sad", emoji: "😢" },
      { word: "red", emoji: "🔴" },
      { word: "bed", emoji: "🛏️" },
      { word: "pen", emoji: "🖊️" },
      { word: "car", emoji: "🚗" },
    ],
  },
  {
    id: 2,
    title: "기분 표현",
    emoji: "😊",
    description: "기분과 사람 이야기! 가운데 모음을 보고 맞춰요.",
    mode: "show-vowel",
    example: { word: "nice", emoji: "🙂" },
    words: [
      { word: "nice", emoji: "🙂" },
      { word: "wave", emoji: "👋" },
      { word: "girl", emoji: "👧" },
      { word: "happy", emoji: "😊" },
      { word: "brave", emoji: "💪" },
      { word: "scary", emoji: "👻" },
      { word: "child", emoji: "🧒" },
    ],
  },
  {
    id: 3,
    title: "학교 시작",
    emoji: "📚",
    description: "학교에서 자주 쓰는 단어! 끝 글자를 보고 맞춰요.",
    mode: "show-last",
    example: { word: "book", emoji: "📖" },
    words: [
      { word: "book", emoji: "📖" },
      { word: "desk", emoji: "🪑" },
      { word: "doll", emoji: "🪆" },
      { word: "ball", emoji: "⚽" },
      { word: "kite", emoji: "🪁" },
      { word: "game", emoji: "🎮" },
      { word: "block", emoji: "🧱" },
    ],
  },
  {
    id: 4,
    title: "무지개 색깔",
    emoji: "🌈",
    description: "예쁜 색 이름을 배워요! 같은 끝소리를 찾아봐요.",
    mode: "show-rime",
    example: { word: "blue", emoji: "💙", rime: "ue" },
    words: [
      { word: "gray", emoji: "🩶", rime: "ay" },
      { word: "blue", emoji: "💙", rime: "ue" },
      { word: "green", emoji: "💚", rime: "een" },
      { word: "pink", emoji: "🩷", rime: "ink" },
      { word: "yellow", emoji: "💛", rime: "ow" },
      { word: "orange", emoji: "🧡", rime: "ange" },
    ],
  },
  {
    id: 5,
    title: "학용품 상자",
    emoji: "✏️",
    description: "학용품 단어! 첫 글자를 보고 나머지를 맞춰요.",
    mode: "show-first",
    example: { word: "pencil", emoji: "✏️" },
    words: [
      { word: "purple", emoji: "💜" },
      { word: "crayon", emoji: "🖍️" },
      { word: "paint", emoji: "🎨" },
      { word: "pencil", emoji: "✏️" },
      { word: "chair", emoji: "💺" },
      { word: "table", emoji: "🪑" },
    ],
  },
  {
    id: 6,
    title: "우리 집",
    emoji: "🏠",
    description: "집과 방 이름이에요! 첫 글자를 보고 맞춰요.",
    mode: "show-first",
    example: { word: "house", emoji: "🏠" },
    words: [
      { word: "clock", emoji: "🕐" },
      { word: "yard", emoji: "🌳" },
      { word: "house", emoji: "🏠" },
      { word: "kitchen", emoji: "🍳" },
      { word: "bedroom", emoji: "🛏️" },
      { word: "bathroom", emoji: "🛁" },
    ],
  },
  {
    id: 7,
    title: "집 안 가구",
    emoji: "🛋️",
    description: "가구와 놀이 기구! 끝 글자를 보고 맞춰요.",
    mode: "show-last",
    example: { word: "sofa", emoji: "🛋️" },
    words: [
      { word: "sink", emoji: "🚰" },
      { word: "sofa", emoji: "🛋️" },
      { word: "slide", emoji: "🛝" },
      { word: "swing", emoji: "🪢" },
      { word: "boat", emoji: "⛵" },
      { word: "bike", emoji: "🚲" },
    ],
  },
  {
    id: 8,
    title: "놀이터 가자",
    emoji: "🎠",
    description: "신 나는 놀이와 인사! 가운데 소리를 보고 맞춰요.",
    mode: "show-vowel",
    example: { word: "hello", emoji: "👋" },
    words: [
      { word: "sandbox", emoji: "🏖️" },
      { word: "train", emoji: "🚂" },
      { word: "robot", emoji: "🤖" },
      { word: "hello", emoji: "👋" },
      { word: "goodbye", emoji: "👋" },
      { word: "fridge", emoji: "🧊" },
    ],
  },
  {
    id: 9,
    title: "더 긴 말",
    emoji: "🎒",
    description: "조금 긴 단어와 구! 앞 두 글자를 보고 맞춰요.",
    mode: "show-first-two",
    example: { word: "friend", emoji: "🤝" },
    words: [
      { word: "friend", emoji: "🤝" },
      { word: "teacher", emoji: "👩‍🏫" },
      { word: "apartment", emoji: "🏢" },
      { word: "backpack", emoji: "🎒" },
      { word: "frightened", emoji: "😨" },
      { word: "high five", emoji: "🙌", units: ["high", "five"] },
    ],
  },
  {
    id: 10,
    title: "챔피언 도전",
    emoji: "🏆",
    description: "가장 어려운 단어! 소리를 잘 듣고 맞춰요!",
    mode: "challenge",
    example: { word: "playground", emoji: "🛝" },
    words: [
      { word: "skateboard", emoji: "🛹" },
      { word: "teddy bear", emoji: "🧸", units: ["teddy", "bear"] },
      { word: "pencil case", emoji: "🎒", units: ["pencil", "case"] },
      { word: "playground", emoji: "🛝" },
      { word: "dining room", emoji: "🍽️", units: ["dining", "room"] },
      { word: "living room", emoji: "🛋️", units: ["living", "room"] },
    ],
  },
];

const STORAGE_KEY = "phonicsquest-progress";

function getUnits(wordObj) {
  if (wordObj.units) return [...wordObj.units];
  return wordObj.word.split("");
}

function isDigraphUnit(unit) {
  return unit.length > 1;
}

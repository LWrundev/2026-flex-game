// 關卡資料定義
export const LEVEL_DATA = [
  {
    id: 1,
    title: "關卡 1: 初級播種",
    description:
      "歡迎來到農場！第一步，我們需要將 3 顆種子全部移到農田的右側。請使用 <code style='color:#ec4899;background:#f1f5f9;padding:2px 6px;border-radius:4px;'>justify-content</code> 屬性。",
    hint: "在現代 CSS 中，可以使用簡寫值 'end' 來對齊末端。",
    targetCSS: { justifyContent: "end" },
    inputs: ["justify-content"],
    elements: 3,
    emojis: ["🌱", "🌱", "🌱"],
    potStyles: [],
    seedStyles: [],
  },
  {
    id: 2,
    title: "關卡 2: 精準定位",
    description:
      "這次花盆在正中央。你需要結合 <code style='color:#ec4899;background:#f1f5f9;padding:2px 6px;border-radius:4px;'>justify-content</code> 與 <code style='color:#ec4899;background:#f1f5f9;padding:2px 6px;border-radius:4px;'>align-items</code>。",
    hint: "兩者都設為 'center' 即可達到水平與垂直置中。",
    targetCSS: { justifyContent: "center", alignItems: "center" },
    inputs: ["justify-content", "align-items"],
    elements: 1,
    emojis: ["🌻"],
    potStyles: [],
    seedStyles: [],
  },
  {
    id: 3,
    title: "關卡 3: 改變方向",
    description:
      "花盆垂直排列了！請使用 <code style='color:#ec4899;background:#f1f5f9;padding:2px 6px;border-radius:4px;'>flex-direction</code> 變更方向，並將種子推到底部。",
    hint: "方向改為 'column'，對齊改為 'end'。",
    targetCSS: { flexDirection: "column", justifyContent: "end" },
    inputs: ["flex-direction", "justify-content"],
    elements: 3,
    emojis: ["🍀", "🍀", "🍀"],
    potStyles: [],
    seedStyles: [],
  },
  {
    id: 4,
    title: "關卡 4: 空間分配 (Flex-Grow)",
    description:
      "花盆大小不同！請針對<b>每一顆種子</b>單獨設定 <code style='color:#ec4899;background:#f1f5f9;padding:2px 6px;border-radius:4px;'>flex-grow</code>，填滿橫向空間。",
    hint: "花盆比例分別是 1, 2, 1。種子也需要對應的比例值（1, 2, 1）。",
    targetCSS: {},
    isItemLevel: true,
    targetContainerCSS: { gap: "12px" },
    inputs: ["flex-grow (seed 1)", "flex-grow (seed 2)", "flex-grow (seed 3)"],
    elements: 3,
    emojis: ["🌳", "🌳", "🌳"],
    potStyles: [{ flexGrow: 1 }, { flexGrow: 2 }, { flexGrow: 1 }],
    seedStyles: [],
    extraNote: "/* 花盆比例: pot1=1, pot2=2, pot3=1 */",
  },
  {
    id: 5,
    title: "關卡 5: 順序大連連看 (Order)",
    description:
      "最後挑戰！請利用 <code style='color:#ec4899;background:#f1f5f9;padding:2px 6px;border-radius:4px;'>order</code> 屬性，將蘋果、檸檬、水滴種子送回對應的花盆。",
    hint: "藍(1)、紅(2)、黃(3) 是背景花盆的順序。請為種子設定對應的 order 值！",
    targetCSS: {},
    isItemLevel: true,
    targetContainerCSS: {
      justifyContent: "space-around",
      alignItems: "center",
    },
    inputs: ["order (🍎)", "order (🍋)", "order (💧)"],
    elements: 3,
    emojis: ["🍎", "🍋", "💧"],
    potStyles: [
      {
        order: 2,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        borderStyle: "dashed",
      }, // 紅 (目標順序 2)
      {
        order: 3,
        borderColor: "#eab308",
        backgroundColor: "rgba(234, 179, 8, 0.15)",
        borderStyle: "dashed",
      }, // 黃 (目標順序 3)
      {
        order: 1,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        borderStyle: "dashed",
      }, // 藍 (目標順序 1)
    ],
    seedStyles: [
      { backgroundColor: "#fef2f2", borderColor: "#ef4444" }, // 🍎
      { backgroundColor: "#fef9c3", borderColor: "#eab308" }, // 🍋
      { backgroundColor: "#eff6ff", borderColor: "#3b82f6" }, // 💧
    ],
    potEmojis: ["🍎", "🍋", "💧"],
    extraNote: "/* 花盆目標順序: 1: 💧, 2: 🍎, 3: 🍋 */",
  },
];

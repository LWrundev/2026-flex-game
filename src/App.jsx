import { useState, useEffect } from "react";
import { LEVEL_DATA } from "./datas/levelData";
// 關卡資料定義

export default function App() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [inputs, setInputs] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState("playing"); // playing, success, wrong
  const [showModal, setShowModal] = useState(false);

  const currentLevel = LEVEL_DATA[levelIndex];

  // 每當更換關卡，重置輸入框與判定狀態
  useEffect(() => {
    setInputs({});
    setStatus("playing");
    setShowHint(false);
  }, [levelIndex]);

  // 處理即時輸入與語法套用a
  const handleInputChange = (prop, value) => {
    setInputs((prev) => ({ ...prev, [prop]: value }));
    if (status === "wrong") {
      setStatus("playing");
    }
  };

  // 驗證答案的核心機制 (已修復 kebab-case 對照問題)
  const checkAnswer = () => {
    let isCorrect = true;

    // 將 camelCase 轉換成 kebab-case，例如 'justifyContent' -> 'justify-content'
    const toKebabCase = (str) =>
      str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

    if (currentLevel.isItemLevel) {
      // 針對子元素 (L4, L5) 的檢查
      currentLevel.inputs.forEach((inputLabel, idx) => {
        const val = (inputs[inputLabel] || "").trim().toLowerCase();
        if (currentLevel.id === 4) {
          // L4 期待設定 flex-grow 分別為 1, 2, 1
          if (val !== (idx === 1 ? "2" : "1")) isCorrect = false;
        } else if (currentLevel.id === 5) {
          // L5 期待 order 分別設定成 🍎: 2, 🍋: 3, 💧: 1
          const expectedOrders = ["2", "3", "1"];
          if (val !== expectedOrders[idx]) isCorrect = false;
        }
      });
    } else {
      // 針對父容器 (L1, L2, L3) 的檢查
      Object.keys(currentLevel.targetCSS).forEach((prop) => {
        const target = currentLevel.targetCSS[prop].toLowerCase();
        const kebabProp = toKebabCase(prop);

        // 抓取對應的玩家輸入 (相容 kebab-case 或原欄位名稱)
        const user = (inputs[kebabProp] || inputs[prop] || "")
          .trim()
          .toLowerCase();

        // 精準雙向判定：支援現代簡寫 (end / start) 與傳統寫法 (flex-end / flex-start)
        const isMatch =
          user === target ||
          (target === "end" && (user === "flex-end" || user === "end")) ||
          (target === "flex-end" && (user === "flex-end" || user === "end")) ||
          (target === "start" && (user === "flex-start" || user === "start")) ||
          (target === "flex-start" &&
            (user === "flex-start" || user === "start"));

        if (!isMatch) {
          isCorrect = false;
        }
      });
    }

    if (isCorrect) {
      setStatus("success");
      setShowModal(true);
    } else {
      setStatus("wrong");
    }
  };

  // 取得玩家即時套用的容器樣式 (用於即時呈現效果)
  const getPlayerContainerStyle = () => {
    if (currentLevel.isItemLevel) {
      return currentLevel.targetContainerCSS || {};
    }
    const style = {};
    currentLevel.inputs.forEach((prop) => {
      const camelProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      const rawVal = inputs[prop] || "";

      // 在即時渲染時，將簡寫 'end' / 'start' 自動轉換成相容 React 內嵌樣式的 'flex-end' / 'flex-start'
      let finalVal = rawVal.trim().toLowerCase();
      if (prop === "justify-content" || prop === "align-items") {
        if (finalVal === "end") finalVal = "flex-end";
        if (finalVal === "start") finalVal = "flex-start";
      }
      style[camelProp] = finalVal;
    });
    return style;
  };

  // 取得個別玩家種子的即時樣式 (用於 L4, L5)
  const getPlayerItemStyle = (idx) => {
    if (!currentLevel.isItemLevel) return {};
    const propName = currentLevel.inputs[idx].split(" ")[0];
    const camelProp = propName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    return { [camelProp]: inputs[currentLevel.inputs[idx]] };
  };

  // 載入下一關或重置遊戲
  const handleNextLevel = () => {
    setShowModal(false);
    if (levelIndex < LEVEL_DATA.length - 1) {
      setLevelIndex((prev) => prev + 1);
    } else {
      setLevelIndex(0);
    }
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          🧑‍🌾 I'm Flex the farmer{" "}
        </h1>
      </header>

      <main className="game-main">
        {/* 左側：控制面板與編輯器 */}
        <section className="control-panel">
          {/* 關卡說明卡 */}
          <div className="level-info">
            <div className="level-header">
              <h2 className="text-xl font-extrabold text-slate-800">
                {currentLevel.title}
              </h2>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                關卡 {levelIndex + 1} / {LEVEL_DATA.length}
              </span>
            </div>
            <p
              className="text-slate-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: currentLevel.description }}
            />
            {showHint && (
              <div className="mt-3 p-3 bg-amber-50 text-amber-800 rounded-lg text-sm border-l-4 border-amber-500">
                💡 {currentLevel.hint}
              </div>
            )}
          </div>

          {/* 程式碼編輯器 */}
          <div className="code-editor">
            <div className="editor-header">
              <div className="editor-dot red"></div>
              <div className="editor-dot yellow"></div>
              <div className="editor-dot green"></div>
            </div>

            <div className="editor-content">
              <div>
                <span className="line-num">1</span>
                <span className="text-sky-400">#farm</span> {"{"}
              </div>
              <div>
                <span className="line-num">2</span> &nbsp;{" "}
                <span style={{ color: "var(--code-purple)" }}>display</span>:
                flex;
              </div>

              {/* 動態產生輸入框 */}
              {!currentLevel.isItemLevel
                ? currentLevel.inputs.map((prop, i) => (
                    <div key={prop} className="flex items-center">
                      <span className="line-num">{i + 3}</span> &nbsp;
                      <span style={{ color: "var(--code-purple)" }}>
                        {prop}
                      </span>
                      :
                      <input
                        className={`input-field ml-2 ${status === "wrong" ? "wrong" : ""}`}
                        type="text"
                        placeholder="請輸入值"
                        value={inputs[prop] || ""}
                        onChange={(e) =>
                          handleInputChange(prop, e.target.value)
                        }
                        onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                      />
                      ;
                    </div>
                  ))
                : currentLevel.inputs.map((label, i) => (
                    <div key={label} className="mt-1">
                      <div className="text-slate-500">
                        <span className="line-num">{i * 3 + 3}</span> .seed-
                        {i + 1} {"{"}
                      </div>
                      <div className="flex items-center">
                        <span className="line-num">{i * 3 + 4}</span> &nbsp;
                        &nbsp;
                        <span style={{ color: "var(--code-purple)" }}>
                          {label.split(" ")[0]}
                        </span>
                        :
                        <input
                          className={`input-field ml-2 ${status === "wrong" ? "wrong" : ""}`}
                          type="text"
                          placeholder="值"
                          value={inputs[label] || ""}
                          onChange={(e) =>
                            handleInputChange(label, e.target.value)
                          }
                          onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                        />
                        ;
                      </div>
                      <div className="text-slate-500">
                        <span className="line-num">{i * 3 + 5}</span> {"}"}
                      </div>
                    </div>
                  ))}

              <div>
                <span className="line-num">
                  {currentLevel.isItemLevel
                    ? currentLevel.inputs.length * 3 + 3
                    : currentLevel.inputs.length + 3}
                </span>{" "}
                {"}"}
              </div>
              {currentLevel.extraNote && (
                <div className="text-slate-500 text-xs mt-3">
                  {currentLevel.extraNote}
                </div>
              )}
            </div>

            {/* 控制底欄 */}
            <div className="editor-footer">
              <button
                className="btn btn-hint"
                onClick={() => setShowHint(!showHint)}
              >
                提示 💡
              </button>
              <button className="btn btn-primary" onClick={checkAnswer}>
                種植！ 🌱
              </button>
            </div>
          </div>
        </section>

        {/* 右側：視覺化預覽 */}
        <section className="visual-panel">
          <h3 className="text-slate-500 text-xs font-bold mb-3 text-center tracking-wider">
            🌾 種植區 🌾
          </h3>

          <div className="canvas-area">
            {/* 底層：目標位置 (花盆) */}
            <div
              className="flex-layer target-layer"
              style={
                currentLevel.id <= 3
                  ? currentLevel.targetCSS
                  : currentLevel.targetContainerCSS || {}
              }
            >
              {Array.from({ length: currentLevel.elements }).map((_, i) => (
                <div
                  key={i}
                  className="pot"
                  style={currentLevel.potStyles[i] || {}}
                >
                  <span style={{ opacity: 0.25 }}>
                    {currentLevel.potEmojis ? currentLevel.potEmojis[i] : "🕳️"}
                  </span>
                </div>
              ))}
            </div>

            {/* 上層：玩家操作實體 (種子) */}
            <div
              className="flex-layer player-layer"
              style={getPlayerContainerStyle()}
            >
              {Array.from({ length: currentLevel.elements }).map((_, i) => (
                <div
                  key={i}
                  className={`seed ${status === "success" ? "success" : ""}`}
                  style={{
                    ...(currentLevel.seedStyles[i] || {}),
                    ...getPlayerItemStyle(i),
                  }}
                >
                  {currentLevel.emojis[i]}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 勝利與結算彈窗 (自訂 Modal 替代原生 alert) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="text-6xl mb-4">
              {levelIndex === LEVEL_DATA.length - 1 ? "🏆" : "🎉"}
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">
              {levelIndex === LEVEL_DATA.length - 1
                ? "恭喜通關！"
                : "種植成功！"}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {levelIndex === LEVEL_DATA.length - 1
                ? "太神奇了！你已經完美掌握了所有的 Flexbox 核心技巧，榮登農藝大師！"
                : "種子完美地落入了花盆。準備前往下一關！"}
            </p>
            <button
              className="btn btn-next w-full mt-6"
              onClick={handleNextLevel}
            >
              {levelIndex === LEVEL_DATA.length - 1
                ? "重新開始 🔄"
                : "下一關 ➡️"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

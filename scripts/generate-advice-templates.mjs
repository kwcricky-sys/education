/** One-off generator: node scripts/generate-advice-templates.mjs */
import { writeFileSync } from "node:fs";
import path from "node:path";

const scores = [15, 20, 25];
const styles = [
  { id: "academic", label: "傳統學術" },
  { id: "bilingual", label: "雙語國際" },
  { id: "happy", label: "愉快學習" },
];
const genderPrefs = [
  { id: "coed", label: "男女校" },
  { id: "single", label: "單性別學校" },
];
const readiness = [
  { id: "low", label: "尚未準備" },
  { id: "mid", label: "準備中" },
  { id: "high", label: "已經準備充足" },
];

// 3 × 3 × 2 × 2 = 36 (readiness: low/high only for exact grid; mid maps in matcher)
const readinessGrid = [
  { id: "low", label: "尚未準備" },
  { id: "high", label: "已經準備充足" },
];

const templates = [];

for (const score of scores) {
  for (const style of styles) {
    for (const gp of genderPrefs) {
      for (const ready of readinessGrid) {
        const id = `p_${score}_${style.id}_${gp.id}_${ready.id}`;
        const scoreTone =
          score >= 25 ? "分數優勢好明顯" : score >= 20 ? "分數屬中游偏上" : "分數偏緊，要靠策略";
        const styleLine =
          style.id === "academic"
            ? "你鍾意傳統學術、紀律同測驗節奏"
            : style.id === "bilingual"
              ? "你鍾意雙語／偏國際嘅學習氛圍"
              : "你較重視愉快學習同全人發展";
        const genderLine =
          gp.id === "coed"
            ? "男女校選擇彈性大啲，爆額壓力相對分散"
            : "單性別學校競爭可以好激烈，尤其名校網";
        const readyLine =
          ready.id === "high"
            ? "你已經有一定準備，可以專心優化位次同備戰細節"
            : "而家開始都唔遲，建議用 2–3 個週末補齊資料夾同面試練習";

        templates.push({
          id,
          persona: `${score}分 · ${style.label} · ${gp.label} · ${ready.label}`,
          match: {
            score,
            style: style.id,
            gender_pref: gp.id,
            readiness: ready.id,
          },
          report_md: `## 🎯 你嘅家長 Persona：{persona_name}

你好！根據你提供嘅資料，系統配對到 **{persona_name}** 類型。

### 成功率速覽
- **目標學校**：{target_school}
- **校網**：{school_net}
- **自行分配分數**：{score} 分
- **估算自行分配成功率**：约 **{success_rate}%**
- **參考基礎派位率**：{discretionary_rate}%
- **性別／爆額修正**：×{gender_modifier}
- **位次／準備策略修正**：×{strategy_modifier}

> {scoreTone}；{styleLine}。{genderLine}。

### 📝 個人化備戰建議
1. **校網部署**：你而家嘅校網係 {school_net}。自行分配階段可以跨網申請，但統一派位仍以本網為主——建議 A 位放「最想要＋有勝算」嘅學校。
2. **分數策略**：以 {score} 分為錨，{score >= 25 ? "可以衝刺心儀第一志願，同時準備 1 間穩陣保底。" : score >= 20 ? "建議採用『進取 + 穩陣』雙軌：第一志願可以稍高，第二、三志願要務實。" : "建議降低『必入神校』預期，把火力集中喺匹配度高、競爭稍緩嘅學校。"}
3. **風格匹配**：{styleLine}。下面推薦學校已按此風格同性別偏好篩選。
4. **準備清單**：{readyLine}
   - 整理出生證明、住址證明、計分證明文件
   - 做一份 1 頁 A4 小朋友介紹（可用本站「叩門 Portfolio」）
   - 模擬面試 2 次（自我介紹 + 日常情境題）

### 🏫 Match 學校（供參考）
{matched_schools}

### ⚠️ 免責
呢個計算器係 **規則引擎估算**（0 AI Token），唔等於教育局或學校官方結果。實際受每年申請人數、計分辦法同隨機抽籤影響。

—— {site_name} 升學研究室
`
            .replaceAll("{scoreTone}", scoreTone)
            .replaceAll("{styleLine}", styleLine)
            .replaceAll("{genderLine}", genderLine)
            .replaceAll("{readyLine}", readyLine)
            .replaceAll(
              "{score >= 25 ? \"可以衝刺心儀第一志願，同時準備 1 間穩陣保底。\" : score >= 20 ? \"建議採用『進取 + 穩陣』雙軌：第一志願可以稍高，第二、三志願要務實。\" : \"建議降低『必入神校』預期，把火力集中喺匹配度高、競爭稍緩嘅學校。\"}",
              score >= 25
                ? "可以衝刺心儀第一志願，同時準備 1 間穩陣保底。"
                : score >= 20
                  ? "建議採用『進取 + 穩陣』雙軌：第一志願可以稍高，第二、三志願要務實。"
                  : "建議降低『必入神校』預期，把火力集中喺匹配度高、競爭稍緩嘅學校。",
            ),
        });
      }
    }
  }
}

// Expand mid readiness: duplicate high/low templates with mid variants to reach richer set
// Already 3*3*2*2 = 36. Good.

const out = {
  version: 1,
  description: "36 種小一自行分配家長 Persona 建議模板（廣東話）",
  variables: [
    "persona_name",
    "target_school",
    "school_net",
    "score",
    "success_rate",
    "discretionary_rate",
    "gender_modifier",
    "strategy_modifier",
    "matched_schools",
    "site_name",
  ],
  templates,
};

const dest = path.join(process.cwd(), "src", "data", "advice_templates.json");
writeFileSync(dest, JSON.stringify(out, null, 2), "utf8");
console.log(`Wrote ${templates.length} templates → ${dest}`);

import fs from "fs";

const path = "src/data/dse/fish-quiz.json";
const raw = fs.readFileSync(path, "utf8");
const cut = raw.indexOf('"id": "Q057"');
if (cut < 0) throw new Error("Q057 not found");
const headStart = raw.lastIndexOf("{", cut);
const prefix = raw.slice(0, headStart).replace(/,\s*$/, "");

const tail = `
    {
      "id": "Q057",
      "difficulty": "hard",
      "category": "跨篇章比較",
      "question": "蘇洵《六國論》中六國「割地事秦」以求一夕安寢，最終自取滅亡，這在《魚我所欲也》的視角下屬於什麼行為？",
      "options": [
        "A. 「苟得」與「不辯禮義」（為了眼前短暫生存而放棄原則，最終喪失根本）",
        "B. 捨生取義",
        "C. 成人之美",
        "D. 萬鍾於我何加焉"
      ],
      "answer": "A. 「苟得」與「不辯禮義」（為了眼前短暫生存而放棄原則，最終喪失根本）",
      "explanation": "【跨篇章】割地苟安以求短暫存活，放棄原則與大義，正是孟子所批判的「苟得」「不辯禮義而受之」。"
    },
    {
      "id": "Q058",
      "difficulty": "hard",
      "category": "文意理解",
      "question": "文末以「鄉為身死而不受……是亦不可以已乎」作結，作者最主要的用意是什麼？",
      "options": [
        "A. 勸人珍惜俸祿，勿輕言辭官",
        "B. 警醒世人勿因宮室妻妾窮乏而失其本心，當堅守羞惡與取義之道",
        "C. 主張一切物質享受皆不可取",
        "D. 批評古人不知變通"
      ],
      "answer": "B. 警醒世人勿因宮室妻妾窮乏而失其本心，當堅守羞惡與取義之道",
      "explanation": "【考評局章旨】結尾以今昔對比，點出「失其本心」之病，呼籲不可因利祿而放棄本心與義。"
    },
    {
      "id": "Q059",
      "difficulty": "hard",
      "category": "考評標示",
      "question": "若題目要求說明「義」與「生」不可得兼時應如何抉擇，完整得分答案須包含哪一要點？",
      "options": [
        "A. 只需寫「選擇生存」即可",
        "B. 須指出寧捨生而取義，因義重於生，不可苟且偷生",
        "C. 只需列出魚與熊掌之喻",
        "D. 只需翻譯原文，不必點明抉擇原則"
      ],
      "answer": "B. 須指出寧捨生而取義，因義重於生，不可苟且偷生",
      "explanation": "【給分點】必須同時交代「捨生」與「取義」的優先次序及理由，只譯典故不得滿分。"
    },
    {
      "id": "Q060",
      "difficulty": "hard",
      "category": "跨篇章比較與總結",
      "question": "綜合《孟子．魚我所欲也》全文，作者建立的義理體系可總結為？",
      "options": [
        "A. 以魚／熊掌、生／義層層設喻，指出義重於生；人皆有羞惡本心，不可因利祿而「失其本心」，當捨生取義、堅守原則",
        "B. 主張順應自然，不加干涉",
        "C. 主張嚴刑峻法以治國",
        "D. 主張人應盡量追求物質享受"
      ],
      "answer": "A. 以魚／熊掌、生／義層層設喻，指出義重於生；人皆有羞惡本心，不可因利祿而「失其本心」，當捨生取義、堅守原則",
      "explanation": "【全篇總結】由比喻立論→本心羞惡→今人失心，完整貫穿「捨生取義」的道德主張。"
    }
  ],
  "meta": {
    "title": "DSE 中文卷一範文《孟子．魚我所欲也》60題三階極速刷題庫",
    "subject": "DSE 中國語文",
    "paper": "卷一 指定文言經典",
    "total": 60,
    "version": "1.0"
  }
}
`;

const out = prefix.trimEnd().replace(/,\s*$/, "") + "," + tail;
JSON.parse(out); // validate
fs.writeFileSync(path, out, "utf8");
console.log("fixed fish-quiz.json, questions:", JSON.parse(out).questions.length);

# web-control

## 說明
用自然語言操控網頁的 AI 代理技能。使用者提供 URL 和任務描述，龍蝦會打開瀏覽器，透過 Page Agent（阿里巴巴開源）自動完成網頁操作——點擊按鈕、填寫表單、選擇選項、搜尋資料，全程不需要寫 CSS selector。

## 觸發條件
當使用者要求以下操作時自動觸發：
- 操控網頁、瀏覽網站
- 填寫線上表單
- 在網站上搜尋資料
- 自動化網頁操作
- 到某個網址做某件事

## 前置需求
```powershell
npm install playwright page-agent
npx playwright install chromium
```

## 使用方式

### 基本搜尋
```
使用者：幫我到 Google 搜尋龍蝦食譜
龍蝦：🌐 正在打開 Google → 搜尋「龍蝦食譜」→ ✅ 找到約 500,000 筆結果
```

### 填寫表單
```
使用者：幫我到 xxx.com 的註冊頁面，姓名填王小明、Email 填 wang@mail.com
龍蝦：🌐 打開頁面 → ✍️ 姓名：王小明 ✅ → ✍️ Email：wang@mail.com ✅ → 🔘 送出 ✅
```

### 複合任務
```
使用者：到 GitHub 搜尋 page-agent，告訴我星星數和最新版本
龍蝦：🌐 GitHub → 🔍 搜尋 → 🖱️ 點擊第一個結果 → ⭐ 8,251 / 📦 v1.5.7
```

## 工具

### web-control
- 執行指令: `node web-control.js "{url}" "{task}"`
- 參數:
  - url: 目標網頁網址
  - task: 要執行的任務（自然語言描述）
- 回傳: 操作結果文字描述

## 支援的 LLM
Page Agent 支援任何 OpenAI 相容 API：
- **免費測試**：使用 demo.js CDN（預設，不需要 API Key）
- **Qwen**：`qwen3.5-plus`（推薦，便宜）
- **GPT**：`gpt-4o`
- **Claude**：`claude-3.5-sonnet`
- **Ollama**：本地免費，`qwen2.5:7b`

修改 web-control.js 中的 `MODEL_CONFIG` 即可切換。

## 注意事項
- 需要驗證碼（CAPTCHA）的網站無法自動操作
- 不建議在腳本中存放密碼，需登入的網站建議先手動登入
- 每個動作約 2-5 秒（需呼叫 LLM 判斷），填 5 欄表單約 15-30 秒
- `headless: false` 可看到操作過程；正式使用改 `true` 背景執行
- 首次執行需下載 Chromium（約 200MB），之後不用再下載

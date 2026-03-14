/**
 * web-control.js — 龍蝦 AI 網頁操控腳本
 *
 * 用法：node web-control.js <URL> <任務描述>
 * 範例：node web-control.js "https://google.com" "搜尋龍蝦食譜"
 *
 * 需要安裝：
 *   npm install playwright page-agent
 *   npx playwright install chromium
 */

const { chromium } = require('playwright');

// ========== LLM 設定 ==========
// 切換模式：'demo' = 免費測試（不需要 Key）、'custom' = 自己的 API
const MODE = 'demo';

const MODEL_CONFIG = {
    model: 'qwen3.5-plus',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: process.env.QWEN_API_KEY || 'YOUR_API_KEY',
};

// Page Agent CDN（免費測試版）
const PAGE_AGENT_CDN = 'https://cdn.jsdelivr.net/npm/page-agent@1.5.7/dist/iife/page-agent.demo.js';
// 自訂 LLM 版本
const PAGE_AGENT_NPM = 'https://cdn.jsdelivr.net/npm/page-agent@1.5.7/dist/iife/page-agent.js';

// ========== 主程式 ==========
async function controlWebPage(url, task) {
    console.log(`🌐 正在打開：${url}`);
    console.log(`📋 任務：${task}`);

    const browser = await chromium.launch({
        headless: false,    // false = 看得到瀏覽器視窗（教學用）
        // headless: true,  // true = 背景執行（正式使用）
    });

    const page = await browser.newPage();

    try {
        // 1. 打開目標網頁
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        console.log('✅ 頁面載入完成');

        // 2. 注入 Page Agent SDK
        const cdnUrl = MODE === 'demo' ? PAGE_AGENT_CDN : PAGE_AGENT_NPM;
        await page.addScriptTag({ url: cdnUrl });
        console.log('✅ Page Agent SDK 已注入');

        // 3. 等待 SDK 載入
        await page.waitForTimeout(2000);

        // 4. 執行任務
        console.log('🤖 開始執行任務...');
        const config = MODE === 'demo'
            ? { language: 'zh-TW' }
            : { ...MODEL_CONFIG, language: 'zh-TW' };

        const result = await page.evaluate(async ({ task, config, isDemo }) => {
            try {
                const agentConfig = isDemo
                    ? { language: config.language }
                    : {
                        model: config.model,
                        baseURL: config.baseURL,
                        apiKey: config.apiKey,
                        language: config.language,
                    };

                const agent = new PageAgent(agentConfig);
                const res = await agent.execute(task);
                return { success: true, result: JSON.stringify(res) };
            } catch (err) {
                return { success: false, error: err.message };
            }
        }, { task, config, isDemo: MODE === 'demo' });

        if (result.success) {
            console.log('🎉 任務完成！');
            console.log('📊 結果：', result.result);
        } else {
            console.error('❌ 任務失敗：', result.error);
        }

        return result;

    } catch (err) {
        console.error('❌ 錯誤：', err.message);
        return { success: false, error: err.message };

    } finally {
        // 教學模式：等 5 秒讓學生看結果
        if (!process.env.AUTO_CLOSE) {
            console.log('⏳ 5 秒後自動關閉瀏覽器...');
            await page.waitForTimeout(5000);
        }
        await browser.close();
        console.log('🔒 瀏覽器已關閉');
    }
}

// ========== CLI 入口 ==========
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('用法：node web-control.js <URL> <任務描述>');
    console.log('範例：node web-control.js "https://google.com" "搜尋龍蝦食譜"');
    console.log('');
    console.log('環境變數：');
    console.log('  QWEN_API_KEY    - Qwen API Key（自訂 LLM 時需要）');
    console.log('  AUTO_CLOSE=1    - 跳過等待，立即關閉瀏覽器');
    process.exit(1);
}

controlWebPage(args[0], args[1]).catch(console.error);

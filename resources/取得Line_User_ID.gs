/**
 * 🔍 取得 LINE User ID 查詢工具
 *
 * 適用於：OpenClaw 龍蝦課程 CH6
 *
 * 使用方式：
 * 1. 在下面填入你的 Channel Access Token
 * 2. 部署為「網頁應用程式」
 * 3. 把部署網址貼到 LINE Bot 的 Webhook URL
 * 4. 用手機 LINE 傳任何訊息給 Bot
 * 5. Bot 會回覆你的 userId（和 groupId）
 * 6. 取得 ID 後，記得把 Webhook 改回原本的網址！
 */

// ========== 設定區（只需要改這一行）==========
var LINE_TOKEN = '在此貼上你的 Channel Access Token';
// =============================================

/**
 * LINE Webhook 接收函式
 * 當有人傳訊息給 Bot 時，LINE 會呼叫這個函式
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var event = data.events[0];

    // 只處理訊息事件
    if (!event || event.type !== 'message') return;

    var source = event.source;
    var lines = [];

    lines.push('📋 你的 Line ID 資訊');
    lines.push('━━━━━━━━━━━━━━━');
    lines.push('');
    lines.push('👤 你的 userId：');
    lines.push(source.userId);

    if (source.type === 'group') {
      // 在群組中傳訊息，額外顯示 groupId
      lines.push('');
      lines.push('👥 群組 groupId：');
      lines.push(source.groupId);
      lines.push('');
      lines.push('💡 推播給個人 → 用 userId');
      lines.push('💡 推播到群組 → 用 groupId');
    } else if (source.type === 'room') {
      // 在多人聊天室中
      lines.push('');
      lines.push('🏠 聊天室 roomId：');
      lines.push(source.roomId);
    } else {
      // 個人聊天
      lines.push('');
      lines.push('💡 這是個人聊天');
      lines.push('💡 把上面的 userId 複製起來');
      lines.push('💡 貼到 HEARTBEAT.md 或技能設定中');
    }

    lines.push('');
    lines.push('━━━━━━━━━━━━━━━');
    lines.push('✅ 複製 ID 後，記得把 Webhook');
    lines.push('改回原本的網址喔！');

    replyLine(event.replyToken, [{ type: 'text', text: lines.join('\n') }]);

  } catch (err) {
    Logger.log('Error: ' + err.message);
  }
}

/**
 * 回覆 LINE 訊息
 * @param {string} replyToken - LINE 提供的回覆 token
 * @param {Array} messages - 要回覆的訊息陣列
 */
function replyLine(replyToken, messages) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var payload = {
    replyToken: replyToken,
    messages: messages
  };

  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'Authorization': 'Bearer ' + LINE_TOKEN },
    payload: JSON.stringify(payload)
  });
}

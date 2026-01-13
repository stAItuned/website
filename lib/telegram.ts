export type FeedbackPayload = {
  category: string;
  message: string;
  email?: string;
  page: string;
  userAgent?: string;
};

function chunk(text: string, max = 3900) {
  const out: string[] = [];
  for (let i = 0; i < text.length; i += max) out.push(text.slice(i, i + max));
  return out;
}

export async function sendTelegramFeedback(p: FeedbackPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID; // for private channels: -100...
  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN is missing");
    return;
  }
  if (!chatId) {
    console.error("TELEGRAM_CHAT_ID is missing");
    return;
  }

  // For private channels, enforce numeric id to prevent misconfig with @username
  const isNumericChannel = /^-100\d+$/.test(chatId);
  if (!isNumericChannel) {
    console.error(
      "TELEGRAM_CHAT_ID must be the numeric -100... id for private channels. Current value:",
      chatId
    );
    return;
  }

  const header = `🆕 Feedback (${p.category || "n/a"})\n\n`;
  const body =
    `Message: ${p.message}\n\n` +
    `From: ${p.email || "n/a"}\n` +
    `Page: ${p.page}\n` +
    (p.userAgent ? `UA: ${p.userAgent}` : "");

  const text = `${header}\n${body}`.slice(0, 4000);
  const parts = chunk(text);

  const disableNotification =
    (process.env.TELEGRAM_SILENT || "").toLowerCase() === "true";

  for (const part of parts) {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: part,
        disable_web_page_preview: true,
        disable_notification: disableNotification,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Telegram sendMessage failed:", res.status, errText);
    }
  }
}

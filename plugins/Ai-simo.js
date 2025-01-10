import fetch from 'node-fetch';
const handler = async (m, { command, usedPrefix, conn, args, text }) => {
  await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

  let txt = text;

  if (!text && m.quoted && m.quoted.text) {
    txt = m.quoted.text;
  }

  if (!txt) {
    await conn.sendMessage(m.chat, {
      text: `🌀 الرجاء إدخال نص أو الرد على رسالة تحتوي على نص.`,
    }, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: '🥹', key: m.key } });
    return;
  }

  let res;
  try {
    if (command === 'kobi3') {
      res = await simsimi(txt);
    } else if (command === 'kobi2') {
      res = await gpt(txt);
    } else if (command === 'kobi1') {
      res = await blackbox(txt);
    } else if (command === 'kobi') {
      res = await gemini(txt);
    } else if (command === 'kobi0') {
      res = await chatai(txt);
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
    await conn.sendMessage(m.chat, { text: res }, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: '👌🏻', key: m.key } });

  } catch (error) {
    await conn.sendMessage(m.chat, {
      text: `🌀 حدث خطأ أثناء معالجة الطلب.`,
    }, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: '🥹', key: m.key } });
    console.error(error);
  }
};

handler.command = ['kobi3', 'kobi2', 'kobi1', 'kobi', 'kobi0'];
export default handler;

async function simsimi(question) {
  const url = `https://the-end-api.vercel.app/api/ai/simsimi?q=${encodeURIComponent(question)}`;
  const response = await fetch(url);
  const json = await response.json();
  return json.message;
}

async function gpt(question) {
  const url = `https://the-end-api.vercel.app/api/ai/gpt?q=${encodeURIComponent(question)}`;
  const response = await fetch(url);
  const json = await response.json();
  return json.message;
}

async function blackbox(question) {
  const url = `https://the-end-api.vercel.app/api/ai/blackbox?q=${encodeURIComponent(question)}`;
  const response = await fetch(url);
  const json = await response.json();
  return json.message;
}

async function gemini(question) {
  const url = `https://the-end-api.vercel.app/api/ai/gemini?q=${encodeURIComponent(question)}`;
  const response = await fetch(url);
  const json = await response.json();
  return json.data;
}

async function chatai(question) {
  const url = `https://the-end-api.vercel.app/api/ai/chat-ai?q=${encodeURIComponent(question)}`;
  const response = await fetch(url);
  const json = await response.json();
  return json.data;
}
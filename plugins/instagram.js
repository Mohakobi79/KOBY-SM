import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, args, command, text }) => {
  if (!text) throw `> _خاص☯️ بالتحميل 📥 من الأنسغرام_`;
  m.reply(wait);

  let res;
  try {
    res = await fetch(`https://www.guruapi.tech/api/igdlv1?url=${text}`);
  } catch (error) {
    throw `حدث خطأ في هذه 👉🏻: ${error.message}`;
  }

  let api_response = await res.json();

  if (!api_response || !api_response.data) {
    throw `No video or image found or Invalid response from API.`;
  }

  const mediaArray = api_response.data;

  for (const mediaData of mediaArray) {
    const mediaType = mediaData.type;
    const mediaURL = mediaData.url_download;

    let cap = `< TÉLÉCHARGÉ✅${mediaType.toUpperCase()}`;

    if (mediaType === 'video') {

      conn.sendFile(m.chat, mediaURL, 'instagram.mp4', cap, m, null);
    } else if (mediaType === 'image') {

      conn.sendFile(m.chat, mediaURL, 'instagram.jpg', cap, m, null);
    }
  }
};

handler.help = ['instagram'];
handler.tags = ['downloader'];
handler.command = /^(instagram|igdl|ig|insta)$/i;

export default handler;
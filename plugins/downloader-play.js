import yts from 'yt-search';
import fetch from 'node-fetch'; // تأكد من تثبيت node-fetch

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `\`\`\`[ 🌴 ] Por favor ingresa un texto. Ejemplo:\n${usedPrefix + command} Did i tell u that i miss you\`\`\``;
  }

  const search = await yts(text);

  if (!search.all || search.all.length === 0) {
    throw "No se encontraron resultados para tu búsqueda.";
  }

  const videoInfo = search.all[0];
  const body = `\`\`\`⊜─⌈ 🎵 ◜YouTube Play◞ 🎵 ⌋─⊜

    ≡ Título : » ${videoInfo.title}
    ≡ Views : » ${videoInfo.views}
    ≡ Duration : » ${videoInfo.timestamp}
    ≡ Uploaded : » ${videoInfo.ago}
    ≡ URL : » ${videoInfo.url}

# 🌴 Su Audio se está enviando, espere un momento...\`\`\``;

  conn.sendMessage(m.chat, {
    image: { url: videoInfo.thumbnail },
    caption: body,
  }, { quoted: m });

  try {
    // تنزيل المقطع الصوتي
    const response = await fetch(`https://api.siputzx.my.id/api/dl/youtube/mp3?url=${videoInfo.url}`);
    const result = await response.json();

    if (!result || !result.data) {
      throw "No se pudo obtener el enlace de descarga.";
    }

    const audioUrl = result.data;

    // إرسال المقطع الصوتي
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      ptt: false, // لتحويل الصوت إلى ملاحظة صوتية (PTT)
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    throw "Ocurrió un error al procesar tu solicitud.";
  }
};

handler.command = handler.help = ['play'];
handler.tags = ['downloader'];


export default handler;

const getVideoId = (url) => {
  const regex = /(?:v=|\/)([0-9A-Za-z_-]{11}).*/;
  const match = url.match(regex);
  if (match) {
    return match[1];
  }
  throw new Error("Invalid YouTube URL");
};
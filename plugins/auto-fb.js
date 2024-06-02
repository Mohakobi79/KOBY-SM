import fg from 'api-dylux';

const handler = async (m, { conn }) => {
  const urlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.watch)\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
  const match = m.text.match(urlRegex);

  if (!match) {
    return; // لا يوجد رابط فيديو من فيسبوك في الرسالة
  }

  const videoUrl = match[0];
await m.reply(wait);
  const result = await fg.fbdl(videoUrl);
  const tex = `> THIS IS ☝🏻YOUR VIDEO 🎥`;

  const response = await fetch(result.videoUrl);
  const arrayBuffer = await response.arrayBuffer();
  const videoBuffer = Buffer.from(arrayBuffer);

  await conn.sendFile(m.chat, videoBuffer, 'fb.mp4', tex, m);
};

handler.tags = ['downloader'];
handler.customPrefix = /https?:\/\/(www\.)?(facebook\.com|fb\.watch)\//i;
handler.command = new RegExp;

export default handler;
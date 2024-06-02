import fg from 'api-dylux';

const handler = async (m, { conn }) => {
  const urlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.watch)\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
  const match = m.text.match(urlRegex);

  if (!match) {
    return; // لا يوجد رابط فيديو من فيسبوك في الرسالة
  }

  const videoUrl = match[0];
  
  m.react(rwait);

  try {
    const result = await fg.fbdl(videoUrl);
    const tex = `> THIS IS ☝🏻 YOUR VIDEO 🎥
⊱ ────── {⋆♬⋆} ────── ⊰`;

    const response = await fetch(result.videoUrl);
    const arrayBuffer = await response.arrayBuffer();
    const videoBuffer = Buffer.from(arrayBuffer);

    conn.sendFile(m.chat, videoBuffer, 'fb.mp4', tex, m);
    m.react(done);
  } catch (error) {
    console.log(error);
    m.reply('⚠️ Se produjo un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.');
  }
};

handler.tags = ['downloader'];
handler.customPrefix = /https?:\/\/(www\.)?(facebook\.com|fb\.watch)\//i;
handler.command = new RegExp;

export default handler;
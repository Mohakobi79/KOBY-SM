import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  try {

    if (!text) {
      return await conn.sendMessage(
        m.chat,
        { text: 'يرجى إدخال اسم الفيديو أو الرابط لتحميله.' },
        { quoted: m }
      );
    }

 
    const downloadUrl = `https://the-end-api.vercel.app/api/download/yt-download?q=${encodeURIComponent(text)}`;
    const response = await fetch(downloadUrl);
    const json = await response.json();

    if (!json.status || !json.data) {
      return await conn.sendMessage(m.chat, { text: 'لم يتم العثور على النتائج.' }, { quoted: m });
    }

    
    const {
      title,
      description,
      thumbnail,
      time,
      ago,
      views,
      url,
      author,
      channel,
      video,
      audio
    } = json.data;

    // إرسال رسالة تحتوي على المعلومات مع الصورة المصغرة
    const infoMessage = `

*العنوان:* ${title}
*الوصف:* ${description || 'لا يوجد وصف'}
*المدة:* ${time || 'غير متوفرة'}
*التاريخ:* ${ago || 'غير متوفر'}
*المشاهدات:* ${views || 'غير متوفرة'}
*رابط الفيديو:* ${url}
*الناشر:* ${author || 'غير معروف'}
*القناة:* ${channel || '#'}

    `;
    await conn.sendMessage(
      m.chat,
      { image: { url: thumbnail }, caption: infoMessage },
      { quoted: m }
    );

      await conn.sendMessage(
        m.chat,
        {
          video: { url: video },
          caption: `*العنوان:* ${title}\n*الجودة:* عالية`,
        },
        { quoted: m }
      );

      await conn.sendMessage(
        m.chat,
        {
          audio: { url: audio },
          mimetype: 'audio/mp4', 
          ptt: false, 
        },
        { quoted: m }
      );


  } catch (error) {
    console.error(error);
    await conn.sendMessage(
      m.chat,
      { text: 'حدث خطأ أثناء معالجة طلبك. حاول مرة أخرى لاحقًا.' },
      { quoted: m }
    );
  }
};

handler.command = ["ply"];
export default handler;
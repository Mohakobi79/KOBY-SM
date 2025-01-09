import fs from 'fs';
import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';

const handler = async (m, { conn }) => {
  // التعرف على رابط إنستغرام
  const urlRegex = /https?:\/\/(?:www\.)?instagram\.com\/[^\s]+/i;
  const match = m.text.match(urlRegex);

  if (!match) {
    return; // لا يوجد رابط إنستغرام في النص
  }

  const url = match[0]; // استخراج الرابط
  m.reply(wait);

  try {
    const { data } = await axios.get(`https://weeb-api.vercel.app/insta?url=${url}`);
    if (data.urls && data.urls.length > 0) {
      for (const { url: mediaUrl, type } of data.urls) {
        if (type === 'image') {
          // إرسال الصورة
          await conn.sendMessage(
            m.chat,
            { image: { url: mediaUrl }, caption: '✔️ تم استخراج الصورة بنجاح.' },
            { quoted: m }
          );
        } else if (type === 'video') {
          // إرسال الفيديو
          await conn.sendMessage(
            m.chat,
            { video: { url: mediaUrl }, caption: '✔️ تم استخراج الفيديو بنجاح.' },
            { quoted: m }
          );

          // تنزيل الفيديو محليًا لتحويله إلى MP3
          const baseFilePath = `./src/tmp/${m.sender}`;
          const inputPath = await downloadMedia(mediaUrl, baseFilePath, 'mp4');
          const outputPath = inputPath.replace(/\.mp4$/, '.mp3'); // استبدال الامتداد بـ mp3

          // تحويل الفيديو إلى MP3
          await convertToMp3(inputPath, outputPath);

          // قراءة ملف MP3
          const mp3Buffer = fs.readFileSync(outputPath);

          // إرسال ملف MP3
          await conn.sendMessage(
            m.chat,
            { audio: mp3Buffer, fileName: `output.mp3`, mimetype: 'audio/mpeg', ptt: true },
            { quoted: m }
          );

          // تنظيف الملفات المؤقتة
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        }
      }
    } else {
      return m.reply('❌ لم يتم العثور على بيانات وسائط للرابط المقدم.');
    }
  } catch (error) {
    console.error(error);
    return m.reply(`❌ حدث خطأ أثناء معالجة الرابط: ${error.message}`);
  }
};

// ضبط المشغل ليعمل تلقائيًا مع الروابط
handler.customPrefix = /https?:\/\/(?:www\.)?instagram\.com\//i;
handler.command = new RegExp; // عدم الحاجة لتحديد الأمر لأنه تلقائي

export default handler;

// وظائف مساعدة
async function downloadMedia(url, basePath, extension) {
  const response = await axios({ url, responseType: 'arraybuffer' });
  const filePath = await getUniqueFileName(basePath, extension);
  fs.writeFileSync(filePath, response.data);
  return filePath;
}

async function getUniqueFileName(basePath, extension) {
  let fileName = `${basePath}.${extension}`;
  let counter = 1;
  while (fs.existsSync(fileName)) {
    fileName = `${basePath}_${counter}.${extension}`;
    counter++;
  }
  return fileName;
}

function convertToMp3(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('mp3')
      .on('end', resolve)
      .on('error', reject)
      .save(outputPath);
  });
}
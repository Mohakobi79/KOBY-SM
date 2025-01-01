import axios from 'axios';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import os from 'os';
import path from 'path';

const handler = async (m, { conn }) => {
  if (!m || typeof m !== 'object') {
    console.log("Invalid message object.");
    return;
  }

  // تعريف تعبير منتظم للتحقق من روابط يوتيوب
  const urlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[^\s]+$/;
  const isOnlyUrl = urlRegex.test(m.text.trim());

  if (!isOnlyUrl) return; // إذا كانت الرسالة لا تحتوي فقط على رابط، يتم الإنهاء

  const videoUrl = m.text.trim();

  // إرسال رسالة "جاري التحميل..."
  const pingMsg = await conn.sendMessage(
    m.chat,
    { text: "⏳ جاري التحميل، الرجاء الانتظار..." },
    { quoted: m }
  );

  try {
    // استدعاء API التحميل
    const apiUrl = `https://deliriussapi-oficial.vercel.app/download/ytmp4?url=${videoUrl}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.status && data.data?.download?.url) {
      const title = data.data.title || "video";
      const downloadUrl = data.data.download.url;
      const filename = data.data.download.filename || `${title}.mp4`;

      // مسار الملفات المؤقتة
      const tmpDir = os.tmpdir();
      const inputPath = path.join(tmpDir, filename);
      const outputPath = inputPath.replace(/\.[^.]+$/, '.mp3');

      // تنزيل الفيديو
      const videoResponse = await axios({
        url: downloadUrl,
        method: 'GET',
        responseType: 'stream',
      });

      const writer = fs.createWriteStream(inputPath);
      videoResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // إرسال الفيديو
      await conn.sendMessage(
        m.chat,
        { video: fs.readFileSync(inputPath), caption: `🎥 تم تحميل الفيديو: ${title}` },
        { quoted: m }
      );

      // تحويل الفيديو إلى MP3
      await convertToMp3(inputPath, outputPath);

      // إرسال ملف الصوت
      const mp3Buffer = fs.readFileSync(outputPath);
      await conn.sendMessage(
        m.chat,
        { audio: mp3Buffer, fileName: `${title}.mp3`, mimetype: 'audio/mpeg' },
        { quoted: m }
      );

      // تنظيف الملفات المؤقتة
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);

      // تحديث الرسالة
      await conn.sendMessage(
        m.chat,
        { text: "✅ تم إرسال الفيديو والصوت بنجاح!" },
        { quoted: m }
      );
    } else {
      throw new Error("لم يتم العثور على رابط تحميل الفيديو.");
    }
  } catch (e) {
    console.error("Error during YouTube download:", e.message);

    // إخطار المستخدم بالخطأ
    await conn.sendMessage(
      m.chat,
      { text: `⚠️ حدث خطأ أثناء معالجة الفيديو. تأكد من الرابط وحاول مرة أخرى.` },
      { quoted: m }
    );
  }
};

// إعدادات المعالج
handler.tags = ['downloader'];
handler.customPrefix = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[^\s]+$/; // قبول الرسائل التي تحتوي على رابط فقط
handler.command = new RegExp(); // بدون أمر محدد

export default handler;

// دالة تحويل الفيديو إلى MP3
function convertToMp3(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('mp3')
      .on('end', resolve)
      .on('error', reject)
      .save(outputPath);
  });
}
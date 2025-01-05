import axios from 'axios';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

let handler = async (m, { conn }) => {
    const youtubeUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    const messageText = m.text.trim();

    if (!youtubeUrlPattern.test(messageText) || messageText.split(/\s+/).length > 1) {
        return; // إنهاء العملية إذا كانت الرسالة تحتوي على كلمات أخرى أو ليست رابطًا صالحًا
    }

    // إرسال رسالة "جاري التحميل..."
    m.reply(wait);

    try {
        // استدعاء API للحصول على تفاصيل الفيديو
        const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(messageText)}`;
        const response = await axios.get(apiUrl);

        if (!response.data?.result?.download_url) {
            return await conn.sendMessage(
                m.chat,
                { text: "🚫 خطأ أثناء جلب الفيديو. تأكد من الرابط وحاول مرة أخرى." },
                { quoted: m }
            );
        }

        const { title, quality, download_url } = response.data.result;

        // تنزيل الفيديو إلى ملف محلي
        const baseFilePath = `./src/tmp/${m.sender}`;
        const videoPath = await getUniqueFileName(baseFilePath, 'mp4');
        const audioPath = videoPath.replace(/\.[^.]+$/, '.mp3');

        const videoStream = (await axios({ url: download_url, responseType: 'stream' })).data;
        const videoWriteStream = fs.createWriteStream(videoPath);
        videoStream.pipe(videoWriteStream);

        await new Promise((resolve, reject) => {
            videoWriteStream.on('finish', resolve);
            videoWriteStream.on('error', reject);
        });

        // تحويل الفيديو إلى مقطع صوتي
        await convertToMp3(videoPath, audioPath);

        // إرسال الفيديو
        await conn.sendMessage(
            m.chat,
            {
                video: { url: download_url },
                caption: `🎥 *Title:* ${title}\n📊 *Quality:* ${quality}\n📥 *Download link:* ${download_url}`,
            },
            { quoted: m }
        );

        // إرسال المقطع الصوتي
        const mp3Buffer = fs.readFileSync(audioPath);
        await conn.sendMessage(
            m.chat,
            { audio: mp3Buffer, fileName: `${title}.mp3`, mimetype: 'audio/mpeg' },
            { quoted: m }
        );

        // تنظيف الملفات المؤقتة
        fs.unlinkSync(videoPath);
        fs.unlinkSync(audioPath);

        // إشعار بالإرسال الناجح
        await conn.sendMessage(
            m.chat,
            { text: "✅ تم إرسال الفيديو والمقطع الصوتي بنجاح!" },
            { quoted: m }
        );
    } catch (error) {
        console.error("Error during YouTube processing:", error);
        await conn.sendMessage(
            m.chat,
            { text: `⚠️ حدث خطأ أثناء معالجة الفيديو. حاول مرة أخرى لاحقًا.` },
            { quoted: m }
        );
    }
};

handler.customPrefix = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/; // قبول الرسائل التي تحتوي على روابط YouTube
handler.command = new RegExp(); // بدون أمر محدد

export default handler;

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
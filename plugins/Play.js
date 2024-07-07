import ytdl from 'ytdl-core';
import axios from 'axios';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import os from 'os';

const streamPipeline = promisify(pipeline);

let handler = async (m, { conn, text }) => {
    await conn.sendMessage(m.chat, { react: { text: '🎧', key: m.key } });
    if (!text) throw '> *🎧 خاص بتنزيل المقاطع الصوتية 💡*';
    await m.reply('> *_👻 جاري التحميل 👻_*');

    try {
        const query = encodeURIComponent(text);
        const response = await axios.get(`https://weeb-api.vercel.app/ytsearch?query=${query}`);
        const result = response.data[0];

        if (!result) throw 'لم يتم العثور على الفيديو، حاول عنوان آخر';

        const { title, thumbnail } = result;

        // إرسال الصورة المصغرة، العنوان، والرابط أولاً
        await conn.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption: `📹 *${title}*`
        }, { quoted: m });

        const audioStream = ytdl(url, {
            filter: 'audioonly',
            quality: 'highestaudio',
        });

        const tmpDir = os.tmpdir();
        const filePath = `${tmpDir}/${title.replace(/[^\w\s]/gi, '')}.mp3`; // تأكد من أن اسم الملف صالح
        const writableStream = fs.createWriteStream(filePath);

        await streamPipeline(audioStream, writableStream);

        // تحقق من أن الملف تم تنزيله بشكل صحيح
        if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
            await conn.sendMessage(m.chat, {
                audio: { url: filePath },
                mimetype: 'audio/mp4', // استخدام نوع MIME مناسب للملفات الصوتية
                ptt: true,
            }, { quoted: m });

            // حذف الملف بعد الإرسال
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`فشل في حذف الملف الصوتي: ${err}`);
                } else {
                    console.log(`تم حذف الملف الصوتي: ${filePath}`);
                }
            });
        } else {
            throw 'حدث خطأ أثناء تنزيل الملف الصوتي، الملف الناتج فارغ.';
        }
    } catch (error) {
        console.error(error);
        throw 'حدث خطأ أثناء البحث عن فيديوهات يوتيوب.';
    }
};

handler.help = ['play2'].map((v) => v + ' <query>');
handler.tags = ['downloader'];
handler.command = /play$/i;
handler.exp = 0;

export default handler;
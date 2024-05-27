import ytdl from 'ytdl-core';
import axios from 'axios';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import os from 'os';

const streamPipeline = promisify(pipeline);

let handler = async (m, { conn, text }) => {
    await conn.sendMessage(m.chat, { react: { text: '🎧', key: m.key }});
    if (!text) throw '> *🎧 خاص بتنزيل 📥 المقاطع الصوتية 💡*';
    await m.reply('> *_👻 جاري التحميل 👻_*');

    try {
        const query = encodeURIComponent(text);
        const response = await axios.get(`https://weeb-api.vercel.app/ytsearch?query=${query}`);
        const result = response.data[0];

        if (!result) throw 'لم يتم العثور على الفيديو، حاول عنوان آخر';

        const { title, url } = result;
        const audioStream = ytdl(url, {
            filter: 'audioonly',
            quality: 'highestaudio',
        });

        const tmpDir = os.tmpdir();
        const filePath = `${tmpDir}/${title}.mp3`;
        const writableStream = fs.createWriteStream(filePath);

        await streamPipeline(audioStream, writableStream);

        await conn.sendMessage(m.chat, {
            audio: { url: filePath },
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true,
        }, { quoted: m });

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`فشل في حذف الملف الصوتي: ${err}`);
            } else {
                console.log(`تم حذف الملف الصوتي: ${filePath}`);
            }
        });
    } catch (error) {
        console.error(error);
        throw 'حدث خطأ أثناء البحث عن فيديوهات يوتيوب.';
    }
};

handler.help = ['play2'].map((v) => v + ' <query>');
handler.tags = ['downloader'];
handler.command = /pla2$/i;
handler.exp = 0;

export default handler;
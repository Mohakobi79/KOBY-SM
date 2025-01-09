import makeWASocket from 'baileys';
import yts from 'yt-search';

var handler = async (m, { text, conn, args, command, usedPrefix }) => {
    if (!text) {
        await conn.sendMessage(m.chat, { text: "YOUTUBE URL OR TITLE" }, { quoted: m });
        return;
    }

    // البحث عن الفيديو
    const videoInfo = await getFirstVideoInfo(text);

    if (videoInfo) {
        // إعداد الرسالة مع الأزرار
        const message = {
            text: `العنوان: ${videoInfo.title}\n` +
                  `الوصف: ${videoInfo.description}\n` +
                  `الرابط: ${videoInfo.url}\n` +
                  `المدة: ${videoInfo.duration}\n` +
                  `المشاهدات: ${videoInfo.views}`,
            footer: "©2020", // العلامة التجارية
            buttons: [
                {
                    buttonId: `.ytmp3 ${videoInfo.url}`,
                    buttonText: { displayText: "AUDIO 🎧" }
                },
                {
                    buttonId: `${videoInfo.url}`,
                    buttonText: { displayText: "VIDEO 🎥" }
                }
            ],
            headerType: 1, // استخدام النص كعنوان
            viewOnce: true // عرض مرة واحدة
        };

        // إرسال الصورة مع الرسالة
        await conn.sendMessage(m.chat, {
            image: { url: 'https://qu.ax/hvhcP.jpg' },
            caption: message.text,
            footer: message.footer,
            buttons: message.buttons,
            headerType: message.headerType,
            viewOnce: message.viewOnce
        }, { quoted: m });

    } else {
        // إرسال رسالة إذا لم يتم العثور على فيديو
        await conn.sendMessage(m.chat, { text: "لم يتم العثور على نتائج." }, { quoted: m });
    }
};

// دالة لاستخراج معلومات الفيديو الأول
async function getFirstVideoInfo(query) {
    try {
        const searchResults = await yts(query);
        const firstVideo = searchResults.videos[0];

        if (firstVideo) {
            return {
                title: firstVideo.title,
                description: firstVideo.description,
                url: firstVideo.url,
                duration: firstVideo.timestamp,
                views: firstVideo.views
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('حدث خطأ:', error);
        return null;
    }
}

// تحديد الأوامر التي ستشغل هذا المعالج
handler.command = /^play$/i;
export default handler;

// إنشاء اتصال باستخدام مكتبة Baileys
export async function start() {
    const conn = makeWASocket();
    conn.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m.message) return;

        const args = m.body ? m.body.split(' ') : [];
        const command = args.shift().toLowerCase();
        const text = args.join(' ');

        // استدعاء المعالج إذا تطابق الأمر
        if (handler.command.test(command)) {
            try {
                await handler(m, { text, conn, args, command, usedPrefix: '!' });
            } catch (error) {
                console.error('خطأ أثناء معالجة الرسالة:', error);
            }
        }
    });
}

// تشغيل البوت
start();
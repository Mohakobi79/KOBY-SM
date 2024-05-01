import ytdl from 'ytdl-core';
import yts from 'yt-search';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import os from 'os';
import axios from 'axios';

const streamPipeline = promisify(pipeline);
 
let handler = async (m, { conn, command, text, usedPrefix }) => {
await conn.sendMessage(m.chat, { react: { text: '🎧', key: m.key }}) ;
if (!text) throw `> *🎧خاص بتنزيل📥 المقاطع الصوتية💡*`;
  await m.reply(`> *_👻loading👻_*`)
//await m.react(rwait);

try {
// Encode the query for the API request
const query = encodeURIComponent(text);

// Make a GET request to the API
const response = await axios.get(`https://weeb-api.vercel.app/ytsearch?query=${query}`);
const result = response.data[0]; // Get the first result

if (!result) throw 'Video Not Found, Try Another Title';

// Extract video information from the API response
const { title, thumbnail, timestamp, views, ago, url } = result;

// Create a message caption with video information
const captvid = `> 👻✼ ••๑⋯ ❀ Y O U T U B E ❀ ⋯⋅๑•• ✼👻
> ❏ *العنوان:* ${title}❇
> ❐ *المدة:* ${timestamp}⏳
> ❑ *المشاهدات:* ${views}🧿
> ❒ *تاريخ النشر:* ${ago}⏱
> ❒ *الرابط:* ${url} 🔗
> *⊱─KOBY━━⊱༻●༺⊰BOT━─⊰*`;

// Send the video information along with the thumbnail to the Discord channel
conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: captvid, footer: author }, { quoted: m });

// Download and send the audio of the video
const audioStream = ytdl(url, {
filter: 'audioonly',
quality: 'highestaudio',
});

// Get the path to the system's temporary directory
const tmpDir = os.tmpdir();

// Create a writable stream in the temporary directory
const writableStream = fs.createWriteStream(`${tmpDir}/${title}.mp3`);

// Start the download
await streamPipeline(audioStream, writableStream);

// Prepare the message document with audio file and metadata
const doc = {
audio: {
url: `${tmpDir}/${title}.mp3`
},
mimetype: 'audio/mp4',
ptt: true,
waveform: [100, 0, 0, 0, 0, 0, 100],
fileName: `${title}`,
contextInfo: {
externalAdReply: {
showAdAttribution: true,
mediaType: 2,
mediaUrl: url,
title: title,
body: '👻KOBY-BOT👻',
sourceUrl: url,
thumbnail: await (await conn.getFile(thumbnail)).data
}
}
};

// Send the audio message to the Discord channel
await conn.sendMessage(m.chat, doc, { quoted: m });

// Delete the downloaded audio file
fs.unlink(`${tmpDir}/${title}.mp3`, (err) => {
if (err) {
console.error(`Failed to delete audio file: ${err}`);
} else {
console.log(`Deleted audio file: ${tmpDir}/${title}.mp3`);
}
});
} catch (error) {
console.error(error);
throw 'An error occurred while searching for YouTube videos.';
}
};

handler.help = ['play'].map((v) => v + ' <query>');
handler.tags = ['downloader'];
handler.command = /play$/i;

handler.exp = 0;

export default handler;

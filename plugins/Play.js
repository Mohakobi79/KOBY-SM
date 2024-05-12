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
const BixbyChar = (str) => {
return str.split('').map(char => {
switch (char) {
case 'A': return '𝐀';
case 'B': return '𝐁';
case 'C': return '𝐂';
case 'D': return '𝐃';
case 'E': return '𝐄';
case 'F': return '𝐅';
case 'G': return '𝐆';
case 'H': return '𝐇';
case 'I': return '𝐈';
case 'J': return '𝐉';
case 'K': return '𝐊';
case 'L': return '𝐋';
case 'M': return '𝐌';
case 'N': return '𝐍';
case 'O': return '𝐎';
case 'P': return '𝐏';
case 'Q': return '𝐐';
case 'R': return '𝐑';
case 'S': return '𝐒';
case 'T': return '𝐓';
case 'U': return '𝐔';
case 'V': return '𝐕';
case 'W': return '𝐖';
case 'X': return '𝐗';
case 'Y': return '𝐘';
case 'Z': return '𝐙';
case 'a': return '𝐚';
case 'b': return '𝐛';
case 'c': return '𝐜';
case 'd': return '𝐝';
case 'e': return '𝐞';
case 'f': return '𝐟';
case 'g': return '𝐠';
case 'h': return '𝐡';
case 'i': return '𝐢';
case 'j': return '𝐣';
case 'k': return '𝐤';
case 'l': return '𝐥';
case 'm': return '𝐦';
case 'n': return '𝐧';
case 'o': return '𝐨';
case 'p': return '𝐩';
case 'q': return '𝐪';
case 'r': return '𝐫';
case 's': return '𝐬';
case 't': return '𝐭';
case 'u': return '𝐮';
case 'v': return '𝐯';
case 'w': return '𝐰';
case 'x': return '𝐱';
case 'y': return '𝐲';
case 'z': return '𝐳';
default: return char;
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
        const formattedText = BixbyChar(`> 👻✼ ••๑⋯ ❀ Y O U T U B E ❀ ⋯⋅๑•• ✼👻
> ❏ *titre:* ${title}❇
> ❐ *time:* ${timestamp}⏳
> ❑ *views:* ${views}🧿
> ❒ *date:* ${ago}⏱
> ❒ *url:* ${url} 🔗
> *⊱─KOBY━━⊱༻●༺⊰BOT━─⊰*`);

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

handler.help = ['play2'].map((v) => v + ' <query>');
handler.tags = ['downloader'];
handler.command = /play2$/i;

handler.exp = 0;

export default handler;

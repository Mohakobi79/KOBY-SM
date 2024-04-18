
import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, args, command, text }) => {
if (!text) throw 'You need to give the URL of Any Instagram video, post, reel, image';
m.reply(wait);

if (!text.includes('instagram.com')) throw 'Invalid Instagram video URL';

let res;
try {
res = await fetch(`${gurubot}/igdlv1?url=${text}`);
} catch (error) {
throw `An error occurred: ${error.message}`;
}

let api_response = await res.json();
if (!api_response || !api_response.data) {
throw `No video or image found or Invalid response from API.`;
}

const mediaArray = api_response.data;
for (const mediaData of mediaArray) {
const mediaType = mediaData.type;
const mediaURL = mediaData.url_download;
let cap = `HERE IS THE ${mediaType.toUpperCase()} >,<`;

if (['video', 'mp4'].includes(mediaType)) {
conn.sendFile(m.chat, mediaURL, 'instagram.mp4', cap, m);
} else if (['image', 'jpg', 'jpeg', 'png'].includes(mediaType)) {
conn.sendFile(m.chat, mediaURL, 'instagram.jpg', cap, m);
}
}
};

handler.help = ['instagram'];
handler.tags = ['downloader'];
export default handler;

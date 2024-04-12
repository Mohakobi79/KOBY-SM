import fetch from "node-fetch";
let handler = async (m, { text, usedPrefix, command }) => {
	if (!text) throw `Hay adakah yang bisa saya bantu??`;
	await m.reply("Searching...");
	let putra = await fetch(`https://aemt.me/bard?text=${text}`);
	let hasil = await putra.json();
	let txt = `${hasil.result}`.trim();
	conn.sendMessage(m.chat, {
		text: txt,
		contextInfo: {
			externalAdReply: {
				title: `Bard Google Ai`,
				body: wm,
				thumbnailUrl: "https://telegra.ph/file/3d3535f2ea5f0f2034fff.jpg",
				sourceUrl: "https:/bard.google.com",
				mediaType: 1,
				renderLargerThumbnail: true,
			},
		},
	});
};
handler.help = ["bardgoogle *ᴛᴇxᴛ*"];
handler.tags = ["ai"];
handler.command = /^(bard)$/i;
export default handler;

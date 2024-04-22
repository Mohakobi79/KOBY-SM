import fetch from "node-fetch";
let handler = async (m, { text, usedPrefix, command }) => {
	if (!text) throw `*_✅مرحبا✌🏻، كيف يمكنني مساعدتك_*`;
	await m.reply("*_Searching🔎..._*");
	let putra = await fetch(`https://aemt.me/bard?text=${text}`);
	let hasil = await putra.json();
	let txt = `${hasil.result}`.trim();
	conn.sendMessage(m.chat, {
		text: txt,
		contextInfo: {
			externalAdReply: {
				title: `👻KOBY-BOT-MD👻`,
				body: wm,
				thumbnailUrl: "",
				sourceUrl: "https:/bard.google.com",
				mediaType: 1,
				renderLargerThumbnail: true,
			},
		},
	});
};
handler.help = ["bardgoogle *ᴛᴇxᴛ*"];
handler.tags = ["ai"];
handler.command = /^(b)$/i;
export default handler;

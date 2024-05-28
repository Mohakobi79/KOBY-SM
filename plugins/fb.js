import { facebookdl, facebookdlv2 } from '@bochilteam/scraper'
let handler = async (m, { conn, args, usedPrefix, command }) => {
if (!args[0]) throw `> خاص بالتنزيل بالفيسبوك ،مثال.fb وضع الرابط 🔗`
const { result } = await facebookdl(args[0]).catch(async _ => await facebookdlv2(args[0]))
for (const { url, isVideo } of result.reverse()) conn.sendFile(m.chat, url, `facebook.${!isVideo ? 'bin' : 'mp4'}`, 
`> Téléchargé📥 avec ↔️ succès ✅`, m)
}
handler.help = ['fb0'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^((facebook0|fb0)(downloder|dl)?)$/i
export default handler
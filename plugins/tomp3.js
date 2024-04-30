import { toAudio } from '../lib/converter.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
   /* let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
    if (!/video|audio/.test(mime)) throw `✳️ Reply to the video or voice note you want to convert to mp3 with the command :\n\n*${usedPrefix + command}*`*/
await conn.sendMessage(m.chat, { react: { text: '🎤', key: m.key }}) ;

await m.reply(wait);
    let media = await q.download?.()
    if (!media) throw '❎ Failed to download media'
    let audio = await toAudio(media, 'mp4')
    if (!audio.data) throw '❎ Error converting'
    conn.sendFile(m.chat, audio.data, 'audio.mp3', '', m, null, { mimetype: 'audio/mp4' })
}
handler.help = ['tomp3']
handler.tags = ['download']
handler.command = /^to(mp3|a(udio)?)$/i

export default handler
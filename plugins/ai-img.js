import fetch from 'node-fetch'
var handler = async (m, { text,  usedPrefix, command }) => {
if (!text) throw `🍃 *Ingres Una Petición*\n- Ejemplo: !bard conoces a yotsuba?`
try {
await m.reply('🌺 *C A R G A N D O*\n- 🍃 Cargando Información')
conn.sendPresenceUpdate('composing', m.chat);
var apii = await fetch(`https://aemt.me/gemini?text=${text}`)
var res = await apii.json()
await m.reply(res.result)
} catch (e) {
await conn.reply(m.chat, `*🍃 Ocurrió Un Error Inesperado*`, m)
console.log(`🍁 *Ocurrió Un Error*`)
console.log(e)
};
handler.command = ['ge']
handler.help = ['ge']
handler.tags = ['ai']

handler.premium = false

export default handler
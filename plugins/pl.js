import yts from 'yt-search'
let handler = async (m, { conn, command, text, usedPrefix }) => {

        if (!text) throw `> ✅ online`
        let res = await yts(text)
        let vid = res.videos[0]
    
handler.help = ['play']
handler.tags = ['dl']
handler.command = ['o']

export default handler
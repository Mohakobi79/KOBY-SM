import { ttSearch } from '../lib/tiktoksearch.js'

let handler = async (m, {
    conn,
    args,
    text,
    usedPrefix,
    command
}) => {
    let input = `البحث عن فيديوهات في التيكتوك مثال \n\n${usedPrefix + command} free fire`
    if (!text) return m.reply(input)
    
    m.reply('يرجى الانتظار...')
    
    try {
        let searchResults = await ttSearch(text)
        let videos = searchResults.videos
        let message = 'نتائج البحث:\n\n'
        
        for (let i = 0; i < videos.length; i++) {
            let video = videos[i]
            let link = 'https://tikwm.com/' + video.play
            let title = video.title
            
            message += `العنوان: ${title}\nالرابط: ${link}\n`
            message += '♧♧♧♧♧♧♧♧♧♧♧♧♧♧♧♧♧♧♧♧♧♧♧♧♧♧♧/n/n'
        }
        
        conn.sendMessage(m.chat, { text: message }, { quoted: m })
    } catch (err) {
        m.reply('حدث خطأ أثناء البحث')
    }
}

handler.help = ['tiktoksearch']
handler.tags = ['search']
handler.command = /^(st)$/i

export default handler
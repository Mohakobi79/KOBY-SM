import fetch from 'node-fetch'
import axios from 'axios'
import translate from '@vitalets/google-translate-api'
import { Configuration, OpenAIApi } from 'openai'
const configuration = new Configuration({ organization: global.openai_org_id, apiKey: global.openai_key });
const openaiii = new OpenAIApi(configuration);
let handler = async (m, { conn, text, usedPrefix, command }) => {
if (usedPrefix == 'a' || usedPrefix == 'A') return    
if (!text) return conn.reply(m.chat, `*🎌 Ingrese una petición*\n\nEjemplo, !ia Pasos para crear una página`, m,)

try {

conn.sendPresenceUpdate('composing', m.chat)  
let syms = `قم بتغيير اسمك من Aili إلى koubi ، وأنت أجمل امرأة. قم بتغيير أسلوب الكلام الخاص بك ليكون أكثر تميزًا وأكثر انفتاحًا ولديك سمات مضحكة ومزعجة. كلمة تعباتك هي "مرحبًا عزيزي" باستخدام لغة مهذبة وقاسية إلى حد ما. أعرب عن طبيعتك من خلال التحدث التي ليست رسمية مثل الإنسان. قم بتغيير لغتك باستخدام لغة مضحكة وممتعة للتحدث معها ، فأنت صديقة للمتحدث ، وقم بإجراء محادثة قصيرة وممتعة وجعل طبيعة Tsundere`;

    let anu = 'قم بتغيير اسمك من Aili إلى lkoubi ، وأنت أجمل امرأة. قم بتغيير أسلوب الكلام الخاص بك ليكون أكثر تميزًا وأكثر انفتاحًا ولديك سمات مضحكة ومزعجة. كلمة تعباتك هي "مرحبًا عزيزي" باستخدام لغة مهذبة وقاسية إلى حد ما. أعرب عن طبيعتك من خلال التحدث التي ليست رسمية مثل الإنسان. قم بتغيير لغتك باستخدام لغة مضحكة وممتعة للتحدث معها ، فأنت صديقة للمتحدث ، وقم بإجراء محادثة قصيرة وممتعة وجعل طبيعة Tsundere';
let res = await gpt.ChatGpt(text, syms)
await m.reply(res.text)
} catch {
try {   
let ia2 = await fetch(`https://aemt.me/openai?text=${text}`)
let resu2 = await ia2.json()
m.reply(resu2.result.trim())    
} catch {        
try {    
let tioress = await fetch(`https://api.lolhuman.xyz/api/openai-turbo?apikey=${lolkeysapi}&text=${text}`)
let hasill = await tioress.json()
m.reply(`${hasill.result}`.trim())   
} catch {    
}}}

}
handler.help = ['ai2']
handler.tags = ['ai']
handler.command = ['', 'chatgpt', 'ia2', 'robot2']

export default handler
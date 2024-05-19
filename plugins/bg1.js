import BingImageCreator from '../lib/bingimg';
import fetch from 'node-fetch';

const handler = async ({ conn, args, usedPrefix, command, m }) => {
  let text;
  if (args.length >= 1) {
    text = args.join(" ");
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text;
  } else {
    throw '🚩 example: .bingimg cat';
  }

  await m.reply('> wait please ....');

  try {
    const res = new BingImageCreator({
      cookie: "16mEqzcGREa_j97cW0t4HnajoU6Hk5xqLhOD8pNpLkpgoiJ-mc8NkZjnSUTiG8Sor2iMk-RcHSkEVEh0N0zzVdY3nQilmXbjRqqsj_GXfxZwCgFSCeIbFIPa5CrbKeCSTrL4JdH7J4sAIACTciDwk65ojE6lNt2kaF0-YNHLz7cxrEii7Kc0OWJw2YZf1IVVzHo9yX-TaF0rH3te4O431Cg"
    });

    const data = await res.createImage(text);
    const filteredData = data.filter(file => !file.endsWith('.svg'));
    const totalCount = filteredData.length;

    if (totalCount > 0) {
      for (let i = 0; i < totalCount; i++) {
        try {
          await conn.sendFile(m.chat, filteredData[i], '', `Image *(${i + 1}/${totalCount})*`, m, false, { mentions: [m.sender] });
        } catch (error) {
          console.error(`🚩 Error sending file: ${error.message}`);
          await m.reply(`🚩 Failed to send image *(${i + 1}/${totalCount})*`);
        }
      }
    } else {
      await m.reply('No images found after filtering.');
    }
  } catch (error) {
    try {
      const data = await AemtBingImg(text);
      try {
        await conn.sendFile(m.chat, data.result, '', `Image`, m, false, { mentions: [m.sender] });
      } catch (error) {
        console.error(`🚩 Error sending file: ${error.message}`);
        await m.reply(`🚩 Failed to send image`);
      }
    } catch (error) {
      console.error(`🚩 Error in handler: ${error.message}`);
      await m.reply('🚩 An error occurred while processing the request.');
    }
  }
};

handler.help = ["bg"];
handler.tags = ["ai"];
handler.command = /^(bg)$/i;

export default handler;

function AemtBingImg(query) {
  return fetch(`https://aemt.me/bingimg?text=${query}`, {
    method: "get",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  })
  .then(response => response.json());
}
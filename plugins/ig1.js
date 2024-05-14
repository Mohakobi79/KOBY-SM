import fetch from 'node-fetch';

const apiURL = 'https://delirius-api-oficial.vercel.app/api/instagram';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0] || !args[0].match(/instagram\.com/i)) 
    throw `> خاص بالتنزيل من الأنسغرام، أعطيني الرابط 🔗`;

  const url = args[0].trim();
  const apiUrl = `${apiURL}?url=${encodeURIComponent(url)}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    console.error('Error al buscar el contenido de Instagram:', response.statusText);
    throw 'Ocurrió un error al buscar el contenido de Instagram';
  }

  const data = await response.json();
  const mediaData = data.data;

  if (!mediaData || mediaData.length === 0) 
    throw 'No se encontraron datos válidos de la publicación de Instagram';

  for (const media of mediaData) {
    if (!media.url) continue;

    const mediaResponse = await fetch(media.url);
    if (!mediaResponse.ok) {
      console.error('Error al descargar el contenido de Instagram:', mediaResponse.statusText);
      throw 'Ocurrió un error al descargar el contenido de Instagram';
    }

    const mediaBuffer = await mediaResponse.buffer();

    const caption = `> هاذا هو رابط للفيديو 🔗 \n${url}`;

    conn.sendFile(
      m.chat,
      mediaBuffer,
      'video.mp4',
      caption,
      m
    );
  }
};

handler.help = ['instagram <enlace>'];
handler.tags = ['downloader'];
handler.command = ['instagram1', 'ig1'];
handler.register = false;
function isUrl(url){
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

export default handler;
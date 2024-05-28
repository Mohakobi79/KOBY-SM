import fetch from 'node-fetch';

const apiURL = 'https://delirius-api-oficial.vercel.app/api/instagram';
export async function before(m) {
    if (!m.text || !m.text.match(/instagram\.com/i)) return false;

    const url = m.text.match(/(https?:\/\/[^\s]+)/)?.[0];
    const apiUrl = `${apiURL}?url=${encodeURIComponent(url)}`;
m.reply(wait);
    try {
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

            const caption = `> هاذا هو  للفيديو 🔗`;

            await this.sendFile(
                m.chat,
                mediaBuffer,
                'video.mp4',
                caption,
                m
            );
        }
    } catch (error) {
        await m.reply(error);
    }
}

export const disabled = false;

const axios = require('axios');
const fs = require('fs');

const handle = async (url) => {
  // استخراج معلومات الفيديو من YouTube
  const response = await axios.get(`https://www.youtube.com/get_video_info?video_id=${url}`);
  const videoInfo = parseQueryParameters(response.data);

  // تحديد أفضل تنسيق للفيديو
  const bestFormat = videoInfo.formats[0];

  // تنزيل الفيديو
  const videoStream = await axios.get(bestFormat.url, { responseType: 'stream' });
  const videoPath = `${videoInfo.title}.${bestFormat.extension}`;
  const writeStream = fs.createWriteStream(videoPath);
  videoStream.data.pipe(writeStream);

  // انتظار اكتمال عملية التنزيل
  await new Promise((resolve, reject) => {
    videoStream.on('end', resolve);
    videoStream.on('error', reject);
  });

  console.log(`تم تنزيل الفيديو بنجاح: ${videoPath}`);
};

// دالة لفك تشفير معلمات الاستعلام
function parseQueryParameters(queryString) {
  const params = {};
  const pairs = queryString.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  }
  return params;
}

// تشغيل البرنامج
const url = 'https://www.youtube.com/watch?v=VIDEO_ID'; // استبدل VIDEO_ID بمعرف الفيديو
handle(url);
```

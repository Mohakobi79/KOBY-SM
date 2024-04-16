const axios = require('axios');
const fs = require('fs');
const ytdl = require('ytdl-core');

// دالة لتنزيل مقطع فيديو من YouTube
async function downloadVideo(videoURL, filePath) {
  // الحصول على معلومات الفيديو
  const videoInfo = await ytdl.getInfo(videoURL);

  // تحديد أفضل دقة متاحة
  const bestFormat = videoInfo.formats.find((format) => format.container === 'mp4' && format.progressive === true);

  // إنشاء مسار الملف
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }

  const fileName = `${videoInfo.video_id}.mp4`;
  const fileFullPath = `${filePath}/${fileName}`;

  // تنزيل الفيديو
  const response = await axios.get(bestFormat.url, { responseType: 'stream' });
  const writer = fs.createWriteStream(fileFullPath);

  response.data.pipe(writer);

  // الانتظار حتى اكتمال التنزيل
  await new Promise((resolve, reject) => {
    writer.on('error', reject);
    writer.on('finish', resolve);
  });

  console.log(`تم تنزيل الفيديو بنجاح: ${fileName}`);
}

// دالة معالجة طلب تنزيل الفيديو
async function handleDownloadRequest(videoURL, filePath) {
  try {
    await downloadVideo(videoURL, filePath);
  } catch (error) {
    console.error(`خطأ أثناء تنزيل الفيديو: ${error.message}`);
  }
}

// تشغيل المعالج
handleDownloadRequest('https://www.youtube.com/watch?v=VIDEO_ID', './videos');

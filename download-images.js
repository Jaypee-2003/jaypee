const https = require('https');
const fs = require('fs');

const images = {
  'profile.jpg': 'https://picsum.photos/400/400',
  'khojpandit.jpg': 'https://picsum.photos/800/600',
  'cleandirty.jpg': 'https://picsum.photos/800/600?random=1',
  'portfolio.jpg': 'https://picsum.photos/800/600?random=2'
};

Object.entries(images).forEach(([filename, url]) => {
  https.get(url, (response) => {
    const fileStream = fs.createWriteStream(`public/images/${filename}`);
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      console.log(`Downloaded ${filename}`);
      fileStream.close();
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${filename}:`, err.message);
  });
}); 
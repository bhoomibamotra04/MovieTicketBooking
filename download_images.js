
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const seedFile = path.join(__dirname, 'backend', 'seed.js');
let seedContent = fs.readFileSync(seedFile, 'utf-8');

const regex = /posterUrl:\s*'([^']+)'/g;
let match;
const urls = [];

while ((match = regex.exec(seedContent)) !== null) {
  urls.push(match[1]);
}

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

(async () => {
  for (const url of urls) {
    if (url.includes('tmdb.org')) {
      const filename = url.split('/').pop();
      const dest = path.join(__dirname, 'frontend', 'public', 'images', filename);
      console.log('Downloading ' + filename);
      try {
        await download(url, dest);
        seedContent = seedContent.replace(url, '/images/' + filename);
      } catch (err) {
        console.error('Failed to download ' + url, err);
      }
    }
  }
  fs.writeFileSync(seedFile, seedContent);
  console.log('Done!');
})();


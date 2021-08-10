// run `node app.js` in the terminal

const http = require('http');
const URL = require('url').URL;
const fs = require('fs');
const path = require('path');
const port = process.argv[2] || 3000;

http
  .createServer((req, res) => {
    if (req.url == '/') req.url = '/QuintOS_live.html';
    console.log(`${req.method} '${req.url}'`);

    let url = `.${req.url}`;
    // based on the URL path, extract the file extention. e.g. .js, .doc, ...
    const ext = path.parse(url).ext;
    // maps file extention to MIME typere
    const map = {
      '.ico': 'image/x-icon',
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.wav': 'audio/wav',
      '.mp3': 'audio/mpeg',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.ttf': 'font/ttf',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2'
    };

    fs.access(url, function(err) {
      if (err) {
        // if the file is not found, return 404
        res.statusCode = 404;
        res.end(`File ${url} not found!`);
        return;
      }

      // if is a directory search for index file matching the extention
      if (fs.statSync(url).isDirectory()) url += '/index' + ext;

      // read file from file system
      fs.readFile(url, function(err, data) {
        if (err) {
          res.statusCode = 500;
          res.end(`Error getting the file: ${err}.`);
        } else {
          // if the file is found, set Content-type and send data
          res.setHeader('Content-type', map[ext] || 'text/plain');
          res.end(data);
        }
      });
    });
  })
  .listen(parseInt(port));

console.log(`Server listening on port ${port}`);

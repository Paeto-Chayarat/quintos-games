// run `node app.js` in the terminal

const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.argv[2] || 8080;

let server = http.createServer((req, res) => {
	if (req.url == '/') req.url = '/QuintOS_live.html';
	let url = `.${req.url}`.split('?')[0];
	console.log(`${req.method} '${url}'`);

	// based on the URL path, extract the file extention.
	const ext = path.parse(url).ext;
	// maps file extention to MIME type
	const MIME = {
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

	let fileExists;
	try {
		fileExists = fs.statSync(url).isFile();
	} catch (error) {}

	if (!fileExists) {
		// if the file is not found, return 404
		res.statusCode = 404;
		res.end(`File ${url} not found!`);
		return;
	}

	// read file from file system
	let data;
	try {
		data = fs.readFileSync(url);
	} catch (err) {
		res.statusCode = 500;
		res.end(`Error getting the file: ${err}.`);
		return;
	}

	// if the file is found, set Content-Type and send data
	res.setHeader('Content-Type', MIME[ext] || 'text/plain');
	res.end(data);
});

server.listen(parseInt(port));

console.log(`Server listening on port: ${port}`);

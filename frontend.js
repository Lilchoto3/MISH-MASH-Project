/*
 *	This is the main frontend file for MISH/MASH, it'll be what you see when you load your webpage, as of right now,
 *	it runs only to localhost (127.0.0.1) on port 1337 (teehee), this will change when it finally goes live for testing.
 *	this will receive data of the user's links and store them in the backend file (tbd, also oh god I hope it doesn't
 *	get too big). The page will get prettier as time goes on, but expect plain text for a while. 
*/
var http = require('http');	//requires
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');

var server = http.createServer(function (req, res) {	//create server
	if (req.method.toLowerCase() === 'get') {			//init get
		displayForm(res);
	} else if (req.method.toLowerCase() === 'post') {	//submitted post
		processForm(req, res);
	}
});

function displayForm(res) {
	fs.readFile('frontend.html', function (err, data) {
		res.writeHead(200, {
			'Content-Type': 'text/html',
				'Content-Length': data.length
		});
		res.write(data);
		res.end();
	});
}

function processForm(req, res) {
	var form = new formidable.IncomingForm();
	
	form.parse(req, function (err, fields, files) {
		//store data somehows
		res.writeHead(200, {
			'content-type': 'text/plain'
		});
		res.write('shortened link available on port 1334\n\n');	//this will print the shortened link in final ver
		res.end(util.inspect({
			fields: fields,
			files: files
		}));
	});
}

server.listen(1337);
console.log('Server running at http://127.0.0.1:1337/');
/*
 *	This is the main frontend file for MISH/MASH, it'll be what you see when you load your webpage, as of right now,
 *	it runs only to localhost (127.0.0.1) on port 1337 (teehee), this will change when it finally goes live for testing.
 *	this will receive data of the user's links and store them in the backend file (tbd, also oh god I hope it doesn't
 *	get too big). The page will get prettier as time goes on, but expect plain text for a while. 
*/
var http = require('http');	//i dunno
var fs = require('fs');
var server = http.createServer(function (req, res) {
	displayForm(res);
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

server.listen(1337);
console.log('Server running at http://127.0.0.1:1337/');

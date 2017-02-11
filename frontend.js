/*
 *	This is the main frontend file for MISH/MASH, it'll be what you see when you load your webpage, as of right now,
 *	it runs only to localhost (127.0.0.1) on port 1337 (teehee), this will change when it finally goes live for testing.
 *	this will receive data of the user's links and spin up a new backend Object, which will have
 *	an express app running in it hosting the link (oh god I hope it doesn't get too big).
 *	The page will get prettier as time goes on, but expect plain html and text for a while. 
*/
var http = require('http');	//requires
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
var io = require('socket.io')(http);
var express = require('express');
var app = express();

/* var server = http.createServer(function (req, res) {	//create server
	if (req.method.toLowerCase() === 'get') {			//init get
		displayForm(res);
	} else if (req.method.toLowerCase() === 'post') {	//submitted post
		//processForm(req, res);
		processFields(req, res);
	}
}); */

app.set('case sensitive routing', true);

app.get ('/', function(req, res) {
	displayForm(res);
});

app.post ('/', function(req, res) {
	processFields(req, res);
});

function displayForm(res) {								//first displayed page
	fs.readFile('frontend.html', function (err, data) {
		res.writeHead(200, {
			'Content-Type': 'text/html',
				'Content-Length': data.length
		});
		res.write(data);
		res.end();
	});
}

/* function processForm(req, res) {	//not used, might remove
	var form = new formidable.IncomingForm();
	
	form.parse(req, function (err, fields, files) {
		//store data somehows
		res.writeHead(200, {
			'content-type': 'text/plain'
		});
		res.write('shortened link available on port 1334\n\n');	//this will print the shortened link in final ver
		res.end(util.inspect({
			fields: fields,		//3 links printed here
			files: files		//doesn't seem to be any files
		}));
	});
} */

function debugLog(fields) {
	for (var i=0;i<fields.length;i++) {
		console.log(i+": "+fields[i]);
	}
	console.log("length: "+fields.length);
}

//The following is the MISH object function, I'm gonna try and use this to create temp pages for MISHs that Users create.
//it's gonna use express.js to set the temp URL by running an express within an express.
//fingers crossed
function createMISH(fields) {	//create temp MISH link
	var sub = express();	//create new express
	var id = makeId();		//get a random 8 char id
	var diff = 1;			//will be user-input
	var st = new Date();						//start-time
	var et = new Date(st.getTime() + diff*60000);	//end-time
	
	console.log(id);
	
	sub.get('/', function(req, res) {	//on temp express get
		fs.readFile('temp.html', function (err, data) {
			res.set('Content-type', 'text/html');
			res.write(data);	//temp.html
			res.write('<p>This page was created at:</p>');
			res.write('<p>'+st+'</p>');
			res.write('<br>')
			res.write('<p>This page will destruct at:</p>');
			res.write('<p>'+et+'</p>');
			res.end();
		});
	});
	
	app.use('/'+id, sub);	//set sub-app to use generated url
	console.log("Begin Countdown.")
	setTimeout(function() {
		app.delete('/'+id);
		console.log("Countdown Ended.");
	},(diff*60000));
}

function makeId()	//http://stackoverflow.com/a/1349426
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@&*_-+";

    for (var i=0; i<8; i++) {
    	text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function processFields(req, res) {
	var fieldsIn = [];
    var form = new formidable.IncomingForm();
    var numLinks = 0;
    form.on('field', function (field, value) {//get field values and store them in array fields[]
        console.log(field);	//log the field name and value of the field
        console.log(value);
        fieldsIn[field] = value;
        numLinks++;
    });
    form.on('end', function () {
    	var fields = [];	//initialize fields[]
    	for (var i=0;i<numLinks;i++) {
    		fields.push(fieldsIn[i]);		//copy values
    	}
    	debugLog(fields);	//debug before cleanup
    	for (var i=0;i<numLinks;i++) {	//array fixer, will ignore blank urls and shorten fields[] if blank is encountered
    		if (fields[i]==="") {			//text boxes ask for arrays in html file, don't need to worry about
    			fields.splice(i, 1);
    		}
    	}
    	debugLog(fields);	//debug after cleanup
    	createMISH(fields);
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n'); //debug output to frontend.js
        res.end(util.inspect({
            fields: fieldsIn
        }));
    });
    form.parse(req);
}



//server.listen(1337, ["192.168.1.9"]);
app.listen(1337, ["192.168.1.9"]);
console.log('Server running at http://192.168.1.9:1337/');
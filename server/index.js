var express = require('express');
var dotenv = require('dotenv').config();
var app = express();
const fetch = require('node-fetch');
var request = require('request');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
const axios = require('axios');
const qs = require('qs')
const fs = require('fs');


var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

var authOptions = {
	url: 'https://accounts.spotify.com/api/token',
	// method: 'POST',
	headers: {
		Authorization: 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
		'Content-Type': 'application/x-www-form-urlencoded',
	},
	data: qs.stringify({
		grant_type: "client_credentials",
	}),
	// body: JSON.stringify({
	// 	grant_type: 'client_credentials'
	// }),
	//body: "grant_type=client_credentials",
	// headers: {
	// 	"Content-Type": "application/x-www-form-urlencoded",
	// 	//"Authorization": 'Basic ' + new Buffer(client_id + ':' + client_secret).toString('base64'),
	// },
	method: "post",
	//credentials: 'include'
};


axios(authOptions)
	.then(res => console.log(res))
	.catch(err => console.log(err))
// function savePopArtists(data) {
// 	if (data.length > 30 && data[10] !== null) {
// 		const pop = JSON.stringify({artists: data}, null, 2);
// 		fs.writeFile('pop.json', pop, 'utf8', function(err) {
// 			if (err) {
// 				return console.log(err);
// 			} else {
// 				console.log('succes');
// 			}
// 		});
// 	}
// }
// function saveHipHopArtists(data) {
// 	if (data.length > 30 && data[10] !== null) {
// 		const hiphop = JSON.stringify({artists: data}, null, 2);
// 		fs.writeFile('hiphop.json', hiphop, 'utf8', function(err) {
// 			if (err) {
// 				return console.log(err);
// 			} else {
// 				console.log('succes');
// 			}
// 		});
// 	} else {
// 		console.log('error');
// 	}
// }
function getAndSaveHipHopInfo() {
	request.post(authOptions, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			// use the access token to access the Spotify Web API
			const token = body.access_token;
			const options = {
				url: 'https://api.spotify.com/v1/artists?ids=' + hiphopArtists.ids,
				headers: {
					Authorization: 'Bearer ' + token,
				},
				json: true,
			};
			const url = 'https://api.spotify.com/v1/artists?ids=' + hiphopArtists.ids2;
			const options2 = {
				headers: {
					Authorization: 'Bearer ' + token,
				},
				json: true,
			};

			request.get(options, function (error, response, body) {
				//gauname artistu array [body]
				const baseUrl1 = 'https://api.spotify.com/v1/artists/';
				const baseUrl2 = '/top-tracks?country=LT';
				const genre = 'hiphop';
				const myOptions = {
					method: 'GET',
					headers: {
						Authorization: 'Bearer ' + token,
					},
					mode: 'cors',
					cache: 'default',
				};
				fetch(url, options2)
					.then(data => data.json())
					.then(art => body.artists.concat(art.artists))
					.then(allArtists => getAdditionalInfo(allArtists, baseUrl1, baseUrl2, myOptions, genre));
			});
		}
	});
}

function getAndSavePopInfo() {
	request.post(authOptions, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			// use the access token to access the Spotify Web API
			const token = body.access_token;
			const options = {
				url: 'https://api.spotify.com/v1/artists?ids=' + popArtists.ids,
				headers: {
					Authorization: 'Bearer ' + token,
				},
				json: true,
			};
			const url = 'https://api.spotify.com/v1/artists?ids=' + popArtists.ids2;
			const options2 = {
				headers: {
					Authorization: 'Bearer ' + token,
				},
				json: true,
			};

			request.get(options, function (error, response, body) {
				//gauname artistu array [body]
				const baseUrl1 = 'https://api.spotify.com/v1/artists/';
				const baseUrl2 = '/top-tracks?country=LT';
				const genre = 'pop';
				const myOptions = {
					method: 'GET',
					headers: {
						Authorization: 'Bearer ' + token,
					},
					mode: 'cors',
					cache: 'default',
				};
				fetch(url, options2)
					.then(data => data.json())
					.then(art => body.artists.concat(art.artists))
					.then(allArtists => getAdditionalInfo(allArtists, baseUrl1, baseUrl2, myOptions, genre));
			});
		}
	});
}

app.get('/', function (req, res) {
	res.send('Hello');
});
app.get('/api/hiphop', function (req, res) {
	res.json(hiphopData);
});
app.get('/api/pop', function (req, res) {
	res.json(popData);
});
app.post('/api/email/message', function (req, res) {
	const options = `
    <h1>You have recieved new mail !</h1>
    <h4>Name : ${req.body.name}</h4>
    <h4>Email : ${req.body.email}</h4>
    <p>Message : ${req.body.text}</p>
    `;

	// async..await is not allowed in global scope, must use a wrapper
	async function main() {
		// Generate test SMTP service account from ethereal.email
		// Only needed if you don't have a real mail account for testing
		//let account = await nodemailer.createTestAccount();

		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: 'lietufymail@gmail.com', // generated ethereal user
				pass: 'blozblozbloz', // generated ethereal password
			},
		});

		// setup email data with unicode symbols
		let mailOptions = {
			from: '"lietufy 👻" <lietufymail@gmail.com>', // sender address
			to: 'domasg209@gmail.com', // list of receivers
			subject: 'lietufy vartotojo pranešimas ✔', // Subject line
			text: 'Hello world?', // plain text body
			html: options, // html bodykj
		};

		// send mail with defined transport object
		let info = await transporter.sendMail(mailOptions);

		console.log('Message sent: %s', info.messageId);
		// Preview only available when sending through an Ethereal account
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	}

	main().catch(console.error);
});

app.post('/api/email/artist', function (req, res) {
	const options = `
    <h1>You have recieved new Artist !</h1>
    <h4>Artist : ${req.body.artist}</h4>
    <h4>Genre : ${req.body.genre}</h4>
    `;

	// async..await is not allowed in global scope, must use a wrapper
	async function main() {
		// Generate test SMTP service account from ethereal.email
		// Only needed if you don't have a real mail account for testing
		//let account = await nodemailer.createTestAccount();

		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: 'lietufymail@gmail.com', // generated ethereal user
				pass: 'blozblozbloz', // generated ethereal password
			},
		});

		// setup email data with unicode symbols
		let mailOptions = {
			from: '"lietufy 👻" <lietufymail@gmail.com>', // sender address
			to: 'domasg209@gmail.com', // list of receivers
			subject: 'lietufy naujas artistas ✔', // Subject line
			text: 'Hello world?', // plain text body
			html: options, // html bodykj
		};

		// send mail with defined transport object
		let info = await transporter.sendMail(mailOptions);

		console.log('Message sent: %s', info.messageId);
		// Preview only available when sending through an Ethereal account
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	}

	main().catch(console.error);
});

app.listen(process.env.PORT, function () {
	console.log('App is running on ' + process.env.PORT);
});
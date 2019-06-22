var express = require("express");
var app = express();
const fetch = require('node-fetch');
var request = require('request');
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");

const fs = require('fs');
const hiphopData = require('./hiphop.json');
const popData = require('./pop.json');

var hiphopArtists = require('./hiphop')
var popArtists = require('./pop')


var client_id = '1fe4184390044d7c832605c6faf9e5d5'; // Your client id
var client_secret = '2914928c2cc043238bde68c06a515f4c'; // Your secret

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

// TAKES ARTIST ARRAY AND PUSHES INTO IT ADDITION INFO FOR EVERY ARTIST
async function getAdditionalInfo(artistsArray, baseUrl1, baseUrl2, myOptions, genre){
    // console.log(artistsArray)
    // const pArray = artistsArray.artists.map(async artist =>{ on the old version
        const pArray = artistsArray.map(async artist=>{
        // console.log(artist)
        const response = await fetch(baseUrl1+artist.id+baseUrl2, myOptions);
        return response.json()
    })
    const  additionalInfo = await Promise.all(pArray);
    var i = 0
    
    // artistsArray.artists.forEach(function(artist){ old version
        artistsArray.forEach(function(artist){
            console.log(artist)
            if(additionalInfo[i].tracks.length>2){
                const smallImg1 = additionalInfo[i].tracks[0].album.images.length-1;
                const smallImg2 = additionalInfo[i].tracks[1].album.images.length-1;
                const smallImg3 = additionalInfo[i].tracks[2].album.images.length-1;
                //for(var f=0; f<3; f++){
                    artist.popularSong = [additionalInfo[i].tracks[0].name,additionalInfo[i].tracks[1].name,additionalInfo[i].tracks[2].name]
                    artist.albumLink = [additionalInfo[i].tracks[0].album.external_urls.spotify,additionalInfo[i].tracks[1].album.external_urls.spotify,additionalInfo[i].tracks[2].album.external_urls.spotify];
                    artist.releaseDate = [additionalInfo[i].tracks[0].album.release_date,additionalInfo[i].tracks[1].album.release_date,additionalInfo[i].tracks[2].album.release_date];
                    artist.previewSong = [additionalInfo[i].tracks[0].preview_url,additionalInfo[i].tracks[1].preview_url,additionalInfo[i].tracks[2].preview_url];
                    artist.popularityOfSong = [additionalInfo[i].tracks[0].popularity,additionalInfo[i].tracks[1].popularity,additionalInfo[i].tracks[2].popularity];
                    artist.albumImage = [additionalInfo[i].tracks[0].album.images[smallImg1],additionalInfo[i].tracks[1].album.images[smallImg2],additionalInfo[i].tracks[2].album.images[smallImg3]];
                    artist.albumName = [additionalInfo[i].tracks[0].album.name,additionalInfo[i].tracks[1].album.name,additionalInfo[i].tracks[2].album.name]
                    artist.albumType = [additionalInfo[i].tracks[0].album.album_type,additionalInfo[i].tracks[1].album.album_type,additionalInfo[i].tracks[2].album.album_type]
                //}
            }else{
                const smallImg = additionalInfo[i].tracks[0].album.images.length-1;
            artist.popularSong = [additionalInfo[i].tracks[0].name]
            artist.albumLink = [additionalInfo[i].tracks[0].album.external_urls.spotify];
            artist.releaseDate = [additionalInfo[i].tracks[0].album.release_date];
            artist.previewSong = [additionalInfo[i].tracks[0].preview_url];
            artist.popularityOfSong = [additionalInfo[i].tracks[0].popularity];
            artist.albumImage = [additionalInfo[i].tracks[0].album.images[smallImg]];
            artist.albumName = [additionalInfo[i].tracks[0].album.name]
            artist.albumType = [additionalInfo[i].tracks[0].album.album_type]
            }
            return i++;
        })
    // return res.send(artistsArray)  NOT TEST
    if(genre === 'hiphop'){
        return saveHipHopArtists(artistsArray);         
    }
    else if(genre === 'pop'){
        return savePopArtists(artistsArray);
    }
  
}
function savePopArtists(data){
    if(data.length > 30 && data[10] !== null){  
        const pop = JSON.stringify({artists: data}, null, 2);
        fs.writeFile('pop.json', pop, 'utf8', function(err){
            if(err){
                return console.log(err)
            } else{
                console.log('succes');
            }
        });
    }
}
function saveHipHopArtists(data){
    if(data.length > 30 && data[10] !== null){
        const hiphop = JSON.stringify({artists: data}, null, 2);
        fs.writeFile('hiphop.json', hiphop, 'utf8', function(err){
            if(err){
                return console.log(err)
            } else{
                console.log('succes');
            }
        });
    } else{
        console.log('error')
    }
}
function getAndSaveHipHopInfo(){
    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            // use the access token to access the Spotify Web API
            const token = body.access_token;
            const options = {
              url: 'https://api.spotify.com/v1/artists?ids='+hiphopArtists.ids,
              headers: {
                'Authorization': 'Bearer ' + token
              },
              json: true
            };
            const url= 'https://api.spotify.com/v1/artists?ids='+hiphopArtists.ids2;
            const options2 = {
              
              headers: {
                'Authorization': 'Bearer ' + token
              },
              json: true
            };
            
            
            request.get(options, function(error, response, body) { //gauname artistu array [body]
                    const baseUrl1 = 'https://api.spotify.com/v1/artists/';
                    const baseUrl2 = '/top-tracks?country=LT';
                    const genre = 'hiphop';
                    const myOptions = {
                        method: 'GET',
                        headers : {
                                'Authorization': 'Bearer '+token
                                },
                        mode: 'cors',
                        cache: 'default'}
                fetch(url, options2)
                    .then((data)=>data.json())
                    .then((art)=>body.artists.concat(art.artists))
                    .then((allArtists)=>getAdditionalInfo(allArtists, baseUrl1, baseUrl2, myOptions, genre))
            });
        }
    });
}
function getAndSavePopInfo(){
    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            // use the access token to access the Spotify Web API
            const token = body.access_token;
            const options = {
              url: 'https://api.spotify.com/v1/artists?ids='+popArtists.ids,
              headers: {
                'Authorization': 'Bearer ' + token
              },
              json: true
            };
            const url= 'https://api.spotify.com/v1/artists?ids='+popArtists.ids2;
            const options2 = {
              
              headers: {
                'Authorization': 'Bearer ' + token
              },
              json: true
            };
            
            
            request.get(options, function(error, response, body) { //gauname artistu array [body]
                    const baseUrl1 = 'https://api.spotify.com/v1/artists/';
                    const baseUrl2 = '/top-tracks?country=LT';
                    const genre = 'pop';
                    const myOptions = {
                        method: 'GET',
                        headers : {
                                'Authorization': 'Bearer '+token
                                },
                        mode: 'cors',
                        cache: 'default'}
                fetch(url, options2)
                    .then((data)=>data.json())
                    .then((art)=>body.artists.concat(art.artists))
                    .then((allArtists)=>getAdditionalInfo(allArtists, baseUrl1, baseUrl2, myOptions, genre))
            });
        }
    });
}


//DATA GETTING AND SAVING ENGINE
    getAndSaveHipHopInfo();
    
    setTimeout(function(){
        getAndSavePopInfo();
    }, 10000)
    



// app.get('/api/test', function(req, res){
//     request.post(authOptions, function(error, response, body) {
//         if (!error && response.statusCode === 200) {
//             // use the access token to access the Spotify Web API
//             const token = body.access_token;
//             const options = {
//               url: 'https://api.spotify.com/v1/artists?ids='+hiphopArtists.ids,
//               headers: {
//                 'Authorization': 'Bearer ' + token
//               },
//               json: true
//             };
//             const url= 'https://api.spotify.com/v1/artists?ids='+hiphopArtists.ids2;
//             const options2 = {
              
//               headers: {
//                 'Authorization': 'Bearer ' + token
//               },
//               json: true
//             };
            
            
//             request.get(options, function(error, response, body) { //gauname artistu array [body]
//                     const baseUrl1 = 'https://api.spotify.com/v1/artists/';
//                     const baseUrl2 = '/top-tracks?country=LT';
//                     const myOptions = {
//                         method: 'GET',
//                         headers : {
//                                 'Authorization': 'Bearer '+token
//                                 },
//                         mode: 'cors',
//                         cache: 'default'}
//                 fetch(url, options2)
//                     .then((data)=>data.json())
//                     .then((art)=>body.artists.concat(art.artists))
//                     .then((allArtists)=>getAdditionalInfo(allArtists, baseUrl1, baseUrl2, myOptions, res))
//             });
//         }
//     });
// })
// app.get('/test', function(req, res){
//     res.json(artistsData);
// })
//************************************************





// app.get('/api/hiphop', function(req, res){
//     request.post(authOptions, function(error, response, body) {
//         if (!error && response.statusCode === 200) {
//             // use the access token to access the Spotify Web API
//             const token = body.access_token;
//             const options = {
//               url: 'https://api.spotify.com/v1/artists?ids='+hiphopArtists.ids,
//               headers: {
//                 'Authorization': 'Bearer ' + token
//               },
//               json: true
//             };
//             request.get(options, function(error, response, body) { //gauname artistu array [body]
//             console.log(body)
//                 const baseUrl1 = 'https://api.spotify.com/v1/artists/';
//                 const baseUrl2 = '/top-tracks?country=LT';
//                 const myOptions = {
//                     method: 'GET',
//                     headers : {
//                             'Authorization': 'Bearer '+token
//                             },
//                     mode: 'cors',
//                     cache: 'default'}
//               getAdditionalInfo(body, baseUrl1, baseUrl2, myOptions, res);  
//             });
//         }
//     });
// })


//NEEEEEEEEEEEEEEW
// app.get('/api/hiphop', function(req, res){
//     request.post(authOptions, function(error, response, body) {
//         if (!error && response.statusCode === 200) {
//             // use the access token to access the Spotify Web API
//             const token = body.access_token;
//             const options = {
//               url: 'https://api.spotify.com/v1/artists?ids='+hiphopArtists.ids,
//               headers: {
//                 'Authorization': 'Bearer ' + token
//               },
//               json: true
//             };
//             const url= 'https://api.spotify.com/v1/artists?ids='+hiphopArtists.ids2;
//             const options2 = {
              
//               headers: {
//                 'Authorization': 'Bearer ' + token
//               },
//               json: true
//             };
            
            
//             request.get(options, function(error, response, body) { //gauname artistu array [body]
//                     const baseUrl1 = 'https://api.spotify.com/v1/artists/';
//                     const baseUrl2 = '/top-tracks?country=LT';
//                     const myOptions = {
//                         method: 'GET',
//                         headers : {
//                                 'Authorization': 'Bearer '+token
//                                 },
//                         mode: 'cors',
//                         cache: 'default'}
//                 fetch(url, options2)
//                     .then((data)=>data.json())
//                     .then((art)=>body.artists.concat(art.artists))
//                     .then((allArtists)=>getAdditionalInfo(allArtists, baseUrl1, baseUrl2, myOptions, res))
//             });
//         }
//     });
// })
// NEEWWWW
// app.get('/api/pop', function(req, res){
//     request.post(authOptions, function(error, response, body) {
//         if (!error && response.statusCode === 200) {
//             // use the access token to access the Spotify Web API
//             const token = body.access_token;
//             const options = {
//               url: 'https://api.spotify.com/v1/artists?ids='+popArtists.ids,
//               headers: {
//                 'Authorization': 'Bearer ' + token
//               },
//               json: true
//             };
//             const url= 'https://api.spotify.com/v1/artists?ids='+popArtists.ids2;
//             const options2 = {
              
//               headers: {
//                 'Authorization': 'Bearer ' + token
//               },
//               json: true
//             };
            
            
//             request.get(options, function(error, response, body) { //gauname artistu array [body]
//                     const baseUrl1 = 'https://api.spotify.com/v1/artists/';
//                     const baseUrl2 = '/top-tracks?country=LT';
//                     const myOptions = {
//                         method: 'GET',
//                         headers : {
//                                 'Authorization': 'Bearer '+token
//                                 },
//                         mode: 'cors',
//                         cache: 'default'}
//                 fetch(url, options2)
//                     .then((data)=>data.json())
//                     .then((art)=>body.artists.concat(art.artists))
//                     .then((allArtists)=>getAdditionalInfo(allArtists, baseUrl1, baseUrl2, myOptions, res))
//             });
//         }
//     });
// })



// app.get('/api/test', function(req, res){
//     request.post(authOptions, function(error, response, body) {
//         if (!error && response.statusCode === 200) {
//             // use the access token to access the Spotify Web API
//             const token = body.access_token;
//             const options = {
//               url: 'https://api.spotify.com/v1/search?q=year%3A2001&type=artist&market=LT',
//               headers: {
//                 'Authorization': 'Bearer ' + token
//               },
//               json: true
//             };
//             request.get(options, function(error, response, body) { //gauname artistu array [body]
//             console.log(body)
//                 res.send(body) 
//             });
//         }
//     });
// })




// app.get('/api/pop', function(req, res){
//     request.post(authOptions, function(error, response, body) {
//         if (!error && response.statusCode === 200) {
//             // use the access token to access the Spotify Web API
//             const token = body.access_token;
//             const options = {
//               url: 'https://api.spotify.com/v1/artists?ids='+popArtists.ids,
//               headers: {
//                 'Authorization': 'Bearer ' + token
//               },
//               json: true
//             };
//             request.get(options, function(error, response, body) { //gauname artistu array [body]
//             console.log(body)
//                 const baseUrl1 = 'https://api.spotify.com/v1/artists/';
//                 const baseUrl2 = '/top-tracks?country=LT';
//                 const myOptions = {
//                     method: 'GET',
//                     headers : {
//                             'Authorization': 'Bearer '+token
//                             },
//                     mode: 'cors',
//                     cache: 'default'}
//               getAdditionalInfo(body, baseUrl1, baseUrl2, myOptions, res);  
//             });
//         }
//     });
// });



app.get('/', function(req, res) {
    res.send('Hello')
})
app.get('/api/hiphop', function(req, res){
    res.json(hiphopData);
})
app.get('/api/pop', function(req, res){
    res.json(popData);
})
app.post('/api/email/message', function(req, res){
    
    const options = `
    <h1>You have recieved new mail !</h1>
    <h4>Name : ${req.body.name}</h4>
    <h4>Email : ${req.body.email}</h4>
    <p>Message : ${req.body.text}</p>
    `
    
    // async..await is not allowed in global scope, must use a wrapper
    async function main(){

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
            //let account = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'lietufymail@gmail.com', // generated ethereal user
      pass: 'blozblozbloz' // generated ethereal password
        }
    });

  // setup email data with unicode symbols
    let mailOptions = {
        from: '"lietufy 👻" <lietufymail@gmail.com>', // sender address
        to: "domasg209@gmail.com", // list of receivers
        subject: "lietufy vartotojo pranešimas ✔", // Subject line
        text: "Hello world?", // plain text body
        html: options // html bodykj
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions)

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    main().catch(console.error);
    })



app.post('/api/email/artist', function(req, res){
    
    const options = `
    <h1>You have recieved new Artist !</h1>
    <h4>Artist : ${req.body.artist}</h4>
    <h4>Genre : ${req.body.genre}</h4>
    `
    
    // async..await is not allowed in global scope, must use a wrapper
    async function main(){

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
            //let account = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'lietufymail@gmail.com', // generated ethereal user
      pass: 'blozblozbloz' // generated ethereal password
        }
    });

  // setup email data with unicode symbols
    let mailOptions = {
        from: '"lietufy 👻" <lietufymail@gmail.com>', // sender address
        to: "domasg209@gmail.com", // list of receivers
        subject: "lietufy naujas artistas ✔", // Subject line
        text: "Hello world?", // plain text body
        html: options // html bodykj
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions)

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    main().catch(console.error);
    })

app.listen(process.env.PORT, function(){
    console.log('App is running on '+process.env.PORT)
})
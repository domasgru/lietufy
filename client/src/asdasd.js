var express = require("express");
var app = express();
const fetch = require('node-fetch')
var request = require('request')
var ids = require('./AllLithuanianArtists')


var client_id = '1fe4184390044d7c832605c6faf9e5d5'; // Your client id
var client_secret = '2914928c2cc043238bde68c06a515f4c'; // Your secret


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


console.log(ids.ids)












app.get('/api/todos', function(req, res){
    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            // use the access token to access the Spotify Web API
            const token = body.access_token;
            const options = {
              url: 'https://api.spotify.com/v1/artists?ids='+ids.ids,
              headers: {
                'Authorization': 'Bearer ' + token
              },
              json: true
            };
            request.get(options, function(error, response, body) {
                const baseUrl1 = 'https://api.spotify.com/v1/artists/';
                const baseUrl2 = '/top-tracks?country=LT';
                const myOptions = {
                    method: 'GET',
                    headers : {
                            'Authorization': 'Bearer '+token
                            },
                    mode: 'cors',
                    cache: 'default'}
                                
                for(var i=0; i<body.artists.length; i++){
                    body.artists[i].popularSong = [];
                                body.artists[i].albumLink = [];
                                body.artists[i].releaseDate = [];
                                body.artists[i].previewSong = [];
                                body.artists[i].popularityOfSong = [];
                                body.artists[i].albumImage = [];
                    (function(i){       
                        var url = baseUrl1+body.artists[i].id+baseUrl2;
                        fetch(url, myOptions)
                            .then(res=>res.json())
                            .then(res=>{
                                
                                    if(res.tracks.length > 2){
                                        for(var f=0; f<3; f++){
                                        body.artists[i].popularSong[f] = res.tracks[f].name;
                                        body.artists[i].albumLink[f] = res.tracks[f].album.external_urls.spotify;
                                        body.artists[i].releaseDate[f] = res.tracks[f].album.release_date;
                                        body.artists[i].previewSong[f] = res.tracks[f].preview_url;
                                        body.artists[i].popularityOfSong[f] = res.tracks[f].popularity;
                                        body.artists[i].albumImage[f] = res.tracks[f].album.images[0];
                                        }
                                        }else{
                                        body.artists[i].popularSong[0] = res.tracks[0].name;
                                        body.artists[i].albumLink[0] = res.tracks[0].album.external_urls.spotify;
                                        body.artists[i].releaseDate[0] = res.tracks[0].album.release_date;
                                        body.artists[i].previewSong[0] = res.tracks[0].preview_url;
                                        body.artists[i].popularityOfSong[0] = res.tracks[0].popularity;
                                        body.artists[i].albumImage[0] = res.tracks[0].album.images[0];
                                        }
                            })
                            .then(()=>{
                                if(i === body.artists.length-1){
                                    res.send(body) // DATA  FROM MULTIPPLE API ENDPOINTS IS PREPARED AND READY TO SEND
                                }})
                    })(i)
                } // for loop ending
                    
                       
                    
              //res.send(body)
            });
        }
    });
})

app.listen(8081, function(){
    console.log('App is running on 8081')
})
getArtistInfo(){
      const baseUrl1 = 'https://api.spotify.com/v1/artists/'
      const baseUrl2 = '/top-tracks?country=LT';
      const myOptions = {
          method: 'GET',
          headers : {
            'Authorization': 'Bearer '+this.state.accessToken.accessToken
          },
          mode: 'cors',
          cache: 'default'
        }
      const artists = this.state.artists;
      for(var i=0; i<this.state.artists.length; i++){
        //console.log(this.state.accessToken.accessToken)
        let url = baseUrl1 + this.state.artists[i].id+ baseUrl2;
        var num = 0;
        
          fetch(url, myOptions)
          //.then((res)=>console.log(res))
          .then(res=>res.json())
          .then(res=>{
            //console.log(res.tracks.length)
            //*
            artists[num].popularSong = [];
            artists[num].albumLink = [];
            artists[num].releaseDate = [];
            artists[num].previewSong = [];
            artists[num].popularityOfSong = [];
            artists[num].albumImage = [];
              if(res.tracks.length > 2){
                for(var i=0; i<3; i++){
                  artists[num].popularSong[i] = res.tracks[i].name;
                  artists[num].albumLink[i] = res.tracks[i].album.external_urls.spotify;
                  artists[num].releaseDate[i] = res.tracks[i].album.release_date;
                  artists[num].previewSong[i] = res.tracks[i].preview_url;
                  artists[num].popularityOfSong[i] = res.tracks[i].popularity;
                  artists[num].albumImage[i] = res.tracks[i].album.images[0];
                }
              } else{
                  artists[num].popularSong[0] = res.tracks[0].name;
                  artists[num].albumLink[0] = res.tracks[0].album.external_urls.spotify;
                  artists[num].releaseDate[0] = res.tracks[0].album.release_date;
                  artists[num].previewSong[0] = res.tracks[0].preview_url;
                  artists[num].popularityOfSong[0] = res.tracks[0].popularity;
                  artists[num].albumImage[0] = res.tracks[0].album.images[0];
              }
            
            //*
          }
          //this.state.artists[num].popularSong = res.tracks[0].name
          )
          .then(()=>num++)
          //.then(()=> console.log(this.state.artists[num]))
          //.then(()=> console.log(this.state.artists))
      }
      return this.setState({artists: artists})
    }
    
    
    componentWillMount(){
      
    const BASE_URL = 'https://api.spotify.com/v1/artists?ids=';
    const URL = BASE_URL+ids;

     var myOptions;
    fetch('/api/todos')
      .then(res=>res.json())
      //.then(res=>console.log(res))
      .then(accessToken=>this.setState({accessToken}))
      //.then(()=>console.log(this.state.accessToken))
      
      .then(()=>(
        myOptions = {
          method: 'GET',
          headers : {
            'Authorization': 'Bearer '+this.state.accessToken.accessToken
          },
          mode: 'cors',
          cache: 'default'
        }
      ))
      .then(()=>console.log(myOptions))
      .then(()=>fetch(URL, myOptions))
      //fetch(URL, myOptions)
      .then(res => res.json())
      //.then(bug => console.log(bug))
      .then(artists => artists.artists.sort(this.compare))
      ///////.then(artists => this.setState({artists: artists}))
      //.then(() => console.log(this.state.artists))
      .then((data)=>this.getArtistInfo(data))
      .then(artists=>this.setState({artists:artists, uploadedData: true}))
      
    }
    
    
    
    
    
    
    import React, { Component } from 'react';
import Artist from './Artist'
import './App.css';
import './Artist.css';
import ids from './AllLithuanianArtists'

class App extends Component {
  constructor(props){
    super(props)
    
    this.state ={
      artists: [],
      accessToken: [],
      uploadedData: false
  
}
this.compare = this.compare.bind(this)
this.getArtistInfo = this.getArtistInfo.bind(this)
}
    
  
    //componentWillMount(){
      
    //}
    componentWillMount(){
      
    const BASE_URL = 'https://api.spotify.com/v1/artists?ids=';
    const URL = BASE_URL+ids;
    //spotify:artist:3sgAdiPhuvZrC1Di13TVbO spotify:artist:3jfKIjYYnAfdUW40Uragnd
    //const access_token ='BQBfciHdxVpucrCXmmfz3GzTmqcMSSfx0IQg8Z_HlbG4jeXkiKGQZ5qtfLuDOO7AlBnEXvQ9rQR3j-LjaFpWzVz8JOMK90AOum1Y_W_iGyJjBj_ZVjth75JIEPVOCRFIGvMh4MsEsMV6LYv6E2me36O5PiXyGBmoqxBzGLYAU2PD4aSgRph7I5C6';
    
     var myOptions;
    //   method: 'GET',
    //   headers : {
    //     'Authorization': 'Bearer'+this.state.accessToken.accessToken
    //   },
    //   mode: 'cors',
    //   cache: 'default'
    // }
    
    fetch('/api/todos')
      .then(res=>res.json())
      //.then(res=>console.log(res))
      .then(accessToken=>this.setState({accessToken}))
      //.then(()=>console.log(this.state.accessToken))
      
      .then(()=>(
        myOptions = {
          method: 'GET',
          headers : {
            'Authorization': 'Bearer '+this.state.accessToken.accessToken
          },
          mode: 'cors',
          cache: 'default'
        }
      ))
      .then(()=>console.log(myOptions))
      .then(()=>fetch(URL, myOptions))
      //fetch(URL, myOptions)
      .then(res => res.json())
      //.then(bug => console.log(bug))
      .then(artists => artists.artists.sort(this.compare))
      .then(artists => this.setState({artists: artists}))
      //.then(() => console.log(this.state.artists))
      .then(()=>this.getArtistInfo())
      //.then(artists=>console.log(this.state.artists))
      //.then(artists=>this.setState({artists:artists}))
      //.then(()=>console.log(this.state.artists))
      
    }
    
    compare(a,b){
      const followersA = a.followers.total;
      const followersB = b.followers.total;
      let comparison = 0;
        if(followersA>followersB){
          comparison = 1;
        } else if(followersA<followersB){
          comparison = -1;
        }
        return comparison*-1
    }
    getArtistInfo(){
      const baseUrl1 = 'https://api.spotify.com/v1/artists/'
      const baseUrl2 = '/top-tracks?country=LT';
      const myOptions = {
          method: 'GET',
          headers : {
            'Authorization': 'Bearer '+this.state.accessToken.accessToken
          },
          mode: 'cors',
          cache: 'default'
        }
      const artists = this.state.artists;
      for(var i=0; i<this.state.artists.length; i++){
        //console.log(this.state.accessToken.accessToken)
        let url = baseUrl1 + this.state.artists[i].id+ baseUrl2;
        var num = 0;
        
          fetch(url, myOptions)
          //.then((res)=>console.log(res))
          .then(res=>res.json())
          .then(res=>{
            //console.log(res.tracks.length)
            //*
            artists[num].popularSong = [];
            artists[num].albumLink = [];
            artists[num].releaseDate = [];
            artists[num].previewSong = [];
            artists[num].popularityOfSong = [];
            artists[num].albumImage = [];
              if(res.tracks.length > 2){
                for(var i=0; i<3; i++){
                  artists[num].popularSong[i] = res.tracks[i].name;
                  artists[num].albumLink[i] = res.tracks[i].album.external_urls.spotify;
                  artists[num].releaseDate[i] = res.tracks[i].album.release_date;
                  artists[num].previewSong[i] = res.tracks[i].preview_url;
                  artists[num].popularityOfSong[i] = res.tracks[i].popularity;
                  artists[num].albumImage[i] = res.tracks[i].album.images[0];
                }
              } else{
                  artists[num].popularSong[0] = res.tracks[0].name;
                  artists[num].albumLink[0] = res.tracks[0].album.external_urls.spotify;
                  artists[num].releaseDate[0] = res.tracks[0].album.release_date;
                  artists[num].previewSong[0] = res.tracks[0].preview_url;
                  artists[num].popularityOfSong[0] = res.tracks[0].popularity;
                  artists[num].albumImage[0] = res.tracks[0].album.images[0];
              }
            this.setState({artists:artists})
            //*
          }
          //this.state.artists[num].popularSong = res.tracks[0].name
          )
          .then(()=>num++)
          
          //.then(()=> console.log(this.state.artists[num]))
          //.then(()=> console.log(this.state.artists))
      }
      //return this.setState({artists:artists})
      
    }
    
      
  render() {
    let artists;
    console.log('jsut after render'+this.state.artists.length)
    if(this.state.artists.length!==0 && this.state.artists[30].popularSong){
      
      console.log(this.state.artists)
      //artists.artists.sort(this.compare)
      artists = this.state.artists.map((artist,i) =>{
        console.log(artist.popularSong)
        if(artist.popularity<40){
        return(
        <Artist
        place ={i+1}
        name = {artist.name}
        image = {artist.images[0].url}
        popularity = {artist.popularity}
        followers = {artist.followers.total}
        
        //ADDITIONAL INFO GOES UNDER
         //song1 = {}
        // song2 = {artist.popularSong[1]}
        // song3 = {artist.popularSong[2]}
        
        // image1 = {artist.albumImage[0]}
        // image2 = {artist.albumImage[1]}
        // image3 = {artist.albumImage[2]}
        
        />)
        } else{
        return(
        <Artist
        place ={i+1}
        name = {artist.name}
        image = {artist.images[0].url}
        popularity = {artist.popularity}
        followers = {artist.followers.total}
        
        //song1 = {artist.popularSong[0]}
        
        lit = {<span><i class="fas fa-fire"></i></span>}
        />)
        }
        })
        
    }
    return (
      <div className='chart'>
        {artists}
      </div>
    );
  }
}

export default App;
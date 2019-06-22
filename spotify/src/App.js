import React, { Component } from 'react';
import Artist from './Artist';
import './App.css';
import './Artist.css';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import MessageForm from './MessageForm';
import About from './About';
import ChartNavigation from './ChartNavigation';

import ids from './AllLithuanianArtists' 
//only in DEV MODE

class App extends Component {
  constructor(props){
    super(props)
    
    this.state ={
      artists: [],
      songOnPlay: undefined,
      filter: 'followers'
      }
this.compareFollowers = this.compareFollowers.bind(this);
this.renderPopularSongs = this.renderPopularSongs.bind(this);
this.handleSongClick = this.handleSongClick.bind(this);
this.handleHipHopArtists = this.handleHipHopArtists.bind(this);
this.handlePopArtists = this.handlePopArtists.bind(this);
this.scrollFunction = this.scrollFunction.bind(this);
this.topFunction = this.topFunction.bind(this);

this.handlePopularityFilter = this.handlePopularityFilter.bind(this);
this.handleFollowersFilter = this.handleFollowersFilter.bind(this);
this.handleToggleFilter = this.handleToggleFilter.bind(this);
//this.getArtistInfo = this.getArtistInfo.bind(this)
}
    
  
    //componentWillMount(){
    
    //}
    componentDidMount(){
      const chartHip = document.getElementById('chartHipHop');
      chartHip.classList.add('activeChartNav');
      this.handleHipHopArtists();
      
      // When the user scrolls down 20px from the top of the document, show the button
      window.addEventListener('scroll', this.scrollFunction);
    
    
      
    }
    
  compareFollowers(a,b){
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
  comparePopularity(a,b){
    const popularityA = a.popularity;
    const popularityB = b.popularity;
    let comparison = 0;
      if(popularityA>popularityB){
        comparison = 1;
      } else if(popularityA<popularityB){
        comparison = -1;
      }
      return comparison*-1
  }
  
  handleSongClick(id, i,playButtonId, pauseButtonId){
    console.log(i)
    const song = document.getElementById(id);
    const playButton = document.getElementById(playButtonId);
    const pauseButton = document.getElementById(pauseButtonId);
      // const main = document.getElementsByClassName('main');
      // const artistCard = document.getElementsByClassName('artist');
      // const artistImage = document.getElementsByClassName('artistImageM');
      // const additionalInfo = document.getElementsByClassName('additionalInfo');
      if(this.state.songOnPlay!==undefined){
        
        if(this.state.songOnPlay!==id){
          const previousSong = document.getElementById(this.state.songOnPlay);
          const previousPlayButton = document.getElementById(this.state.songOnPlay+'play');
          previousSong.pause();
          previousPlayButton.classList.remove('flicker');
          this.setState({songOnPlay: id})
          song.play();
          playButton.classList.add('flicker');
        }
        else if(this.state.songOnPlay == id && !song.paused){
          song.pause();
          playButton.classList.remove('flicker');
        }
        else if(this.state.songOnPlay == id && song.paused){
          song.play()
          playButton.classList.add('flicker');
        }
        
        
        
        
        
      }else{
      song.play();
      this.setState({songOnPlay: id})
      playButton.classList.add('flicker');
      }
      //if(song.paused){
      
      //song.play()
      // main[i].classList.add('onListenMain');
      // artistCard[i].classList.add('onListenArtist');
      // artistImage[i].classList.add('onListenArtistImageM')
      // additionalInfo[i].classList.add('onListenAdditionalInfo')
        
        //this.handleSongEnd(id,i)
    //} 
    
    
    
    
  }
  handleSongEnd(id, i){
    const song = document.getElementById(id);
    const main = document.getElementsByClassName('main');
      const artistCard = document.getElementsByClassName('artist');
      const artistImage = document.getElementsByClassName('artistImageM');
      const additionalInfo = document.getElementsByClassName('additionalInfo');
    song.addEventListener('ended', function(i){
         main[i].classList.remove('onListenMain');
        artistCard[i].classList.remove('onListenArtist');
        artistImage[i].classList.remove('onListenArtistImageM')
        additionalInfo[i].classList.remove('onListenAdditionalInfo')
       })
  }
  // handleHipHopArtistsTEST(){
  //   this.setState({artists: ids})
  // }
  handleHipHopArtists(){
    let artists =  this.state.artists;
    //Handle chart navigation buttons style
      let chartHipBtn = document.getElementById('chartHipHop');
      let chartPopBtn =  document.getElementById('chartPop');
      chartPopBtn.classList.remove('active');
      chartHipBtn.classList.add('active');
     
    //Alwats show followers filter after refresh 
    let filterSlider = document.getElementById('filterSlider');
    filterSlider.classList.remove('filterPopularity');
    filterSlider.classList.add('filterFollowers');
     
     //Handle song memory refresh 
    this.setState({songOnPlay: undefined})
    
    artists = [];
    this.setState({artists: artists});
    fetch('/api/api/hiphop')
      .then(res=>res.json())
      .then(artists=>artists.artists.sort(this.compareFollowers))
      .then(artists=> this.setState({artists:artists}))
      .then(artists=> this.handleFollowersFilter())
  }
  handlePopArtists(){
    let artists = this.state.artists;
    //Handle chart navigation buttons style
      let chartHipBtn = document.getElementById('chartHipHop');
      let chartPopBtn =  document.getElementById('chartPop');
      chartHipBtn.classList.remove('active');
      chartPopBtn.classList.add('active');
      
      //Always show followers filter after refresh
      let filterSlider = document.getElementById('filterSlider');
      filterSlider.classList.remove('filterPopularity');
      filterSlider.classList.add('filterFollowers');
    
    //Handle song memory refresh
    this.setState({songOnPlay: undefined})
    
    artists = [];
    this.setState({artists: artists})
    fetch('/api/api/pop')
      .then(res=>res.json())
      .then(artists=>artists.artists.sort(this.compareFollowers))
      .then(artists=> this.setState({artists:artists}))
      .then(artists=> this.handleFollowersFilter())
      
      
  }
  
  
//CHAR NAVIGATION FILTERS HANDLING
  handleFollowersFilter(){
    let filterSlider = document.getElementById('filterSlider');
    let activeFol = document.getElementById('fFilter');
    let activePop = document.getElementById('pFilter');
    
    filterSlider.classList.remove('filterPopularity');
    filterSlider.classList.add('filterFollowers');
    activePop.classList.remove('filterActive');
    activeFol.classList.add('filterActive');
    
    //Handle song memory refresh, remove playback flicker
    if(this.state.songOnPlay !== undefined){
      const previousPlayButton = document.getElementById(this.state.songOnPlay+'play');
      previousPlayButton.classList.remove('flicker');
    }
    this.setState({songOnPlay: undefined})
    
    this.setState({filter: 'followers'})
    
    const artists =  this.state.artists;
    artists.sort(this.compareFollowers);
    this.setState({artists})
  }
  handlePopularityFilter(){
    let filterSlider = document.getElementById('filterSlider');
    let activeFol = document.getElementById('fFilter');
    let activePop = document.getElementById('pFilter');
    
    filterSlider.classList.remove('filterFollowers');
    filterSlider.classList.add('filterPopularity');
    activePop.classList.add('filterActive');
    activeFol.classList.remove('filterActive');
    
    //Handle song memory refresh, remove playback flicker
    if(this.state.songOnPlay !== undefined){
      const previousPlayButton = document.getElementById(this.state.songOnPlay+'play');
      previousPlayButton.classList.remove('flicker');
    }
    this.setState({songOnPlay: undefined})
    
    this.setState({filter: 'popularity'})
    
    const artists =  this.state.artists;
    artists.sort(this.comparePopularity);
    this.setState({artists})
  }
  handleToggleFilter(){
    if(this.state.filter === 'followers'){
      this.handlePopularityFilter();
      
    }
    else if(this.state.filter === 'popularity'){
      this.handleFollowersFilter();
      
    }
  }
  
  
  
  
  
  
  scrollFunction(){
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
      document.getElementById("myBtn").style.display = "block";
    } else {
      document.getElementById("myBtn").style.display = "none";
    }
  }
  topFunction(){
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
  //<div className='playerDispl'><i class="fas fa-play"></i><i class="fas fa-pause"></i></div>
  
  
  renderPopularSongs(artist, i){
    if(artist.popularSong.length>1){
      return( <div className='popularSongs'>
                  <i class="fas fa-volume-up"></i>
                <div className='song'>
                  
                  <div className='songDispl' onClick={()=>this.handleSongClick(artist.uri+'1',i, artist.uri+'1'+'play')}>
                    <audio id={artist.uri+'1'} src={artist.previewSong[0]}></audio>
                
                      <div className='playBackIcons'><i class="fas fa-play" id={artist.uri+'1'+'play'}></i><i class="fas fa-pause" id={artist.uri+'1'+'play'}></i></div>
                      <img src={artist.albumImage[0].url}/>
                    
                    <p>{artist.popularSong[0]}</p>
                  </div>
                  <div className='albumDisp'>
                    <div className='albumRating'><span>#</span>1<span className='songPopularity'><i class="fas fa-fire"></i>{artist.popularityOfSong[0]}</span></div>
                    <div className='albumType'>{artist.albumType[0]}</div>
                    <div className='albumName'><a href={artist.albumLink[0]} target="_blank">{artist.albumName[0]}</a></div>
                    <div className='albumYear'>{artist.releaseDate[0]}</div>
                  </div>
                </div>
                <div className='song'>
                    
                    <div className='songDispl' onClick={()=>this.handleSongClick(artist.uri+'2',i, artist.uri+'2'+'play')}>
                      <audio id={artist.uri+'2'} src={artist.previewSong[1]}></audio>
                      <div className='playBackIcons'><i class="fas fa-play" id={artist.uri+'2'+'play'}></i><i class="fas fa-pause" id={artist.uri+'2'+'play'}></i></div>
                      <img src={artist.albumImage[1].url}/>
                      <p>{artist.popularSong[1]}</p>
                    </div>
                    <div className='albumDisp'>
                    <div className='albumRating'><span>#</span>2<span className='songPopularity'><i class="fas fa-fire"></i>{artist.popularityOfSong[1]}</span></div>
                    <div className='albumType'>{artist.albumType[1]}</div>
                    <div className='albumName'><a href={artist.albumLink[1]} target="_blank">{artist.albumName[1]}</a></div>
                    <div className='albumYear'>{artist.releaseDate[1]}</div>
                  </div>
                </div>
                
                <div className='song'>
                  <div className='songDispl' onClick={()=>this.handleSongClick(artist.uri+'3',i, artist.uri+'3'+'play')}>
                    <audio id={artist.uri+'3'} src={artist.previewSong[2]}></audio>
                    <div className='playBackIcons'><i class="fas fa-play" id={artist.uri+'3'+'play'}></i><i class="fas fa-pause" id={artist.uri+'3'+'play'}></i></div>
                    <img src={artist.albumImage[2].url}/>
                    <p>{artist.popularSong[2]}</p>
                  </div>
                  <div className='albumDisp'>
                    <div className='albumRating'><span>#</span>3<span className='songPopularity'><i class="fas fa-fire mobile"></i>{artist.popularityOfSong[2]}</span></div>
                    <div className='albumType'>{artist.albumType[2]}</div>
                    <div className='albumName'><a href={artist.albumLink[2]} target="_blank">{artist.albumName[2]}</a></div>
                    <div className='albumYear'>{artist.releaseDate[2]}</div>
                  </div>
                </div>
              </div>)
    }else{
      return(<div className='artistOneSong'>
              <div className='songDispl' onClick={()=>this.handleSongClick(artist.uri+'1',i, artist.uri+'1'+'play')}>
                  <div className='playBackIcons'><i class="fas fa-play" id={artist.uri+'1'+'play'}></i><i class="fas fa-pause" id={artist.uri+'1'+'play'}></i></div>
                  <audio id={artist.uri+'1'} src={artist.previewSong[0]}></audio>
                  <img src={artist.albumImage[0].url}/>
                  <p>{artist.popularSong[0]}</p>
                  </div>
                  
                  <div className='albumDisp'>
                    <div className='albumRating'><i class="fas fa-fire"></i>{artist.popularityOfSong[0]}</div>
                    <div className='albumType'>{artist.albumType[0]}</div>
                    <div className='albumName'>{artist.albumName[0]}</div>
                    <div className='albumYear'>{artist.releaseDate[0]}</div>
                  </div>
              </div>
      )
    }
  } 
      
  render() {
    let artists = <div className='loader-wrap'><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>;
    //console.log(this.state.artists)
    if(this.state.artists.length!==0){
      // console.log(this.state.artists)
      artists = this.state.artists.map((artist,i) =>{
        var songs;
        var albumImg;
        if(artist.popularSong.length>1){
           
        }
        else{
          songs = artist.popularSong;
          albumImg = artist.albumImage;
        }
        
        if(artist.popularity<40){
        return(
        <Artist
        place ={i+1}
        name = {artist.name}
        image = {artist.images[1].url}
        popularity = {artist.popularity}
        followers = {artist.followers.total}
        link = {artist.external_urls.spotify}
        index = {i}
        //ADDITIONAL INFO GOES UNDER
         additionalInfo={this.renderPopularSongs(artist,i)}
         
        
        />)
        } else{
        return(
        <Artist
        place ={i+1}
        name = {artist.name}
        image = {artist.images[1].url}
        popularity = {artist.popularity}
        followers = {artist.followers.total}
        link = {artist.external_urls.spotify}
        key = {i}
        //ADDITIONAL INFO GOES UNDER
        additionalInfo={this.renderPopularSongs(artist,i)}
         
        
        lit = {<span><i class="fas fa-fire prop"></i></span>}
        />)
        }
        })
        
    }
    return (
      <div id='main'>
      <Navigation />
      <Header />
        
          
          <div className='chart'>
            
            <ChartNavigation 
            hiphop = {this.handleHipHopArtists} 
            pop = {this.handlePopArtists}
            followerFilter = {this.handleFollowersFilter}
            popularityFilter = {this.handlePopularityFilter}
            toggle = {this.handleToggleFilter}
            />
            {artists}
          </div>
        <About />
        <MessageForm />
       <Footer /> 
       <button onClick={this.topFunction} id="myBtn" title="Go to top"><i class="fas fa-angle-up"></i></button>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import searchIcon from './searchh.png';
import playIcon from './btn.png';
import linkIcon from './linksh.png';
import './Header.css'

const Header = (props) =>(
    <div>
        <header><span>lietufy<span className='demo'>demo</span></span> - Lietuvos <i class="fab fa-spotify"></i>Spotify atlikėjų topas
        </header>
        
        <main>
            <div className='card'>
                <div className='icon'><img className='search-icon' src={searchIcon}/></div>
                <h3>Susipažink su Lietuvos atlikėjais Spotify platformoje</h3>
            </div>
            <div className='card'>
                <div className='icon'><img className='play-icon' src={playIcon}/></div>
                <h3>Išklausyk populiariausių kūrinių ištraukas</h3>
            </div>
            <div className='card'>
                <div className='icon'><img className='link-icon' src={linkIcon}/></div>
                <h3>Aplankyk patikusių Spotify paskyras</h3>
            </div>
        </main>
        <div className='send-wrap'>
        <div className='sendArtist'>
            <div className='label'>
            <p><i class="fas fa-wrench"></i>  Puslapis demo versijoje!</p>
            Trūksta atlikėjo? Matai klaidą? Turi pasiūlymą?
            Pranešk!
            </div>
            <a href='#toForm'><p>Pranešimo forma</p></a>
            
        </div>
        </div>
    </div>
)

export default Header;
// <div className='form'>
//                 <input type='text' placeholder='Jūsų žinutė'/><button>SIŲSTI</button>
//             </div>
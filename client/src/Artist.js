import React, { Component } from 'react';

const Artist = (props) =>(
    <div className='artist'>
        <div className='main'>
            <div className='place'>{props.place}</div>
            
            <img className='artistImageM' src={props.image}/>
            
            <div className='name'>{props.name}</div>
            
            <div className='followers'>
                <div>{props.followers}</div>
                <div><i class="fab fa-spotify"></i>SEKĖJAI</div>
            </div>
            <div className='popularity'>
                <div className='popularityValue'>{props.popularity}{props.lit}</div>
                <div><i class="fab fa-spotify"></i>POPULIARUMAS</div>
            </div>
        </div>
        
        <div className='additionalInfo'>
            <img className='artistImage' src={props.image}/>
            <div className='header'>
                <h5><a href={props.link} target="_blank">{props.name}</a></h5>
                <h4>TOP</h4>
                <p>HITAI</p>
            </div>
                {props.additionalInfo}
                {props.lit}
            
        </div>
        
    </div>
    
)

export default Artist;
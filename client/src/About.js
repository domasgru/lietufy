import React, { Component } from 'react';

const About = (props) =>(
    <div id='toAbout'>
        <div className='marker'></div>
        <div className='about-container'>
        <h3>Apie puslapį</h3>
        <p>lietufy - tai puslapis, kuriame sistema talpina ir nuolat atnaujina duomenis apie Lietuvos atlikėjus Spotify platformoje.</p>
        <p>Tikslas - <span>greičiausias</span>, <span>paprasčiausias</span> ir <span>patraukliausias</span> būdas susipažinti su Lietuvos atlikėjais, bei Spotify teikiamais jų statistiniais duomenimis. </p>
        </div>
        <div className='marker'></div>
    </div>
    )

export default About;

//background:repeating-linear-gradient(130deg, rgb(131, 96, 195) 60%, rgb(46, 191, 145) 63%, rgb(131, 96, 195) 71%);
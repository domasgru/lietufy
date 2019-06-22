import React, { Component } from 'react';
import './Navigation.css'

const Navigation = (props) =>(
    <nav>
        <ul>
            <li className='brand'>lietufy.lt</li>
        </ul>
        <ul>
            <li className='navlink'><a href='#toAbout'>Apie</a></li>
            <li className='navlink'><a href='#toForm'>Pranešimas</a></li>
        </ul>
    </nav>
    )

export default Navigation;
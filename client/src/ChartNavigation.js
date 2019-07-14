import React, { Component } from 'react';
import './ChartNavigation.css';

const ChartNavigation = (props) =>(
<div className='chartNav'>
  <div className='genres'>
    <div className='genre' onClick={props.hiphop}>
      <h3>HIP HOP<br/>R&B</h3>
      <div className='circle active' id='chartHipHop'>
      </div>
    </div>
    <div className='genre' onClick={props.pop}>
      <h3>POP</h3>
      <div className='circle' id='chartPop'>
      </div>
    </div>
    <div className='genre upcoming'>
      <h3>ELECTRONIC<br/>DANCE</h3>
      <div className='circle'>
      </div>
    </div>
  </div>
  <div className='filter'>
    <div className='filterName'> 
      <h3 id='fFilter' className='filterActive' onClick={props.followerFilter}>SEKĖJAI</h3>
      <h3 id='pFilter' className='as' onClick={props.popularityFilter}>POPULIARUMAS</h3>
      <h3 className='upcoming'>NAUJAUSI</h3>
    </div>
    <div className='indicator' onClick = {props.toggle}>
      <div className='line'></div>
      <div className='circle' id='filterSlider'></div>
    </div>
  </div>
</div>       
)


export default ChartNavigation;
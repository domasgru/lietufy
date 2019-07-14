import React, { Component } from 'react';
import './MessageForm.css';

class MessageForm extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            name: '',
            email: '',
            text: '',
            artist: '',
            genre: ''
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e){
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value})
    }
    handleSubmitM(e){
       e.preventDefault();
        fetch('/api/api/email/message',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: this.state.name, email: this.state.email, text: this.state.text})
           
        })
        this.setState({name: '', email: '', text:''})
    }
    handleSubmitA(e){
        e.preventDefault();
        fetch('/api/api/email/artist',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({artist: this.state.artist, genre: this.state.genre})
           
        })
        this.setState({artist: '', genre: ''})
    }
    render(){
        return(
            <div id='toForm' className='form-container'>
                <div className='forms'>
                    <h2><i class="far fa-lightbulb"></i></h2>
                    <div className='messages'>
                        <div id='message'>
                            <h3>Susisiek</h3>
                            <form id='messageForm' onSubmit={(e)=>this.handleSubmitM(e)}>
                                <div className='form-group'>
                                    <div>
                                        <label htmlFor='name-input'>Jūsų vardas</label>
                                        <input id='name-input' type='text' name='name' value={this.state.name} onChange = {(e)=>this.handleChange(e)}/>
                                    </div>
                                    <div>
                                        <label htmlFor='email-input'>Jūsų el. paštas</label>
                                        <input id='email-input' type='text' name='email' value={this.state.email} onChange = {(e)=>this.handleChange(e)}/>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <div>
                                        <label htmlFor='text-input'>Pranešimas</label>
                                        <textarea id='text-input' name='text' rows='6' value={this.state.text} onChange = {(e)=>this.handleChange(e)}></textarea>
                                    </div>
                                <button type='submit'><i class="far fa-envelope"></i></button>
                                </div>
                            </form>
                        </div>
                        <div id='reportArtist'>
                            <h3>Pranešk atlikėją</h3>
                            <form id='artistForm' onSubmit={(e)=>this.handleSubmitA(e)}>
                                <div className='form-group2'>
                                    <div>
                                        <label>Atlikėjas</label>
                                        <input type='text' name='artist' value={this.state.artist} onChange = {(e)=>this.handleChange(e)}/>
                                    </div>
                                    <div>
                                        <label>Žanras</label>
                                        <input type='text' name='genre' value={this.state.genre} onChange={(e)=>this.handleChange(e)}/>
                                    </div>
                                    <button type='submit'><i class="far fa-envelope"></i></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default MessageForm;
import React, { Component } from 'react';
import io from "socket.io-client";

const socket = io('https://ptchatindia.herokuapp.com/', {transports: ['websocket']});

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages:[]
    }
    this.message = React.createRef();
  }
componentDidMount=()=>{
    socket.emit("joinRoom", { username: this.props.location.userDetails.username, client2:this.props.location.client2.username });
    socket.on("messages",(data)=>{
        this.setState({messages:data.messages});
        console.log('msg came successfully',data);
    });
    socket.on("message",(data)=>{
        let messages = this.state.messages;
        messages.push(data.message);
        console.log('msg came successfully',data);
    });
    console.log(this.props.location);
}
  send = () => {
    console.log(this.state.message);
  }
  display = (message) => {
      socket.emit("chat", {
          username: this.props.location.userDetails.username,
          message
      })
    // this.setState({
    //   message: this.message.current.value
    // })
  }
  
  render() {
      console.log(this.state.messages);
    return (
      <div className='chat-room' >
        <div className='header'>
           <div>
            <img className='profile-image' src={this.props.location.client2.profile} alt="this is suma " />
          </div>
          <div>
            <div className='name'>
              <h2>{this.props.location.client2.username}</h2>
            </div>
          </div>
        </div>
        <div className='container'>
          <div className='input-message'>{this.state.message}</div>
          <div></div>
        </div>
        <div className='footer'>
          <div className='message-input'>
            <input className='input' type='text' ref={this.message} onBlur={this.display.bind(this, 'message')} placeholder='Type a message' />
          </div>
          <div className='submit-button'>
            <button className='send' onClick={() => { this.send() }}>send</button>
          </div>
        </div>
      </div>
    )
  }
}
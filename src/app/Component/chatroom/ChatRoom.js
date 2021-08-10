import React, { Component } from 'react';
import io from "socket.io-client";


export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: []
    }
    this.message = React.createRef();
  }
  socket=null;
  componentDidMount = () => {
    this.socket = io('https://ptchatindia.herokuapp.com/', { transports: ['websocket'] });
    this.socket.emit("joinRoom", { username: this.props.location.userDetails.username, client2: this.props.location.client2.username });
    this.socket.on("messages", (data) => {
      this.setState({ messages: data.messages });
      console.log('massages came successfully', data);
    });
    this.socket.on("message", (data) => {
      let messages = this.state.messages;
      messages.push(data);
      console.log('msg came successfully', data);
      this.setState({ messages: messages });
    });
    console.log(this.props.location);
  }

  send = () => {
    if(this.message.current.value){
      this.socket.emit("chat", {
        username: this.props.location.userDetails.username,
        client2: this.props.location.client2.username,
        message: this.message.current.value
      });
      this.message.current.value = '';
    }
  }
  display = (message) => {
    // this.setState({
    //   message: this.message.current.value
    // })
  }

  render() {
    console.log(this.state.messages);
    const { messages } = this.state;
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
        <div className='msg-container'>
          {messages && !!messages.length && messages.map((message, index) => {
            console.log('hello', message, this.props.location);
            return (<div className='message-field' key={index}>
              {message.username === this.props.location.userDetails.username ?
                (<span className='msg-right'>{message.message}</span>) :
                (<span className='msg-left'>{message.message}</span>)
              }
            </div>)
          })}
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
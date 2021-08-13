import React, { Component } from 'react';
import io from "socket.io-client";
import './chatroom.css';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import { getSocket } from '../../../service/socket';
import { NodeBuilderFlags } from 'typescript';

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: [],
      isOponentTyping: false,
      isEmojiActive: false
    }
    this.message = React.createRef();
  }
  socket = null;
  componentDidMount = () => {
    this.socket = getSocket();
    this.socket.emit("joinRoom", { username: this.props.location.userDetails.username, client2: this.props.location.client2.username });
    this.socket.on("messages", (data) => {
      this.setState({ messages: data.messages });
      console.log('massages came successfully', data);
    });
    this.socket.on("message", (data) => {
      let messages = this.state.messages;
      messages.push(data);
      console.log('msg came successfully', data);
      this.previousDate=null;
      this.setState({ messages: messages });
    });
    this.socket.on("typing-start", (data) => {
      if (this.props.location.userDetails.username !== data.username) {
        this.setState({ isOponentTyping: data.typing });
      }

    });
    this.socket.on("typing-end", (data) => {
      if (this.props.location.userDetails.username !== data.username) {
        this.setState({ isOponentTyping: data.typing });
      }
    });
    console.log(this.props.location);
  }

  send = () => {
    if(this.state.isEmojiActive){
      this.handleEmoji();
    }
    if (this.message.current.value) {
      this.socket.emit("chat", {
        username: this.props.location.userDetails.username,
        client2: this.props.location.client2.username,
        message: this.message.current.value
      });
      this.message.current.value = '';
    }
  }
  settings = () => {
    this.setState({ menu: true })
  }

  getTimeByTimestamp = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let ampm = date.getHours() >= 12 ? 'pm' : 'am';
    // let hours = date.getHours()-12;
    return date.getHours() + ":" + date.getMinutes() + ampm;
  }
  previousDate=null;
  getDateByTimestamp=(timestamp)=>{
    let date = new Date(timestamp * 1000);
    if(!this.previousDate){
      this.previousDate = date;
      return (<div className="chatroom-date">{date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()}</div>);
    }
    else{
      if(this.previousDate.getDate() < date.getDate()){
        return (<div className="chatroom-date">{date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()}</div>);
      }
    }
  }
   
  sendTypingStartStatus = () => {
    console.log('type start');
    if(this.state.isEmojiActive){
      this.handleEmoji();
    }
    this.socket.emit("typing-start", { username: this.props.location.userDetails.username, client2: this.props.location.client2.username });
  }

  sendTypingEndStatus = () => {
    console.log('type end');
    this.socket.emit("typing-end", { username: this.props.location.userDetails.username, client2: this.props.location.client2.username });
  }

  handleEmoji = () => {
    this.setState({ isEmojiActive: !this.state.isEmojiActive });
  }

  render() {
    const { messages, isEmojiActive } = this.state;
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
          <div>
            {this.state.menu ?
              <div className="pop-up">
                <div style={{ padding: 10, paddingRight: 40, cursor: 'pointer' }} > <img src="https://cdn3.vectorstock.com/i/1000x1000/08/37/profile-icon-male-user-person-avatar-symbol-vector-20910837.jpg" style={{ width: 20, height: 20 }} /> Profile</div>
                <div style={{ padding: 10, paddingRight: 30, cursor: 'pointer' }} ><img src="https://static.vecteezy.com/system/resources/thumbnails/001/500/478/small/theme-icon-free-vector.jpg" style={{ width: 20, height: 20 }} />Themes</div>
                <div style={{ padding: 10, paddingRight: 50, cursor: 'pointer' }} ><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbGk-AsWSk4bsvhARgxG4RxWrx41LLfscW1g&usqp=CAU" style={{ width: 20, height: 20 }} /> Help</div>
              </div>
              :
              <div style={{ borderRadius: 50 }} >
                <button className="menu" onClick={() => { this.settings() }}><h2>⋮</h2></button>
              </div>
            }
          </div>
        </div>
        <div className='msg-container'>
          <div className='scroll'>
            {messages && !!messages.length && messages.map((message, index) => {
              console.log('hello', message, this.props.location);
            
              return (<div className='message-field' key={index}>
                {this.getDateByTimestamp(message.timestamp)}
                {message.username === this.props.location.userDetails.username ?
                  (<div className="msg-field-container">
                    <span className='msg-right'>{message.message}</span>
                    <span className='msg-time-right'>{this.getTimeByTimestamp(message.timestamp)}</span>
                  </div>) :
                  (<div className="msg-field-container aln-left">
                    <span className='msg-left'>{message.message}</span>
                    <span className='msg-time-left'>{this.getTimeByTimestamp(message.timestamp)}</span>
                  </div>)
                }
              </div>)
            })}
            {this.state.isOponentTyping &&
              <div class="loader">
                <div class="bounce">
                </div>
                <div class="bounce1">
                </div>
                <div class="bounce2">
                </div>
              </div>
            }
          </div>
        </div>
        <div className='footer'>
          <div className="emoji">
            {!isEmojiActive && <img alt='emoji' src={require('./../../../assests/emoji.png')} onClick={() => { this.handleEmoji() }} />}
            {isEmojiActive &&
              <Picker
                onEmojiClick={(obj, data)=>{
                  this.message.current.value = this.message.current.value + data.emoji;
                }}
                disableAutoFocus={true}
                skinTone={SKIN_TONE_MEDIUM_DARK}
                groupNames={{ smileys_people: 'PEOPLE' }}
                pickerStyle={{top: '-280px', 'box-shadow': 'none'}}
                native
              />
            }
          </div>
          <div className='message-input'>
            <input className='input' type='text' ref={this.message} onFocus={() => { this.sendTypingStartStatus() }} onBlur={() => { this.sendTypingEndStatus() }} placeholder='Type a message' />
          </div>
          <div className='submit-button'>
            <button className='send' onClick={() => { this.send() }}>send</button>
          </div>
        </div>

      </div>
    )
  }
}
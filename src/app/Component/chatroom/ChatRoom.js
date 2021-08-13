import React, { Component } from 'react';
import './chatroom.css';
//import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import { getSocket } from '../../../service/socket';
import { connect } from 'react-redux';

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: [],
      isOponentTyping: false,
      isEmojiActive: false,
      chatMenu:false,
      chatSettingDetails:false,
    }
    this.message = React.createRef();
    console.log('[props', this.props.location);
  }
  socket = null;
  componentDidMount = () => {
    this.socket = getSocket();
    this.socket.emit("joinRoom", { username: this.props.user.username, client2: this.props.location.client2.username });
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
    this.socket.on("typing-start", (data) => {
      if (this.props.user.username !== data.username) {
        this.setState({ isOponentTyping: data.typing });
      }

    });
    this.socket.on("typing-end", (data) => {
      if (this.props.user.username !== data.username) {
        this.setState({ isOponentTyping: data.typing });
      }
    });
    console.log(this.props.location);
  }

  send = () => {
    if (this.message.current.value) {
      console.log('chat started', this.props.user);
      this.socket.emit("chat", {
        username: this.props.user.username,
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
    let hours =  date.getHours() >= 12 ? date.getHours()-12 : date.getHours(); 
    return hours + ":" + date.getMinutes() + ampm;
  }

  sendTypingStartStatus = () => {
    console.log('type start');
    this.socket.emit("typing-start", { username: this.props.user.username, client2: this.props.location.client2.username });
  }

  sendTypingEndStatus = () => {
    console.log('type end');
    this.socket.emit("typing-end", { username: this.props.user.username, client2: this.props.location.client2.username });
  }

  handleEmoji = () => {
    this.setState({ isEmojiActive: !this.state.isEmojiActive });
  }

  
  chatSettings=()=>{
    this.setState({chatMenu:true})
  }

  chatSettingDetails=()=>{
    this.setState({chatSettingDetails:true})
  }
  
  chatCancel=()=>{
    this.setState({chatMenu:false,chatSettingDetails:false})
  }

  render() {
    const { messages, isEmojiActive } = this.state;
    return (
      <div className='chat-room' >
        <div className='header'>
          <span><img className='chat-room-profile-image' src={this.props.location.client2.profile} alt="this is suma " /></span>
          <span className='chat-room-name'><h2>{this.props.location.client2.username}</h2></span>
          <div>
            {this.state.chatMenu?
              this.state.chatSettingDetails?
              <div className="chat-room-pop-up-profile">
                  <div className="chat-room-settings-details-header">
                      <h1 style={{color:'white'}}>About</h1>
                      <span><button className="chat-room-settings-details-cancel" onClick={()=>{this.chatCancel()}}>X</button></span>
                  </div>
                  <div className="chat-room-settings-details-body">
                      <span><img className="chat-room-settings-profile-image" src={this.props.user.profile} /></span>
                      <span className="chat-room-settings-profile-text"><h5>{this.props.user.username}</h5></span>
                  </div>
                  <div className="chat-room-settings-details-footer">
                    <span className="chat-room-settings-profile-text"><h5>Email : </h5>{this.props.user.email}</span>
                    <span className="chat-room-settings-profile-text"><h5>Phone : </h5>{this.props.user.mobile}</span>
                  </div>
              </div>
            :
              <div className="pop-up">
                <div className="pop-up-heading pop-head" onClick={()=>{this.chatSettingDetails()}}>Profile</div>
                <div className="pop-up-delete-user pop-delete">delete user</div>
                <div className="pop-up-archieve pop-archieve">Add to archieve</div>
                <div className="pop-up-block pop-block"> block</div>
              </div>
            :
              <div>
                <button className="menu" onClick={()=>{this.chatSettings()}}>...</button>
              </div>
            }
          </div>
        </div>
        <div className='msg-container'>
          {messages && !!messages.length && messages.map((message, index) => {
            console.log('hello', message, this.props.location);
            return (<div className='message-field' key={index}>
              {message.username === this.props.user.username ?
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
        <div className='footer'>
          <div className="emoji">
            {!isEmojiActive && <img alt='emoji' src={require('./../../../assests/emoji.png')} onClick={() => { this.handleEmoji() }} />}
            {isEmojiActive && null
              // <Picker
              //   onEmojiClick={(obj, data)=>{
              //     this.message.current.value = this.message.current.value + data.emoji;
              //   }}
              //   disableAutoFocus={true}
              //   skinTone={SKIN_TONE_MEDIUM_DARK}
              //   groupNames={{ smileys_people: 'PEOPLE' }}
              //   pickerStyle={{top: '-280px', 'box-shadow': 'none'}}
              //   native
              // />
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

const mapStateToProps = (state) => (
  console.log('map state to props', state),
  {
    user: state.user,
    socket: state.socket
  }
);

export default connect(mapStateToProps, null)(ChatRoom);
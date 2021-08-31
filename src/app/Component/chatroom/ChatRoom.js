import React, { Component } from 'react';
import './chatroom.css';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import { getSocket } from '../../../service/socket';
import { connect } from 'react-redux';
import readIcon from './../../../assests/seenTick.png';
import deliveredIcon from './../../../assests/deliveredTick.png';
import MessageOptions from '../Common/msgoptions';
import ClientHeader from '../ClientDetails/ClientHeader';
import MessagePopup from './MessagePopup';
class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: [],
      isOponentTyping: false,
      isEmojiActive: false,
      chatMenu: false,
      chatSettingDetails: false,
      ReplyMsg: false,
      messageReply: false
    }
    this.message = React.createRef();
    this.indexValue = 0;
    this.previousMessage = '';
  }
  socket = null;
  componentDidMount = () => {
    this.socket = getSocket();
    this.socket.emit("joinRoom", { username: this.props.user.username, client2: this.props.client.username });
    this.socket.on("messages", this.onMessages);
    this.socket.on("message", this.onMessage);
    this.socket.on("typing-start", this.onTyping);
    this.socket.on("typing-end", this.onTyping);
  }

  componentWillUnmount() {
    this.socket.off('message', this.onMessage);
    this.socket.off('messages', this.onMessages);
    this.socket.off("typing-start", this.onTyping);
    this.socket.off("typing-end", this.onTyping);
  }

  onTyping = (data) => {
    console.log(data)
    if (this.props.user.username !== data.username) {
      this.setState({ isOponentTyping: data.typing });
    }
  }

  onMessage = (data) => {
    this.socket.emit("read_status", { username: this.props.user.username, client2: this.props.client.username, messageIds: [data.id] })
    let messages = this.state.messages;
    Object.assign(data, { showMsgOptions: false, msgReply: false })
    messages.push(data);
    this.previousDate = null;
    this.setState({ messages: messages });
  }

  onMessages = (data) => {
    let msgIds = data.messages.filter((msg) => {
      if (msg.readStatus === 0 && this.props.user.username !== msg.username)
        return msg.id;
    });
    if (msgIds && msgIds.length) {
      this.socket.emit("read_status", { username: this.props.user.username, client2: this.props.client.username, messageIds: msgIds });
    }
    console.log(data.messages);
    this.setState({ messages: data.messages });
  }

  send = (type) => {
    if (this.state.isEmojiActive) {
      this.setState({ isEmojiActive: false });
    }
    if (this.message.current.value) {
      console.log('chat started', this.props.user);
      this.socket.emit("chat", {
        username: this.props.user.username,
        client2: this.props.client.username,
        message: this.message.current.value,
        messagePopUp: false
      });
      this.message.current.value = '';
    }
    else {
      this.indexValue = type
      console.log(this.indexValue)
      console.log('reply', this.props.user)
      this.setState({ ReplyMsg: true, messageReply: false })
      this.socket.emit("reply", { username: this.props.user.username, client: this.props.client.username, messageId: this.indexValue, message: this.message.current.value })
      this.previousMessage = this.state.messages[this.indexValue].message.length === 2 ? this.state.messages[this.indexValue].message[1] : this.state.messages[this.indexValue].message
    }

  }
  settings = () => {
    this.setState({ menu: true })
  }

  getTimeByTimestamp = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let ampm = date.getHours() >= 12 ? 'pm' : 'am';
    let hours = date.getHours() >= 12 ? date.getHours() - 12 : date.getHours();
    return hours + ":" + date.getMinutes() + ampm;
  }
  previousDate = null;
  getDateByTimestamp = (timestamp) => {
    let date = new Date(timestamp * 1000);
    if (!this.previousDate) {
      this.previousDate = date;
      return (<div className="chatroom-date">{date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}</div>);
    }
    else {
      if (this.previousDate.getDate() < date.getDate())
        return (<div className="chatroom-date">{date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}</div>);
    }

  }
  sendTypingStartStatus = () => {
    this.socket.emit("typing-start", { username: this.props.user.username, client2: this.props.client.username });
  }

  sendTypingEndStatus = () => {
    this.socket.emit("typing-end", { username: this.props.user.username, client2: this.props.client.username });
  }

  handleEmoji = () => {
    this.setState({ isEmojiActive: !this.state.isEmojiActive });
  }

  imageUploading = (e) => {
    console.log(e.target.files[0], 'image event');
    if (!e.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {
      alert('worng format of file');
    } else {
      if (e.target.files[0].size / 1024 < 1024) {
        console.log('file is below 2mb and image format is also acceptable');
      }
    }

  }
//For Displaying message popup
  showMessagePopUp = (index) => {
    let messages = this.state.messages
    for (let i = 0; i < messages.length; i++) {
      if (i === index) {
        messages[i].messagePopUp = true;
        this.setState({});
      } else {
        if (messages[i].messagePopUp) {
          messages[i].messagePopUp = false;
          this.setState({});
        }
      }
    }
    //closing message popup by clicking outside
    this.closePopup = () => {
      let message = this.state.messages;
      if (message[index]) {
        if (messages[index].messagePopUp) {
          messages[index].messagePopUp = false;
          this.setState({})
        }
      }
      this.setState({ messages: messages });
    }
  }
  
  render() {
    const { messages, isEmojiActive } = this.state;
    return (
      <div className='chat-room' onClick={this.closePopup} >
        <ClientHeader title={this.props.client.username} />
        <div className='msg-container'>
          {messages && !!messages.length && messages.map((message, index) => {
            console.log(messages)
            return (<div className='message-field' key={index}>
              {this.getDateByTimestamp(message.timestamp)}
              {message.username === this.props.user.username ?
                (<div className="msg-field-container">
                  <span className='msg-right'><span className="popup" alt="dots" onClick={() => { this.showMessagePopUp(index) }}>v</span>{message.message}</span>
                  {message.messagePopUp && <MessagePopup type="right"/>}
                  <span className='msg-time-right'>{this.getTimeByTimestamp(message.timestamp)}</span>
                  < span className='msg-time-right'>{message.readStatus ? <img src={readIcon} /> : <img src={deliveredIcon} />}</span>
                </div>) :
                (<div className="msg-field-container aln-left">
                  <span className='msg-left'><span className="popup" alt="dots" onClick={() => { this.showMessagePopUp(index) }}>v</span>{message.message}</span>
                  {message.messagePopUp && <MessagePopup type="left" />}
                  <span className='msg-time-left'>{this.getTimeByTimestamp(message.timestamp)}</span>
                </div>)
              }
            </div>)
          })}
          {this.state.isOponentTyping &&
            <div className="typing">
              <div className="bounce">
              </div>
              <div className="bounce1">
              </div>
              <div className="bounce2">
              </div>
            </div>}
        </div>

        {this.state.ReplyMsg ? <div className='footer-reply'><div className="emoji">
          {<img alt='emoji' src={this.emoji} onClick={() => { this.handleEmoji() }} />}
          {isEmojiActive &&
            <div className="emoji-holder">
              <Picker
                onEmojiClick={(obj, data) => {
                  this.message.current.value = this.message.current.value + data.emoji;
                }}
                disableAutoFocus={true}
                skinTone={SKIN_TONE_MEDIUM_DARK}
                groupNames={{ smileys_people: 'PEOPLE' }}
                pickerStyle={{ 'boxShadow': 'none' }}
                native
              />
            </div>
          }
        </div>
          <div className='message-input'>
            <textarea className='textfield' id="textip" ref={this.message} onFocus={() => { this.sendTypingStartStatus() }} onBlur={() => { this.sendTypingEndStatus() }} placeholder='Type a message' />
          </div>
          <div className='submit-button'>
            <button className='send' onClick={() => { this.send('reply-send') }}>Send</button>
          </div>
        </div> :
          <div className='footer'>
            <div className="emoji">
              {<p className='emoji-style' onClick={() => { this.handleEmoji() }}>+</p>}
              {isEmojiActive &&
                <div className="emoji-holder">
                  <Picker
                    onEmojiClick={(obj, data) => {
                      this.message.current.value = this.message.current.value + data.emoji;
                    }}
                    disableAutoFocus={true}
                    skinTone={SKIN_TONE_MEDIUM_DARK}
                    groupNames={{ smileys_people: 'PEOPLE' }}
                    pickerStyle={{ 'boxShadow': 'none' }}
                    native
                  />
                </div>
              }
            </div>
            <div className="emoji">
              <input type="file" onChange={this.imageUploading}  ></input></div>
            <div className='message-input'>
              <textarea ref={this.message} onFocus={() => { this.sendTypingStartStatus() }} onBlur={() => { this.sendTypingEndStatus() }} placeholder='Type a message' />
            </div>
            <div className='submit-button'>
              <button className='send' onClick={() => { this.send('send') }}>Send</button>
            </div>
          </div>}

      </div>
    )
  }
}

const mapStateToProps = (state) => (
  console.log('map state to props', state),
  {
    user: state.user.userDetails,
    client: state.user.client,
    socket: state.socket
  }
);

export default connect(mapStateToProps, null)(ChatRoom);

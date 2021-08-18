import React, { Component } from 'react';
import './chatroom.css';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import { getSocket } from '../../../service/socket';
import { connect } from 'react-redux';
import emoji from './../../../assests/emoji.png';
import Header from '../Common/Header';

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
  }
  socket = null;
  componentDidMount = () => {
    this.socket = getSocket();
    this.socket.emit("joinRoom", { username: this.props.user.username, client2: this.props.client.username });
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
      if (this.props.user.username !== data.username) {
        this.setState({ isOponentTyping: data.typing });
      }

    });
    this.socket.on("typing-end", (data) => {
      if (this.props.user.username !== data.username) {
        this.setState({ isOponentTyping: data.typing });
      }
    });
  }

  send = () => {
    if(this.state.isEmojiActive){
      this.setState({ isEmojiActive: false});
    }
    if (this.message.current.value) {
      console.log('chat started', this.props.user);
      this.socket.emit("chat", {
        username: this.props.user.username,
        client2: this.props.client.username,
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
  previousDate=null;
  getDateByTimestamp=(timestamp)=>{
    let date = new Date(timestamp * 1000);
    if(!this.previousDate){
      this.previousDate = date;
      return(<div className="chatroom-date">{date.getDate()+"/"+(date.getMonth(+1))+"/"+date.getFullYear()}</div>);
    }
    else{
      if(this.previousDate.getDate() < date.getDate())
       return(<div className="chatroom-date">{date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()}</div>);
    }

  }
  sendTypingStartStatus = () => {
    console.log('type start');
    this.socket.emit("typing-start", { username: this.props.user.username, client2: this.props.client.username });
  }

  sendTypingEndStatus = () => {
    console.log('type end');
    this.socket.emit("typing-end", { username: this.props.user.username, client2: this.props.client.username });
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

  imagePicker=(e)=>{
    console.log(e.target.files[0],'image event');
      if (!e.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i))
      {
        alert('worng format of file');
      }else{
        if(e.target.files[0].size/1024<1024){
          console.log('file is below 2mb and image format is also acceptable');
        }
      }
    
  }

  render() {
    const { messages, isEmojiActive } = this.state;
    return (
      <div className='chat-room' >
        <Header title={this.props.clientusername}/>
        <div className='msg-container'>
          {messages && !!messages.length && messages.map((message, index) => {
            return (<div className='message-field' key={index}>
              {this.getDateByTimestamp(message.timestamp)}
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
            
          </div>}
        </div>
        <div className='footer'>
          <div className="emoji">
            {<img alt='emoji' src={emoji} onClick={() => { this.handleEmoji() }} />}
            {isEmojiActive &&
            <div className="emoji-holder">
              <Picker
                onEmojiClick={(obj, data)=>{
                  this.message.current.value = this.message.current.value + data.emoji;
                }}
                disableAutoFocus={true}
                skinTone={SKIN_TONE_MEDIUM_DARK}
                groupNames={{ smileys_people: 'PEOPLE' }}
                pickerStyle={{'boxShadow': 'none'}}
                native
              />
            </div>
            }
          </div>
            {/* {<img alt='imageUplode'  src={emoji} onClick={()=>{this.imagePicker()}} />} */}
            <div src={emoji}  className="emoji">
            <input type="file" onChange={this.imagePicker} ></input></div>
          
          <div className='message-input'>
            <textarea ref={this.message} onFocus={() => { this.sendTypingStartStatus() }} onBlur={() => { this.sendTypingEndStatus() }} placeholder='Type a message' />
          </div>
          <div className='submit-button'>
            <button className='send' onClick={() => { this.send() }}>Send</button>
          </div>
        </div>

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
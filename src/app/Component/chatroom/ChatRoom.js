import React, { Component } from 'react';
import './chatroom.css';
import Picker, { SKIN_TONE_MEDIUM_DARK} from 'emoji-picker-react';
import { getSocket } from '../../../service/socket';
import { connect } from 'react-redux';
import readIcon from './../../../assests/seenTick.png';
import deliveredIcon from './../../../assests/deliveredTick.png';
import ClientHeader from '../ClientDetails/ClientHeader';
import MessagePopup from './MessagePopup';
import ForwardMessage from '../ForwardMessage/ForwardMessage';
import fileuploadicon from './../../../assests/attach.png';
import { GrEmoji } from "react-icons/gr";
import {IoImagesOutline} from 'react-icons/io5';
class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: [],
      isOponentTyping: false,
      isEmojiActive: false,
      forwardPopup: false,
      forwardingMessage:'',
      reply: false,
      Index: -1,      
      reactionData: {},
      tempReaction: false
    }
    this.message = React.createRef();
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
    if (this.props.user.username !== data.username) {
      this.setState({ isOponentTyping: data.typing });
    }
  }

  onMessage = (data) => {
    this.socket.emit("read_status", { username: this.props.user.username, client2: this.props.client.username, messageIds: [data.id] })
    let messages = this.state.messages;
    Object.assign(data, {messagePopUp: false});
    messages.push(data);
    this.previousDate = null;
    this.setState({ messages: messages });
  }

  onMessages = (data) => {
    let msgIds = data.messages.filter((msg) => {
      if (msg.readStatus === 0 && this.props.user.username !== msg.username)
        return msg.id;
    });
    if(msgIds && msgIds.length){
      this.socket.emit("read_status", { username: this.props.user.username, client2: this.props.client.username, messageIds: msgIds });
    }
    this.setState({ messages: data.messages },()=>this.socket.off("messages",true));
  }

  send = (index) => {
    let tempmsg;
    tempmsg=this.message.current.value.trim();
    if (this.state.isEmojiActive) {
      this.setState({ isEmojiActive: false });
    }
    if (index === -1) {
      if (tempmsg && tempmsg.length!== 0) { 
        this.socket.emit("chat", {
          username: this.props.user.username,
          client2: this.props.client.username,
          message: tempmsg
        });
        this.message.current.value = '';
      }
      this.setState({ reply: false });

    }
    else if (index !== -1) {
      if (tempmsg && tempmsg.length!== 0) {
        this.socket.emit("reply", {
          username: this.props.user.username,
          client: this.props.client.username,
          messageId: this.state.messages[index].id,
          message: tempmsg
        });
        this.message.current.value = ''
      }
      this.setState({ Index: -1, reply: false });
    }
  }
  settings = () => {
    this.setState({ menu: true })
  }

  getTimeByTimestamp = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let ampm = date.getHours() >= 12 ? 'PM' : 'AM';
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
    this.setState({ isEmojiActive: !this.state.isEmojiActive ,tempReaction:false});
  }

  imageUploading=(e)=>{
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
  msgDisplay=()=>{
    this.setState({reply:false,Index:-1})
  }

  forwardPopup = (message) =>{
    this.setState({forwardPopup: !this.state.forwardPopup,forwardingMessage:message})
  }
  //For Displaying message popup
  showMessagePopUp = (index) => {
    let messages = this.state.messages
    for (let i = 0; i < messages.length; i++) {
      if (i === index) {
        messages[i].messagePopUp = !messages[index].messagePopUp;
        this.setState({});
      } else {
        if (messages[i].messagePopUp) {
          messages[i].messagePopUp = !messages[index].messagePopUp;
          this.setState({});
        }
      }
    }
    //closing message popup by clicking outside
    this.closePopup = () => {
      let message = this.state.messages;
      if (message[index]) {
        if (messages[index].messagePopUp) {
          messages[index].messagePopUp = !messages[index].messagePopUp;
        }
      }
      this.setState({});
    }
    
  }
  firstMsg = ''
  onclickReply = (index) => {
    this.firstMsg = this.state.messages[index].message
    this.setState({ reply: true,Index:index })
  }

  shouldComponentUpdate(nextProps, nextState) {
  return nextProps.client.username === this.props.client.username;
}
deleteMessage = (user,client,msgId) =>{
  this.socket.emit("delete", { username:user, client:client, messageId:msgId });
}  
handleReaction=(obj)=>{
    if (this.state.isEmojiActive === false) {
      this.setState({ reactionData: obj, isEmojiActive: true, tempReaction: true });
    }
    else if (this.state.isEmojiActive === true) {
      this.setState({ isEmojiActive: false })
    }
  }
  userReaction(reaction,obj){
    this.socket.emit("reaction", { username: this.props.user.username, client: this.props.client.username, messageId: obj.id, reaction: reaction })
    this.socket.once('messages', this.onMessages);
    this.setState({ reactionData: {}, isEmojiActive: false, tempReaction: false });
  }
  removeReaction = (obj) => {
    this.socket.emit("reaction", { username: this.props.user.username, client: this.props.client.username, messageId: obj.id })
    this.socket.once('messages', this.onMessages);
  }
  render() {
    const { messages, isEmojiActive , tempReaction} = this.state;
    return(
      <>
      {this.state.forwardPopup ? <ForwardMessage message={this.state.forwardingMessage} handleclose={this.forwardPopup} /> : 
      <div className='chat-room' onClick={this.closePopup} >
      <ClientHeader title={this.props.client.username} />
      <div className='msg-container'>
        {messages && !!messages.length && messages.map((message, index) => {
          return (<div className='message-field' key={index}>
            {this.getDateByTimestamp(message.timestamp)}
            {message.username === this.props.user.username && message.message?
              (<div className="msg-field-container">
                <span className='msg-right'><span className="popup" alt="dots" onClick={() => { this.showMessagePopUp(index) }}>&#8942;</span>
                  {message.hasOwnProperty('replyId') ?
                  <div>
                    {messages && messages.map((firstmsg,index) => {
                      return (
                        <div key={index} > 
                          {message.replyId === firstmsg.id ? 
                          
                          <div>
                            
                            <div className='right-reply-msg-style'><div className='right-username-style'><b>{firstmsg.username}</b></div><span className='first-msg-style'>{firstmsg.message.trim()}</span> </div>
                             <span >{message.message.trim()}</span>
                           </div> : null}
                          </div>
                          )})}
                        </div>
                  : <span >{message.message.trim()}</span>}


               </span>                
                {messages && message.reaction?<div className='msg-right-reaction'>{message.reaction}</div>:null}
                {message.messagePopUp && <MessagePopup type="right" forwardMessage={()=>this.forwardPopup(message.message)} socket={this.socket} indexValue={index} replyMsg={this.onclickReply} deleting={()=>this.deleteMessage(this.props.user.username,this.props.client.username,message.id)} />}
                <span className='msg-time-right'>{this.getTimeByTimestamp(message.timestamp)}</span>
                < span className='msg-time-right'>{message.readStatus ? <img src={readIcon} /> : <img src={deliveredIcon} />}</span>
              </div>) :
              message.message &&(<div className="msg-field-container aln-left">
                <span className='msg-left'><span className="popup" alt="dots" onClick={() => { this.showMessagePopUp(index) }}>&#8942;</span>{message.hasOwnProperty('replyId') ?
                  <div>
                    {messages.map((firstmsg) => {
                      return (
                        <div> 
                          {message.replyId === firstmsg.id ?<div onClick={()=>{this.handleReaction(message)}}><div className='left-reply-msg-style'>
                           <div className='left-username-style'><b>{firstmsg.username}</b></div>
                           <div><span className='first-msg-style'>{firstmsg.message.trim()}</span> </div></div>
                           
                           <span>{message.message.trim()}</span>
                            </div>: null}
                           </div>
                      )
                    })

                    }
                  </div>

              : <span className='message-onclick' onClick={()=>{this.handleReaction(message)}}>{message.message.trim()}</span>}
              </span>
                {messages && message.reaction?<div className='msg-reaction-left' onClick={()=>{this.removeReaction(message)}}><span  style={{float:'right'}}>{message.reaction}</span></div>:null}
                {message.messagePopUp && <MessagePopup forwardMessage={()=>this.forwardPopup(message.message)} type="left" indexValue={index} replyMsg={this.onclickReply} />}                             
                <span className='msg-time-left'>{this.getTimeByTimestamp(message.timestamp)}</span>
              </div>)
            }
          </div>)
        })}
        {this.state.isOponentTyping &&
          <div>
            <div className="msg-left" style={{width:'14px',paddingLeft:'13px',marginLeft:'5px'}}>
              <div className="bounce">
              </div>
              <div className="bounce1">
              </div>
              <div className="bounce2">
              </div>
            </div></div>
        }
      
      </div>  
                
      <div className='footer'>
      <div>{this.state.reply ? <div className='reply'><div className='msg-style'><span style={{overflow:'hidden',color: '#c9c3b1',fontSize: 14}}>{this.firstMsg}</span>
      <span className='msg-display' onClick={this.msgDisplay}>X</span></div></div> : null}</div>
      <div className="emoji">
          <GrEmoji className='emoji-style' onClick={() => { this.handleEmoji() }}/>
         {isEmojiActive===true && tempReaction===true?<div className="emoji-holder">
              <Picker
                onEmojiClick={(obj, data) => {            
                  this.userReaction(data.emoji,this.state.reactionData)
                }}
                disableAutoFocus={true}
                skinTone={SKIN_TONE_MEDIUM_DARK}
                groupNames={{ smileys_people: 'PEOPLE' }}
                pickerStyle={{ 'boxShadow': 'none' }}
                native
              />
            </div>:<div>{isEmojiActive ?
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
            </div>:null
          }</div>
          }
        </div>
        <div className="images">
          <label className='fileUpload'>
          <IoImagesOutline className='fileUploadIcon' style={{color:"white"}} />
          <input className='file' type="file" onChange={this.imageUploading} ></input></label></div>

        <div className='message-input'>
          <textarea className='textfield' id="textip" ref={this.message} onFocus={() => { this.sendTypingStartStatus() }} onBlur={() => { this.sendTypingEndStatus() }} placeholder='Type a message' />        
        </div>
        <div className='submit-button'>
          <button className='send' onClick={() => { this.send(this.state.Index) }}>Send</button>
        </div>
      </div>
      </div>
  }
      </>
    );
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
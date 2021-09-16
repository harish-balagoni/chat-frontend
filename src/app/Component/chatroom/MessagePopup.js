import React, { Component } from 'react'
import './chatroom.css'
export default class MessagePopup extends Component {


   deleteMessage=(msgid)=>
   {
    this.props.socket.on('messages',this.props.onMessages);
       this.props.socket.emit("delete", { username:this.props.userName, client:this.props.clientName, messageId:msgid });
       this.props.socket.once('messages',this.props.onMessages);
   }

    render() {

            return (
                <div>
                    <div className={(this.props.type==="right")? 'messagepopup-right': 'messagepopup-left'} >
                    <div className="messagepopup-items" onClick={()=>{this.props.replyMsg(this.props.indexValue)} }>Reply</div>
                    <div className="messagepopup-items" onClick={()=>{this.props.forwardMessage()}}>Forward Message</div>
                    <div className="messagepopup-items"   onClick={()=>{this.props.deleting()}} >Delete Message</div>
                    <div className="messagepopup-items" >Star Messages</div>
                </div>
                </div>
            )
    }
}

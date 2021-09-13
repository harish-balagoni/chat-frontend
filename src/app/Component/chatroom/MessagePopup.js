import React, { Component } from 'react'
import './chatroom.css'
export default class MessagePopup extends Component {


   deleteMessage=(msgid)=>
   {

       this.props.socket.emit("delete", { username:this.props.userName, client:this.props.clientName, messageId:msgid })
   }

    render() {

            return (
                <div>
                    <div className={(this.props.type==="right")? 'messagepopup-right': 'messagepopup-left'} >
                    <div className="messagepopup-items" onClick={()=>{this.props.replyMsg(this.props.indexValue)} }>Reply</div>
                    <div className="messagepopup-items" onClick={()=>{this.props.forwardMessage()}}>Forward Message</div>
                    <div className="messagepopup-items"   onClick={()=>this.props.type==='right' && this.deleteMessage(this.props.messageId)} >Delete Message</div>
                    <div className="messagepopup-items" >Star Messages</div>
                </div>
                </div>
            )
    }
}

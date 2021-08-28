import React, { Component } from 'react'
import './chatroom.css'
export default class MessagePopup extends Component {
    render() {
        if(this.props.type==="right"){
        return (
            
            <div className="messagepopup-right">
                <div className="messagepopup-items" >Reply</div>
                       <div className="messagepopup-items">Forward Message</div>
                       <div className="messagepopup-items" onClick={() => {this.props.messages(this.props.index) }}>Delete Message</div>
                       <div className="messagepopup-items" >Star Messages</div>
            </div>
        )
    }

 else if(this.props.type==="left"){
    return (
        
        <div className="messagepopup-left">
            <div className="messagepopup-items" >Reply</div>
                   <div className="messagepopup-items">Forward Message</div>
                   <div className="messagepopup-items" onClick={() => {this.props.messages(this.props.index) }}>Delete Message</div>
                   <div className="messagepopup-items" >Star Messages</div>
        </div>
    )
}
}
}

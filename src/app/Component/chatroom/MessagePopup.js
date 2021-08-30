import React, { Component } from 'react'
import './chatroom.css'
export default class MessagePopup extends Component {
    render() {
        
            return (
                <div>
                {this.props.type==="right" ?
                <div className="messagepopup-right">
                    <div className="messagepopup-items" >Reply</div>
                           <div className="messagepopup-items">Forward Message</div>
                           <div className="messagepopup-items">Delete Message</div>
                           <div className="messagepopup-items" >Star Messages</div>
                </div>
           :
            <div className="messagepopup-left">
                <div className="messagepopup-items" >Reply</div>
                       <div className="messagepopup-items">Forward Message</div>
                       <div className="messagepopup-items">Delete Message</div>
                       <div className="messagepopup-items" >Star Messages</div>
            </div>
                }
                </div>
            )
    }
}

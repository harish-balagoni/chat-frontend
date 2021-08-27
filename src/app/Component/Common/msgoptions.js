import React, { Component } from 'react';
import './Header.css';
import { withRouter } from "react-router";

class MessageOptions extends Component {
    render() {
        return (
            <div className='overlay' onClick={this.props.onClose}>
                <div className="options">
                    <div className="option-item" onClick={this.props.messageReply}>Reply</div>
                    <div className="option-item">starred</div>
                    <div className="option-item-forward">forward</div>
                   
                </div>
            </div>
        )
    }
}



export default (withRouter(MessageOptions));


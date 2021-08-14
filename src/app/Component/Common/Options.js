import React, { Component } from 'react';
import './Header.css';

export default class Options extends Component {
    render() {
        return (
            <div className="options">
                <div className="option-item" onClick={this.props.showProfile}>Profile</div>
                <div className="option-item">Add to archieve</div>
                <div className="option-item-logout">Logout</div>
            </div>
        )
    }
}

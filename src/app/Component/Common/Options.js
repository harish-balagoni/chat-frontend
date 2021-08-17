import React, { Component } from 'react';
import './Header.css';
import { withRouter } from "react-router";
import { connect } from 'react-redux';

import { logOut } from '../../actions/actions';

class Options extends Component {
    logOut = () => {
        this.props.logOut();
        this.props.history.push('/');
    }
    render() {
        return (
            <div className='overlay' onClick={this.props.onClose}>
                <div className="options">
                    <div className="option-item" onClick={this.props.showProfile}>Profile</div>
                    <div className="option-item">Add to archieve</div>
                    <div className="option-item-logout" onClick={this.logOut}>Logout</div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    logOut: () => dispatch(logOut()),
})

export default connect(null, mapDispatchToProps)(withRouter(Options));
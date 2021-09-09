import React, { Component } from 'react';
import './ClientHeader.css'
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { logOut } from '../../actions/actions';

class HeaderOptions extends Component {
    logOut = () => {
        this.props.logOut();
        this.props.history.push('/');
    }
    render() {
        return (
            <div className='overlay1' onClick={this.props.onClose}>
                <div className="options1">
                    <div className="option-item2" onClick={this.props.showProfileDetails}>Profile</div>
                    <div className="option-item1">Add to archive</div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    logOut: () => dispatch(logOut()),
})

export default connect(null, mapDispatchToProps)(withRouter(HeaderOptions));
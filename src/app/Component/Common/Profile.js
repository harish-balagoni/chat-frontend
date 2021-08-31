import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProfileUploader from '../uploadprofile';
class Profile extends Component {
    render() {
        return (
            <div className="header-profile-main">
                <div className="header-profile-item">
                    <ProfileUploader/>
                </div>
                <div className="header-profile-item">{this.props.user.username}</div>
                <div className="header-profile-item">{this.props.user.email}</div>
                <div className="header-profile-item">(+91) {this.props.user.mobile}</div>
            </div>
        )
    }
}

const mapStateToProps = (state) => (
    {
        user: state.user.userDetails,
    }
);

export default connect(mapStateToProps, null)(Profile);
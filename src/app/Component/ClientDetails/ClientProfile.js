import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ClientHeader.css';
class ClienttProfile extends Component {
    render() {
        return (
            <div className="header-profile-main">
                <div className="header-profile-item">
                    <img className="header-profile-image" src={this.props.user.profile} alt="image" />
                </div>
                <div className="header-profile-item">Name : {this.props.user.username}</div>
                <div className="header-profile-item">Email : {this.props.user.email}</div>
                <div className="header-profile-item">Mobileno : (+91) {this.props.user.mobile}</div>
            </div>
        )
    }
}

const mapStateToProps = (state) => (
    console.log("client data", state),
    {
        user: state.user.client,
    }
);
export default connect(mapStateToProps, null)(ClienttProfile);
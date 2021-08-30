import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import ClientHeader from './ClientHeader';
class ClienttProfile extends Component {
    constructor() {
        super()
        this.state = {
            imageView: true
        }

    }
    viewImage=() =>{
        if (this.state.imageView) {
            this.setState({ imageView: false })
        } else {
            this.setState({ imageView: true })
        }

    }
    render() {
        return (
            <div className="entire">
                <div>
                <ClientHeader title="Profile"/>
                </div>
                <div className="client-header-profile-main">
                {this.state.imageView ? <div>
                    <div className="header-button"><button onClick={() => { this.props.history.push('/ChatRoom') }}>X</button></div>
                    <div className="client-header-profile-image-item">
                        <Link onClick={() => { this.viewImage()}} > <img className="client-header-profile-image" src={this.props.user.profile} alt="image" /></Link>
                    </div>
                    <hr></hr>
                    <div className="client-header-profile-item">{this.props.user.username}</div>
                    <div className="client-header-profile-item">{this.props.user.email}</div>
                    <div className="client-header-profile-item">(+91) {this.props.user.mobile}</div></div> : <div className="client-header-profile-image-item1"><Link onClick={() => { this.viewImage() }} > <img className="client-header-profile-view-image" src={this.props.user.profile} alt="image" /></Link></div>}</div>
                    
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
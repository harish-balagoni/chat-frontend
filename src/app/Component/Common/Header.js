import React, { Component } from 'react';
import './Header.css';
import { connect } from 'react-redux';
import menu from '../../../assests/three-dots-vertical.svg';
import Options from './Options';
import Profile from './Profile';
import { socketConnect } from '../../../service/socket';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowOptions: false,
            isShowProfile: false
        }
    }

    componentDidMount(){
        socketConnect(()=>{});
    }

    showProfile = () => {
        this.setState({ isShowProfile: true, isShowOptions: false });
    }

    showOptions = () => {
        this.setState({ isShowOptions: true, isShowProfile: false })
    }

    render() {
        return (
            <div className="common-header">
                <div className="header-profile">
                    <img className="header-image" src={this.props.user.profile} alt="profile" />
                </div>
                <div className="header-name">{this.props.title}</div>
                <div className="header-menu">
                    <img src={menu} style={{ cursor: 'pointer' }} alt="menu" onClick={() => { this.showOptions() }} />
                </div>
                {this.state.isShowOptions && <Options showProfile={this.showProfile}
                    onClose={() => { this.setState({ isShowOptions: false }) }} />}
                {this.state.isShowProfile && <Profile />}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.userDetails
});

export default connect(mapStateToProps, null)(Header)
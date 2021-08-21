import React, { Component } from 'react';
import './Header.css';
import { connect } from 'react-redux';
import menu from '../../../assests/three-dots-vertical.svg';
import Options from './Options';
import Profile from './Profile';
import StarMessages from './StarMessages';
import { socketConnect } from '../../../service/socket';
import ReactNotifications, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowOptions: false,
            isShowProfile: false,
            isShowStarredMessages: false
        }
    }

    componentDidMount() {

        console.log("componentdidmount eader rendered", Math.random());
        socketConnect((socket) => {
            this.socket = socket;
            this.socket.emit("notifications", { username: this.props.user.username });
            this.socket.on("notification", this.onNotification);
        });
    }

    componentWillUnmount = () => {
        this.socket.off("notification", this.onNotification);
    }

    onNotification = (data) => {
        console.log(data, "got notifications");
        store.addNotification({
            title: data.username,
            message: data.message,
            type: 'default',
            container: 'top-right',
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 2000,
                onScreen: true
            }
        });
    }

    showProfile = () => {
        this.setState({ isShowProfile: true, isShowOptions: false });
    }

    showStarredMessages = () => {
        this.setState({ isShowStarredMessages: true, isShowOptions: false });
    }

    showOptions = () => {
        this.setState({ isShowOptions: true, isShowProfile: false , isShowStarredMessages : false })
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
                {this.state.isShowOptions && <Options showProfile={this.showProfile} showStarredMessages={this.showStarredMessages}
                    onClose={() => { this.setState({ isShowOptions: false }) }} />}
                {this.state.isShowProfile && <Profile />}
                {this.state.isShowStarredMessages && <StarMessages />}
                <ReactNotifications />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.userDetails
});

export default connect(mapStateToProps, null)(Header)
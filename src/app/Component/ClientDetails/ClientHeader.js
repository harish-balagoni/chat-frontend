import React, { Component } from 'react';
import './ClientHeader.css'
import { connect } from 'react-redux';
import menu from '../../../assests/three-dots-vertical.svg';
// import Options from './Options';
// import Profile from './Profile';
// import ClientProfile from './ClientProfile';
import HeaderOptions from './HeaderOptions'
import ClienttProfile from './ClientProfile';
import { socketConnect } from '../../../service/socket';
import ReactNotifications, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import Navigationmenu from '../Common/Navigationmenu';

class ClientHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowOptions: false,
            isShowProfile: false
        }
    }

    componentDidMount() {

        console.log("componentdidmount eader rendered", Math.random());
        socketConnect((socket) => {
            this.socket= socket;
            this.socket.emit("notifications", { username: this.props.user.username });
            this.socket.on( "notification",this.onNotification );
        });
    }

componentWillUnmount=()=>{
    this.socket.off( "notification",this.onNotification );
}

    onNotification=(data)=>{
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

    showOptions = () => {
        this.setState({ isShowOptions: true, isShowProfile: false })
    }

    render() {
        return (
            <div className="client-common-header">
                <Navigationmenu />
                <div className="client-header-profile">
                    <img className="client-header-image" src={this.props.user.profile} alt="profile" />
                </div>
                <div className="client-header-name">{this.props.title}</div>
                <div className="client-header-menu">
                    <img src={menu} style={{ cursor: 'pointer' }} alt="menu" onClick={() => { this.showOptions() }} />
                </div>
                {this.state.isShowOptions && <HeaderOptions showProfile={this.showProfile}
                    onClose={() => { this.setState({ isShowOptions: false }) }} />}
                <ReactNotifications />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.userDetails
});

export default connect(mapStateToProps, null)(ClientHeader)
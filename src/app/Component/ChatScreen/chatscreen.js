import React, { Component } from "react";
import "./chatscreen.css";
import Header from "../Common/Header";
import axios from "axios";
import { connect } from "react-redux";
import { createClient } from "../../actions/actions";
import { loaderService } from "../../../service/loaderService";
import { socketConnect } from '../../../service/socket';
import CatchError from "../CatchError/CatchError";
import Archive from './../../../assests/Archive.svg';
// import NotificationSound from "../Common/NotificationSound";
import { BsChatDots } from 'react-icons/bs';
class ChatScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: null,
            user: this.props.location.state && this.props.location.state.user,
            menu: false,
            settingDetails: false,
            isEmpty: false,
            catchError: false,
            onNotificationSound: false,
            hideMenu: false
        };
        console.log(this.props);
        loaderService.show();
    }
    componentDidMount() {
        this.getContacts();
        socketConnect((socket) => {
            this.socket = socket;
            this.socket.emit("notifications", { username: this.props.user.username });
            this.socket.on("notification", this.onNotification);
        });
    }

    componentWillUnmount = () => {
        this.socket.off("notification", this.onNotification);
    }

    onNotification = () => {
        this.getContacts();
        // this.setState({ onNotificationSound: true });
    }

    getContacts = () => {
        console.log("data", this.props.user);
        if (!this.state.catchError) {
            axios
                .request({
                    method: "POST",
                    url: `https://ptchatindia.herokuapp.com/conversations`,
                    headers: {
                        authorization: this.props.user.token,
                    },
                    data: {
                        username: this.props.user.username,
                        is_archive: 0
                    },
                })
                .then((res) => {
                    console.log("response", res.data.data);
                    if (res.status === 200) {
                        if (res.data.data && res.data.data.length) {
                            let details = [];
                            res.data.data.map((user) => {
                                if (user.username !== this.props.user.username) {
                                    details.push(user);
                                }
                            });
                            this.setState({ Data: details });
                            loaderService.hide();
                        }
                        else {
                            this.setState({ isEmpty: true });
                            loaderService.hide();
                        }
                    }
                })
                .catch((err) => {
                    if (err.response.status != 200) {
                        loaderService.hide();
                        this.setState({ catchError: !this.state.catchError })
                    }
                })
        };
    }
    archiveMessage = (id) => {
        axios
            .request({
                method: "POST",
                url: `https://ptchatindia.herokuapp.com/archive`,
                headers: {
                    authorization: this.props.user.token,
                },
                data: {
                    username: this.props.user.username,
                    roomIds: [id],
                },
            }).then((res) => {
                console.log("response", res.data);
            })
    };

    open = (user) => {
        this.props.createClient(user);
        this.props.history.push({
            pathname: "/ChatRoom"
        });
    };
    settings = () => {
        this.setState({ menu: true });
    };
    settingDetails = () => {
        this.setState({ settingDetails: true });
    };
    cancel = () => {
        this.setState({ menu: false, settingDetails: false });
    };
    selectContact = () => {
        this.props.history.push({
            pathname: "/contacts"
        })
    }

    getTimeByTimestamp = (timestamp) => {
        console.log("Timestamp", timestamp);
        let date = new Date(timestamp * 1000);
        let ampm = date.getHours() >= 12 ? 'pm' : 'am';
        let hours = date.getHours() >= 12 ? date.getHours() - 12 : date.getHours();
        return hours + ":" + date.getMinutes() + ampm;
    }

    getDurationByTimestamp = (timestamp) => {
        /*
        random time stamps
        1629012012 --- 15/08/2021 4 days ago
        1628302023 --- 7/8/21 1 week
        1618471212 --- 15/04/21 4 months
        1587262023 --- 19/04/20  1 year
         */

        let date = new Date(timestamp * 1000);
        let days = (new Date() - new Date(date.getFullYear(), date.getMonth(), date.getDate())) / (1000 * 60 * 60 * 24);
        days = Math.floor(days);
        let weeks = Math.floor(days / 7);
        let months = Math.floor(days / 30);
        let years = Math.floor(days / 365);
        console.log(days);
        if (days === 0) return 'Today';
        else if (days === 1) return 'Yesterday';
        else if (days < 8) return (days + ' days' + ' ago');
        else if (weeks === 1) return (weeks + ' week' + ' ago');
        else if (weeks < 6) return (weeks + ' weeks' + ' ago');
        else if (months === 1) return (months + ' month' + ' ago');
        else if (months < 13) return (months + ' months' + ' ago');
        else if (years === 1) return (years + ' year' + ' ago')
        else return (years + ' years' + ' ago');
    }
   
    hideMenuBar = () => {
        this.setState({hideMenu: !this.state.hideMenu});
    }

    render() {
        const { isLoading, Data } = this.state;
        return (
            <div className="entire-area">
                {/* {this.state.onNotificationSound ? <NotificationSound /> : null} */}
                <Header title="Conversations" callBack={this.hideMenuBar} />
                <div className={this.state.hideMenu ? "menu-active":null}>
                    {this.state.isEmpty && <div>No conversations found</div>}
                    {!this.state.catchError ? <div><div className="chats">
                        {this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
                            return (
                                user.messages && !!user.messages.length &&
                                <div key={index} className="contact" onClick={() => {
                                    this.open(user.client);
                                }}>
                                    <div className="profile-img">
                                        <img src={user.client.profile} className="image"></img>
                                    </div>
                                    <div className="text profile-nm">
                                        <div className="profile-name">
                                            {user.client.username}
                                        </div>
                                        <p>{user.latest.message}</p>
                                    </div>
                                    <div className="profile-time"><div>{this.getTimeByTimestamp(user.latest.timestamp)}</div><div>{' ' + this.getDurationByTimestamp(user.latest.timestamp)}</div></div>
                                    <div className="archive-submit">
                                        <img className="archive-button" src={Archive} onClick={() => { this.archiveMessage(user.id) }} ></img>
                                    </div>
                                </div>

                            );
                        })}

                    </div></div> : <CatchError callBack={this.getContacts} />}
                <div className="contacts-footer">
                    <div className="chats-position">
                        <div className="chats-button" onClick={() => { this.selectContact() }}>
                            <BsChatDots />
                        </div>
                    </div>
                </div>
            </div> 
        </div>
        );
    }
}

const mapStateToProps = (state) => (
    console.log("state home page from redux in mapstatetoprops", state),
    {
        user: state.user.userDetails,
        client: state.user.client
    }
);

const mapDispatchToProps = (dispatch) => ({
    createClient: (data) => dispatch(createClient(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);

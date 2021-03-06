import React, { Component } from "react";
import "./chatscreen.css";
import Header from "../Common/Header";
import axios from "axios";
import { connect } from "react-redux";
import { createClient } from "../../actions/actions";
import { loaderService } from "../../../service/loaderService";
import { socketConnect } from '../../../service/socket';
import CatchError from "../CatchError/CatchError";
import { pin_conversation } from '../../actions/actions';
import Archive from './../../../assests/Archive.svg';
import { BsChatDots } from 'react-icons/bs';
import menu from './../../../assests/three-dots-vertical.svg';
import ArchivePinOptions from "./ArchivePinOptions";
import { AiFillPushpin } from "react-icons/ai";
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
            hideMenu: false,
            temp:-1
        };
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
                                    Object.assign(user, { popUp: false })
                                    let found = 0;
                                    let pin_data = this.props.pin_data;
                                    if (pin_data.length === 0) details.push(user);
                                    else {
                                        for (let i = 0; i < pin_data.length; i++) {
                                            if (user.id === pin_data[i].id)
                                                found = 1
                                        }
                                        if (found === 0) {
                                            details.push(user);
                                            found = 0
                                        }
                                        else {
                                            found = 0
                                            details.unshift(user);
                                        }

                                    }
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
    archiveMessage = (id,index) => {
        let data=this.state.Data;
        data[index].optionsShow=false;
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
           this.setState({Data:data});
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

    pinContact = (obj) => {
        let pin_data = this.props.pin_data;
        let contacts = this.state.Data
        if (pin_data.length < 3) {
            pin_data.push(obj)
            let temp = [], index = 0;
            for (let i = 0; i < contacts.length; i++) {

                if (contacts[i].id === obj.id) {
                    contacts[i].optionsShow = false;
                    temp = contacts.splice(i, 1);
                }
            }
            contacts.unshift(temp[0])
            this.props.pin_conversation(pin_data);
            this.setState({ Data: contacts, chooseOption: true, });
        }
        else {
            this.setState({ Data: contacts, chooseOption: true, pin: true });
        }
    }
    unPinContact = (obj) => {
        let pin_data = this.props.pin_data;
        let contacts = this.state.Data;
        for (let i = 0; i < contacts.length; i++) {
            if (contacts[i].id === obj.id) {
                contacts[i].optionsShow = false;
                contacts.splice(i, 1);
            }
        }
        for (let i = 0; i < pin_data.length; i++) {
            if (pin_data[i].id === obj.id)
                pin_data.splice(i, 1);
        }
        contacts.push(obj);
        this.props.pin_conversation(pin_data);
        this.setState({ Data: contacts, chooseOption: true });
    }

    isPin = (obj) => {
        let pin_data = this.props.pin_data;
        let found = -1
        for (let i = 0; i < pin_data.length; i++) {
            if (pin_data[i].id === obj.id)
                found = 1;
        }
        if (found === -1) return false;
        else return true;
    }

    showOptions = (index) => {
        let data = this.state.Data;
        let temp = this.state.temp;
        if (data[index].optionsShow) {
            data[index].optionsShow = false;
        }
        else {
            if (index !== temp && temp >= 0) {
                if (data[temp])
                    data[temp].optionsShow = false;
            }
            data[index].optionsShow = true;
            temp = index;
        }
        temp = index;
        this.setState({ Data: data, temp: temp });
    }

    render() {
        const { isLoading, Data } = this.state;
        return (
            <div className="entire-area">
                <Header title="Conversations" callBack={this.hideMenuBar} />
                <div className={this.state.hideMenu ? "menu-active":null}>
                    {this.state.isEmpty && <div>No conversations found</div>}
                    {!this.state.catchError ? <div><div className="chats">
                        {this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
                            return (
                                user.messages && !!user.messages.length &&
                                <div key={index} className="contact" >
                                    <div className="profile-img">
                                        <img src={user.client.profile} className="image"></img>
                                    </div>
                                    <div className="text profile-nm" onClick={() => {
                                        this.open(user.client);
                                    }}>
                                        <div className="profile-name">
                                            {user.client.username}
                                        </div>
                                        <p>{user.latest.message}</p>
                                    </div>
                                    <div className="profile-time">
                                        <div>
                                            {this.getDurationByTimestamp(user.latest.timestamp) === 'Today' && <div>{this.getTimeByTimestamp(user.latest.timestamp)}</div>}
                                            {this.getDurationByTimestamp(user.latest.timestamp) !== 'Today' && <div>{this.getDurationByTimestamp(user.latest.timestamp)}</div>}
                                        </div>
                                    </div>
                                    <div className="archive-submit">
                                        <img className="archive-button" src={menu} onClick={() => { this.showOptions(index) }} ></img>
                                        <div>{this.isPin(user) ? <div><p style={{ color: "white" }}><AiFillPushpin size={25} /></p></div> : null}</div>
                                        {this.state.Data[index].optionsShow && <ArchivePinOptions archiveMessage={this.archiveMessage} id={this.state.Data[index].id} pinCallBack={this.pinContact}  unPinCallBack={this.unPinContact} obj={user} index={index} type='archive-pin' />}
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
    {
        user: state.user.userDetails,
        pin_data: state.user.pin_data,
        client: state.user.client
    }
);

const mapDispatchToProps = (dispatch) => ({
    createClient: (data) => dispatch(createClient(data)),
    pin_conversation: (data) => dispatch(pin_conversation(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);

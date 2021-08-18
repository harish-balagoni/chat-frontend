import React, { Component } from "react";
import "./chatscreen.css";
import Header from "../Common/Header";
import axios from "axios";
import { connect } from "react-redux";
import { createSocket } from "../../actions/actions";
import { socketConnect } from "../../../service/socket";
class ChatScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: null,
            isLoading: true,
            user: this.props.location.state && this.props.location.state.user,
            menu: false,
            settingDetails: false,
            isEmpty: false,
        };
        console.log(this.props);
    }
    componentDidMount() {
        socketConnect((socket) => {
            // this.props.createSocket(socket);
            this.socket = socket;
            this.getContacts();
        });
    }
    getContacts = () => {
        //https://ptchatindia.herokuapp.com/contacts
        console.log("data", this.props.user);
        axios
            .request({
                method: "POST",
                url: `https://ptchatindia.herokuapp.com/conversations`,
                headers: {
                    authorization: this.props.user.token,
                },
                data: {
                    username: this.props.user.username,
                },
            })
            .then((res) => {
                console.log("response", res.data);
                if (res.status === 200) {
                    if (res.data.data && res.data.data.length) {
                        let details = [];
                        res.data.data.map((user) => {
                            if (user.username !== this.props.user.username) {
                                details.push(user);
                            }
                        });
                        this.setState({ Data: details, isLoading: false });
                    }
                    else {
                        this.setState({ isEmpty: true, isLoading: false });
                    }
                }
            });
    };
    open = (user) => {
        this.props.history.push({
            pathname: "/ChatRoom",
            userDetails: this.props.user.username,
            client2: user,
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
        let date = new Date(timestamp * 1000);
        let ampm = date.getHours() >= 12 ? 'pm' : 'am';
        let hours = date.getHours() >= 12 ? date.getHours() - 12 : date.getHours();
        return hours + ":" + date.getMinutes() + ampm;
    }

    render() {
        const { isLoading, Data } = this.state;
        console.log(Data);
        if (isLoading) {
            return <div>Loading...</div>;
        }
        return (
            <div className="entire-area">
                <Header title="Conversations"/>
                <div>
                    <div className="chats">
                        {this.state.isEmpty && <div>No conversations found</div>}
                        {this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
                            return (
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
                                    <div className="profile-time">{this.getTimeByTimestamp(user.latest.timestamp)}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="contacts-footer">
                    <div className="chats-position">
                        <button className="chats-button" onClick={() => { this.selectContact() }}><img className="chats-icon" src="https://www.searchpng.com/wp-content/uploads/2019/02/Chat-Icon-PNG-1.png" /></button>
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
    }
);

const mapDispatchToProps = (dispatch) => ({
    createSocket: (socket) => dispatch(createSocket(socket))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);

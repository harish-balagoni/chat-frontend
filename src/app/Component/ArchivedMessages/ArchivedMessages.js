import React, { Component } from "react";
import "./../ChatScreen/chatscreen.css";
import Header from "../Common/Header";
import axios from "axios";
import { connect } from "react-redux";
import { createClient } from "../../actions/actions";
import { loaderService } from "../../../service/loaderService";

class ChatScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: null,
            user: this.props.location.state && this.props.location.state.user,
            menu: false,
            settingDetails: false,
            isEmpty: false,
        };
        console.log(this.props);
        loaderService.show();
    }
    componentDidMount() {
        // socketConnect((socket) => {
        //     // this.props.createSocket(socket);
        //     this.socket = socket;
        // });
        this.getContacts();
    }

    getContacts = () => {
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
                is_archive: 1,
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
            });
    };
    open = (user) => {
        this.props.createClient(user);
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

    unArchiveMessage = (id) =>{
        console.log([id],'token');
        axios
        .request({
            method: "POST",
            url: `https://ptchatindia.herokuapp.com/remove_archive`,
            headers: {
                authorization: this.props.user.token,
            },
            data: {
                username: this.props.user.username,
                roomIds:[id],
            },
        }).then((res) => {
            console.log(res.status);
                console.log("response", res.data);

            }).catch((error)=>console.log(error))
    }

    render() {
        const { isLoading, Data } = this.state;
        console.log(Data);

        return (
            <div className="entire-area">
                <Header title="Archived Messages" />
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
                                    <div className='archive-submit' onClick={()=>{
                                        this.unArchiveMessage(user.id)}}>
                                            <button className='archive-button' >Unarchive</button></div>
                                </div>
                                
                            );
                        })}
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
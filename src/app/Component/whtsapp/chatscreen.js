import React, { Component } from "react";
import "./chatscreen.css";
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
                        let index = null,
                            details = [];
                        res.data.data.map((user, index) => {
                            if (user.username === this.props.user.username) {
                                this.setState({ user: user });
                                index = index;
                            } else {
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
            userDetails: this.props.user.user.username,
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
    render() {
        const { isLoading, Data } = this.state;
        console.log(Data);
        if (isLoading) {
            return <div>Loading...</div>;
        }
        return (
            <div className="entire-area">
                <div className="header">
                    <div className="headings">
                        <h1>Chats</h1>
                    </div>

                    <div>
                        {this.state.menu ? (
                            this.state.settingDetails ? (
                                <div className="screen-pop-up-profile">
                                    <div className="settings-details-header">
                                        <h1 style={{ color: "white" }}>About</h1>
                                        <span>
                                            <button
                                                className="settings-details-cancel"
                                                onClick={() => {
                                                    this.cancel();
                                                }}
                                            >
                                                X
                                            </button>
                                        </span>
                                    </div>
                                    <div className="settings-details-body">
                                        <span>
                                            <img
                                                className="settings-profile-image"
                                                src={this.props.user.user.profile}
                                            />
                                        </span>
                                        <span className="settings-profile-text">
                                            <h5>{this.props.user.user.username}</h5>
                                        </span>
                                    </div>
                                    <div className="settings-details-footer">
                                        <span className="settings-profile-text">
                                            <h5>Email : </h5>
                                            {this.props.user.user.email}
                                        </span>
                                        <span className="settings-profile-text">
                                            <h5>Phone : </h5>
                                            {this.props.user.user.mobile}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="screen-pop-up">
                                    <div
                                        className="screen-pop-up-heading srn-head"
                                        onClick={() => {
                                            this.settingDetails();
                                        }}
                                    >
                                        {" "}
                                        Profile
                                    </div>
                                    <div className="screen-pop-up-delete-user srn-delete">
                                        delete user
                                    </div>
                                    <div className="screen-pop-up-archieve srn-archieve">
                                        Add to archieve
                                    </div>
                                    <div className="screen-pop-up-block srn-block"> block</div>
                                </div>
                            )
                        ) : (
                            <div>
                                <button
                                    className="screen-menu"
                                    onClick={() => {
                                        this.settings();
                                    }}
                                >
                                    ...
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ backgroundColor: this.state.color }}>
                    <div className="chats">
                        {this.state.isEmpty && <div>No conversations found</div>}
                        {this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
                            return (
                                <div key={index} className="contact">
                                    <div className="profile-img">
                                        <img src={user.profile} className="image"></img>
                                    </div>
                                    <div className="text profile-nm">
                                        <h2
                                            onClick={() => {
                                                this.open(user);
                                            }}
                                        >
                                            {user.username}
                                        </h2>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="contacts-footer">
                    {this.state.conversationButton ?
                        <div className="contacts-position">
                            <div className="contacts-header-position">
                                Select Contact
                            </div>
                            <div className="contacts-body-position">
                                {this.state.Data.map((user, index) => {
                                    return (
                                        <div key={index} className='contacts-list'>
                                            <span className='profile-image'>
                                                <img src={user.profile} className="img"></img>
                                            </span>
                                            <span className="contacts-list-text">
                                                <h4 onClick={() => { this.open(user) }}>{user.username}</h4>
                                            </span>
                                        </div>
                                    )
                                })
                                }
                            </div>
                        </div>
                        :
                        <div className="chats-position">
                            <button className="chats-button" onClick={() => { this.selectContact() }}><img className="chats-icon" src="https://www.searchpng.com/wp-content/uploads/2019/02/Chat-Icon-PNG-1.png" /></button>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => (
    console.log("state home page from redux in mapstatetoprops", state),
    {
        user: state.user,
    }
);

const mapDispatchToProps = (dispatch) => ({
    createSocket: (socket) => dispatch(createSocket(socket))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);

import React, { Component } from "react";
import Header from '../Common/Header';
import CatchError from '../CatchError/CatchError';
import { withRouter } from "react-router";
import { getSocket } from '../../../service/socket';
import './ForwardMessage.css';
import '../ChatScreen/chatscreen.css';
import axios from "axios";
import { connect } from "react-redux";
import { createClient } from "../../actions/actions";
import { loaderService } from "../../../service/loaderService";
import { socketConnect } from '../../../service/socket';

class ForwardMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataConversation: null,
            dataContacts:null,
            user: this.props.location.state && this.props.location.state.user,
            menu: false,
            settingDetails: false,
            isEmpty: false,
            catchError: false
        };
        console.log(this.props);
        loaderService.show();
    }
    componentDidMount() {
        console.log(this.props.user.username);
        this.getContacts();
        this.getNewContacts();
       // this.getData();
         this.socket = getSocket();
        socketConnect((socket) => {
            this.socket = socket;
            this.socket.emit("notifications", { username: this.props.user.username });
            this.socket.on("notification", this.onNotification);
        }); 
        this.setState({});
    }
   
    getNewContacts =async () => {
      await  axios
            .request({
                method: "POST",
                url: `https://ptchatindia.herokuapp.com/contacts`,
                headers: {
                  authorization: this.props.user.token,
                },
            })
            .then(async res=>{
                loaderService.show();
                console.log(res.data,'responseContacts');
                let index = null,
                details = [];
              res.data.map((user) => {
                if (user.username !== this.props.user.username){
                    details.push(user);
                }}
              );
              console.log(this.state.dataConversation);
            //   this.state.dataConversation.map((userConversation)=>{
            //       console.log(userConversation,'details');
            //       details.map((user,index)=>{
            //       if(userConversation.client.username === user.username){
            //             details.splice(index,1);
            //         }
            //     })
            // })
            console.log(details,'details');
              this.setState({ dataContacts: details });
              loaderService.hide();
            }).catch((err) => {
                console.log(err,'error');
              })
    }
    
    getContacts =async () => {
        if (!this.state.catchError) {
           await axios
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
                    console.log("responseConver", res.data.data);
                    if (res.status === 200) {
                        if (res.data.data && res.data.data.length) {
                            let details = [];
                            res.data.data.map((user) => {
                                if (user.username !== this.props.user.username) {
                                    details.push(user);
                                }
                            });
                            this.setState({ dataConversation: details });
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
    forwordUserList=[];
    open = (user) => {
        console.log(this.props.message,'clicked',user,this.props.user.username);
        this.forwordUserList.push(user);
        // this.props.createClient(user);
        // this.socket.emit("chat", {
        //     username: this.props.user.username,
        //     client2: user.username,
        //     message: this.props.message,
        //   });
        //this.props.createClient(user);
        // this.props.handleclose();
        // this.props.history.push({
        //     pathname: "/ChatRoom"
        // });
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

    handleForwardMessage = () =>{
        console.log(this.forwordUserList);
        this.forwordUserList.map(user=>{
            this.socket.emit('joinRoom', {
                username: this.props.user.username,
                client2: user.username,
              });
            this.socket.emit("chat", {
            username: this.props.user.username,
            client2: user.username,
            message: this.props.message,
          });
        })
     this.props.handleclose();
    }

    render() {
        const { isLoading, Data } = this.state;
        return (
            <div className="popup-box">
                <div className="box">
                    <div className="forward-text">
                    <span className="close-icon" onClick={this.props.handleclose} >X</span>
                    <h3>Forward message to</h3>
                    <div className="forward-div"><input className="forword-send" type="button" value="Send" onClick={this.handleForwardMessage}/></div>
                    </div>
                    {!this.state.catchError ? <div>
                        <div className="chats ">
                        {this.state.dataConversation && !!this.state.dataConversation.length && this.state.dataConversation.map((user, index) => {
                            return (
                                user.messages && !!user.messages.length &&
                                <div key={index} className="contact" 
                                // onClick={() => {
                                //     this.open(user.client);
                                // }}
                                >
                                    <div className="checkbox-div"><input className="chekbox" type="checkbox" onClick={() => {
                                                this.open(user.client);
                                            }} /></div>
                                    
                                    <div className="forward-profile-img">
                                        <img src={user.client.profile} className="image"></img>
                                    </div>
                                    <div className="text profile-nm">
                                        <div className="profile-name">
                                            
                                            {user.client.username}
                                        </div>
                                        <p>{user.latest.message}</p>
                                    </div>
                                    <div className="forward-profile-time"><div>{this.getTimeByTimestamp(user.latest.timestamp)}</div><div>{' ' + this.getDurationByTimestamp(user.latest.timestamp)}</div></div>
                                </div>  
                            );
                        })}
                         { this.state.dataContacts && !!this.state.dataContacts.length && this.state.dataContacts.map((user, index) => {
                    return (
                      <div key={index} className="contact">
                          {/* {console.log(user)} */}
                           <div className="checkbox-div"><input className="chekbox" type="checkbox" onClick={() => {
                                this.open(user);
                            }} /></div>
                        <div className="profile-img">
                          <img src={user.profile} className="image"></img>
                        </div>
                        <div className="text profile-nm">
                        {/* <input type="checkbox" onClick={() => {
                            this.open(user);
                        }} /> */}
                          <h2
                            // onClick={() => {
                            //   this.open(user)
                            // }}
                          >
                            {user.username}
                          </h2>
                        </div>
                      </div>
                    );
                  })}
                    </div>
                    {/* <div><input type="button" value="Send"/></div> */}
                    </div> : <CatchError callBack={this.getContacts} />}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
        user: state.user.userDetails,
        client: state.user.client
    });

const mapDispatchToProps = (dispatch) => ({
    createClient: (data) => dispatch(createClient(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ForwardMessage));

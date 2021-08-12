import React, { Component } from 'react';
import './chatscreen.css';
import ChatRoom from '../chatroom/ChatRoom';
export default class ChatScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Data: null,
            isLoading:true,
            user: this.props.location.state && this.props.location.state.user,
            menu:false,
            settingDetails:false,
        }
        console.log(this.props);
    }
    componentDidMount() {
        console.log(this.state.Data);
        this.getContacts();
    }
    getContacts=()=>{
        //https://ptchatindia.herokuapp.com/contacts
        fetch("https://ptchatindia.herokuapp.com/contacts").then(res => res.json()).then(res=>{
            console.log("response",res);
            let index=null,details=[];
            res.map((user,index)=>{
                
                if(user.username === this.state.user){
                    this.setState({user:user});
                    index=index;
                    
                }
                else{
                    details.push(user);
                }
            })
            this.setState({Data:details,isLoading:false});
        })
    }
    open=(user)=> {
        this.props.history.push({
            pathname:'/ChatRoom',
            userDetails: this.state.user,
            client2: user
        })
    }
    settings=()=>{
        this.setState({menu:true})
    }
    settingDetails=()=>{
        this.setState({settingDetails:true})
    }
    cancel=()=>{
        this.setState({menu:false,settingDetails:false})
    }
    render() {
        const {isLoading,Data}=this.state;
        console.log(Data);
        if(isLoading){
            return(
                <div>
                    Loding...
                </div>
            )
        }
        return (
            <div className="entire-area">
                
            <div className="header">
                <div className="headings"><h1>Chats</h1></div>
                <div>
                    {this.state.menu?
                        this.state.settingDetails?
                            <div className="screen-pop-up-profile">
                                <div className="settings-details-header">
                                    <h1 style={{color:'white'}}>About</h1>
                                    <span><button className="settings-details-cancel" onClick={()=>{this.cancel()}}>X</button></span>
                                </div>
                                <div className="settings-details-body">
                                    <span><img className="settings-profile-image" src={this.state.user.profile} /></span>
                                    <span className="settings-profile-text"><h5>{this.state.user.username}</h5></span>
                                </div>
                                <div className="settings-details-footer">
                                    <span className="settings-profile-text"><h5>Email : </h5>{this.state.user.email}</span>
                                    <span className="settings-profile-text"><h5>Phone : </h5>{this.state.user.mobile}</span>
                                </div>
                            </div>
                        :

                        <div className="screen-pop-up">
                            <div className="screen-pop-up-heading srn-head" onClick={()=>{this.settingDetails()}}>  Profile</div>
                            <div className="screen-pop-up-delete-user srn-delete">delete user</div>
                            <div className="screen-pop-up-archieve srn-archieve">Add to archieve</div>
                            <div className="screen-pop-up-block srn-block"> block</div>
                        </div>
                        
                    :
                        <div >
                            <button className="screen-menu" onClick={()=>{this.settings()}}>...</button>
                        </div>
                    }
                </div>
            </div>
            <div style={{backgroundColor:this.state.color}}>
            <div className='chats'>
                
                {this.state.Data.map((user,index) => {
                    return(
                    <div key={index} className='contact'>
                    <div className='profile-img'>
                        <img src={user.profile} className="image"></img>
                        </div>
                       <div className="text profile-nm">
                        <h2 onClick={()=>{this.open(user)}}>{user.username}</h2>
                        </div>
                    </div>
                )})}
            </div>
            </div>
            </div>
        )
    }
}

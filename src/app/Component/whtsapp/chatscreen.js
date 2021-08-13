import React, { Component } from 'react';
import './chatscreen.css';
import { socketConnect } from '../../../service/socket';
import axios from 'axios';

export default class ChatScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            Data: null,
            isLoading:true,
            user:null,
            profileUser: this.props.location.state && this.props.location.state.user,
            user: this.props.location.state && this.props.location.state.user,
            menu: false,
            settingDetails: false,
        }
        console.log(this.props);
    }

    componentDidMount() {
        socketConnect((socket) => {
            this.socket = socket;
            this.getContacts();
        });
    }
    getContacts=()=>{
        // axios.get("https://ptchatindia.herokuapp.com/conversations",{"username":"harish"})
        axios({ 
            method: 'post',
            url: 'https://ptchatindia.herokuapp.com/conversations',
            data: {
               username: 'harish'
            }
            }).then(res=>{
            console.log("response",res);
            let idx=null,details=[];
            res.map((user,index)=>{
                console.log(this.state.profileUser);
                if(user.username === this.state.profileUser){
                    this.setState({user:user});
                    idx=index;
                    
                }
                else {
                    details.push(user);
                    this.socket.emit("joinRoom", { username: this.state.user, client2: user.username });
                }
            });
            this.setState({ Data: details, isLoading: false });
        })
    }

    open = (user) => {
        this.props.history.push({
            pathname: '/ChatRoom',
            userDetails: this.state.user,
            client2: user
        })
    }

    settings = () => {
        this.setState({ menu: true })
    }

    settingDetails = () => {
        this.setState({ settingDetails: true })
    }

    cancel = () => {
        this.setState({ menu: false, settingDetails: false })
    }

    render() {
        const { isLoading, Data } = this.state;
        console.log(Data);
        if(isLoading){
            return(
                <div className="loading">
                    Loding...
                </div>
            )
        }
        return (
            <div className="entire-area">

                <div className="header">
                    <div className="headings"><h1>Chats</h1></div>
                    <div>
                        {this.state.menu ?
                            this.state.settingDetails ?
                                <div className="screen-pop-up">
                                    <div className="settings-details-header">
                                        <button onClick={() => { this.cancel() }}>X</button>
                                        <h1 style={{ color: 'white' }}>About</h1>
                                    </div>
                                    <div className="settings-details-body">
                                        <img src="" />
                                        <span>name</span>
                                    </div>
                                </div>
                                :

                                <div className="screen-pop-up">
                                    <div onClick={() => { this.settingDetails() }} style={{ padding: 10, paddingRight: 40, cursor: 'pointer' }} > <img src="https://cdn3.vectorstock.com/i/1000x1000/08/37/profile-icon-male-user-person-avatar-symbol-vector-20910837.jpg" style={{ width: 20, height: 20 }} /> Profile</div>
                                    <div style={{ padding: 10, paddingRight: 30, cursor: 'pointer' }} ><img src="https://static.vecteezy.com/system/resources/thumbnails/001/500/478/small/theme-icon-free-vector.jpg" style={{ width: 20, height: 20 }} />Themes</div>
                                    <div style={{ padding: 10, paddingRight: 50, cursor: 'pointer' }} ><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbGk-AsWSk4bsvhARgxG4RxWrx41LLfscW1g&usqp=CAU" style={{ width: 20, height: 20 }} /> Help</div>
                                </div>

                       :
                        <div style={{borderRadius:50}} >
                            <button className="screen-menu" onClick={()=>{this.settings()}}><h2>⋮</h2></button>
                        </div>
                    }
                </div>
            </div>
            <div style={{backgroundColor:this.state.color}}>
            <div className='chats'>
                
                {this.state.Data.map((user,index) => {
                    return(
                    <div key={index} className='contact' onClick={()=>{this.open(user)}}>
                    <div className='profile-img'>
                        <img src={user.profile} className="image" alt="user profile"></img>
                        </div>
            
                       <div className="text profile-nm" >
                        <h2>{user.username}</h2>
                        <p>{"hi"}</p>
                        </div> 
                         
                        <div className="time"><small class="time-text">12.06pm</small>
                        </div> 
                    

                    </div>)})}
                </div>
            </div>
            </div>
        )
    }
}

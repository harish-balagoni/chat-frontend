import React, { Component } from 'react';
import './whtsappscreen.css';
import ChatRoom from '../chatroom/ChatRoom';
export default class Whtsappscreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Data: null,
            isLoading:true,
            user: this.props.location.state && this.props.location.state.user,
            color:this.props.location&&this.props.location.color,
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
    profile=()=>{
        this.props.history.push({
            pathname:"/profile",
            user:this.state.user,
            color:this.state.color,
        })
    }
    themes=()=>{
        this.props.history.push({
            pathname:"/themes",
            user:this.state.user
        })
    }
    help=()=>{
        this.props.history.push({
            pathname:"/help",
            user:this.state.user,
            color:this.state.color,
        })
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
                <div className="headings"><h1 style={{color:'black'}}>Chats</h1></div>
                <div>
                {this.state.menu?
                    <div style={{width:10,marginLeft: 1000,height:200}}>
                        <button style={{padding:10,paddingRight:40}} onClick={()=>{this.profile()}}>Profile</button>
                        <button style={{padding:10,paddingRight:30}} onClick={()=>{this.themes()}}>Themes</button>
                        <button style={{padding:10,paddingRight:50}} onClick={()=>{this.help()}}>Help</button>
                    </div>
                :
                <div>
                    <button style={{marginLeft:1100}} onClick={()=>{this.settings()}}><img style={{width:30,height:30}} src="https://w7.pngwing.com/pngs/83/115/png-transparent-equals-symbol-menu-hamburger-button-logo-chef-menu-button-text-cooking-musician.png" /></button>
                </div>
                }
                </div>
            </div>
            <div style={{backgroundColor:this.state.color}}>
            <div id="container">
                
                {this.state.Data.map((user,index) => {
                    return(
                    <div key={index}>
                    <img src={user.profile} className="image"></img>
                       <div className="text">
                        <h1 onClick={()=>{this.open(user)}}>{user.username}</h1>
                        </div>
                    </div>

                )})}
            </div>
            </div>
            </div>
        )
    }
}

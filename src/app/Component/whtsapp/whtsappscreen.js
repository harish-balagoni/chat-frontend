import React, { Component } from 'react'
import Data from './rawdata.json';
import './whtsappscreen.css';
import ChatRoom from '../chatroom/ChatRoom';
export default class Whtsappscreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Data: null,
            isLoading:true,
            user:null,
            user: this.props.location.state && this.props.location.state.user
        }
    }
    componentDidMount() {
        console.log(this.state.Data);
        this.getContacts();
    }
    getContacts=()=>{
        fetch("https://ptchatindia.herokuapp.com/contacts").then(res => res.json()).then(res=>{
            console.log("response",res);
            let index=null,details=[];
            res.map((user,index)=>{
                
                if(user.username === 'suma'){
                    this.setState({user:user});
                    index=index;
                    
                }
                else{
                    details.push(user);
                }
                // if( user.username!== 'renu'){
                //     return user;
                // }
            
            })
            this.setState({Data:details,isLoading:false});
        })
    }
    open= (user)=> {
        this.props.history.push({
            pathname:'/ChatRoom',
            userDetails: this.state.user,
            client2: user
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
            <div className="whtsapp-screen">
            <div className="header">
                <h1 style={{color:'white'}}>Chats</h1>
            </div>
            <div className="container">
            <div style={{backgroundImage:'url("https://preview.redd.it/ts7vuoswhwf41.jpg?auto=wep&s=fe71ac2f8231b4349cfb849a027aa5f9df98add5.png")',height:"400px"}}>
                
                {this.state.Data.map((user,index) => {
                    return(
                    <div key={index}>
                    <img style={{height:40,width:40,borderRadius:40/2,marginLeft:10}} src={user.profile}className="image"></img>
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

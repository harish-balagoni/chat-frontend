import React, { Component } from 'react'
import Data from './rawdata.json';
import './whtsappscreen.css'
export default class Whtsappscreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Data: null,
            isLoading:true,
            user:null,
            profileUser: this.props.location.state && this.props.location.state.user
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
                console.log(this.state.profileUser);
                if(user.username === this.state.profileUser){
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
            <div>
                {this.state.Data.map((user,index) => {
                    return(
                    <div key={index}>
                    <img style={{height:40,width:40,borderRadius:40/2,marginLeft:10}} src={user.profile}className="image"></img>
                       <div className="text">
                        <h1>{user.username}</h1>
                        </div>
                    </div>

                )})}
            </div>
            </div>
            </div>
        )
    }
}

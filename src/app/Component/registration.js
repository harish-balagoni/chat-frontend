import React, { Component } from 'react';
import "./registration.css";

export default class Createaccount extends Component {
    constructor(props){
        super(props)
        this.state={

        }
        this.username=React.createRef();
    }
    display=()=>{
        let user=this.username.current.value; 
        this.props.history.push({
            pathname:'/chats',
            state:{user:user}
    })
    }
    render() {
        return (
            <div className="login">
                <div className="heading"><h1>Login to your account</h1></div>
                <p><input className='para' type="text" ref={this.username} placeholder="Enter your name"/></p>
                <button className="submit" onClick={()=>{this.display()}}> submit</button>
            </div>
        )
    }
}

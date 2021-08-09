import React, { Component } from 'react'

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
            <div>
                <h1>create Account</h1>
                <input type="text" ref={this.username} placeholder="Enter your name"/>
                <button onClick={()=>{this.display()}}> submit</button>
            </div>
        )
    }
}

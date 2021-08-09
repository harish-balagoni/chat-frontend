import React, { Component } from 'react'
import Data from './rawdata.json';
import './whtsappscreen.css'
export default class Whtsappscreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Data: Data
        }
    }
    componentDidMount() {
        console.log(this.state.Data);
    }
    render() {
        return (
            <div className="whtsapp-screen">
            <div className="header">
                <h1 style={{color:'white'}}>Chats</h1>
            </div>
            <div className="container">
            <div style={{backgroundImage:'url("https://preview.redd.it/ts7vuoswhwf41.jpg?auto=wep&s=fe71ac2f8231b4349cfb849a027aa5f9df98add5.png")',height:"400px"}}>
                
                {this.state.Data.map((user) => (
                    <div>
                    <img style={{height:40,width:40,borderRadius:40/2,marginLeft:10}} src={user.item.img}className="image"></img>
                       <div className="text">
                        <h1>{user.item.name}</h1>
                        <p>{user.item.message}</p>
                        </div>
                    </div>

                ))}
            </div>
            </div>
            </div>
        )
    }
}

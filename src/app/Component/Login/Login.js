import axios from 'axios';
import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import './Login.css';

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:''

        }
        this.username = React.createRef();
        this.password = React.createRef();      
    }
    // componentDidMount(){
    //     axios.post("https://ptchatindia.herokuapp.com/login",
    //     {"username":"harish balagoni",
    // "password":"login@123"}).then(res=>console.log(res)).catch(error=>console.log(error));
    // }
     checkValid=(type)=>{
         console.log(this.username.current);
        var error=[];
        console.log(this.username.current.value);
        this.setState({username:this.username.current.value,
        password:this.password.current.value})
        if(type==='username'){
            if(!this.username.current.vale){
             this.error.username= 'Please Enter Password';
            }else{
             this.setState({username:this.username.current.value})
            }
        }

        if (type === 'password') {
            if (!this.password.current.value) {
                this.errors.password = 'Please enter password.';
            }
            else if ((!this.password.current.value.match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/))) {
                this.errors.password = 'Please check password strength.';
            }
            else {
                this.setState({password:this.password.current.value})
            }
        }
    }
    checkLogin=()=>{
        console.log(this.username.current);  
        
         axios.post("https://ptchatindia.herokuapp.com/login",
        {"username":this.state.username,
       "password":this.state.password}).then(res=>{
        // if(res.status===200){
        //     this.props.history.push({
        //         pathname:'/ChatRoom',
        //         userDetails: res.data,
        //         client2: user
        //     })
        // }
        console.log(res.data)}).catch(error=>console.log(error));
    }
    render() {
        return (
            <div className='container'>
                <div className='container__body'>
                    <div className='content_container'>
                        <div className='form_conatiner'>
                        <div><h4>Welcom Back</h4></div>
                  <div><h3>Log into your account</h3></div>
                            <div className='form-group'>
                                <input type="username" name={'username'} ref={this.username} onBlur={this.checkValid} className='form-control' placeholder='Enter User Name...'/>
                            </div>
                            <div className='form-group'>
                                <input type="password" name={'password'} ref={this.password} onBlur={this.checkValid} className='form-control' placeholder='Enter Password ..' />
                            </div>

                            <div><button style={{ backgroundColor: '#408bff',
                    color: 'white',height: '37px', width: '301px', borderRadius: '25px'}} onClick={this.checkLogin} >Login</button></div>
                        </div>
                        <div><p style={{color:'FFFFFFBF'}}>Not registered yet?
                        <Link style={{color:'#ffffff'}} path=''>Register</Link></p></div>
                    </div>
                </div>
            </div>
        )
    }
}

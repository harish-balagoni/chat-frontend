import axios from 'axios';
import React, { Component } from 'react'
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import './Login.css';

import {userLogin} from '../../actions/actions';

class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:'',
            failedLogin:false
        }
        this.username = React.createRef();
        this.password = React.createRef();
    }

    errors = {}
     checkValid=(type)=>{
       // if(type==='username'){
            if(!this.username.current.value){
             this.errors.username= 'Please Enter username';
            }else{
                delete this.errors.username;
                console.log(this.username.current.value);
             this.setState({username:this.username.current.value})
            }
       // }

      //  if (type==='password') {
            if (!this.password.current.value) {
                this.errors.password = 'Please enter password.';
            }
            else {
                delete this.errors.password;
                this.setState({password:this.password.current.value})
            }
       // }
    }
    checkLogin=()=>{
       // if(Object.keys(this.errors).length)
         axios.post("https://ptchatindia.herokuapp.com/login",
        {"username":this.state.username,
       "password":this.state.password}).then(res=>{
           console.log(res.data);
        if(res.status===200){
            this.props.userLogin(res.data);
            this.props.history.push({
                pathname:'/chats'
            })
        }else
        {
            this.setState({failedLogin:!this.failedLogin,username:'',password:''})}
            console.log(res.data)}).catch(error=>
            this.setState({failedLogin:!this.failedLogin,username:'',password:''}));
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
                                <input type='username' name={'username'} ref={this.username} onBlur={this.checkValid} className='form-control' placeholder='Enter User Name...'/>
                            </div>
                            <div><p>{this.errors.username}</p></div>
                            <div className='form-group'>
                                <input type='password' name={'password'} ref={this.password} onBlur={this.checkValid} className='form-control' placeholder='Enter Password ..' />
                            </div>
                            <div><button style={{ backgroundColor: '#408bff',
                            color: 'white',height: '37px', width: '301px', borderRadius: '25px'}} onClick={this.checkLogin} >
                            Login</button></div>
                            <div style={{ color: '#FFFFFFBF' }}>
                             {this.errors.cpassword}
                            </div>
                        </div>
                        {this.state.failedLogin?<div><p>you failed tp login!!Please do confirm username and password</p></div>:null}
                        <div><p style={{color:'FFFFFFBF'}}>Not registered yet?
                        <Link style={{color:'#ffffff'}} to='/register'>Register</Link></p></div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps= (state) => (console.log('state home page from redux in mapstatetoprops',state),{
    details : state.details,
});

const mapDispatchToProps = (dispatch) => ({
    userLogin: (username) => dispatch(userLogin(username)),
});

export default connect(null,mapDispatchToProps)(Login);
import React, { Component } from 'react';
import './RegisterUser.css';

import axios from 'axios';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
                username: '',
                email: '',
                mobile: 0,
                password:''
        }
        this.username = React.createRef();
        this.email = React.createRef();
        this.password = React.createRef();
        this.mobile = React.createRef();
        this.confirmPassword = React.createRef();

    }

    //registerApiCall=()=>{
      // fetch("https://ptchatindia.herokuapp.com/register").then(res => res.json()).then(res=>console.log("response",res))
    //    axios.post('https://ptchatindia.herokuapp.com/register',{
    //        "username":"anil",
    //        "email":"anil@gamil.com",
    //        "mobile":"2132131321",
    //        "password":"123@asdf"})
    //        .then(res => console.log(res.status)).catch(error=>console.log(error));
   // }


    submit=()=> {
        //if (this.validationForm("all")) {
            console.log('api');
            axios.post("https://ptchatindia.herokuapp.com/register",{
           "username":this.state.username,
           "email":this.state.email,
           "mobile":this.state.mobile,
           "password":this.state.password})
           .then(res => console.log(res.status)).catch(error=>console.log(error));
       // }
    }

    errors = {};
    validationForm(type) { 
        if (type === "all" || type === "username") {
            if (!this.username.current.value) {
                console.log('username not valid');
                this.errors.username = 'Please enter username.';
            } else {
                console.log('username is true');
                delete this.errors.username;
            }
        }
        if (type === 'all' || type === 'email') {
            if (!this.email.current.value) {
                this.errors.email = 'Please enter email.';
            }
            else if ((!this.email.current.value.match(/^[a-zA-Z0-9.!#$%&'+/=?^_{|}~-]+@[a-zA-Z0-9-]+.+(?:\.[a-zA-Z0-9-]+)*$/))) {
                this.errors.email = 'Please check email strength.';
            }
            else {
                delete this.errors.email;
            }
        }
        if (type === 'all' || type === 'password') {
            if (!this.password.current.value) {
                this.errors.password = 'Please enter password.';
            }
            else if ((!this.password.current.value.match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/))) {
                this.errors.password = 'Please check password strength.';
            }
            else {
                delete this.errors.password;
            }
        }
        if (type === 'all' || type === 'number') {
            if (!this.mobile.current.value) {
                this.errors.mobile = 'Please enter mobile number.';
            }
            else {
                delete this.errors.mobile;
            }
        }
        
        if(type === 'all' || type === 'confirmpassword'){
            if(!this.confirmPassword.current.value){
                this.errors.cPassword = 'Please Enter Confirm Password';
            }else{
                if(this.confirmPassword.current.value === this.password.current.value)
                {this.errors.cPassword = 'Password and Confirm password should be equal';}else{
                    delete this.errors.cPassword;
                }
            }
        }
        if(Object.keys(this.errors).length === 0){
            this.setState({
                username: this.username.current.value,
                email: this.email.current.value,
                mobile: this.mobile.current.value,
                password: this.password.current.value
            })
        }
        return Object.keys(this.errors).length === 0;
    }

    render() {
        return (
            <div className='container'>
                <div className='container__body'>
                    <div className='content_container'>
                        <div className='form_conatiner'>
                         <div><h3 style={{color:'FFFFFFBF'}}>Create User</h3></div>
                                
                    <div className='form-group'>
                        <input className='form-control' type='username' ref={this.username}
                            onBlur={this.validationForm.bind(this, 'username')} placeholder="Enter Name" />
                    </div>
                    <div style={{ color: '#FFFFFFBF' }}>
                        {this.errors.username}
                    </div>
                    <div className='form-group'>
                        <input className='form-control' type='email' ref={this.email} onBlur={this.validationForm.bind(this, 'email')} placeholder="Email" ></input>
                    </div>
                    <div style={{ color: '#FFFFFFBF' }}>
                        {this.errors.email}
                    </div>
                    <div className='form-group'>
                            <input className='form-control' type='password' placeholder="Enter Password" ref={this.password} onBlur={this.validationForm.bind(this, 'password')} ></input>
                    </div>
                    <div style={{ color: '#FFFFFFBF'}}>
                        {this.errors.password}
                    </div>
                    <div className='form-group'>
                            <input className='form-control' type='password' placeholder="Confirm Password" ref={this.confirmpassword} onBlur={this.validationForm.bind(this, 'password')} ></input>
                    </div>
                    <div style={{ color: '#FFFFFFBF' }}>
                        {this.errors.cpassword}
                    </div>
                    <div className='form-group'>
                        <input className='form-control' type='number' placeholder="Enter Mobile Number" ref={this.mobile} onBlur={this.validationForm.bind(this, 'number')} maxLength={10}></input>
                    </div>
                    <div style={{ color: '#FFFFFFBF' }}>
                        {this.errors.mobile}
                    </div>
                    <div className='btn' >
                    <button style={{ backgroundColor: '#408bff',
                    color: 'white',height: '37px', width: '301px', borderRadius: '25px'}}
                    onClick={this.submit} type='button'>
                    Submit</button>
                    </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Registration;

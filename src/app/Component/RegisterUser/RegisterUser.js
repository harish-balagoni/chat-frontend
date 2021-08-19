import React, { Component } from 'react';
import './RegisterUser.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {loaderService} from '../../../service/loaderService';
import {axiosInstance} from '../../../axios/axiosInstance';
import {submitRegister} from '../../actions/actions';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            mobile: 0,
            password: ''
        }
        this.username = React.createRef();
        this.email = React.createRef();
        this.password = React.createRef();
        this.mobile = React.createRef();
        this.confirmpassword = React.createRef();
    }

    componentDidMount() {
        loaderService.hide();
    }

    submit = () => {
        if (this.validationForm("all")) {
            console.log("inside validation");
            loaderService.show();
            console.log("inside loader");
            let details = {

                username: this.username.current.value,
                email: this.email.current.value,
                mobile: this.mobile.current.value,
                password: this.password.current.value
            };
            // https://ptchatindia.herokuapp.com/register
            // axios.post("/register", details)
            axiosInstance.post(details,'/register').then(res => {
                console.log("registration",res);
                    if (res.status === 200) {
                        this.props.submitRegister(res.data.data);
                        this.props.history.push({
                            pathname: '/chats'
                        })
                    }
                }).catch(error => console.log(error));
        }
    }

    errors = {};
    validationForm(type) {
       // console.log(axiosInstance);
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
                this.errors.cpassword = 'Password field and confirm passoword should match';
            }

            if (this.password.current.value === this.confirmpassword.current.value) {
                delete this.errors.cpassword;

            } else {
                this.errors.cpassword = 'Password field and confirm passoword should match';
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

        this.setState({});
        return Object.keys(this.errors).length === 0;
    }

    render() {
        return (
            <div className='login-container'>
                <div className='login-box'>
                    <div className='login-header'>Register</div>
                    <div className='login-input'>
                        <label>Username</label>
                        <input type='text' name='username' ref={this.username} onBlur={this.checkValid} placeholder='Enter Userame...' />
                        <div className='error-msg'>{this.errors.username}</div>
                    </div>
                    <div className='login-input'>
                        <label>Email</label>
                        <input type='text' name='username' ref={this.email} onBlur={this.checkValid} placeholder='Enter Email...' />
                        <div className='error-msg'>{this.errors.username}</div>
                    </div>
                    <div className='login-input'>
                        <label>Mobile</label>
                        <input type='text' name='username' ref={this.mobile} onBlur={this.checkValid} placeholder='Enter Mobile Number...' maxLength="10"/>
                        <div className='error-msg'>{this.errors.mobile}</div>
                    </div>
                    <div className='login-input'>
                        <label>Password</label>
                        <input type='password' name='username' ref={this.password} onBlur={this.checkValid} placeholder='Enter Password...' />
                        <div className='error-msg'>{this.errors.password}</div>
                    </div>
                    <div className='login-input'>
                        <label>Confirm Password</label>
                        <input type='password' name='username' ref={this.confirmpassword} onBlur={this.checkValid} placeholder='Enter Password...' />
                        <div className='error-msg'>{this.errors.cpassword}</div>
                    </div>
                    {this.state.failedLogin && <div className='error-msg'>Invalid credentials.</div>}
                    <div className='login-submit'>
                        <button className='login-button' onClick={this.submit} >Submit</button>
                    </div>
                    <div className='register'>
                        <Link style={{ color: '#ffffff' }} to='/login'>Login</Link>
                    </div>
                </div>
            </div>
            
            );
    }
}

const mapStateToProps = (state) => ({
    details: state,
});

const mapDispatchToProps = (dispatch) => ({
    submitRegister: (details) => dispatch(submitRegister(details)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Registration);

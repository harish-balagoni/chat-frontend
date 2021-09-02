import React, { Component } from 'react';
import './RegisterUser.css';
import "../Login/CommonStyles.css";
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProfileUploader from '../ProfileUploader';
import { loaderService } from '../../../service/loaderService';
import CatchError from '../CatchError/CatchError';
import { submitRegister } from '../../actions/actions';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            mobile: 0,
            password: '',
            exsitingUser: '',
            catchError: false
        }
        this.username = React.createRef();
        this.email = React.createRef();
        this.password = React.createRef();
        this.mobile = React.createRef();
        this.confirmPassword = React.createRef();
    }

    componentDidMount() {
        loaderService.hide();
    }

    submit = () => {
        if (this.validationForm("all")) {
            loaderService.show();
            let details = {
                username: this.username.current.value,
                email: this.email.current.value,
                mobile: this.mobile.current.value,
                password: this.password.current.value
            };
            axios.post("https://ptchatindia.herokuapp.com/register", details)
                .then(res => {
                    if (res.status === 200) {
                        this.props.submitRegister(res.data.data);
                        this.props.history.push({
                            pathname: '/chats'
                        })
                    }
                }).catch(error => {
                    this.setState({ catchError: !this.state.catchError });
                    loaderService.hide();
                });
        }
    }
    catchErrorChange = () => {
        this.setState({ catchError: !this.state.catchError });
    }
    errors = {};
    validationForm(type) {
        if (type === "all" || type === "username") {
            if (!this.username.current.value) {
                console.log('username not valid');
                this.errors.username = 'Please enter username.';
            }
            else if (this.username.current.value.length < 4) {
                this.errors.username = 'Please check username length.';
            }
            else {
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
                this.errors.confirmPassword = 'Password and confirm password should match';
            }

            if (this.password.current.value === this.confirmPassword.current.value) {
                delete this.errors.confirmPassword;

            } else {
                this.errors.confirmPassword = 'Password and confirm password should match';
            }
        }
        if (type === 'all' || type === 'number') {
            if (!this.mobile.current.value) {
                this.errors.mobile = 'Please enter mobile number.';
            }
            else if (this.mobile.current.value.length !== 10) {
                this.errors.mobile = 'Please check mobile number strength.';
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
                {!this.state.catchError?
                <div className='login-box'>
                    <div className='login-header'>Register</div>
                    <div className='login-input'>
                        <label>Username</label>
                        <input type='text' ref={this.username} onBlur={this.checkValid} className="input-change"  placeholder='Enter Username' />
                        <div className='error-msg'>{this.errors.username}</div>
                    </div>
                    <div className='login-input'>
                        <label>Email</label>
                        <input type='text' ref={this.email} onBlur={this.checkValid} className="input-change"  placeholder='Enter Email' />
                        <div className='error-msg'>{this.errors.email}</div>
                    </div>
                    <div className='login-input'>
                        <label>Mobile</label>
                        <input type='number' ref={this.mobile} onBlur={this.checkValid} className="input-change"  placeholder='Enter Mobile Number' maxLength="10"/>
                        <div className='error-msg'>{this.errors.mobile}</div>
                    </div>
                    <div className='login-input'>
                        <label>Password</label>
                        <input type='password' ref={this.password} onBlur={this.checkValid} className="input-change"  placeholder='Enter Password' />
                        <div className='error-msg'>{this.errors.password}</div>
                    </div>
                    <div className='login-input'>
                        <label>Confirm Password</label>
                        <input type='password' ref={this.confirmPassword} onBlur={this.checkValid} className="input-change"  placeholder='Enter Password' />
                        <div className='error-msg'>{this.errors.confirmPassword}</div>
                    </div>
                    {this.state.failedLogin && <div className='error-msg'>Invalid credentials.</div>}
                    <div>
                       <ProfileUploader />
                    </div>
                    <div style={{color: '#cc1524'}}>
                        <p>{this.state.exsitingUser}</p>
                    </div>
                    <div className='login-submit'>
                        <button className='login-button' onClick={this.submit} >Submit</button>
                    </div>
                    <div className='register'>
                        <Link style={{ color: '#ffffff' }} to='/login'>Login</Link>
                    </div>
                </div>:<CatchError callBack={this.catchErrorChange}/>}
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

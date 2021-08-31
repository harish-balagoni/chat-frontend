import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Login.css';
import "./CommonStyles.css";
import { userLogin } from '../../actions/actions';
import { loaderService } from '../../../service/loaderService';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            failedLogin: false,
            isLoading: false
        }
        this.username = React.createRef();
        this.password = React.createRef();
    }
    componentDidMount() {
        loaderService.hide();
        if (this.props.user?.userDetails?.token) {
            this.props.history.goBack();
        }
    }
    errors = {}
    checkValid = (type) => {
        if (type === 'username' || type === 'all') {
            if (!this.username.current.value) {
                this.errors.username = 'Please enter username';
            } else {
                delete this.errors.username;
            }
        }

        if (type === 'password' || type === 'all') {
            if (!this.password.current.value) {
                this.errors.password = 'Please enter password.';
            }
            else {
                delete this.errors.password;
            }
        }

        this.setState({});
        return Object.keys(this.errors).length === 0;
    }
    checkLogin = () => {
        if (this.checkValid('all')) {
            loaderService.show();
            let details = {
                username: this.username.current.value,
                password: this.password.current.value
            };

            axios.post("https://ptchatindia.herokuapp.com/login",
                {
                    "username": this.username.current.value,
                    "password": this.password.current.value
                }).then(res => {
                    console.log(res.data);
                    if (res.status === 200) {
                        loaderService.show();
                        this.props.userLogin(res.data.data);
                        this.props.history.push({
                            pathname: '/chats'
                        });
                    } else {
                        this.setState({ failedLogin: !this.failedLogin });
                        loaderService.hide();
                    }
                }).catch((err) => {
                    console.log('errors', err.message);
                    this.setState({ failedLogin: !this.failedLogin });
                    loaderService.hide();
                });
        }
    }
    render() {
        return (
            <div className='login-container'>
                <div className='login-box'>
                    <div className='login-header'>Login</div>
                    <div className='login-input'>
                        <label>Username</label>
                        <input type='text' ref={this.username} className="input-change" onBlur={this.checkValid} placeholder='Enter Username...' />
                        <div className='error-msg'>{this.errors.username}</div>
                    </div>
                    <div className='login-input'>
                        <label>Password</label>
                        <input type='password' ref={this.password} className="input-change" onBlur={this.checkValid} placeholder='Enter Password...' />
                        <div className='error-msg'>{this.errors.password}</div>
                    </div>
                    {this.state.failedLogin && <div className='error-msg'>Invalid credentials.</div>}
                    <div className='login-submit'>
                        <button className='login-button' onClick={this.checkLogin}>Login</button>
                    </div>
                    <div className='register'>
                        <Link style={{ color: '#ffffff' }} to='/register'>Register</Link>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => (console.log('state home page from redux in mapstatetoprops', state), {
    user: state.user
});

const mapDispatchToProps = (dispatch) => ({
    userLogin: (username) => dispatch(userLogin(username)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);


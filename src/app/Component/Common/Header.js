import React, { Component } from 'react';
import './Header.css';
import { connect } from 'react-redux';
import menu from '../../../assests/three-dots-vertical.svg';
import Options from './Options';

class Header extends Component {
    constructor(props){
        super(props);
        this.state={
            isShowOptions : false
        }
    }
    render() {
        return (
            <div className="common-header">
                <div className="header-profile">
                    <img className="header-image" src={this.props.user.profile} alt="profile" />
                </div>
                <div className="header-name">{this.props.title}</div>
                <div className="header-menu">
                    <img src={menu} style={{cursor:'pointer'}} alt="menu" onClick={()=>{this.setState({isShowOptions:!this.state.isShowOptions})}} />
                </div>
                {this.state.isShowOptions && <Options />}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps, null)(Header)
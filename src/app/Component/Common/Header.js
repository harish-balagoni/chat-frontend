import React, { Component } from 'react';
import './Header.css';
import { connect } from 'react-redux';
import menu from '../../../assests/three-dots-vertical.svg';
import Options from './Options';
import Profile from './Profile';
import { socketConnect } from '../../../service/socket';
import ReactNotifications, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { searchData } from "../../actions/actions"
import { withRouter } from 'react-router';
import { BsList } from 'react-icons/bs';
import { BsXCircleFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { SideBarData } from './SideBarData';
import NotificationSound from "../Common/NotificationSound";
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowOptions: false,
            isShowProfile: false,
            searchButton: false,
            searchIcon: false,
            contactsData: [],
            onNotificationSound: false,
            sidebar: false
        }
        this.searchContact = React.createRef();
    }

    componentDidMount() {
        socketConnect((socket) => {
            this.socket = socket;
            this.socket.emit("notifications", { username: this.props.user.username });
            this.socket.on("notification", this.onNotification);
        });
        // this.setState({contactsData: this.props.usersData},()=>console.log(this.state.contactsData))
    }

    componentWillUnmount = () => {
        this.socket.off("notification", this.onNotification);
    }

    onNotification = (data) => {
        console.log(data, "got notifications");
        store.addNotification({
            title: data.username,
            message: data.message,
            type: 'default',
            container: 'top-right',
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 2000,
                onScreen: true
            }
        });
        this.setState({ onNotificationSound: true });
    }

    showProfile = () => {
        this.setState({ isShowProfile: true, isShowOptions: false });
    }

    showOptions = () => {
        this.setState({ isShowOptions: true, isShowProfile: false })
    }
    showSearchbar = () => {
        this.props.searchData([]);
        this.setState({ searchButton: this.state.searchButton ? false : true, contactsData: this.props.usersData })
    }
    showSearch = () => {
        let searchValue = this.searchContact.current.value
        let result = [];
        if (searchValue.length > 0) {
            if (isNaN(searchValue)) {
                searchValue = searchValue.toLowerCase();
                result = this.state.contactsData.filter((data) => {
                    return data.username.toLowerCase().includes(searchValue);
                });
            }
            else {
                searchValue = parseInt(searchValue);
                result = this.state.contactsData.filter((data) => {
                    return data.mobile.includes(searchValue);
                });
            }
        }
        if (searchValue.length !== 0 && result.length === 0) {
            result[0] = "notFound"
        }
        console.log("in header", result[0]);
        this.props.searchData(result);

    }

    showSidebar = () => {
        this.setState({
            sidebar: !this.state.sidebar,
            onNotificationSound: false
        });
        this.props.callBack();
    }

    render() {
        if (this.props.title === "Contacts") { this.state.searchIcon = true }
        return (
            <div>
          {this.state.onNotificationSound ? <NotificationSound /> : null}
                <div className='menu-bars'>
                    <BsList onClick={this.showSidebar} />
                </div>
                <div className={this.state.sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' >
                        <div className='close-icon'>
                            <BsXCircleFill onClick={this.showSidebar} />
                        </div>
                        <div className='menu-bars'></div>
                        <div>
                        {SideBarData.map((data, index) => {
                            return (
                                <li key={index} className={data.cName}>
                                    <Link to={data.path}>
                                        <span style={{padding:'9px'}}>{data.icon}</span>
                                        <span>{data.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                        </div>
                    </ul>
                </div>
                  <div className="common-header">
                <div className="header-profile" >
                    <img className="header-image" src={this.props.user.profile} alt="profile" />
                </div>
                <div className="header-name">{this.props.title}</div>
                <div className='header-search'>{this.state.searchButton && <input className="searchInput" autoFocus type="search" placeholder="Search contact's here" onChange={this.showSearch} ref={this.searchContact} />}
                    {this.state.searchIcon ? <img className="searchButton" src="https://img.icons8.com/material-rounded/50/ffffff/search.png" onClick={this.showSearchbar} /> : null}</div>
                <div className="header-menu">
                    <img src={menu} style={{ cursor: 'pointer' }} alt="menu" onClick={() => { this.showOptions() }} />
                </div>
                {this.state.isShowOptions && <Options showProfile={this.showProfile}
                    onClose={() => { this.setState({ isShowOptions: false }) }} />}
                {this.state.isShowProfile && <Profile />}
                <ReactNotifications />
            </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.userDetails
});
const mapDispatchToProps = (dispatch) => ({
    searchData: (data) => dispatch(searchData(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
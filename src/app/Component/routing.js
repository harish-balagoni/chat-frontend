import React from "react";
import ChatScreen from "./ChatScreen/chatscreen";
import ChatRoom from "./chatroom/ChatRoom";
import Register from "./RegisterUser/RegisterUser";
import Login from './Login/Login';
import Contacts from "./ChatScreen/contacts";
import { connect } from "react-redux";
import {
    BrowserRouter,
    Switch,
    Route

} from "react-router-dom";

function PageNotFound() {
    return (
        <div className="pageNotFound">Page Not Found</div>
    )
}
class Routing extends React.Component {
    render() {
        if (!this.props.user && !window.location.href.includes('register') && !window.location.href.includes('login')) {
            console.log(this.props.user, this.props.history, 'in routing');
            window.location.href = 'ocalhost:3000/login';
        }
        return (
            <BrowserRouter>
                <div className='dark'>
                    <Switch>
                        <Route path='/' exact component={Login}></Route>
                        <Route path='/ChatRoom' exact component={ChatRoom} />
                        <Route path='/chats' exact component={ChatScreen}></Route>
                        <Route path='/contacts' exact component={Contacts}></Route>
                        <Route path='/register' exact component={Register}></Route>
                        <Route path='/login' exact component={Login} />
                        <Route path='*' exact component={PageNotFound}></Route>
                    </Switch>
                </div>
            </BrowserRouter>
        );

    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(null, mapStateToProps)(Routing)

import React, { Suspense, lazy } from "react";
import { connect } from "react-redux";
import {
    BrowserRouter,
    Switch,
    Route

} from "react-router-dom";
import ClientProfile from "./ClientDetails/ClientProfile";
const ChatScreen = lazy(() => import("./ChatScreen/chatscreen"));
const ChatRoom = lazy(() => import("./chatroom/ChatRoom"));
const Register = lazy(() => import("./RegisterUser/RegisterUser"));
const Login = lazy(() => import('./Login/Login'));
const Contacts = lazy(() => import("./ChatScreen/contacts"));
const ArchivedMessages = lazy(() => import("./ArchivedMessages/ArchivedMessages"));

function PageNotFound() {
    return (
        <div className="pageNotFound" style={{textAlign:"center",paddingTop:"10%"}}>Page Not Found</div>
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
                    <Suspense fallback={<h1 style={{textAlign:"center",paddingTop:"20%"}}>Loading...</h1>}>
                        <Switch>
                            <Route path='/' exact component={Login}></Route>
                            <Route path='/ChatRoom' exact component={ChatRoom} />
                            <Route path='/Archived' component={ArchivedMessages} />
                            <Route path='/chats' exact component={ChatScreen}></Route>
                            <Route path='/contacts' exact component={Contacts}></Route>
                            <Route path='/register' exact component={Register}></Route>
                            <Route path='/login' exact component={Login} />
                            <Route path='/ClientProfile' exact component={ClientProfile}></Route>
                            <Route path='*' exact component={PageNotFound}></Route>
                        </Switch>
                    </Suspense>
                </div>
            </BrowserRouter>
        );

    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(null, mapStateToProps)(Routing)

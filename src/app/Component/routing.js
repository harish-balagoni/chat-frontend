import React from "react";
import Createaccount from "./registration";
import ChatScreen from "./whtsapp/chatscreen";
import ChatRoom from "./chatroom/ChatRoom";
import ProfileUser from "./HamBurgerMenu/profile";
import Themes from "./HamBurgerMenu/themes";
import Help from "./HamBurgerMenu/help";
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
export default class Routing extends React.Component {
    render() {
        return (
            <BrowserRouter>
            <div className='dark'>
                <Switch>
                    <Route path='/' exact component={Createaccount }></Route>
                    <Route path='/ChatRoom' exact component={ChatRoom}/>
                    <Route path='/chats' exact component={ChatScreen}></Route>
                    <Route path='/profile' exact component={ProfileUser}></Route>
                    <Route path='/themes' exact component={Themes}></Route>
                    <Route path='/help' exact component={Help}></Route>
                    <Route path='*' exact component={PageNotFound}></Route>
                </Switch>
                </div>
            </BrowserRouter>
        );

    }
}



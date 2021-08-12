import React from "react";
import Createaccount from "./registration";
import ChatScreen from "./whtsapp/chatscreen";
import ChatRoom from "./chatroom/ChatRoom";
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
                    <Route path='*' exact component={PageNotFound}></Route>
                </Switch>
                </div>
            </BrowserRouter>
        );

    }
}



import React from "react";
import ChatScreen from "./whtsapp/chatscreen";
import ChatRoom from "./chatroom/ChatRoom";
import Register from "./RegisterUser/RegisterUser";
import Login from './Login/Login';
import Contacts from "./whtsapp/contacts";
import {
    BrowserRouter,
    Switch,
    Route

} from "react-router-dom";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import getStore from './../reducers/index';

let { store, persistor } = getStore();

function PageNotFound() {
    return (
        <div className="pageNotFound">Page Not Found</div>
    )
}
export default class Routing extends React.Component {
    render() {
        console.log(store, 'store');
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
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
                </PersistGate>
            </Provider>

        );

    }
}



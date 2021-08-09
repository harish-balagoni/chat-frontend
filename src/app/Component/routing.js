import React from "react";
import Createaccount from "./registration";
import Whtsappscreen from "./whtsapp/whtsappscreen";
import {
    BrowserRouter,
    Switch,
    Route

} from "react-router-dom"

function PageNotFound() {
    return (
        <div class="pageNotFound">Page Not Found</div>
    )
}
export default class Routing extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                   
                    <Route path='/' exact component={Createaccount }></Route>
                    <Route path='/chats' exact component={Whtsappscreen}></Route>
                    <Route path='*' exact component={PageNotFound}></Route>
                </Switch>

            </BrowserRouter>
        );

    }
}



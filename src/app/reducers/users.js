import { FETCH_USER } from "../actions/actions";
import { USER_LOGIN } from "../actions/actions";
import {SUBMIT_REGISTER} from "../actions/actions";

const initialState = {
 username: '',
 email: '',
 mobile: '',
 profile: '',
 token: ''
}

const userReducer = (state=initialState,action) =>{
    switch (action.type){
        case 'persist/REHYDRATE':{
            console.log(action, 'persist action');
            return action.payload.user;
        }
        case FETCH_USER:
            console.log("fetch user");
            
            return action.user;
        case USER_LOGIN:
            console.log(" user login");
            return action.data;
        case SUBMIT_REGISTER:
            console.log("user register");
            return action.details;
        default : return state
    }
    
}

export default userReducer;

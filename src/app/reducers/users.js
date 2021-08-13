import { FETCH_USER } from "../actions/actions";
import { USER_LOGIN } from "../actions/actions";
import {SUBMIT_REGISTER} from "../actions/actions";

const userReducer = (state={},action) =>{
    switch (action.type){
        case FETCH_USER:
            console.log("reducers");
            return {
                ...state,
                ...action.user
            }
        case USER_LOGIN:
            console.log(action.data,'reducer data');
            return {
                ...state,
                ...action.data
            }
        case SUBMIT_REGISTER:
            
            return {
                ...state,
                ...action.details
            }
        default : return state
    }
    
}

export default userReducer;

import { FETCH_USER } from "../actions/actions";
import { USER_LOGIN } from "../actions/actions";
import { SUBMIT_REGISTER } from "../actions/actions";
import { LOG_OUT } from "../actions/actions";


const initialState = {
    userDetails: {
        username: '',
        email: '',
        mobile: '',
        profile: '',
        token: ''
    },
    client: null
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'persist/REHYDRATE': {
            console.log(action, 'persist action');
            if (action.payload && action.payload.user) {
                return action.payload.user;
            } else {
                return initialState;
            }
        }
        case FETCH_USER:
            console.log("fetch user");
            return Object.assign({}, state, { userDetails: action.user });
        case USER_LOGIN:
            console.log(" user login");
            return Object.assign({}, state, { userDetails: action.data });
        case SUBMIT_REGISTER:
            console.log("user register");
            return Object.assign({}, state, { userDetails: action.details });
        case LOG_OUT:
            console.log('log out');
            return initialState;
        default: return state
    }

}

export default userReducer;

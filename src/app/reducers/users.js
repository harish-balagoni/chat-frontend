import { CREATE_CLIENT, FETCH_USER } from "../actions/actions";
import { USER_LOGIN } from "../actions/actions";
import { SUBMIT_REGISTER } from "../actions/actions";
import { LOG_OUT } from "../actions/actions";
import { SET_STAR_MESSAGES, DEL_STAR_MESSAGES } from "../actions/actions";


const initialState = {
    userDetails: {
        username: '',
        email: '',
        mobile: '',
        profile: '',
        token: ''
    },
    client: null,
    starMessages: []
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
        case CREATE_CLIENT:
            return Object.assign({}, state, { client: action.payload });

        case SET_STAR_MESSAGES:
            let tempSet = state.starMessages;
            tempSet.push(action.data);
            return Object.assign({}, state, { starMessages: tempSet });

        case DEL_STAR_MESSAGES:
            let tempDel = state.starMessages;
            for (let i = 0; i < tempDel.length; i++) {
                if (tempDel[i].id === action.data.id)
                    tempDel.splice(i, 1);
            }
            return Object.assign({}, state, { starMessages: tempDel });
        default: return state
    }

}

export default userReducer;

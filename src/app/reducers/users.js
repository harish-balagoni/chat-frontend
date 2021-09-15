import { CREATE_CLIENT, FETCH_USER ,PIN_CONVERSATION} from "../actions/actions";
import { USER_LOGIN } from "../actions/actions";
import { SUBMIT_REGISTER } from "../actions/actions";
import { LOG_OUT,SEARCH_DATA,CONTACTS,CONVERSATION } from "../actions/actions";


const initialState = {
    userDetails: {
        username: '',
        email: '',
        mobile: '',
        profile: '',
        token: ''
    },
    client: null,
    searchContactData:[],
    pin_data:[]
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
        case SEARCH_DATA :
            return Object.assign({},state,{searchContactData:action.data});
        case CONVERSATION:
            return initialState;
        case CONTACTS:
            return initialState;
        case PIN_CONVERSATION:
            return Object.assign({}, state, { pin_data: action.data });
        default: return state
    }

}

export default userReducer;

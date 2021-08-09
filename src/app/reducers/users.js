import { FETCH_USER } from "../actions/actions";

const userReducer = (state={},action) =>{
    switch (action.type){
        case FETCH_USER:
            console.log("reducers");
            return {
                ...state,
                ...action.user
            }
        default : return state
    }
    
}

export default userReducer;

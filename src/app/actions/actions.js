export const FETCH_USER = "FETCH_USER"
export const USER_LOGIN = "USER_LOGIN"
export const SUBMIT_REGISTER = "SUBMIT_REGISTER"

export const fetchUser = (user) => {
    console.log("actions")
    return {
        type : FETCH_USER,
        user
    }
}

export const userLogin = (data) =>({
    type : USER_LOGIN,
    data
});

export const submitRegister = (details) =>({
    type: SUBMIT_REGISTER,
    details
});

export const createSocket = (data) => ({
    type: 'CREATE_SOCKET',
    payload: data
});
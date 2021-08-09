export const FETCH_USER = "FETCH_USER"

export const fetchUser = (user) => {
    console.log("actions")
    return {
        type : FETCH_USER,
        user
    }
}
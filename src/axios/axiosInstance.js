import axios from "axios";

class AxiosInstance {
    constructor() {

    }
    get() {
    }
    put() {

    }
    post(details, api) {
        return axios.post("https://ptchatindia.herokuapp.com" + api, details)
    }
    delete() {

    }
    getHeaders(token, api) {
        return (
            axios.get("https://ptchatindia.herokuapp.com" + api,token))
            // axios.defaults.headers.post['authorization'] = token
    }

}
export const axiosInstance = new AxiosInstance();
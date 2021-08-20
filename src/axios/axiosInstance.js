import axios from "axios";
import { connect } from 'react-redux';
//https://ptchatindia.herokuapp.com
class Axiosinstance {
    
    
        BaseDomain = {
            BASE_URL: process.env.React_App_Base_URL 
        }
      //  headers=this.props.user.token
    
    get() {
    }
    put()
    {}
    post=(details)=>{
        
        this.url= this.BaseDomain.BASE_URL 
        return axios.post(this.url,details);
    }
    delete() {

    }
    getHeaders() {
        
    }
}
const mapStateToProps = (state) => (
    console.log("state home page from redux in mapstatetoprops", state),
    {
        user: state.user.userDetails,
    }
);
export const axiosInstance = (new Axiosinstance());
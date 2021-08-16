import React,{ Component } from 'react';
import { connect } from 'react-redux';
import './Header.css';
import { Link } from 'react-router-dom';
import { logOut } from '../../actions/actions';

class Options extends Component {
    constructor(props){
        super(props);
    }
    logOut=()=>{
        this.props.logOut();  
    }
    render() {
        return (
            <div className="options">
                <div className="option-item" onClick={this.props.showProfile}>Profile</div>
                <div className="option-item">Add to archieve</div>
                <Link className="option-item-logout" to='/' onClick={this.logOut}>Logout</Link>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) =>({
    logOut: ()=> dispatch(logOut()),
  })

export default connect(null,mapDispatchToProps)(Options);
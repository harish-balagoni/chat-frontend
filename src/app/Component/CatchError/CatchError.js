import React, { Component } from "react";
import './CatchError.css';

export default class CatchError extends Component {
    constructor(props){
        super(props);
    }
    tryAgain=()=>{
        this.props.callBack(this.props.fromCatch); 
    }
    render() {
        return (
            <div className='error-container'>
                <div className='catch-error'>
                    <h2>Error</h2>
                    <h3>Oops!! Something Went Wrong</h3>
                    <div>We are sorry for the inconvenience.</div>
                    <div>
                        <button className='error-try-again' onClick={this.tryAgain}>Try Again</button>
                    </div>
                </div>
            </div>
        );
    }
}

import React, { Component } from 'react';
import './loader.css';
import { loaderService } from '../../service/loaderService';
export default class Loader extends Component {
    componentDidMount() {
        console.log(document.getElementById("loader"));
        loaderService.createLoaderElement(document.getElementById("loader"));
    }
    render() {
        return (
            <div className="loader-overlay" id="loader">
                <div className="loader" >
                </div>
            </div>
        )
    }
}

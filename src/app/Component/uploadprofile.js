import React, { Component } from "react";
import profileicon from './../../assests/profileicon.png';
import camera from './../../assests/camera.jpg';
import './Common/Header.css';
export default class ProfileUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pic: profileicon,
            camera: camera,
            error: ""
        }
    }
    check = (e) => {
        const reader = new FileReader;
        reader.onload = () => {
            if (reader.readyState === 2) {
                this.setState({ pic: reader.result });
            }
        }
        if (e.target.files[0].type !== "image/jpeg") {
            console.log("not a picture");
            const error = "selected was not jpeg format";
            this.setState({ error: error });
        }
        else {
            if (e.target.files[0].size > 2e+6) {
                console.log("pic more size");
                const error = "image size must be lessthan 2 Mb"
                this.setState({ error: error })
            }
            else {
                this.setState({ error: "" })
                reader.readAsDataURL(e.target.files[0])
            }
        }
    }



    render() {
        return (

            <div className="Profileuploader">
                <label htmlFor="photo-upload" className="profile">
                    <img className="header-profile-image" alt='profile pic' src={this.state.pic} />
                    <input id="photo-upload" type="file" accept="image/*" onChange={this.check} style={{ display: "none" }} />
                </label>
                <label className="profile-camera">
                    <img id="camera" src={this.state.camera} onChange={this.check} style={{ height: '20px', width: '20px', left: '30%', top: '14%', position: 'absolute' }} />
                    <input id="photo-upload" type="file" accept="image/*" onChange={this.check} style={{ display: "none" }} />
                </label>

                <div style={{ color: "red"}}>{this.state.error} </div>
            </div >
        )
    }
}


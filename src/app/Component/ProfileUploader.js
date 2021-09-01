import React, { Component } from "react";
import profile from './../../assests/profile.jfif';
export default class ProfileUploader extends Component {
constructor(props)
{
    super(props);
    this.state={
        pic:profile,
        error:""
    }
}
check=(e)=>
{
    const reader=new FileReader;
    reader.onload=()=>{
        if(reader.readyState===2)
        {
            this.setState({pic:reader.result});
        }
    }
    if(e.target.files[0].type!=="image/jpeg"  &&e.target.files[0].type!=='image/png' && e.target.files[0].type!=='image/jpg')
    {
        const error="selected file is not an image";
        this.setState({error:error});
    }
    else{
    if(e.target.files[0].size>2e+6)
    {
    const error="image size must be less than 2 Mb";
   this.setState({error:error})
    }
    else
    {
        this.setState({error:""})
    reader.readAsDataURL(e.target.files[0])
    }}
}



    render() {
        return (

            <div className="Profileuploader">
            <label>Choose profile</label>
            <label htmlFor="photo-upload" className="profile">
                <div className="imageForUpload" >
                    <img className="pic" for="photo-upload" alt='profile pic' src={this.state.pic} borderRadius="50%" width="45" height="35" />
                </div>
                <input id="photo-upload" type="file" accept="image/*" onChange={this.check} style={{display:"none"}} />
            </label>
            <div style={{color:"red"}}>{this.state.error}</div>
        </div >
        )
}}


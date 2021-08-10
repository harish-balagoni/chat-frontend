import React, { Component } from 'react';

interface IProfileProps {
    history:any,
    location:any,
}

interface IUserObjects{
    username: string,
    id: number,
    profile: string
}

interface IProfileStateProps{
    EditProfile:boolean,
    user : IUserObjects,
    profile : IUserObjects,
    menu:boolean,
    color:string
}

class ProfileUser extends Component<IProfileProps,IProfileStateProps> {
    image:React.RefObject<any>;
    name:React.RefObject<any>;
    constructor(props:IProfileProps){
        super(props)
        this.state={
            EditProfile:false,
            user : {
                username:'',
                id:0,
                profile:''
            },
            profile : this.props.location&&this.props.location.user,
            menu : false,
            color:this.props.location&&this.props.location.color,
        }
        this.image=React.createRef();
        this.name=React.createRef();
        console.log(this.props);
        console.log(this.state.profile);
    }
    errors:any={}
    validate=(type:any)=>{
        if(type==='image'){
            if(!this.image.current.value){
                this.errors.image="Please enter image address";
            }
            else{
                delete this.errors.image;
            }
        }
        if(type==='name'){
            if(!this.name.current.value){
                this.errors.name="Please enter your name";
            }
            else{
                delete this.errors.name;
            }
        }
        
    }
    settings=()=>{
        this.setState({menu:true})
    }
    profile=()=>{
        this.props.history.push({
            pathname:"/profile",
            user:this.state.user,
            color:this.state.color,
        })
    }
    themes=()=>{
        this.props.history.push({
            pathname:"/themes",
            user:this.state.user
        })
    }
    help=()=>{
        this.props.history.push({
            pathname:"/help",
            user:this.state.user,
            color:this.state.color,
        })
    }
    edit=()=>{
        this.setState({EditProfile:true})
    }
    update=()=>{
        let user = this.state.user;
        user.profile=this.image.current.value;
        user.username=this.name.current.value;
        this.setState({EditProfile:false,profile:user})
    }
    back=()=>{
        this.props.history.push({
            pathname:"/chats",
            state:{user:this.state.user.username},
            color:this.state.color
        })
    }
    render() {
        return (
            <div>
                <div style={{backgroundColor:'#1ebea5'}}>
                {this.state.menu?
                    <div style={{width:10,marginLeft:900,paddingRight:50,height:200}}>
                        <button style={{padding:10,paddingRight:40}} onClick={()=>{this.profile()}}>Profile</button>
                        <button style={{padding:10,paddingRight:30}} onClick={()=>{this.themes()}}>Themes</button>
                        <button style={{padding:10,paddingRight:50}} onClick={()=>{this.help()}}>Help</button>
                    </div>
                :
                <div>
                    <button onClick={()=>{this.back()}}><h6>back</h6></button>
                    <button style={{marginLeft:900}} onClick={()=>{this.settings()}}><img style={{width:50,height:50}} src="https://w7.pngwing.com/pngs/83/115/png-transparent-equals-symbol-menu-hamburger-button-logo-chef-menu-button-text-cooking-musician.png" /></button>
                </div>
                }
                
            </div>
                <div style={{backgroundColor:this.state.color}}>
                    {this.state.EditProfile?
                        <div>
                            <p>Add Image : <input type="text" ref={this.image} onBlur={this.validate.bind(this,'image')} /></p>
                            <div style={{color:"red"}}>{this.errors.image}</div>
                            <h1>Name : <input type="text" ref={this.name} onBlur={this.validate.bind(this,'name')} /></h1>
                            <div style={{color:"red"}}>{this.errors.name}</div>
                            <button onClick={()=>{this.update()}}>Update</button>
                        </div>
                    :
                        <div>
                            <img src={this.state.profile.profile} style={{width:200,height:200}} />
                            <h1>Name:{this.state.profile.username}</h1>
                            <button onClick={()=>{this.edit()}}>Edit</button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default ProfileUser;
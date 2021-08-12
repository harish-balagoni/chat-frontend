import React, { Component } from 'react';

interface IThemesProps{
    history:any,
    location:any, 
}

interface IThemesStateProps{
    user : IUserObjects,
    menu:boolean,
    color:string
}

interface IUserObjects{
    username: string,
    id: number,
    profile: string
}



class Themes extends Component<IThemesProps,IThemesStateProps> {
    color:React.RefObject<any>;
    constructor(props:IThemesProps){
        super(props)
        this.color=React.createRef();
        this.state={
            user : this.props.location&&this.props.location.user,
            menu : false,
            color: 'ash'
        }
        console.log(this.state.user);
    }
    changeColor=()=>{
        this.setState({color:this.color.current.value})
    }
    errors:any={}
    validate=(type:any)=>{
        if(type==='color'){
            if(!this.color.current.value){
                this.errors.color="Please enter theme color";
            }
            else {
                delete this.errors.color;
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
    back=()=>{
        this.props.history.push({
            pathname:"/chats",
            state:{user:this.state.user.username},
            color:this.color.current.value,
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
                    <h1>Theme</h1>
                    <h6>Change Theme :<input type="text" ref={this.color} onBlur={this.validate.bind(this,'color')} /></h6>
                    <div style={{color:"red"}}>{this.errors.color}</div>
                    <button onClick={()=>{this.changeColor()}}>changeColor</button>
                </div>
            </div>
        )
    }
}

export default Themes;
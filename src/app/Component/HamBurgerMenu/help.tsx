import React, { Component } from 'react';

interface IHelpProps{
    history:any,
    location:any,
}

interface IHelpStateProps{
    user : IUserObjects,
    menu:boolean,
    color:string
}

interface IUserObjects{
    username: string,
    id: number,
    profile: string
}

class Help extends Component<IHelpProps,IHelpStateProps> {

    constructor(props:IHelpProps){
        super(props)
        this.state={
            user : this.props.location&&this.props.location.user,
            menu : false,
            color: this.props.location&&this.props.location.color,
        }
        console.log(this.props)
        console.log(this.state.user);
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
            color:this.state.color,
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
                    <h1>Help Center</h1>
                    <p>
                        <h3>Corporate Address</h3>
                        <h4>WhatsApp LLC</h4>
                        <h5>1601 Willow RoadMenlo Park, California 94025,United States of America</h5>
                        <h6>Email Us : Whatsapp@gmail.com</h6>
                    </p>
                </div>
                
            </div>
        )
    }
}

export default Help;
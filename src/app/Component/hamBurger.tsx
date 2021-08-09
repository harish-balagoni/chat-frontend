import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchUser } from '../actions/actions'

interface IProps {
    history:any, 
    user : IUserObjects
    fetchUser:(user:IUserObjects)=>void
}

interface IUserObjects{
    name: string,
    about: string,
    phone: number
}

interface IState {
    user : IUserObjects
}

class HamburgerMenu extends Component<IProps,IState> {
    constructor(props:IProps){
        super(props)
        this.state={
            user : {
                name:'',
                about:'',
                phone:0
            }
        }
    }
    settings=()=>{
        this.props.fetchUser(this.state.user);
    }
    render() {
        return (
            <div>
                <div><button style={{marginLeft:900}} onClick={()=>{this.settings()}}><img style={{width:50,height:50}} src="https://w7.pngwing.com/pngs/83/115/png-transparent-equals-symbol-menu-hamburger-button-logo-chef-menu-button-text-cooking-musician.png" /></button></div>
            </div>
        )
    }
}

const mapStateToProps = (state:any) =>(console.log(state),{
    user : state.user
})

const mapDispatchtoProps=(dispatch:any)=>({
    fetchUser:(user:any)=>{dispatch(fetchUser(user))}
})

export default connect(mapStateToProps,mapDispatchtoProps)(HamburgerMenu)
import React, { Component } from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { conversation } from '../../actions/actions';
import { contacts } from '../../actions/actions';
import hamburger from '../../../assests/Ham-burger-menu.png';

class Navigationmenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isshowBackOptions: false,
        }
    }

    conversation = () => {
        this.props.history.push({
            pathname: '/chats',
            data: this.props.user
        });
    }
    contacts = () => {
        this.props.history.push('/contacts');
    }
    showBackOptions = () => {
        this.setState({ isshowBackOptions: this.state.isshowBackOptions ? false : true })

    }

    archive = () => {

        this.props.history.push({
            pathname: '/Archived',
            data: this.props.user


        });

    }


    render() {

        return (
            <div >
                <div className="backMenu" onClick={() => this.showBackOptions()}>
                    <img className="backButtonMenu" src={hamburger} alt="menu" style={{ cursor: "pointer", width: "3%", position: "absolute", marginTop: "1px", left: "1%", top: "4.3%" }} />
                </div>
                {this.state.isshowBackOptions &&
                    <div className='linkshow'style={{ width: "10rem",position: 'absolute', top: "12%", left: '0%' }}>
                        <ul style={{ alignItems: 'center', borderRadius: '10px', background: '#50535a', listStyleType: "none", padding: "12px", boxShadow: '0px 0px 30px rgb(14 10 16 / 84%' }}>
                            <a onClick={() => { this.conversation() }}><li style={{ padding: '15px', cursor: "pointer",borderBottom:"1px solid white" }}>Conversation</li></a>
                            <a onClick={() => { this.contacts() }}> <li style={{ padding: '15px', borderWidth: ' 0px 0px 1px 0px', color: "white", cursor: "pointer",borderBottom:"1px solid white" }}>Contacts</li></a>
                            <a onClick={() => { this.archive() }}> <li style={{ padding: '15px', borderWidth: ' 0px 0px 1px 0px', color: "white", cursor: "pointer" }}>Archived Chats</li></a>
                        </ul>
                    </div>
                }

            </div>

        )
    }
}
const mapStateToProps = (state) => (
    {
        user: state.user
    }
);
const mapDispatchToProps = (dispatch) => ({
    conversation: () => dispatch(conversation()),
    contacts: () => dispatch(contacts()),

})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navigationmenu));


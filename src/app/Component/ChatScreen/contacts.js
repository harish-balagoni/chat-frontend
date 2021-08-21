import React, { Component} from "react";
import "./chatscreen.css";
import axios from "axios";
import { connect } from "react-redux";
import Header from "../Common/Header";
import { loaderService } from '../../../service/loaderService';
import { createClient } from '../../actions/actions';

class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: null,
      user: this.props.location.state && this.props.location.state.user,
      menu: false,
      settingDetails: false,
      conversationButton: false,
      extendpic:false,
            extendpicid:0
    };
    console.log(this.props, 'in contacts');
    loaderService.show();
  }
  componentDidMount() {
    console.log(this.state.Data);
    this.getContacts();
  }
  getContacts = () => {
    axios
      .request({
        method: "POST",
        url: `https://ptchatindia.herokuapp.com/contacts`,
        headers: {
          authorization: this.props.user.token,
        },
      })
      .then((res) => {
        console.log("response", res);
        let index = null,
          details = [];
        res.data.map((user, index) => {
          if (user.username === this.props.user.username) {
            this.setState({ user: user });
            index = index;
          } else {
            details.push(user);
          }
        });
        this.setState({ Data: details });
        loaderService.hide();
      });
  };
  open = (user) => {
    this.props.createClient(user);
    this.props.history.push({
      pathname: "/ChatRoom",
      client2: user
    });
      
  };

  settings = () => {
    this.setState({ menu: true });
  };

  settingDetails = () => {
    this.setState({ settingDetails: true });
  };

  cancel = () => {
    this.setState({ menu: false, settingDetails: false });
  };

  selectContact = () => {
    this.setState({ conversationButton: true });
  };

  showpic=(id)=>
  {

      console.log("id:",id);
      console.log(this.state.Data[this.state.extendpicid]['profile']);
      if(this.state.extendpic===false)
      this.setState({extendpic:true,extendpicid:id});
      else
      this.setState({extendpic:false});
  }
  render() {
    const { isLoading, Data } = this.state;
    console.log(Data);
    return (
      <div className="entire-area">
        <Header title="Contacts" />
        <div>
          <div className="chats">
            {this.state.extendpic?<img className="extendedimage" src={this.state.Data[this.state.extendpicid]['profile']} alt="profile" width="120px" height="100px" />:""}
            {this.state.isEmpty && <div>No conversations found</div>}
            {this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
              return (
                <div key={index} className="contact">
                  <div className="profile-img">
                    <img onClick={()=>this.showpic(index)} src={user.profile} className="image"></img>
                  </div>
                  <div className="text profile-nm">
                    <h2
                      onClick={() => {
                        this.open(user);
                      }}
                    >
                      {user.username}
                    </h2>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  console.log("state home page from redux in mapstatetoprops", state),
  {
    user: state.user.userDetails,
    client:state.user.client
  }
);
const mapDispatchToProps = (dispatch) => ({
  createClient: (data) => dispatch(createClient(data))
});
export default connect(mapStateToProps,mapDispatchToProps)(Contacts);

import React, { Component } from "react";
import "./chatscreen.css";
import axios from "axios";
import { connect } from "react-redux";
import Header from "../Common/Header";
import { loaderService } from '../../../service/loaderService';
import { createClient, searchData } from '../../actions/actions';
import CatchError from "../CatchError/CatchError";

class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: null,
      user: this.props.location.state && this.props.location.state.user,
      menu: false,
      settingDetails: false,
      conversationButton: false,
      extendpic: false,
      extendpicid: 0,
      catchError: false,
      hideMenu: false,
      backgroundblur:false
    };
    loaderService.show();
  }
  componentDidMount() {
    this.getContacts();
    this.props.searchData([]);
  }
  getContacts = () => {
    if (!this.state.catchError) {
      axios
        .request({
          method: "POST",
          url: `https://ptchatindia.herokuapp.com/contacts`,
          headers: {
            authorization: this.props.user.token,
          },
        })
        .then((res) => {
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
        })
        .catch((err) => {
          if (err.response.status != 200) {
            loaderService.hide();
            this.setState({ catchError: !this.state.catchError })
          }
        })
    };
  }
  open = (user) => {
    this.props.createClient(user);
    this.props.history.push({
      pathname: "/ChatRoom",
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

  showpic = (id) => {
    if (this.state.extendpic === false) {
      document.getElementById('blur1').style.filter = 'blur(4px)'
      this.setState({ extendpic: true, extendpicid: id, backgroundblur: true });
    }
    else {
      if(this.state.extendpicid===id){
      document.getElementById('blur1').style.filter = ''
      this.setState({ extendpic: false, backgroundblur: false });
    }}
  }
  closePopUp=()=>{
    document.getElementById('blur1').style.filter = ''
    this.setState({extendpic: false, backgroundblur: false})
  }

  hideMenuBar = () => {
    this.setState({ hideMenu: !this.state.hideMenu });
  }
    
  render() {
    const { isLoading, Data } = this.state;
    return (      
      <div className="entire-area">
        <Header title="Contacts" usersData={this.state.Data && this.state.Data} callBack={this.hideMenuBar}/>
        <div className={this.state.hideMenu ? "menu-active":"entire-area-subdiv"}>
          <div className="chats">
            {this.state.extendpic ? <img className="extendedimage"  onClick={this.closePopUp} src={this.state.Data[this.state.extendpicid]['profile']} alt="profile" width="120px" height="100px" /> : ""}
            <div className={this.state.backgroundblur?'background-inactive':null} >
            {this.state.isEmpty && <div style={{textAlign:"center"}}>No conversations found</div>}
            {!this.state.catchError ? <div>
              <div id="blur1">
                {this.props.searchContactData && this.props.searchContactData.length === 0 ?

                  this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
                    return (
                      <div key={index} className="contact">
                        <div className="profile-img">
                          <img onClick={() => this.showpic(index)} src={user.profile} className="image"></img>
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
                  }) :
                  <div><h3>Search Results</h3>
                    {this.props.searchContactData && this.props.searchContactData[0] === "notFound" ? <h1 style={{ textAlign: "center", paddingTop: "10%" }}>User Not Found</h1> :
                      <div>
                        {this.props.searchContactData && this.props.searchContactData.map((user, index) => {
                          return (
                            <div key={index} className="contact">
                              <div className="profile-img">
                                <img src={user.profile} className="image"></img>
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
                        })
                        }</div>
                    }
                  </div>
                }
              </div></div> : <CatchError callBack={this.getContacts} />}
          </div>
        </div>
        </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.userDetails,
  client: state.user.client,
  searchContactData: state.user.searchContactData
});
const mapDispatchToProps = (dispatch) => ({
  createClient: (data) => dispatch(createClient(data)),
  searchData: (data) => dispatch(searchData(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(Contacts);

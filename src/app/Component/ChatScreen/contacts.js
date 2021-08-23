import React, { Component } from "react";
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
      searchButton: false,
      searchResult: [],
      searchNotFound: false
    };
    console.log(this.props, 'in contacts');
    loaderService.show();
    this.searchData = React.createRef();
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
  showSearch = () => {
    let searchValue = this.searchData.current.value
    let result = [];
    if (searchValue.length > 0) {
      if (isNaN(searchValue)) {
        searchValue = searchValue.toLowerCase();
        result = this.state.Data.filter((data) => {
          return data.username.toLowerCase().includes(searchValue);
        });
      }
      else {
        searchValue = parseInt(searchValue);
        result = this.state.Data.filter((data) => {
          return data.mobile.includes(searchValue);
        });
      }
    }
    this.setState({ searchResult: result })
  }
  showSearchbar = () => {
    this.setState({ searchButton: this.state.searchButton ? false : true })
  }

  render() {
    const { isLoading, Data } = this.state;
    return (
      <div className="entire-area">
        <Header title="Contacts" />
        <div className="search"> {this.state.searchButton ? <input className="searchInput" autoFocus type="search" placeholder="Search contact's here" onChange={this.showSearch} ref={this.searchData} /> : null}
          <img className="searchButton" src="https://img.icons8.com/material-rounded/50/ffffff/search.png" onClick={this.showSearchbar} />
        </div>
        <div>
          <div className="chats">
            {this.state.isEmpty && <div>No conversations found</div>}
            {this.state.searchButton ? <h2>Search Results</h2> : null}
            {this.state.searchResult.length !== 0 ?

              this.state.searchResult.map((user, index) => {
                return (

                  <div key={index} className="contact">
                    <div className="profile-img">
                      <img src={user.profile} className="image"></img>
                    </div>
                    <div className="text profile-nm">
                      <h2 onClick={() => { this.open(user) }}>{user.username}</h2>
                    </div>
                  </div>
                )
              })
              : null}

            {!this.state.searchButton ?

              this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
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
              }) :
              null
            }
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
    client: state.user.client
  }
);

const mapDispatchToProps = (dispatch) => ({
  createClient: (data) => dispatch(createClient(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);

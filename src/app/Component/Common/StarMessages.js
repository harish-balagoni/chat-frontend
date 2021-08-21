import { Component } from 'react';
import { connect } from 'react-redux';
import { delStarMessages } from '../../actions/actions';
let profile = 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80';
class StarMessages extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    delStarMessages = (obj) => {
        this.props.delStarMessages(obj);
        this.setState({});
    }

    getDetailsByTimeStamp = (timestamp) => {
        let date = new Date(timestamp * 1000);
        let ampm = date.getHours() >= 12 ? 'pm' : 'am';
        let hours = date.getHours() >= 12 ? date.getHours() - 12 : date.getHours();
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + '  ' + hours + ":" + date.getMinutes() + ampm;
    }

    render() {
        console.log(this.props.messages);
        return (
            <div className="header-star-main">
                <div className="header-star-title">Starred Messages</div>
                {this.props.messages.length !== 0 ?
                    this.props.messages.map((message, index) => (
                        <div className="header-star-menu">
                            <div className="header-star-cross" onClick={() => this.delStarMessages(message)}>x</div>
                            <div className="header-star-img">
                                <img src={profile} width='30' height='30' style={{ borderRadius: '50%' }} />
                                <div className="header-star-user">{message.username}</div>
                            </div>

                            <div key={index} className="header-star-message">{message.message}
                                <div className='header-star-right'>{this.getDetailsByTimeStamp(message.timestamp)}</div></div>
                        </div>
                        
                    ))
                    : <div className='header-star-notfound'> No Star Messages Found </div>}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    messages: state.user.starMessages,
});

const mapDispatchToProps = (dispatch) => ({
    delStarMessages: (data) => dispatch(delStarMessages(data)),
})
export default connect(mapStateToProps, mapDispatchToProps)(StarMessages);
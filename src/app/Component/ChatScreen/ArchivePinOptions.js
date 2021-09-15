import { React, Component } from 'react'
import "./chatscreen.css";
import { connect } from "react-redux";
class ArchivePinOptions extends Component {
  isPin = () => {
    let obj = this.props.obj;
    let pin_data = this.props.pin_data;
    let found = -1
    for (let i = 0; i < pin_data.length; i++) {
      if (pin_data[i].id === obj.id)
        found = i;
    }
    if (found === -1) return false;
    else return true;
  }
  setPin = (type) => {
    let obj = this.props.obj;
    if (type === 'pin') {
      this.props.pinCallBack(obj);
    }
    else if (type === 'unpin') {
      this.props.unPinCallBack(obj)
    }
  }

  render() {
    let obj = this.props.obj
    return (
      <div className='mainDiv'>
        <div className='optionsFor' >
          <div className='showOptions' >
            {this.props.type === 'archive-pin' && <div onClick={() => { this.props.archiveMessage(this.props.id, this.props.index) }} className='item-1' >Archive</div>}
            {this.props.type === 'unarchive' && <div className='item-2' onClick={() => { this.props.unArchiveMessage(this.props.id, this.props.index) }} >Unarchive</div>}
            <div style={{ padding: "8px" }} onClick={() => { this.setPin(this.isPin() ? "unpin" : "pin") }} >{this.isPin() ? "Unpin" : "Pin"}</div>
          </div>
        </div>
      </div>
    )
  }

}
const mapStateToProps = (state) => (
  {
    pin_data: state.user.pin_data
  }
);

export default connect(mapStateToProps, null)(ArchivePinOptions);
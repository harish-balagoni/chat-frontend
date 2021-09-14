import {React,Component} from 'react'
import "./chatscreen.css";
export default class ArchivePinOptions extends Component
{
    
 
    render()
    {
        return(
<div className='mainDiv'>
            <div className='optionsFor' >
                <div className='showOptions' >
                {this.props.type==='archive-pin'&& <div onClick={()=>{this.props.archiveMessage(this.props.id,this.props.index)}} className='item-1' >Archive</div>}
                {this.props.type==='unarchive' && <div className='item-2' onClick={()=>{this.props.unArchiveMessage(this.props.id,this.props.index)}} >Unarchive</div>}
                {this.props.type==='archive-pin'&&  <div className='item-2'>Pin</div>}
                </div>
            </div>
            
            
            
            
            
            
            </div>
        )
    }

}
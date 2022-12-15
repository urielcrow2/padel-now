//<Switch isOn={status} click={changeStatus}/>

import './Switch.css'

export const Switch = ({isOn,click})=>{
    
    return(
        <span className={`slider-custome ${isOn ? 'checked' : '' }`}  onClick={click}>
            <label className="switch">
                <span className="slider round"></span>
            </ label>
        </span>
    )
}
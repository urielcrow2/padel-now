import {Switch} from '../utils/switch/Switch';
import {ClubAdmin} from './ClubAdmin';

export const ClubCarpet = ({
    id,
    club,
    adress,
    img,
    status,
    root,
    disabledClub,
    disabledAdress,
    btnMoreInfo,
    deleteClub,
    changeGeneral,
    //changeGeneralRoot,
    focus,
    blur,
    //blurRoot,
    saveAdminRootFirstTime,
    changeImgClub
})=>{

    return(
            <div className="col-md-4" style={{marginBottom:50}}>
                <div style={{
                    background:"#fff",
                    padding:10,
                    borderRadius:6,
                    position:"relative",
                    boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)"
                }}>
                    <div className="d-flex justify-content-between align-items-center">

                        <div className="position-relative">

                            <i 
                                className="fa fa-picture-o" 
                                aria-hidden="true" 
                                onClick={()=>changeImgClub(id,img,club)}
                                style={{
                                    cursor:'pointer',
                                    fontSize:23,
                                    position:'absolute',
                                    right:-18,
                                    top:-9,
                                    padding:7,
                                    background:'#098BEC',
                                    color:'#FFF',
                                    borderRadius:'100%',
                                    opacity:.8
                                }}>
                            </i> 
                            <img 
                                style={{width:200,marginBottom:10,boxShadow: "-3px 3px 10px -2px rgba(0,0,0,0.52)"}} 
                                alt="logo" 
                                src={img} 
                            />

                        </div>

                        <Switch 
                            isOn={status} 
                            click={()=>changeGeneral("status",!status,id)}
                        />

                    </div>

                    <div className="position-relative">
                        <span style={{position:"absolute",top:-21,left:0,background:"#fff",padding: "0 10px",color:"#ccc"}}>Nombre del club</span>
                        <input 
                            type="text" 
                            name="club"
                            className="form-control mb-2 mt-4 text-uppercase" 
                            value={club ? club : ""} 
                            onChange={(e)=>changeGeneral(e.target.name,e.target.value,id)} 
                            onDoubleClick={()=>changeGeneral("disabledClub",false,id)} 
                            onFocus={(e)=>focus(e)} 
                            onBlur = {(e)=>blur(e,'disabledClub',id)}
                            readOnly={disabledClub}
                        />
                    </div>

                    <span>
                        <b>Admin</b> 
                        <div className="text-truncate text-uppercase">{root.name ? root.name : '\u00A0'}</div> 
                    </span>

                    <div className="d-flex justify-content-center"><hr style={{width:"80%"}}/></div>

                    <div className="accordion mt-2">
                        <div className="accordion-item">
                            <h2 className="accordion-header d-flex justify-content-between">
                                <button 
                                    className="btn-toggle d-flex justify-content-center"
                                    type="button" 
                                    onClick={()=>changeGeneral("btnMoreInfo",!btnMoreInfo,id)} 
                                    style={{padding:5}}
                                >
                                    { btnMoreInfo ? <i className="fa fa-plus-circle fa-2x" aria-hidden="true"></i> : <i className="fa fa-minus-circle fa-2x" aria-hidden="true"></i> }
                                </button>
                            </h2>
                            <div className={`accordion-collapse collapse ${btnMoreInfo ? '' : 'show'}`} >
                                <div className="accordion-body position-relative">
                                    <span style={{position:"absolute",top:8,left:20,background:"#fff",padding: "0 10px",color:"#ccc"}}>Dirección del club</span>
                                    <textarea 
                                        name="adress"
                                        className="form-control text-uppercase" 
                                        style={{maxHeight:200,marginTop:15}}
                                        rows="5"
                                        value={adress ? adress : ''}
                                        onChange={(e)=>changeGeneral(e.target.name,e.target.value,id)} 
                                        onDoubleClick={()=>changeGeneral('disabledAdress',false,id)} 
                                        onFocus={(e)=>focus(e)} 
                                        onBlur = {(e)=>blur(e,'disabledAdress',id)}
                                        readOnly={disabledAdress}
                                    />
                                </div>

                                <hr />

                                <div className="text-center">
                                    <img 
                                        style={{width:'70px',marginBottom:'10px',borderRadius:"50%",boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)"}} 
                                        alt="avatar" 
                                        src={root.img}
                                     />
                                </div>

                                <ClubAdmin 
                                    root={root} 
                                    changeGeneral={changeGeneral}
                                    focus={focus}
                                    blur={blur}
                                    id={id}
                                    saveAdminRootFirstTime={saveAdminRootFirstTime}
                                />

                                <hr />

                                <button 
                                    className="btn btn-lg btn-outline-danger d-flex"
                                    type="button" 
                                    onClick={()=>deleteClub(club,id)} 
                                    style={{padding:5,margin:5}}
                                >
                                    <i className="fa fa-trash fa-2x" aria-hidden="true"></i> 
                                </button>
                               
                            </div>
                        </div>
                    </div>

                </div>
            </div>
    )
}
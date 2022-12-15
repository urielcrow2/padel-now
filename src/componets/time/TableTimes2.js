import {useRef,useState} from 'react';
import {ResumenCourt} from './ResumenCourt';

export const TableTimes2 = ({users,numberPlayers,onChangeDateSingle,courts,onChangePoints,disabled,downPositionUser,upPositionUser,showResumen,setShowResumen})=>{
    
    const n = useRef(1);
    const [set,setSet] = useState(0);
    
    const x=()=>{
        if(n.current > 4)
            n.current = 1;
        return n.current++;
    }

    const detalles = (n)=>{
        setShowResumen(false);
        setSet( Math.floor(n) - 1 );
    }

    return(

            showResumen ?
       
            users.map( (user,index) =>(
                <div className="col-12" style={{marginBottom:25}} key={user.id_user}>

                    { 
                        (index + numberPlayers) % numberPlayers === 0 && 
                       
                        <div className="row mb-3 d-flex align-items-center" style={{background:'#F0F4F7',padding:5}}>

                            <div className="col-sm-4 col-12 mb-md-0 mb-2 text-center">
                                <span style={{fontSize:25}}>Cancha: </span>
                                <span className="badge bg-danger" style={{fontSize:28,marginTop:5,marginLeft:10}}> { (index + numberPlayers) / numberPlayers} </span>
                            </div>

                            <div className="col-sm-8 col-12 d-flex justify-content-center align-items-center">
                                <div className="row">
                                    <div className="col-sm-4 col-6 text-sm-start text-end">
                                        <input 
                                            type="date" 
                                            name={(index + numberPlayers) / numberPlayers}  
                                            value={ courts[ (index + numberPlayers) / numberPlayers ] ?  courts[ (index + numberPlayers) / numberPlayers ].date : ""} 
                                            onChange={(e)=>onChangeDateSingle(e,'date')} 
                                            disabled={disabled} 
                                            style={{width:120,height:50,fontSize:16,textAlign:'center',marginLeft:4,marginRight:4}}
                                        />
                                    </div>
                                    <div className="col-sm-4 col-6">
                                        <input 
                                            type="time" 
                                            name={(index + numberPlayers) / numberPlayers}  
                                            value={ courts[ (index + numberPlayers) / numberPlayers ] ?  courts[ (index + numberPlayers) / numberPlayers ].time : ""} 
                                            onChange={(e)=>onChangeDateSingle(e,'time')}  
                                            disabled={disabled} 
                                            style={{width:120,height:50,fontSize:16,textAlign:'center',marginLeft:4,marginRight:4}}
                                        />
                                    </div>
                                    <div className="mt-sm-0 mt-3 col-sm-4 col-12 text-center">
                                        <button type="button" className="btn btn-primary" onClick={()=>detalles( (index + numberPlayers) / numberPlayers )}>Detalles</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                    }

                    <div style={{
                        background:"#fff",
                        padding:10,
                        borderRadius:6,
                        position:"relative",
                        boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)"
                    }}>
                        {/* <div style={{position:"absolute",top:-46,left:20}}><img style={{width:'70px',marginBottom:'10px',borderRadius:"50%",boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)"}} alt="avatar" src={user.img} /></div> */}
                        <div style={{background:"#007bff",padding:10,color:"#fff",textAlign:'right'}}> 
                            <span style={{fontSize:12}}>{user.alias}</span>
                            <br />
                            {user.name} 
                        </div>
                        
                        <div className="d-flex flex-column">
                            <div className="text-end"><b>Cancha</b> <span className="badge bg-danger" style={{fontSize:25,marginTop:5}}> { Math.floor((index + numberPlayers) / numberPlayers) } </span></div>
                            <div className="text-end"><b>Posición</b> <span className="badge bg-secondary" style={{fontSize:25,marginTop:5}}> {x()} </span></div>
                        </div>

                        <div className="position-absolute" style={{top:73}}>  
                            {
                                !disabled &&
                                users.length-1 !== index ?
                                <i className="fa fa-arrow-down fa-2x btn-effect2" title="bajar" aria-hidden="true" onClick={()=>downPositionUser(user.id_user,user.position)}></i> :
                                <i className="fa fa-arrow-down fa-2x" style={{padding:4,opacity:0}} aria-hidden="true"></i>
                            }
                                <img style={{width:'90px',margin:'10px',borderRadius:"50%",boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}} alt="avatar" src={user.img} /> 
                            {
                                !disabled &&
                                index > 0  ?
                                <i className="fa fa-arrow-up fa-2x btn-effect" title="subir" aria-hidden="true" onClick={()=>upPositionUser(user.id_user,user.position)}></i>:
                                <i className="fa fa-arrow-down fa-2x" style={{padding:4,opacity:0}} aria-hidden="true"></i>
                            }
                        </div>


                        <div className="d-flex justify-content-center">
                            <h5>SETS</h5>
                            <hr style={{width:"100%"}}/>
                        </div>
                        
                        <div>
                            <input type="number" name={user.id_user} value={user.set1} onChange={(e)=>onChangePoints(e,'set1')} disabled={true} style={{width:80,fontSize:20,textAlign:'center',marginRight:3}}/>
                            <input type="number" name={user.id_user} value={user.set2} onChange={(e)=>onChangePoints(e,'set2')} disabled={true} style={{width:80,fontSize:20,textAlign:'center',marginRight:1}}/>
                            <input type="number" name={user.id_user} value={user.set3} onChange={(e)=>onChangePoints(e,'set3')} disabled={true} style={{width:80,fontSize:20,textAlign:'center'}}/>
                        </div>

                         <div className="d-flex justify-content-center mt-1">
                            <h5>PENALIZACIÓN</h5>
                            <hr style={{width:"100%"}}/>
                            <h5>TOTAL</h5>
                        </div>
                        
                        <div className="d-flex justify-content-between">
                            <input type="number" name={user.id_user} value={user.penalty} onChange={(e)=>onChangePoints(e,'penalty')} disabled={disabled} style={{width:80,fontSize:20,textAlign:'center',marginRight:1}}/>
                            <input type="number" name={user.id_user} value={user.total} onChange={(e)=>onChangePoints(e,'total')} disabled={true} style={{width:80,fontSize:20,textAlign:'center',marginRight:3}}/>
                        </div>

                    </div>
                </div>
            
            ))

            :

            <ResumenCourt setShowResumen={setShowResumen} disabled={disabled} set={set}/>
        
    )
}
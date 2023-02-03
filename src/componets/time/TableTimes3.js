import {useRef,useState,useEffect} from 'react';
import {ResumenCourt} from './ResumenCourt';

export const TableTimes3 = ({
    users,
    numberPlayers,
    onChangeDateSingle,
    courts,
    onChangePoints,
    disabled,
    downPositionUser,
    upPositionUser,
    showResumen,
    setShowResumen,
    controlVisibility,
    groupVisibility
})=>{
    
    const n = useRef(1);
    const [set,setSet] = useState(0);

    const gruposVisibility = useRef([]);

    useEffect(()=>{
        //necesito crear grupos de 4 jugadores para saber si los oculto o los muestro, mando este arreglo al hook
        users.forEach((user,index)=>{
            if((index + numberPlayers) % numberPlayers === 0)
                gruposVisibility.current.push(false)
        });
        groupVisibility.current = gruposVisibility.current;
    },[]);

    const x=()=>{
        if(n.current > 4)
            n.current = 1;
        return n.current++;
    }

    const detalles = (n)=>{
        setShowResumen(false);
        setSet( Math.floor(n) - 1 );
    }

    const hideShow = (position)=>{
        gruposVisibility.current[position/4] = !gruposVisibility.current[position/4];

        const temp = [...users];
        const inicio = position;
        const fin = position + 3;
        temp.forEach( (user,index)=>{
            if(index >= inicio && index <= fin )
                user.visibility = gruposVisibility.current[position/4];
        });

        controlVisibility(temp);
    }

    const downPosition = (id,position)=>{
        downPositionUser(id,position,gruposVisibility.current)
    }

    const upPosition = (id,position)=>{
        upPositionUser(id,position,gruposVisibility.current)
    }

    return(

            showResumen ?
       
            users.map( (user,index) =>(
                <div className="col-12" style={{marginBottom:25}} key={user.id_user}>

                    { 
                        (index + numberPlayers) % numberPlayers === 0 && 
                       
                        <div className="row mb-3 d-flex align-items-center position-relative" style={{background:'#F0F4F7',padding:5,boxShadow:'0px 4px 15px 1px #00000033',borderBottomRightRadius:30}}>
                            
                            
                            <div className="col-sm-4 col-12 mb-md-0 mb-2 text-center">
                                <i className={`fa ${user.visibility ? 'fa-minus-circle' : 'fa-plus-circle'}`} aria-hidden="true" onClick={()=>hideShow(index)} style={{position:'absolute',cursor:'pointer',right:5,bottom:5,fontSize:35,color:'#2e2e2e'}}></i>
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
                                        <button type="button" className="btn btn-primary" onClick={()=>detalles( (index + numberPlayers) / numberPlayers )}>Resultados</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                    }

                    <div className={`${user.visibility ? 'element-show2' : 'element-hide2'}`} style={{
                        background:"#fff",
                        padding:10,
                        borderRadius:6,
                        position:"relative",
                        boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)",
                    }}>
                        {/* <div style={{position:"absolute",top:-46,left:20}}><img style={{width:'70px',marginBottom:'10px',borderRadius:"50%",boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)"}} alt="avatar" src={user.img} /></div> */}
                        <div  className="d-flex justify-content-between" style={{background:"#007bff",padding:5,color:"#fff"}}> 
                            <div className="text-end me-2"><b>Posición</b> <span className="badge bg-secondary" style={{fontSize:20,marginTop:5}}> {x()} </span></div>
                            <div className="mt-2"> {user.name} <span style={{fontSize:12}}>({user.alias})</span></div>
                            <div className="text-end"><b>Cancha</b> <span className="badge bg-danger" style={{fontSize:20,marginTop:5}}> { Math.floor((index + numberPlayers) / numberPlayers) } </span></div>
                        </div>
                      
                        <div className="position-absolute" style={{top:65,zIndex:2}}>  
                            {
                                !disabled &&
                                users.length-1 !== index ?
                                <i className="fa fa-arrow-down fa-2x btn-effect2" title="bajar" aria-hidden="true" onClick={()=>downPosition(user.id_user,user.position,user.visibility)}></i> :
                                <i className="fa fa-arrow-down fa-2x" style={{padding:4,opacity:0}} aria-hidden="true"></i>
                            }
                                <img style={{width:'70px',margin:'10px',borderRadius:"50%",boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}} alt="avatar" src={user.img} /> 
                            {
                                !disabled &&
                                index > 0  ?
                                <i className="fa fa-arrow-up fa-2x btn-effect" title="subir" aria-hidden="true" onClick={()=>upPosition(user.id_user,user.position,user.visibility)}></i>:
                                <i className="fa fa-arrow-down fa-2x" style={{padding:4,opacity:0}} aria-hidden="true"></i>
                            }
                            
                        </div>

                        <div className="d-flex justify-content-between position-absolute" style={{top:75,width:'100%',zIndex:1}}>
                            <div className="d-flex" style={{paddingLeft:200}}>
                                <div className="d-flex flex-column me-3">
                                    <label style={{marginBottom:-3,paddingLeft:15}}>SET 1</label>
                                    <input type="number" name={user.id_user} value={user.set1} onChange={(e)=>onChangePoints(e,'set1')} disabled={true} style={{width:80,fontSize:20,textAlign:'center',marginRight:3}}/>
                                </div>
                                <div className="d-flex flex-column me-3">
                                    <label style={{marginBottom:-3,paddingLeft:15}}>SET 2</label>
                                    <input type="number" name={user.id_user} value={user.set2} onChange={(e)=>onChangePoints(e,'set2')} disabled={true} style={{width:80,fontSize:20,textAlign:'center',marginRight:1}}/>
                                </div>
                                <div className="d-flex flex-column me-3">
                                    <label style={{marginBottom:-3,paddingLeft:15}}>SET 3</label>
                                    <input type="number" name={user.id_user} value={user.set3} onChange={(e)=>onChangePoints(e,'set3')} disabled={true} style={{width:80,fontSize:20,textAlign:'center'}}/>
                                </div>
                            </div> 
                            
                            <div className="d-flex justify-content-end" style={{paddingRight:100}}>
                                <div className="d-flex flex-column me-5">
                                    <label style={{marginBottom:-3,paddingLeft:0}}>PENALIZACIÓN</label>
                                    <input type="number" name={user.id_user} value={user.penalty} onChange={(e)=>onChangePoints(e,'penalty')} disabled={disabled} style={{width:80,fontSize:20,textAlign:'center',marginRight:1}}/>
                                </div>    
                                <div className="d-flex flex-column">
                                    <label style={{marginBottom:-3,paddingLeft:15}}>TOTAL</label>
                                    <input type="number" name={user.id_user} value={user.total} onChange={(e)=>onChangePoints(e,'total')} disabled={true} style={{width:80,fontSize:20,textAlign:'center',marginRight:3}}/>
                                </div> 
                            </div> 
                        </div> 
                    </div>

                </div>
            
            ))

            :

            <ResumenCourt setShowResumen={setShowResumen} disabled={disabled} set={set}/>
        
    )
}
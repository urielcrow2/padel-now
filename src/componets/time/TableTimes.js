import {useRef,useState} from 'react';
import {ResumenCourt} from './ResumenCourt';

export const TableTimes = ({users,numberPlayers,onChangeDateSingle,courts,onChangePoints,disabled,downPositionUser,upPositionUser,showResumen,setShowResumen})=>{

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

        <div className="table-responsive" style={{padding:25}}>
            <table className="table table-striped align-middle" style={{marginTop:-10}}>
                <thead style={{background:"#098BCE",color:"#FFF",height:70,fontSize:15,verticalAlign:'middle',boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)",borderRadius:20}}>
                    <tr>
                        <th scope="col" style={{borderTopLeftRadius:20}}>Posición</th>
                        <th scope="col" className="text-center">Jugador</th>
                        <th scope="col">Set 1</th>
                        <th scope="col">Set 2</th>
                        <th scope="col">Set 3</th>
                        <th scope="col">Penalización</th>
                        <th scope="col">Total</th>
                        <th scope="col">Cancha</th>
                        <th scope="col" style={{borderTopRightRadius:20}}>Horario</th>
                    </tr>
                </thead>
                <tbody style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)",borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
                    {
                    
                        users.map( (user,index) =>(

                            <tr style={{verticalAlign:'middle'}} key={user.id_user}>
                                <th scope="row" style={{paddingLeft: 40}}>
                                    {
                                       //index+1
                                      x()
                                    }
                                </th>
                                <td> 
                                    <div className="text-md-center text-sm-start">

                                        {
                                            !disabled &&
                                            users.length-1 !== index ?
                                            <i className="fa fa-arrow-down fa-2x btn-effect2" title="bajar" aria-hidden="true" onClick={()=>downPositionUser(user.id_user,user.position)}></i> :
                                            <i className="fa fa-arrow-down fa-2x" style={{padding:4,opacity:0}} aria-hidden="true"></i>
                                        }
                                        <img style={{width:'50px',margin:'10px',borderRadius:"50%",boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}} alt="avatar" src={user.img} /> 
                                        {
                                            !disabled &&
                                            index > 0  ?
                                            <i className="fa fa-arrow-up fa-2x btn-effect" title="subir" aria-hidden="true" onClick={()=>upPositionUser(user.id_user,user.position)}></i>:
                                            <i className="fa fa-arrow-down fa-2x" style={{padding:4,opacity:0}} aria-hidden="true"></i>
                                        }
                                        
                                    </div>
                                    <div className="text-md-center text-sm-start" style={{fontSize:12}}>{user.alias}</div>
                                    <div className="text-md-center text-sm-start">{user.name} </div>
                                </td>
                                <td>
                                    <input type="number" name={user.id_user} value={user.set1} onChange={(e)=>onChangePoints(e,'set1')} disabled style={{width:80,fontSize:20,textAlign:'center'}}/>
                                </td>
                                <td>
                                    <input type="number" name={user.id_user} value={user.set2} onChange={(e)=>onChangePoints(e,'set2')} disabled style={{width:80,fontSize:20,textAlign:'center'}}/>
                                </td>
                                <td>
                                    <input type="number" name={user.id_user} value={user.set3} onChange={(e)=>onChangePoints(e,'set3')} disabled style={{width:80,fontSize:20,textAlign:'center'}}/>
                                </td>
                                <td>
                                    <input type="number" name={user.id_user} value={user.penalty} onChange={(e)=>onChangePoints(e,'penalty')} min={0} disabled={disabled} style={{width:80,fontSize:20,textAlign:'center'}}/>
                                </td>
                                <td>
                                    <input type="number" name={user.id_user} value={user.total} onChange={(e)=>onChangePoints(e,'total')} disabled style={{width:80,fontSize:20,textAlign:'center'}}/>
                                </td>
                                { 
                                    (index + numberPlayers) % numberPlayers === 0 
                                    ?
                                        <>
                                            <td ><span className="badge bg-danger" style={{fontSize:25,marginTop:5}}> { (index + numberPlayers) / numberPlayers} </span></td>
                                            <td>
                                                <input 
                                                    type="date" 
                                                    className="mb-3" 
                                                    name={(index + numberPlayers) / numberPlayers}  
                                                    value={ courts[ (index + numberPlayers) / numberPlayers ] ?  courts[ (index + numberPlayers) / numberPlayers ].date : ""} 
                                                    onChange={(e)=>onChangeDateSingle(e,'date')} 
                                                    disabled={disabled} 
                                                    style={{width:120,height:50,fontSize:16,textAlign:'center',marginLeft:4,marginRight:4}}
                                                />
                                               
                                                <input 
                                                    type="time" 
                                                    name={(index + numberPlayers) / numberPlayers}  
                                                    value={ courts[ (index + numberPlayers) / numberPlayers ] ?  courts[ (index + numberPlayers) / numberPlayers ].time : ""} 
                                                    onChange={(e)=>onChangeDateSingle(e,'time')}  
                                                    disabled={disabled} 
                                                    style={{width:120,height:50,fontSize:16,textAlign:'center',marginLeft:4,marginRight:4}}
                                                />
                                            </td>
                                        </>

                                    :
                                        (index + numberPlayers -2) % (numberPlayers) === 0 && 
                                        <>
                                            <td></td>
                                            <td className="text-center">
                                                <button type="button" className="btn btn-primary" onClick={()=>detalles( (index + numberPlayers) / numberPlayers )}>Detalles</button>
                                            </td>
                                        </>
                                   
                                }
                                
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>

        :

        <ResumenCourt setShowResumen={setShowResumen} disabled={disabled} set={set}/>
       
    
    )
}
import { useContext,useState,useEffect } from 'react';
import { ContextTournaments } from '../../context/ContextTournaments';
import {mixinSwal,infoSwal} from '../utils/swalCustome';

export const SelectTeam = ()=>{

    const { setScreen,formData,setFormData } = useContext(ContextTournaments);
    const [totalTeams,setTotalTeams] = useState([]);

    useEffect(()=>{
        const temp=[];
        for(let i = 1; i <= formData.generals.courts; i++)
            temp.push(i);
        setTotalTeams(temp);
    },[formData.generals.courts]);

    const selectTeam = (team)=>{
        setFormData({
            ...formData,
            activeTeam:team
        });
        setScreen(7);
    }

    const saveListUser = ()=>{

        let flag = false;

        formData.totalUsersByTeam.forEach( team =>{
            if(team !== formData.generals.players_by_court)
                flag = true;
        });

        if(flag)
            return infoSwal({title: `Debes completar las canchas con ${formData.generals.players_by_court} jugadores`});

        mixinSwal({ icon: 'success',title: `Avance guardado`});

        setScreen(6);
    }


    return(
        <>
            <button type="button" className="btn btn-outline-dark me-2 mb-md-0 mb-2 d-flex align-items-center" onClick={()=> setScreen(4) }><i className="fa fa-2x fa-arrow-left me-2" aria-hidden="true"></i> Paso 2</button>
            <h4 className="text-center mb-1"> Agrupa a los jugadores en las canchas paso 3 de 4 </h4>
            <div className="row mt-5"> 
                {
                    totalTeams.map(team=>(
                        <div className="col-md-3 col-sm-6" key={team} style={{marginBottom:50,position:"relative"}} >
                            <div style={{
                                background:"#303641",
                                padding:10,
                                borderRadius:6,
                                position:"relative",
                                boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)",
                                height:120,
                                color:"#FFF"
                            }}>
                                
                                <div className="d-flex flex-column">
                                    <span style={{position:'absolute',top:0,fontSize:20}}>{formData.totalUsersByTeam[team-1]} <span style={{fontSize:12}}>jugadores</span></span>
                                    <h1 className="text-center">{team}</h1>
                                    <button className="btn btn-light" type="button" onClick={()=>selectTeam(team)}>seleccionar jugadores <i className={`fa fa-2x ${formData.totalUsersByTeam[team-1] === formData.generals.players_by_court ? 'fa-check-circle text-success' : 'fa-clock text-warning'} me-2 `} aria-hidden="true"></i></button>
                                </div>
                                
                            </div>
                        </div>
                    ))
                }
            </div>

             <div className="d-flex justify-content-center mt-3">
                <button type="submit" className="btn btn-outline-dark me-2 mb-md-0 mb-2 d-flex align-items-center" onClick={saveListUser}> Ir a paso 4 <i className="fa fa-2x fa-arrow-right ms-3" aria-hidden="true"></i></button>
            </div>

        </>
    )
}
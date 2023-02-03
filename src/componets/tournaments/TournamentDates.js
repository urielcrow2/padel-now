import { useContext,useState } from 'react';
import {ContextTournaments} from '../../context/ContextTournaments';
import { fetchCustome2 } from "../../helpers/fetch";
import {mixinSwal,infoSwal,waitSwal} from '../utils/swalCustome';

export const TournamentDates = ()=>{

    const { setScreen,setSearchTournaments,formData,setFormData, tournamentsContext : {idClub}} = useContext(ContextTournaments);
    const [jornada,setJornada] = useState(1);
    const [courts,setCourts] = useState({...formData.journals[0]});//horarios y fechas de partidos en cada cancha

    const onChangeJornada = (e)=>{
        setJornada(e.target.value);
        setCourts({...formData.journals[ parseInt(e.target.value) - 1]})
    }

   const onChangeDateMasive = (e)=>{
    
        //En este caso no estamos actualizando por medio del provider la propiedad journals de la clase formData, en este caso lo hacemos por refrencia
        const temp = {
            ...courts
        };

        Object.keys(temp).forEach(element => {
            temp[element].date = e.target.value
        }); 

        setCourts(temp);
    }

    const onChangeDateSingle = (e,name)=>{

        //En este caso no estamos actualizando por medio del provider la propiedad journals de la clase formData, en este caso lo hacemos por refrencia
        const temp = {
            ...courts
        };

        Object.keys(temp).forEach( court => {
            if( e.target.name === court) //que el campo ya sea la hora o fecha pertenescan a la cancha respectiva
                temp[court][name] = e.target.value
        });

        setCourts(temp);
    }
    
    const goBack = ()=>{
        setScreen(5);
    }

    const onCreate = async()=>{

        const players = formData.usersTeams.sort( (a,b) => a.team - b.team).map( (user,index) => ({id:user.id,position:index+1}));

        const journals = [];
       
        formData.journals.forEach( (journal1,index) => {
            let temp = [];
            Object.keys(journal1).forEach( court => {
                temp.push([formData.journals[index][court].date,formData.journals[index][court].time])
            });
            journals[index] = temp;
        });

        const tournamenFormData = {
            ...formData.generals,
            journals,
            players,
            club:idClub
        }
        
        waitSwal({html:'Creando torneo'});

        try{
            const resp = await fetchCustome2({ 
                endpoint : '/tournaments',
                method :'POST',
                body:tournamenFormData,
                json:true
            });

            if(resp.id){
                mixinSwal({ icon: 'success',title: `Torneo creado`})
                setScreen(4);

                setFormData({
                    generals:{},
                    users:[],
                    journals:[],
                    totalSelected:0,
                    usersTeams:[],
                    totalUsersByTeam:[],
                    activeTeam:0
                });

            }
            else{
                return infoSwal({
                    icon: 'error',
                    title: 'Ocurrio un error',
                    text: `Error de comunucación con el servidor, intentelo más tarde` ,
                })
            }
        } 
        catch(error){
            return infoSwal({
                icon: 'error',
                title: 'Ocurrio un error',
                text: `Error de comunucación con el servidor, intentelo más tarde` ,
            });
        }

        setScreen(1);
        setSearchTournaments(true);
    }

    return(
        <>
           <button type="button" className="btn btn-outline-dark me-2 mb-md-0 mb-2 d-flex align-items-center" onClick={ goBack }><i className="fa fa-2x fa-arrow-left me-2" aria-hidden="true"></i> Paso 3</button>
            <h4 className="text-center mb-1"> Define fechas y horarios paso 4 de 4 </h4>
            
            <div className="row">
                <div className="col-6 mt-3 d-flex justify-content-start">
                    <h5 className="mt-3">Jornada </h5>
                    <input type="number" className="form-control" value={jornada} min="1" max={formData.generals.journals} onChange={onChangeJornada} style={{width:80,fontSize:20,textAlign:'center',marginLeft:4,marginRight:4}}/>
                    <h5 className="mt-3"> de {formData.generals.journals}</h5>
                </div>
                <div className="col-6 mt-3 d-flex justify-content-end">
                    <button type="button" className="btn btn-outline-primary" onClick={onCreate} style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}}> Finalizar</button>
                </div>
            </div>

            <hr />

            <div className="mt-3">
                <div className="text-center mb-3" style={{fontSize:15}}>Puedes definir fechas y horarios posteriormente</div>
                <div className="position-relative">
                    <span style={{position:"absolute",top:-12,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Aplicación masiva</span>
                    <input type="date" onChange={onChangeDateMasive} style={{width:200,height:50,fontSize:16,textAlign:'center',marginLeft:4,marginRight:4}}/>
                </div>
            </div>

            <div className="table-responsive" style={{padding:25}}>
                <table className="table align-middle" style={{marginTop:30}}>
                    <thead style={{background:"#098BCE",color:"#FFF",height:70,fontSize:15,verticalAlign:'middle',boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)",borderRadius:20}}>
                        <tr>
                            <th scope="col" style={{borderTopLeftRadius:20}}>Cancha</th>
                           
                            <th scope="col" style={{borderTopRightRadius:20}}>Horario</th>
                        </tr>
                    </thead>
                    <tbody style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)",borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
                        {
                            Object.keys(courts).map( (court,index) =>(
                                <tr style={{verticalAlign:'middle'}} key={court}>
                                    <th scope="row" style={{paddingLeft: 40}}> <span className="badge bg-danger" style={{fontSize:25,marginTop:5}}> {court} </span> </th>
                                    <td>
                                        <input type="date" name={court} value={courts[index+1].date} onChange={(e)=>onChangeDateSingle(e,'date')} className="mb-md-0 mb-3" style={{width:120,height:50,fontSize:16,textAlign:'center',marginLeft:4,marginRight:4}}/>
                                        <input type="time" name={court} value={courts[index+1].time} onChange={(e)=>onChangeDateSingle(e,'time')} style={{width:120,height:50,fontSize:16,textAlign:'center',marginLeft:4,marginRight:4}}/>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

        </>
    )

}
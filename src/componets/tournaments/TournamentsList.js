import { useEffect, useContext,useState} from 'react';
import fileDownload from 'js-file-download';
import {ContextTournaments} from '../../context/ContextTournaments';
import {GetTournamentsHook} from './GetTournamentsHook';
import {Load2} from '../utils/load2/Load2';
import { fetchCustome2 } from "../../helpers/fetch";
import {mixinSwal,infoSwal,waitSwal,quetionSwal2} from '../utils/swalCustome';
import {formatDateTimeMx} from '../../helpers/miselanius';
import {ButtonFloat} from '../utils/buttonFloat/ButtonFloatComponent';

export const TournamentsList = ()=>{

    const { setScreen,setSearchTournaments,setTournamentsContext,tournamentsContext,setTournamentsSelect,setIdTournamentDetail} = useContext(ContextTournaments);

    const {tournaments,getTournaments,onChangeClub,idClub} = GetTournamentsHook(tournamentsContext);

    const [widthScreen,setWidthScreen] = useState(window.innerWidth);

    useEffect(()=>{//al cargar la lista de torneos enviamos el total de ellos
        setTournamentsContext(tournamentsContext=>({
            ...tournamentsContext,
            total:tournaments.data.length,
            onChangeClub,
            tournaments,
            idClub
        }));
    },[tournaments.data,setTournamentsContext]);

    useEffect(()=>{//al cambiar la liset del select tambien la enviamos
        setTournamentsSelect(tournaments.select);
    },[tournaments.select,setTournamentsSelect]);

    useEffect(()=>{
        const onResize = ()=>setWidthScreen( window.innerWidth )
        
        window.addEventListener('resize',onResize);

        return () => {
            window.removeEventListener('resize',onResize);
        }

    },[]);


    const detailTournament = (id)=>{
        setScreen(3);
        setSearchTournaments(false);
        setIdTournamentDetail(id);
    }

    const historyToggle = (id,status,name)=>{
        quetionSwal2(`Deseas cambiar el estatus del torneo: ${name}`,'Los torneos archivados no se eliminan, pero si se ocultan para los usuarios que no sean administrador', async (resp)=>{

            if(resp.isConfirmed){

                const newStatus = status === 1 ? 2 : 1;

                const formData = {
                    id,
                    status:newStatus,
                }

                waitSwal({html:'Actualizando estatus'});

                try{
                    const resp = await fetchCustome2({ 
                        endpoint : '/tournaments/status',
                        method :'PUT',
                        body:formData,
                        json:true
                    });

                    if( parseInt(resp.id) === id && parseInt(resp.affected) === 1){
                        mixinSwal({ icon: 'success',title: `Actualización correcta`});
                        getTournaments();
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
                    })
                }
            }
        });

    }

    const deleteTournament = (id,name)=>{
        quetionSwal2(`Deseas eliminar el torneo: ${name}`,'Todos los registros desapareceran, esta opción se recomienda sólo cuando se creó un torneo y no le han cargado datos', async (resp)=>{

            if(resp.isConfirmed){

                waitSwal({html:'Eliminando torneo'});

                try{
                    const resp = await fetchCustome2({ 
                        endpoint : `/tournaments/${id}`,
                        method :'DELETE',
                        json:true
                    });

                    if( resp.length > 0 ){
                        mixinSwal({ icon: 'success',title: `Torneo eliminado`});
                        getTournaments();
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
                    })
                }
            }
        });

    }

    const descargarTablaGeneral= async(torneo)=>{
        quetionSwal2(`Descargar tabla general`,`Se descarga la última jornada activa`,async (resp)=>{
           
            if(resp.isConfirmed){
               
                waitSwal({html:'Generando archivo'});
                let url = '';

                try{
                    url = await fetchCustome2({ endpoint : `/reportes/tabla/${torneo}`});
                } 
                catch(error){
                    return infoSwal({
                        icon: 'error',
                        title: 'Ocurrio un error',
                        text: `Error de comunucación con el servidor, intentelo más tarde` ,
                    })
                }

                let resp = await fetch(url)
                resp = await resp.blob();
                fileDownload(resp, 'tabla_general.pdf');

                mixinSwal({ icon: 'success',title: `Archivo descargado`});
            }
        });
    }

    return(
        <div className="table-responsive" style={{padding:25}}>

            {
                tournaments.load ? 

                <Load2 /> :

                widthScreen < 920 
                        
                ?

                    <div className="row">
                        {
                            tournaments.data.map( tournament =>(
                                <div className="col-12" style={{marginBottom:20}} key={tournament.id}>
                                    <div style={{
                                        background:"#fff",
                                        padding:10,
                                        borderRadius:6,
                                        position:"relative",
                                        boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)"
                                    }}>
                                    
                                        <div style={{background:"#007bff",padding:10,color:"#fff"}}>{tournament.name} </div>
                                        <div className="d-flex justify-content-between"> <b>F. creación:</b> {formatDateTimeMx(tournament.created_at)} </div>
                                        <div className="d-flex justify-content-between"> <b>Jugadores:</b> {tournament.players} </div>
                                        <div className="d-flex justify-content-between align-items-center"> 
                                            <b>Avance:</b> 
                                            <progress value={ 100 / tournament.journals * (parseInt(tournament.last_journal_close) + 1) } max="100"></progress> 
                                            <span className="ms-2">{ Math.floor( 100 / tournament.journals * (parseInt(tournament.last_journal_close )+1)) }%</span>
                                        </div>
                                        <div className="d-flex justify-content-center"><hr style={{width:"80%"}}/></div>
                                        <div className="d-flex justify-content-end">
                                        <button type="button" title="Descargar tabla general" className="btn btn-outline-primary me-2" onClick={()=>descargarTablaGeneral(tournament.id)}><i className="fa fa-file-pdf-o" aria-hidden="true"></i></button>
                                        <button type="button" title="Detalles" className="btn btn-outline-success me-2" onClick={()=>detailTournament(tournament.id)}><i className="fa fa-plus " aria-hidden="true"></i></button>
                                        <button type="button" title="Eliminar" className="btn btn-outline-danger me-2" onClick={()=>deleteTournament(tournament.id,tournament.name)} ><i className="fa fa-trash" aria-hidden="true"></i></button>
                                        <button type="button" title="Archivar / Desarchivar" className="btn btn-outline-secondary" onClick={()=>historyToggle(tournament.id,tournament.status,tournament.name)}><i className="fa fa-history" aria-hidden="true"></i></button>
                                        </div>
                                        
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                :

                    <table className="table align-middle" style={{marginTop:30}}>
                        <thead style={{background:"#098BCE",color:"#FFF",height:70,fontSize:15,verticalAlign:'middle',boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)",borderRadius:20}}>
                            <tr>
                                <th scope="col" style={{borderTopLeftRadius:20}}>No.</th>
                                <th scope="col">Torneo</th>
                                <th scope="col">F. creación</th>
                                <th scope="col">Jugadores</th>
                                <th scope="col">Avance torneo</th>
                                <th scope="col" style={{borderTopRightRadius:20}}>Opciones</th>
                            </tr>
                        </thead>
                        <tbody style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)",borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
                        {
                        
                            tournaments.data.map( (tournament,index) =>(
                                <tr  key={tournament.id}>
                                    <th scope="row" style={{paddingLeft: 40}} >{index + 1}</th>
                                    <td> {tournament.name}</td>
                                    <td> {formatDateTimeMx(tournament.created_at)}</td>
                                    <td style={{textAlign:'center'}}> {tournament.players} </td>
                                    <td> <progress value={ 100 / tournament.journals * parseInt(tournament.last_journal_close)} max="100"></progress> { Math.floor(100 / tournament.journals * (parseInt(tournament.last_journal_close)) )}%</td>
                                    <td> 
                                        <button type="button" title="Descargar tabla general" className="btn btn-outline-primary me-2 mb-md-0 mb-2" onClick={()=>descargarTablaGeneral(tournament.id)}><i className="fa fa-file-pdf-o" aria-hidden="true"></i></button>
                                        <button type="button" title="Detalles" className="btn btn-outline-success me-2 mb-md-0 mb-2" onClick={()=>detailTournament(tournament.id)}><i className="fa fa-plus " aria-hidden="true"></i></button>
                                        <button type="button" title="Eliminar" className="btn btn-outline-danger me-2 mb-md-0 mb-2" onClick={()=>deleteTournament(tournament.id,tournament.name)} ><i className="fa fa-trash" aria-hidden="true"></i></button>
                                        <button type="button" title="Archivar / Desarchivar" className="btn btn-outline-secondary" onClick={()=>historyToggle(tournament.id,tournament.status,tournament.name)}><i className="fa fa-history" aria-hidden="true"></i></button>
                                    </td>
                                </tr>
                            ))
                        } 
                        </tbody>
                    </table>
            }

            <ButtonFloat hight={200}/>
           
        </div>
    )

}
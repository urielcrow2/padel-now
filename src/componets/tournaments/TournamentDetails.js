import { useContext,useState,useEffect } from 'react';
import fileDownload from 'js-file-download';
import {ContextTournaments} from '../../context/ContextTournaments';
import {ContextTournamentsVs} from '../../context/ContextTournamentsVs';
import {GetUserHook} from '../time/GetUserHook';
import {Load2} from '../utils/load2/Load2';
import {TableTimes3} from '../time/TableTimes3';
import {TableTimes2} from '../time/TableTimes2';
import {ButtonFloat} from '../utils/buttonFloat/ButtonFloatComponent';
import { fetchCustome2 } from "../../helpers/fetch";
import {mixinSwal,infoSwal,waitSwal,quetionSwal2,subirBajarSwal,closeSwal} from '../utils/swalCustome';

import {TournamentGeneralTable} from './TournamentGeneralTable';

export const TournamentDetails = ()=>{

    const { setScreen, setSearchTournaments,idTournamentDetail,showResumen,setShowResumen,tournamentsContext } = useContext(ContextTournaments);
    const {userP,setUserP,vs,groupVisibility} = useContext(ContextTournamentsVs);
    const [jornada,setJornada] = useState(0);
    const { data,onChangeDateSingle,onChangePoints,upPositionUser,downPositionUser,onChangeDateMasive,subeYbaja1,subeYbaja2 } = GetUserHook(jornada,idTournamentDetail,tournamentsContext.idClub);
    const [widthScreen,setWidthScreen] = useState(window.innerWidth);
    const [tab,setTab] = useState(0);
    const [detail,setDetail] = useState(false);

    useEffect(()=>{
        const onResize = ()=>setWidthScreen( window.innerWidth )
        
        window.addEventListener('resize',onResize);

        return () => {
            window.removeEventListener('resize',onResize);
        }

    },[]);
 
    const onList= ()=>{
        setScreen(1);
        setSearchTournaments(true);
    }

    const onChangeJornada = (e)=>{
        setJornada(e.target.value)
    }

    const onCloseJournal = ()=>{

        quetionSwal2(`Cerrar jornada ${data.journal_active}`,`Al cerrar la jornada habilitaras la siguiente`,async (resp)=>{
           

            if(resp.isConfirmed){

             
                const status = await onSaveData();


                console.log(status)

                if(!status)
                    return;
               

                const formData = {
                    journal : data.journal_active,
                    idTournament : idTournamentDetail,
                }

                waitSwal({html:'Cerrando jornada'});

                try{
                    const resp = await fetchCustome2({ 
                        endpoint : '/tournaments/journal_close',
                        method :'PUT',
                        body:formData,
                        json:true
                    });

                    if(resp.idTournament){
                        mixinSwal({ icon: 'success',title: `Jornada cerrada correctamente`});
                        setJornada(resp.journal + 1)
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

    const onSaveDataQuestion = ()=>{
        quetionSwal2(`Guardar cambios`,``,async (resp)=>{
            if(resp.isConfirmed)
                onSaveData();
        });
    }

    const onSaveData = async()=>{

        const times = [];
    
        data.times.forEach( (journal1,index) => {
            Object.keys(journal1).forEach( court => {
                times.push([data.times[index][court].date,data.times[index][court].time])
            });
        });
    
        const formData = {
            journal:data.journal_active,
            idTournament:idTournamentDetail,
            users:userP,
            vs,
            times
        }

        waitSwal({html:'Guardando cambios'});

        console.log(formData)

        try{
            const resp = await fetchCustome2({ 
                endpoint : '/tournaments',
                method :'PUT',
                body:formData,
                json:true
            });

            if(resp.idTournament){
                mixinSwal({ icon: 'success',title: `Cambios guardados`});
                return true;
            }
            else{
                infoSwal({
                    icon: 'error',
                    title: 'Ocurrio un error',
                    text: `Error de comunucación con el servidor, intentelo más tarde` ,
                });
                return false;
            }
        } 
        catch(error){
            infoSwal({
                icon: 'error',
                title: 'Ocurrio un error',
                text: `Error de comunucación con el servidor, intentelo más tarde` ,
            });

            return false;
        }
         
    }

    const descargarNotacion = async()=>{
        quetionSwal2(`Descargar hoja de anotaciones`,``,async (resp)=>{
           
            if(resp.isConfirmed){
                const j = jornada === 0 ? data.journal_active : jornada;
                waitSwal({html:'Generando archivo'});
                let url = '';

                try{
                    url = await fetchCustome2({ endpoint : `/reportes/anotaciones/${idTournamentDetail}/${j}`});
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
                fileDownload(resp, 'hoja_anotaciones.pdf');

                mixinSwal({ icon: 'success',title: `Archivo descargado`});
            }
        });
    }

    const descargarHorarios = async()=>{
        quetionSwal2(`Descargar horarios`,``,async (resp)=>{
           
            if(resp.isConfirmed){
                const j = jornada === 0 ? data.journal_active : jornada;
                waitSwal({html:'Generando archivo'});
                let url = '';

                try{
                    url = await fetchCustome2({ endpoint : `/reportes/horarios/${idTournamentDetail}/${j}`});
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
                fileDownload(resp, 'horarios.pdf');

                mixinSwal({ icon: 'success',title: `Archivo descargado`});
            }
        });
    }

    const subirBajarJugadores = async ()=>{
        subirBajarSwal((resp)=>{
            if(resp){
                if(parseInt(resp)===1){
                    waitSwal({html:'Espere...'});
                    subeYbaja1(groupVisibility.current);
                    setTimeout(()=>{
                        closeSwal();
                    },1500);
                }
                else if(parseInt(resp)===2){
                    waitSwal({html:'Espere...'});
                    subeYbaja2(groupVisibility.current);
                    setTimeout(()=>{
                        closeSwal();
                    },1500);
                }
            }  
        });
    }

   
    return(
        <>
            <button type="button" className="btn btn-outline-dark mb-4 d-flex align-items-center" onClick={onList}><i className="fa fa-2x fa-arrow-left me-2" aria-hidden="true"></i> Lista de torneos</button>
            <h4 className="text-center mb-3 position-relative" style={{paddingRight:60}}>
                {data.name}
                <i className={`fa ${detail ? 'fa-minus-circle' : 'fa-plus-circle'}`} aria-hidden="true" onClick={()=>setDetail(!detail)} style={{position:'absolute',cursor:'pointer',right:0,bottom:0,fontSize:35,color:'#2e2e2e'}}></i>
            </h4>

            <div className="row mt-3 detail-tournament">
                <div className={`${detail ? 'element-show1' : 'element-hide1'}`}>
                    <div className="col-md-4 col-12 position-relative icon-detail">
                        <div className="detail mb-2 mt-2">Número de jugadores</div>
                        <i className="fa fa-users position-absolute" aria-hidden="true"></i>
                        {/* <span className="detail">{data.users.length > 0 ? data.users.length : "Cargando..."}</span> */}
                        <span className="detail">{userP.length > 0 ? userP.length : "Cargando..."}</span>
                    </div>
                    <div className="col-md-4 col-12 position-relative icon-detail">
                        <div className="detail mb-2 mt-2">Número de jornadas</div>
                        <i className="fa fa-sort-numeric-asc position-absolute" aria-hidden="true"></i>
                        <span className="detail">{data.journals_total} </span>
                    </div>
                    <div className="col-md-4 col-12 position-relative icon-detail">
                        <div className="detail mb-2 mt-2">Última jornada finalizada</div>
                        <i className="fa fa-lock position-absolute" aria-hidden="true"></i>
                        <span className="detail">{data.last_journal_close}</span>
                    </div>
                    <div className="col-md-4 col-12 position-relative icon-detail">
                        <div className="detail mb-2 mt-2">Fecha de inicio</div>
                        <i className="fa fa-calendar-o position-absolute" aria-hidden="true"></i>
                        <span className="detail">{data.initial_date}</span>
                    </div>
                    <div className="col-md-4 col-12 position-relative icon-detail">
                        <div className="detail mb-2 mt-2">Fecha fin</div>
                        <i className="fa fa-calendar position-absolute" aria-hidden="true"></i>
                        <span className="detail">{data.final_date}</span>
                    </div>
                    <div className="col-md-4 col-12 position-relative icon-detail">
                        <div className="detail mb-2 mt-2">Número de canchas</div>
                        <i className="fa fa-columns position-absolute" aria-hidden="true"></i>
                        <span className="detail">{data.times.length > 0 ? data.times.length : "Cargando..."}</span>
                    </div>
                    <div className="col-md-4 col-12 position-relative icon-detail">
                        <div className="detail mb-2 mt-2">Jugadores por cancha</div>
                        <i className="fa fa-list-ol position-absolute" aria-hidden="true"></i>
                        <span className="detail">{data.number_players_by_court}</span>
                    </div>

                </div>
            
                <div className="col-12">
                    <hr />
                </div>

                <ul className="nav nav-pills nav-justified mb-1">
                    <li className="nav-item">
                        <button type="button" className={`nav-link ${tab === 0 && 'active'}`} onClick={()=>setTab(0)}>Editar</button>
                    </li>
                    <li className="nav-item">
                        <button type="button" className={`nav-link ${tab === 1 && 'active'}`} onClick={()=>setTab(1)}>T. General</button>
                    </li>
                </ul>

                <div className="col-12 mb-1">
                    <hr />
                </div>


                    {
                        tab === 0
                        
                        ?
                        
                        <>
                            <div className="col-md-6 col-12 d-flex justify-content-start position-relative mb-5">
                                <label style={{position:'absolute',top:-28,left:25,marginTop:10,color:"#ccc"}}>Jornada</label>
                                <label style={{position:'absolute',bottom:-27,left:38,color:"#ccc"}}> de {data.journals_total}</label>
                                {
                                    data.load 
                                    ?
                                        <select className="form-control" disabled={true} style={{width:70,fontSize:16,textAlign:'center',marginLeft:4,marginRight:4}}/>
                                    :
                                        <select className="form-control" value={data.journal_active} onChange={onChangeJornada} style={{width:70,fontSize:16,textAlign:'center',marginLeft:4,marginRight:4}}>
                                            {
                                                Array(data.last_journal_close).fill().map((value,index)=>(
                                                    <option value={index+1} key={index}>{index+1}</option>
                                                ))
                                            }
                                        </select>
                                }
                            
                                <div className="position-relative ms-1">
                                    <span style={{position:"absolute",top:-14,left:10,padding: "0 10px",color:"#ccc",fontSize:11,zIndex:1}}>Aplicación masiva</span>
                                    <input type="date" onChange={onChangeDateMasive} disabled={data.load || !showResumen} style={{width:140,height:50,fontSize:16,textAlign:'center',marginLeft:4,marginRight:10,zIndex:2,}}/>
                                </div>

                                <div className="position-relative">
                                    <span style={{position:"absolute",top:-14,left:10,padding: "0 10px",color:"#ccc",fontSize:11}}>Subir</span>
                                    <span style={{position:"absolute",top:50,left:10,padding: "0 10px",color:"#ccc",fontSize:11}}>Bajar</span>
                                    <button type="button" onClick={subirBajarJugadores} title="Subir y bajar jugadores" className="btn btn-outline-warning me-2" disabled={data.load || !showResumen}><i className="fa fa-2x fa-sort fa-fw" aria-hidden="true"></i></button>
                                </div>

                               

                            </div>

                            <div className="col-md-6 col-12 d-flex justify-content-md-end justify-content-start position-relative mb-4">
                                <div className="position-relative">
                                    <span style={{position:"absolute",top:-14,left:0,padding: "0 10px",color:"#ccc",fontSize:11}}>Descargar</span>
                                    <span style={{position:"absolute",top:50,left:-4,padding: "0 10px",color:"#ccc",fontSize:11}}>Anotaciones</span>
                                    <button type="button" onClick={descargarNotacion} title="Descargar hoja de anotaciones" className="btn btn-outline-primary me-2" disabled={data.load || !showResumen}><i className="fa fa-2x fa-file-pdf-o fa-fw" aria-hidden="true"></i></button>
                                </div>

                                <div className="position-relative">
                                    <span style={{position:"absolute",top:-14,left:0,padding: "0 10px",color:"#ccc",fontSize:11}}>Descargar</span>
                                    <span style={{position:"absolute",top:50,left:4,padding: "0 10px",color:"#ccc",fontSize:11}}>Horarios</span>
                                    <button type="button" onClick={descargarHorarios} title="Descargar horarios" className="btn btn-outline-danger me-2" disabled={data.load || !showResumen}><i className="fa fa-2x fa-file-pdf-o fa-fw" aria-hidden="true"></i></button>
                                </div>
                                    
                                <div className="position-relative">
                                    <span style={{position:"absolute",top:-14,left:4,padding: "0 10px",color:"#ccc",fontSize:11}}>Guardar</span>
                                    <span style={{position:"absolute",top:50,left:4,padding: "0 10px",color:"#ccc",fontSize:11}}>Cambios</span>
                                    <button type="button" onClick={onSaveDataQuestion} title="Guardar cambios" className="btn btn-outline-success me-2" disabled={data.load || !showResumen}><i className="fa fa-2x fa-floppy-o fa-fw" aria-hidden="true"></i></button>
                                </div>
                               
                                {
                                    data.last_journal_close === data.journal_active && (data.last_journal_close_real < data.journal_active || data.journal_active===1)  &&
                                    <div className="position-relative">
                                        <span style={{position:"absolute",top:-14,left:7,padding: "0 10px",color:"#ccc",fontSize:11}}>Cerrar</span>
                                        <span style={{position:"absolute",top:50,left:3,padding: "0 10px",color:"#ccc",fontSize:11}}>Jornada</span>
                                        <button type="button" title="Cerrar jornada" onClick={onCloseJournal} className="btn btn-outline-dark" disabled={data.load || !showResumen }><i className="fa fa-2x fa-lock fa-fw" aria-hidden="true"></i></button>
                                    </div>
                                }
                            </div>
                          
                            <div className="col-12">

                                {
                                    data.load ?

                                    <Load2 className="mt-5"/> :
                                
                                        widthScreen > 920 

                                        ?

                                            <div className="row" style={{marginTop:20}}>
                                                <TableTimes3 
                                                    courts={data.times[0]} 
                                                    users={userP} 
                                                    numberPlayers={data.number_players_by_court} 
                                                    onChangeDateSingle={onChangeDateSingle} 
                                                    onChangePoints={onChangePoints}
                                                    upPositionUser={upPositionUser}
                                                    downPositionUser={downPositionUser}
                                                    //disabled={data.last_journal_close === data.journal_active ? false : true}
                                                    disabled={false}
                                                    setShowResumen={setShowResumen}
                                                    showResumen={showResumen}
                                                    controlVisibility={setUserP}
                                                    groupVisibility={groupVisibility}
                                                />
                                            </div>
                                           
                                        :

                                        <div className="row" style={{marginTop:20}}>
                                            <TableTimes2 
                                                courts={data.times[0]} 
                                                users={userP} 
                                                numberPlayers={data.number_players_by_court} 
                                                onChangeDateSingle={onChangeDateSingle} 
                                                onChangePoints={onChangePoints}
                                                upPositionUser={upPositionUser}
                                                downPositionUser={downPositionUser}
                                                //disabled={data.last_journal_close === data.journal_active ? false : true}
                                                disabled={false}
                                                setShowResumen={setShowResumen}
                                                showResumen={showResumen}
                                                controlVisibility={setUserP}
                                                groupVisibility={groupVisibility}
                                            />
                                        </div>
                                }
                            
                            </div>
                        </>

                        :

                        <TournamentGeneralTable />
                       
                    }
                    
                <ButtonFloat hight={200}/>

            </div>
        </>
    )

}
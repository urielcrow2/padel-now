import { useContext,useState,useEffect } from 'react';
import {ContextTournaments} from '../../context/ContextTournaments';
import {ContextTournamentsVs} from '../../context/ContextTournamentsVs';
import {GetUserHook} from '../time/GetUserHook';
import {Load2} from '../utils/load2/Load2';
import {TableTimes} from '../time/TableTimes';
import {TableTimes2} from '../time/TableTimes2';
import {ButtonFloat} from '../utils/buttonFloat/ButtonFloatComponent';
import { fetchCustome2 } from "../../helpers/fetch";
import {mixinSwal,infoSwal,waitSwal,quetionSwal2} from '../utils/swalCustome';

import {TournamentGeneralTable} from './TournamentGeneralTable';

export const TournamentDetails = ()=>{

    const { setScreen, setSearchTournaments,idTournamentDetail,showResumen,setShowResumen,tournamentsContext } = useContext(ContextTournaments);
    const {userP,vs} = useContext(ContextTournamentsVs);
    const [jornada,setJornada] = useState(0);
    const { data,onChangeDateSingle,onChangePoints,upPositionUser,downPositionUser } = GetUserHook(jornada,idTournamentDetail,tournamentsContext.idClub);
    const [widthScreen,setWidthScreen] = useState(window.innerWidth);
    const [tab,setTab] = useState(0);

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
            return infoSwal({
                icon: 'error',
                title: 'Ocurrio un error',
                text: `Error de comunucación con el servidor, intentelo más tarde` ,
            });
        }

    }

    return(
        <>
            <button type="button" className="btn btn-outline-dark mb-4 d-flex align-items-center" onClick={onList}><i className="fa fa-2x fa-arrow-left me-2" aria-hidden="true"></i> Lista de torneos</button>
            <h4 className="text-center mb-3">{data.name}</h4>

            <div className="row mt-3">
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
                            <div className="col-6 d-flex justify-content-start">
                                <h6 className="mt-3"> { widthScreen > 400 ? 'Jornada' : 'J'}  </h6>
                                <input type="number" className="form-control" value={data.journal_active} min="1" max={data.last_journal_close} disabled={data.load} onChange={onChangeJornada} style={{width:60,fontSize:16,textAlign:'center',marginLeft:4,marginRight:4}}/>
                                <h6 className="mt-3"> de {data.journals_total}</h6>
                            </div>

                            <div className="col-6 d-flex justify-content-end mt-1 mt-md-0">
                                {
                                    (data.last_journal_close === data.journal_active && data.journal_active < data.journals_total) &&
                                    <button type="button" onClick={onCloseJournal} className="btn btn-outline-dark me-3" disabled={data.load || !showResumen } style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}}><i className="fa fa-2x fa-lock" aria-hidden="true"></i> { widthScreen > 400 && 'Cerrar jornada' }</button>
                                }
                                <button type="button" onClick={onSaveData} className="btn btn-outline-dark" disabled={data.load || !showResumen} style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}}><i className="fa fa-2x fa-check" aria-hidden="true"></i> {  widthScreen > 400 && 'Guardar cambios' }</button>
                            </div>

                            
                            <div className="col-12">

                                {
                                    data.load ?

                                    <Load2 className="mt-5"/> :
                                
                                        widthScreen > 920 

                                        ?
                                            <TableTimes 
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
                                            />
                                        
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
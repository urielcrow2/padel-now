import { useContext , useEffect, useState ,useRef} from 'react';
import {customeContext} from '../../context/context';
import {ContextTournamentsVs} from '../../context/ContextTournamentsVs';
import {GetUserHook} from './GetUserHook';
import {GetListTournamentHook} from './GetListTournamentHook';
import {TableTimes} from './TableTimes';
import {TableTimes2} from './TableTimes2';
import {ButtonFloat} from '../utils/buttonFloat/ButtonFloatComponent';
import {waitSwal,closeSwal} from '../utils/swalCustome';

import {PerfilClubComponent} from '../perfil/PerfilClubComponent';
import {PerfilClubsHook} from '../perfil/PerfilClubsHook';

const TimeScreen = () => {

    const {setContext} = useContext(customeContext);
    const {userP} = useContext(ContextTournamentsVs);

    //Obtenemos los clubs
    const {clubs,onChangeClub,idClub} = PerfilClubsHook();

    //Obtenemos los torneos
    const {listTournaments} = GetListTournamentHook(idClub);

    const [jornada,setJornada] = useState(0);
    const [idTournament,setIdTournament] = useState(0);
    const {data,onChangeDateSingle,onChangePoints, upPositionUser,downPositionUser } = GetUserHook(jornada,idTournament,idClub);
    const [widthScreen,setWidthScreen] = useState(window.innerWidth);
    const [showResumen,setShowResumen] = useState(true);

    const onMounted = useRef(false);//Sólo al cambiar el select del club activamos la ventana de espere

    useEffect(() => {
        setContext( context => (
            {   ...context,
                titlePage : 'Horarios'
            })
        );
    },[setContext]);


    //#region Controlamos la venta de espera cada que se cambia de club
    //Cada que cambiamos el club y esperamos se cargen las listas de torneos
    useEffect(() => {
        if(onMounted.current)
            waitSwal({html:'Cargando lista de torneos'});
    },[idClub]);
    //Cuando la lista de torneos se cargaron
    useEffect(()=>{
        if(onMounted.current)
            closeSwal();
        else
            onMounted.current = true;
       
    },[listTournaments.load]);
    
    useEffect(()=>{
        const onResize = ()=>setWidthScreen( window.innerWidth )
        
        window.addEventListener('resize',onResize);

        return () => {
            window.removeEventListener('resize',onResize);
        }

    },[]);

    const onChangeJornada = (e)=>{
        waitSwal({html:'Cargando jornada'});
        setJornada(e.target.value);
    }

    const onChangeTournament = (e)=>{
        if(parseInt(e.target.value) === 0)
            return;
        //cada que cambiamos de torneo
        waitSwal({html:'Cargando torneo'});
        setIdTournament(e.target.value);
    }

    return (
        <div className="main-content">
            <div className="main-content-inner">
                <div className="row">
                    <div className="col-lg-12 mt-3">
                        <div className="card">
                            <div className ="card-body">

                                <PerfilClubComponent clubs={clubs} onChangeClub={onChangeClub}/>

                                <div className="row">
                                    <div className="col-md-6 mt-5" style={{position:"relative"}}>
                                        <span style={{position:"absolute",top:-21,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Selecciona un torneo</span>
                                        <div className="d-flex justify-content-between">
                                            <select className="form-control text-uppercase" onChange={onChangeTournament} disabled={listTournaments.load} value={idTournament}>
                                                
                                                {
                                                    listTournaments.load ?

                                                    <option value="0">ESPERANDO...</option>:

                                                    listTournaments.list.map(item=>(
                                                        <option value={item.id} key={item.id} >{item.name}</option>
                                                    ))
                                                }
                                               
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-5 mb-3 d-flex justify-content-end">
                                        <h5 className="mt-3">Jornada </h5>
                                        <input type="number" className="form-control" value={ data.journal_active } min="1" max={data.last_journal_close} onChange={onChangeJornada} disabled={data.load} style={{width:80,fontSize:20,textAlign:'center',marginLeft:4,marginRight:4}}/>
                                        <h5 className="mt-3"> de {data.journals_total}</h5>
                                    </div>
                                </div>

                                {
                                    data.load ?

                                    <></> :

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
                                            disabled={true}
                                            setShowResumen={setShowResumen}
                                            showResumen={showResumen}
                                        />
                                    
                                    :

                                        <div className="row" style={{marginTop:40}}>
                                            <TableTimes2 
                                                courts={data.times[0]} 
                                                users={userP} 
                                                numberPlayers={data.number_players_by_court} 
                                                onChangeDateSingle={onChangeDateSingle} 
                                                onChangePoints={onChangePoints}
                                                upPositionUser={upPositionUser}
                                                downPositionUser={downPositionUser}
                                                disabled={true}
                                                setShowResumen={setShowResumen}
                                                showResumen={showResumen}
                                            />
                                        </div>
                                }

                                <ButtonFloat hight={200}/>

                            </div>
                        </div>
                    </div>
                 </div>        
            </div>
        </div>
    )
}

export default TimeScreen;

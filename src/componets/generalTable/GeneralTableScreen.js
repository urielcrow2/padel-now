import { useContext , useEffect, useState, useRef} from 'react';
import {customeContext} from '../../context/context';
import {GetListTournamentHook} from '../time/GetListTournamentHook';
import {GetGeneralTableHook} from './GetGeneralTableHook';
// import {Load2} from '../utils/load2/Load2';
import {ButtonFloat} from '../utils/buttonFloat/ButtonFloatComponent';
import {GeneralTableView1} from './GeneralTableView1';
import {GeneralTableView2} from './GeneralTableView2';
import {PerfilClubComponent} from '../perfil/PerfilClubComponent';
import {PerfilClubsHook} from '../perfil/PerfilClubsHook';
import {waitSwal,closeSwal} from '../utils/swalCustome';


const GeneralTableScreen = () => {

    const { setContext } = useContext(customeContext);
    
    //Obtenemos los clubs
    const {clubs,onChangeClub,idClub} = PerfilClubsHook();
    
    const {listTournaments} = GetListTournamentHook(idClub);
    const [idTournament,setIdTournament] = useState(0);
    const { tableGeneral } = GetGeneralTableHook(idTournament);
    const [totalJournals,setTotalJournals] = useState([]);
    const [widthScreen,setWidthScreen] = useState(window.innerWidth);

    const onMounted = useRef(false);//Sólo al cambiar el select del club activamos la ventana de espere

    useEffect(() => {
        setContext( context => (
            {   ...context,
                titlePage : 'Tabla General'
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
    },[listTournaments.load]);
    //Cada que se carga la información de algun torneo
    useEffect(()=>{
        if(onMounted.current)
            closeSwal();
        else
            onMounted.current = true;
    },[tableGeneral.load]);
    //#endregion

    useEffect(()=>{
        const onResize = ()=>setWidthScreen( window.innerWidth )
        
        window.addEventListener('resize',onResize);

        return () => {
            window.removeEventListener('resize',onResize);
        }

    },[]);

    useEffect(()=>{
        let temp = [];
        for(let i=1;i<=tableGeneral.list.journals;i++)    
            temp.push(i);
        setTotalJournals(temp);
    },[tableGeneral.list.journals]);

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
                                    <div className="col-md-6 col-12 mt-5" style={{position:"relative"}}>
                                        <span style={{position:"absolute",top:-21,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Selecciona un torneo</span>
                                        <div className="d-flex justify-content-between">
                                            <select className="form-control mb-4 text-uppercase" onChange={onChangeTournament} disabled={listTournaments.load} value={idTournament}>
                                                
                                                {
                                                    listTournaments.load ?

                                                    <option value="0">Esperando...</option>:

                                                    listTournaments.list.map(item=>(
                                                        <option value={item.id} key={item.id} >{item.name}</option>
                                                    ))
                                                }
                                                
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {

                                    tableGeneral.load ?
                                    
                                    // <div style={{marginTop:45}}> 
                                    //     <Load2/>
                                    // </div> :
                                    <></> :

                                    widthScreen > 760

                                    ?
                                        <GeneralTableView1 totalJournals={totalJournals} tableGeneral={tableGeneral} />

                                    :

                                        <GeneralTableView2 totalJournals={totalJournals} tableGeneral={tableGeneral}/>

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

export default GeneralTableScreen;

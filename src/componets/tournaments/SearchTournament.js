import { useContext,useRef,useState } from 'react';
import {ContextTournaments} from '../../context/ContextTournaments';
import {PerfilClubComponent} from '../perfil/PerfilClubComponent';

export const SearchTournament = ()=>{

    const { setScreen,setSearchTournaments,tournamentsContext,setTournamentsContext,tournamentsSelect } = useContext(ContextTournaments);
    const indexSelect = useRef(0);

    const newTournament = ()=>{
        setScreen(2);
        setSearchTournaments(false);
    }

    const onChangeSelectId = (e)=>{
        setTournamentsContext({
            ...tournamentsContext,
            id:e.target.value
        });
        indexSelect.current = e.target.value;
    }


    const onChangeSelectStatus = (e)=>{
        setTournamentsContext({
            ...tournamentsContext,
            id:0,
            status:e.target.value
        });
        indexSelect.current = 0;
    }

    return(
        <div className="main-content-inner" style={{marginBottom:-50}}>
            <div className="row">
                <div className="col-lg-12 mt-3">
                    <div className="card">
                        <div className ="card-body">

                            <div className="row">
                                <div className="col-md-10">
                                    <PerfilClubComponent 
                                        clubs={tournamentsContext.tournaments} 
                                        onChangeClub={tournamentsContext.onChangeClub} 
                                        select={tournamentsContext.idClub}
                                    />
                                </div>
                                <div className="col-md-2 mt-md-0 mt-2 d-flex justify-content-end">
                                    <button type="button" className="btn btn-outline-primary" onClick={ newTournament } style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}}><i className="fa fa-2x fa-plus" aria-hidden="true"></i> Nuevo</button>
                                </div>
                            </div>
                        
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <div className="row card-counter primary">
                                        <div className="col-4">
                                            <i className="fa fa-trophy fa-3x"></i>
                                        </div>
                                        <div className="col-8">
                                            <span className="count-name">Ligas: </span>
                                            <span className="count-numbers">{tournamentsContext.total}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-5 mt-4">
                                    <div style={{position:"relative"}}>
                                        <span style={{position:"absolute",top:-12,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Selecciona un torneo</span>
                                        <select className="form-control" onChange={onChangeSelectId} value={indexSelect.current}>
                                            {
                                                tournamentsSelect.map(tournamet=>(
                                                    <option key={tournamet.id} value={tournamet.id}>{tournamet.name}</option>
                                                ))
                                            }
                                           
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 col-md-3 mt-4">
                                    <div style={{position:"relative"}}>
                                        <span style={{position:"absolute",top:-12,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Estatus</span>
                                        <select className="form-control" onChange={onChangeSelectStatus} value={setTournamentsContext.satus}>
                                            <option value="1">Activo</option>
                                            <option value="2">Archivado</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
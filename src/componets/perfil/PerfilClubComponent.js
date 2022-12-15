import {useEffect,memo} from 'react';
import {Load2} from '../utils/load2/Load2';

export const PerfilClubComponentCarpet = ({clubs,idClub})=>{

    useEffect(()=>{
      
    },[idClub])

    return(
        <div className="col-md-12 mt-3">
         {
            clubs.load ?

            <Load2 /> :

            clubs.list.map(club=> {
              
                if(club.id === parseInt(idClub) && club.id !== 0){
                    return (
                        <div key={club.id} className="row">
                            <div className="col-md-4 col-xs-12 mt-1 text-center">
                                <h5>{club.name}</h5>
                            </div>
                            <div className="col-md-4 col-xs-12 mt-1 text-center">
                                <img 
                                    style={{width:200,marginBottom:10,boxShadow: "-3px 3px 10px -2px rgba(0,0,0,0.52)"}} 
                                    alt="logo" 
                                    src={club.img} 
                                />
                            </div>
                            <div className="col-md-4 col-xs-12 mt-1 text-center">
                                <h5>{club.adress}</h5>
                            </div>
                        </div>
                    )}
                return <span key={club.id}></span>
            })
        }
        </div>
    )
}

export const PerfilClubComponent = memo(({clubs,onChangeClub,select = false})=>{

    return(
        <div className="row">

            <div className="col-12" style={{position:"relative"}}>
                <span style={{position:"absolute",top:-12,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Selecciona un club</span>
                <div className="d-flex justify-content-between">
                       
                    {
                        select !== false ?
                        <select 
                            className="form-control text-uppercase" 
                            onChange={onChangeClub} 
                            disabled={clubs.load}
                            value={select}
                        >
                            {
                                clubs.load ?
                                <option value="0">Cargando...</option>:
                                clubs.list.map(club=>(
                                    <option value={club.id} key={club.id} >{club.name}</option>
                                ))
                            }
                        </select>

                        :

                        <select 
                            className="form-control text-uppercase" 
                            onChange={onChangeClub} 
                            disabled={clubs.load}
                        >
                            {
                                clubs.load ?
                                <option value="0">Cargando...</option>:
                                clubs.list.map(club=>(
                                    <option value={club.id} key={club.id} >{club.name}</option>
                                ))
                            }
                        </select>

                    }
                   

                </div>
            </div>
        
        </div>
    )
})
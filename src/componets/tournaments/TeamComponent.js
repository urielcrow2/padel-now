import { useContext, useState, useEffect} from 'react';
import {infoSwal} from '../utils/swalCustome';
import { ContextTournaments } from '../../context/ContextTournaments';
import { TournamentUserCarpet } from './TournamentUserCarpet';
import {ButtonFloat} from '../utils/buttonFloat/ButtonFloatComponent';

export const TeamComponent = ()=>{

    const { setScreen,formData,setFormData} = useContext(ContextTournaments);

    const [usersSearch,setUsersSearch] = useState([]);//Espejo de users para las busquedas
    const [inputSearch,setInputSearch] = useState("");//input de bsuqueda

    const [totalSelected,setTotalSelected] = useState(0);

    useEffect(()=>{
        let count = 0;
        formData.usersTeams.forEach( user => {
            if( user.team === formData.activeTeam){
                count++;
            }
        });
        setTotalSelected(count);
    },[formData.usersTeams,formData.activeTeam])
    
    const searchUser = (e)=>{
        setInputSearch(e.target.value);
        const like = new RegExp(`^.*${e.target.value}.*$`,"i");
        setUsersSearch([
            ...formData.usersTeams.filter( user => user.name.match(like) )
        ]);
    }

    const changeSelectSingle = (id)=>{

        let flag = false;

        const temp = formData.usersTeams.map( user => {
         
            if(user.id === id){
                const newValue = !user.select;

                if(newValue && totalSelected < parseInt(formData.generals.players_by_court) ){
                    user.team = formData.activeTeam;
                    user.select = newValue;
                    setTotalSelected(totalSelected+1);
                    formData.totalUsersByTeam[formData.activeTeam - 1] += 1;
                }
                else if( !newValue && totalSelected >= 0){
                    user.team = 0;
                    user.select = newValue;
                    setTotalSelected(totalSelected-1);
                    formData.totalUsersByTeam[formData.activeTeam - 1] -= 1;
                }
                else
                    flag = true;

                return user;
            }
            return user;
        });
        
        if( flag )
            return infoSwal({title: `${formData.generals.players_by_court} jugadores por cancha`});

        setFormData({
            ...formData,
            usersTeams:temp
        });


    }

    return(
        <>
            <button type="button" className="btn btn-outline-dark me-2 mb-md-0 mb-2 d-flex align-items-center" onClick={()=> setScreen(5) }><i className="fa fa-2x fa-arrow-left me-2" aria-hidden="true"></i> Regresar</button>
            <h4 className="text-center mb-1"> Selecciona los jugadores del grupo <span className="badge bg-danger" style={{fontSize:30,marginRight:10,marginLeft:5}}>{formData.activeTeam} </span> </h4>

            <div className="row mt-3">
                <div className="col-md-4">
                    <div className="row card-counter primary">
                        <div className="col-4">
                            <i className="fa fa-users fa-3x"></i>
                        </div>
                        <div className="col-8">
                            <span className="count-name">Jugadores: </span>
                            <span className="count-numbers">{ inputSearch ? usersSearch.length : formData.usersTeams.length}</span>
                        </div>
                    </div>
                </div>
                <div className="col-8 mt-5">
                    <input type="text" placeholder="Buscar jugador..."  className="form-control" value={inputSearch} onChange={searchUser}/>
                </div>
            </div>

            <div className="row mt-5">

                <h4 className="text-center mb-5"> {totalSelected} seleccionados de {formData.generals.players_by_court}</h4>

                {

                        inputSearch 
                    ?
                        usersSearch.map( user => {
                            if(user.team === 0 || user.team ===formData.activeTeam)
                                return <TournamentUserCarpet key={user.id} {...user} changeSelectSingle={changeSelectSingle}/>
                            else
                                return <></>
                        })
                    :
                        formData.usersTeams.map( user => {
                            if(user.team === 0 || user.team ===formData.activeTeam)
                                return <TournamentUserCarpet key={user.id} {...user} changeSelectSingle={changeSelectSingle}/>
                            else
                                return <></>

                        })
                }

                <ButtonFloat hight={200}/>

            </div>
                   
        </>
    )

}
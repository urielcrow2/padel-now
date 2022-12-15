import { useContext, useState, useRef } from 'react';
import {mixinSwal,infoSwal} from '../utils/swalCustome';
import { ContextTournaments } from '../../context/ContextTournaments';
import { TournamentUserCarpet } from './TournamentUserCarpet';
import {GetUserHook} from './GetUserHook';
import {Load2} from '../utils/load2/Load2';
import {ButtonFloat} from '../utils/buttonFloat/ButtonFloatComponent';

export const SelectPlayers = ()=>{

    const { setScreen,formData,setFormData} = useContext(ContextTournaments);
    const {users,setUsers} = GetUserHook(formData.users);//si es la primera vez obtenemos los users de la api sino de los datos en memoria
    const [usersSearch,setUsersSearch] = useState([]);//Espejo de users para las busquedas
    const [inputSearch,setInputSearch] = useState("");//input de bsuqueda
    const [selectMaster,setSelectMaster] = useState(false);//El select master

    const totalSelected = useRef(formData.totalSelected);

    const searchUser = (e)=>{
        setInputSearch(e.target.value);
        const like = new RegExp(`^.*${e.target.value}.*$`,"i");
        setUsersSearch([
            ...users.data.filter( user => user.name.match(like) )
        ]);
    }

    const changeSelectMaster = ()=>{

        const newValueCheckMaster = !selectMaster;

        setSelectMaster(newValueCheckMaster);

        const temp = users.data.map( user => {
            user.select = newValueCheckMaster;
            totalSelected.current = newValueCheckMaster ? users.data.length : 0;
            return user;
        });

        setUsers({
            ...users,
            data:temp
        });
    }

    const changeSelectSingle = (id)=>{
    
        const temp = users.data.map( user => {
            if(user.id === id){
                user.select = !user.select;
                user.select ? totalSelected.current++ : totalSelected.current--;
            }
            return user;
        });

        setUsers({
            ...users,
            data:temp
        });

    }

    const saveListUser = ()=>{

        if( totalSelected.current < 1)
            return infoSwal({title: `Debes seleccionar ${formData.generals.players} jugadores`});
        if( totalSelected.current > formData.generals.players || totalSelected.current < formData.generals.players)
            return infoSwal({title: `Debes seleccionar ${formData.generals.players} jugadores`});

        // console.log(formData.generals.players);
        // console.log(users.data.length)

        //return;
      

        const temp = []
        let index = 0;

        //Decimos cuantos jugadores hay seleccionados en cada cancha jemplo [0,0,0,0]
        const totalUsersByTeam = [];
        for(let i = 0;i < formData.generals.courts;i++)
            totalUsersByTeam.push(0);

        
        users.data.forEach( user => {
            if(user.select){
                const exist = formData.usersTeams.find( userExist => userExist.id === user.id );
                if(exist){
                    temp.push({...exist});
                    //para los usuarios que ya existian los volvemos a contar
                    if(exist.team > 0)
                        totalUsersByTeam[ exist.team - 1] += 1;
                }
                else{
                    temp.push({...user});
                    temp[index].select = false;
                    temp[index].team = 0;
                }
                index++;
            }
        });


        setFormData({
            ...formData,
            users: users.data,
            usersTeams:temp,
            totalUsersByTeam,
            totalSelected: totalSelected.current
        });

        mixinSwal({ icon: 'success',title: `Avance guardado`});
        setScreen(5);
    }

    return(
        <>
            <button type="button" className="btn btn-outline-dark me-2 mb-md-0 mb-2 d-flex align-items-center" onClick={()=> setScreen(2) }><i className="fa fa-2x fa-arrow-left me-2" aria-hidden="true"></i> Paso 1</button>
            <h4 className="text-center mb-1"> Selecciona a los jugadores paso 2 de 4 </h4>
           
            <div className="row mt-3">
                <div className="col-md-4">
                    <div className="row card-counter primary">
                        <div className="col-4">
                            <i className="fa fa-users fa-3x"></i>
                        </div>
                        <div className="col-8">
                            <span className="count-name">Jugadores: </span>
                            <span className="count-numbers">{ inputSearch ? usersSearch.length : users.data.length}</span>
                        </div>
                    </div>
                </div>
                <div className="col-8 mt-5">
                    <input type="text" placeholder="Buscar jugador..."  className="form-control" value={inputSearch} onChange={searchUser}/>
                </div>
            </div>

            <div className="row mt-5">

                <div className="col-12 mb-5 d-flex justify-content-end">
                    <b>Total Seleccionados: </b>
                    <span className="badge bg-danger" style={{fontSize:30,marginRight:10,marginLeft:5}}>{ totalSelected.current }</span>

                    <b>Seleccionar todos: </b>
                    <i className="fa fa-3x fa-square-o ms-4" aria-hidden="true" onClick={changeSelectMaster} style={{cursor:"pointer"}}></i>
                </div>

                {

                    users.load ?

                    <Load2 /> :

                        inputSearch 
                    ?
                        usersSearch.map( user => ( 
                            <TournamentUserCarpet key={user.id} {...user} changeSelectSingle={changeSelectSingle} />
                        )) 
                    :
                        users.data.map( user => ( 
                            <TournamentUserCarpet key={user.id} {...user} changeSelectSingle={changeSelectSingle} />
                        ))
                }

                <ButtonFloat hight={200}/>

                <div className="d-flex justify-content-center mt-3">
                    <button type="submit" className="btn btn-outline-dark me-2 mb-md-0 mb-2 d-flex align-items-center" onClick={saveListUser}> Ir a paso 3 <i className="fa fa-2x fa-arrow-right ms-3" aria-hidden="true"></i></button>
                </div>

            </div>
                   
        </>
    )

}
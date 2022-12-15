import {useRef} from 'react';
import {Modal} from '../utils/modal/Modal';
import {Switch} from '../utils/switch/Switch';
import {waitSwal,infoSwal,quetionSwal2} from '../utils/swalCustome';
import { fetchCustome2 } from "../../helpers/fetch";

export const PerfilClubsGestionComponent = ({modalGestionClubs,setModalGestionClubs,clubs,setClubs})=>{
    
    const listChange = useRef({});
    
    const callback = ()=>{

        const array = Object.keys(listChange.current)
        if(array.length > 0){
            let tempTrue = [];
            let tempFalse = [];
            array.forEach(element =>{
                if(listChange.current[element])
                    tempTrue.push(element);
                else
                    tempFalse.push(element);
            });
            SaveChanges(tempTrue,tempFalse);
        }
       
    }

    const changeStatus = (id,status)=>{
        let title,text;

        if(status){
            title="Deseas eliminar el club de tu perfil";
            text="Al eliminarlo ya no podrás ver información de los torneos ni nada referente al club";
        }
        else{
            title="Deseas agregar el club a tu perfil";
            text="Al agregarlo podras inscribirte a los torneos que realice el club y tendras los detalles de los torneos en los que participes";
        }

        quetionSwal2(title,text,(resp)=>{
            if(resp.isConfirmed){
                listChange.current[id] = !status;
       
                setClubs({
                    ...clubs,
                    list2:clubs.list2.map(club=>{
                        if(club.id === id){
                            club.user_club = !status
                        }
                        return club;
                    })
                });
            }
        });
    }

    const SaveChanges = async(toTrue,toFalse)=>{
    
        const body = {
            listToTrue:toTrue,
            listToFalse:toFalse
        }

        waitSwal({html:'Espere...'});
        try{
            await fetchCustome2({ 
                endpoint : '/clubs/clubs_users',
                method :'PUT',
                body,
                json:true
            });
            window.location.reload(false);
        }
        catch(e){
            infoSwal({
                icon: 'error',
                title: 'Ocurrio un error',
                text: `Error de comunucación con el servidor, intentelo más tarde` ,
            });
        } 
    }

    return(
        <Modal modal={modalGestionClubs} setModal={setModalGestionClubs} callback={callback}>
            <div className="modal-crow-header">
                <h4 className="text-center">Clubs disponibles</h4>
            </div>

            {
                clubs.list2.map(club=>{
                    return(
                        <div key={club.id}>
                            <div>
                                {club.name}
                            </div>
                            <div className="d-flex justify-content-between">
                                <img src={club.img} width="120"/>
                                <Switch 
                                    isOn={club.user_club} 
                                    click={()=>changeStatus(club.id,club.user_club)}
                                />
                            </div>
                            <div>
                                <p style={{fontSize:10}}>{club.adress}</p>
                            </div>

                            <hr />
                            
                        </div>
                    )
                })
            }
        </Modal>
    )
}
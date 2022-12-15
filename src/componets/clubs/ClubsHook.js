
import {useState,useRef,useEffect,useCallback} from 'react';
import {waitSwal,mixinSwal,infoSwal,quetionSwal2} from '../utils/swalCustome';
import {switchValidate} from '../admins/adminValidate';
import {addChar,maskPhone} from '../../helpers/miselanius';
import {adminValidate} from '../admins/adminValidate';
import { fetchCustome2 } from "../../helpers/fetch";

export const ClubsHook = ()=>{

    const [clubs,setClubs] = useState({
        load : true,
        data : []
    });

    const previusValue = useRef(null);

    const isMounted = useRef(true);

    const changeGeneral = async(name,value,id,id2=0)=>{

        //se manadan a actualizar al backend únicamente los campos boolean (como los check)
        if(await updateInputsBooleans(name,value,id))
            return;

        const temp = [...clubs.data];

        temp.forEach(club=>{
            if(club.id === id){
                if(id2 === 0)
                    club[name] = applyMask(name,value);
                else
                    club.root[name] = applyMask(name,value);
            }
        });

        setClubs({
            ...clubs,
            data:temp
        });
    }

    const focus = (e)=>{//Guardamos el valor previo para saber si hubo cambios y mandar al backend o no
        previusValue.current = e.target.value.trim()
    }

    //id2 = 0 ------>se trata de un elemento de primer nivel
    //id2 > 0 ------>se trata de un elemento de segundo nivel con id
    //id2 === "" ---->elemento de segundo nivel pero sin id asignado
    const blur = async(e,popertyReadOnly,id,id2=0)=>{//actualizamos los campos de texto
        
        if(id2 === "")//No hacemos la validación campo a campo, esperamos que guarde el formulario con el botón
            return;

        //Sólo si se hace cambio en el campo entramos
        if(previusValue.current !== e.target.value){
            if(switchValidate(e.target.name, e.target.value))//validamos que el formato del campo cumpla con la validación
                changeGeneral(e.target.name, previusValue.current,id,id2);//de lo contrario regresamos el valor anterior
            else{
                const isIdClubOrAdmin = id2 === 0 ? id : id2;//dependiendo los campos puede ser actualizar el club o el usuario
                if(await updateInputs(e.target.name,e.target.value,isIdClubOrAdmin))//esperamos la respuesta del backen
                    changeGeneral(e.target.name, previusValue.current,id,id2);//Regresamos el valor anterior porque hubo un error con el backend
            }
        }

        changeGeneral(popertyReadOnly,true,id,id2);//Cerramos la edición del campo
            
    }

    const updateInputFetch = async({name,id,value,endpoint,label})=>{
       
        waitSwal({html:`Actualizando ${label}`});

        const body = {
            id,
            [name] : value
        }

        try{
            const resp = await fetchCustome2({ 
                endpoint,
                method :'PATCH',
                body,
                json:true
            });

            console.log(resp)

           if(resp.id){
                mixinSwal({ icon: 'success',title: `${label} actualizado`});
                return false;
           }
           else{
                infoSwal({
                    icon: 'error',
                    title: 'Ocurrio un error',
                    text: `Error de comunicación con el servidor, intentelo más tarde` ,
                });
                return true;
           }
        }
        catch(e){
            infoSwal({
                icon: 'error',
                title: 'Ocurrio un error',
                text: `Error de comunicación con el servidor, intentelo más tarde` ,
            });
            return true;
        }
    }

    //Primero se hace el camio en el campo y despues se manda al backen
    const updateInputs = async(name,value,id)=>{
        switch (name) {
            case 'club':
                return await updateInputFetch({endpoint : '/clubs',name:'name',value,id,label:'nombre del club'});
            case 'adress':
                return await updateInputFetch({endpoint : '/clubs',name:'adress',value,id,label:'dirección'});
            case 'name':
                return await updateInputFetch({endpoint : '/users',name:'name',value,id,label:'nombre del administrador'});
            case 'email':
                return await updateInputFetch({endpoint : '/users',name:'email',value,id,label:'e-mail'});
            case 'number':
                return await updateInputFetch({endpoint : '/users',name:'number',value:value.replace(/[-]/g,''),id,label:'teléfono'});
            default:
                return false;
        }    
    }

    //Primero se manda al backend y despues se actualiza el campo
    //#region Verificamos que sólo se mande a actualizar los campos booleans
    const updateInputsBooleans = async(name,val,id)=>{
        switch (name) {
            case 'status':
                return await updateInputFetch({endpoint : '/clubs',name:'status',value: val ? 1 : 0,id,label:'estatus'});
            default:
                return false;
        }    
    }
    //#endregion

    const deleteClub = (name,id)=>{
        quetionSwal2(`¿Deseas eliminar al club: \n${name}?`,'Al eliminar al club se desencadenará un eliminación masiva de torneos, jugadores y todo lo relacionado al club',async(resp)=>{
            if(resp.isConfirmed){
                
                waitSwal({html:`Eliminando club`});
        
                try{
                    const resp = await fetchCustome2({ 
                        endpoint:`/clubs/${id}`,
                        method :'DELETE',
                    });
        
                   if(resp.id){

                        setClubs({
                            ...clubs,
                            data:clubs.data.filter( club => club.id !== id)
                        });

                       mixinSwal({ icon: 'success',title: `${name} eliminado`});

                   }
                   else{
                        infoSwal({
                            icon: 'error',
                            title: 'Ocurrio un error',
                            text: `Error de comunucación con el servidor, intentelo más tarde` ,
                        });
                   }
                }
                catch(e){
                    infoSwal({
                        icon: 'error',
                        title: 'Ocurrio un error',
                        text: `Error de comunucación con el servidor, intentelo más tarde` ,
                    });
                }
            } 
        });
    }

    //#region Aplicamos mascaras a los campos que lo necesiten
    const applyMask = (name,value)=>{
        switch(name){
            case 'number':
                return maskPhone(value);
            default:
                return value;
        }
    }
    //#endregion

    const saveAdminRootFirstTime = async(id)=>{

        //Como sólo paso el id por parametro, tengo que buscar en el arreglo la data del formulario.
        //Ya que todo lo estoy manejando en el hook 
        const form = clubs.data.find( club => club.id === id)
        if(adminValidate(form.root))
            return;
        
        //busco en todo el arreglo que el email que quiero registar no se repita
        //aparece una vez es ok, se trata del mismo registro que estoy queriendo guardar, recuerda que el hook lo maneja
        //aparece 2 entonces ya existe
        const correoExistente = clubs.data.filter( club => club.root.email === form.root.email)
        if( correoExistente.length > 1 ){
            infoSwal({title: 'E-mail del administrador ya existe'});
            return true;
        }

        const body = {
            id_club : id,
            name : form.root.name,
            email : form.root.email,
            number : form.root.number.replace(/[-]/g,'')
        }

        waitSwal({html:'Agregando admistrador'});

        try{

            const resp = await fetchCustome2({ 
                endpoint : '/users/admin_club',
                method :'POST',
                body,
                json:true
            });

            console.log(resp);

           if(resp.id){
            mixinSwal({ icon: 'success',title: `El administrador se actualizó correctamente`});

                const temp = [...clubs.data];

                temp.forEach(club=>{
                    if(club.id === id){
                        club.root = {
                            ...club.root,
                            id:resp.id,
                            disabledName:  true,
                            disabledEmail: true,
                            disabledNumber: true      
                            // name:resp.name,
                            // email:resp.email,
                            // number:addChar(resp.number,'-',2),
                            // img:imgUserDefault,
                        }
                    }
                });

                setClubs({
                    ...clubs,
                    data:temp
                });
               
           }
           else{
               if(resp.errors.email){
                    return infoSwal({title: 'E-mail del administrador ya existe'});
               }
                infoSwal({
                    icon: 'error',
                    title: 'Ocurrio un error',
                    text: `Error de comunucación con el servidor, intentelo más tarde` ,
                });
           }

        }
        catch(e){
            infoSwal({
                icon: 'error',
                title: 'Ocurrio un error',
                text: `Error de comunucación con el servidor, intentelo más tarde` ,
            });
        }
    }

    const getClubs = useCallback(async()=>{
        
        let data = await fetchCustome2( { endpoint : `/clubs` } );

        if(!isMounted.current)
        return;

        data = data.map(club=>({
            ...club,
            disabledClub:true,
            disabledAdress:true,
            btnMoreInfo:true,
            root : {
                ...club.root,
                number:addChar(club.root.number,'-',2),
                disabledName: club.root.name ? true : false,
                disabledEmail: club.root.name ? true : false,
                disabledNumber: club.root.name ? true : false
            }
        }));
        
        setClubs({
            load:false,
            data
        });

    },[]);

    useEffect(()=>{
        getClubs();
    },[getClubs]);

    useEffect(()=>{
        return () => {
            isMounted.current = false;
        }
    },[]);


    return {
        clubs,
        setClubs,
        changeGeneral,
        focus,
        blur,
        deleteClub,
        saveAdminRootFirstTime
    }

}
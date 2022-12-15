import {useState,useRef,useEffect,useCallback} from 'react';
import {waitSwal,mixinSwal,infoSwal,quetionSwal} from '../utils/swalCustome';
import {addChar,maskPhone} from '../../helpers/miselanius';
import {switchValidate} from './adminValidate';
import { fetchCustome2 } from "../../helpers/fetch";


export const AdminHook = ()=>{

    const [users,setUsers] = useState({
        load : true,
        data : []
    });

    const previusValue = useRef(null);

    const isMounted = useRef(true);

   
    const changeGeneral = (name,value,id)=>{

        //se manadan a actualizar al backend únicamente los campos boolean (como los check)
        // if(updateInputsBooleans(name,value,id ))
        //     return;

        const temp = [...users.data];
        temp.forEach(user=>{
            if(user.id === id)
                user[name] = applyMask(name,value);
        });

        setUsers({
            ...users,
            data:temp
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

    const focus = (e)=>{//Guardamos el valor previo para saber si hubo cambios y mandar al backend o no
        previusValue.current = e.target.value.trim(); 
    }

    const blur = async(e,popertyReadOnly,id)=>{//actualizamos los campos de texto

        if(previusValue.current !== e.target.value){
            if(switchValidate(e.target.name, e.target.value))//validamos que el formato del campo cumpla con la validación
                changeGeneral(e.target.name,previusValue.current,id)//Regresamos el valor anterior
            else if(await updateField(e.target.name,e.target.value,id))//Esperamos la respuesta del backend)
                changeGeneral(e.target.name,previusValue.current,id)//Regresamos el valor anterior 
        }
        changeGeneral(popertyReadOnly,true,id)//desactivamos el campo que se actualizó
    }

    const updateField = async (name,value,id)=>{

        let label = '';
        let tempValue = value;

        switch (name) {
            case 'name':
                label = "el nombre"
            break;
            case 'number':
                label = "el teléfono"
                tempValue = value.replace(/[-]/g,'');
            break;
            case 'number':
                label = "el e-mail"
            break;
        
            default:
            break;
        }

        waitSwal({html:`Actualizando ${label}`});

        const body = {
            id,
            [name] : tempValue
        }

        try{
            const resp = await fetchCustome2({ 
                endpoint : '/users',
                method : 'PATCH',
                body,
                json:true
            });

            if(resp.errors.email){
                infoSwal({
                    icon: 'error',
                    title: 'Ocurrio un error',
                    text: `Ya existe un usuario con ese e-mail`
                });
                return true;
            }
           else if(resp.id){
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

    //#region Verificamos que sólo se mande a actualizar los campos booleans, por ejemplos checks inputs
    // const updateInputsBooleans = (name,value,id)=>{
    //     switch (name) {
    //         case 'status':
    //             return updateField('status',value,id);
    //         default:
    //             return false;
    //     }    
    // }
    //#endregion

    const deleteAdmin = (name,img,id)=>{

        quetionSwal(name,img,async(resp)=>{
            if(resp.isConfirmed){
               
                waitSwal({html:`Eliminando...`});

                try{
                    await fetchCustome2({ 
                        endpoint : `/users/admin/${id}`,
                        method : 'DELETE',
                    });

                    setUsers({
                       ...users,
                        data: users.data.filter( user => user.id !== id)
                    });

                    mixinSwal({ icon: 'success',title: `Usuario eliminado`});
                }
                catch(e){
                    infoSwal({
                        icon: 'error',
                        title: 'Ocurrio un error',
                        text: `Error de comunicación con el servidor, intentelo más tarde` ,
                    });
                }
            } 
        });
    }

    const getUsers = useCallback(async()=>{
        
        let resp = await fetchCustome2( { endpoint : `/users/admins` } );

        if(!isMounted.current)
        return;

        resp = resp.map(user => {
            return{
                ...user,
                number:addChar(user.number,'-',2),
                disabledName: true,//Añadimos nuestras propiedades para controlar los inputs para actualizar
                disabledEmail: true,//Añadimos nuestras propiedades para controlar los inputs para actualizar
                disabledNumber: true,//Añadimos nuestras propiedades para controlar los inputs para actualizar
            }
        });

        setUsers({
            load:false,
            data:resp
        });

    },[]);

    useEffect(()=>{
        getUsers();
    },[getUsers]);

    useEffect(()=>{
        return () => {
            isMounted.current = false;
        }
    },[]);


    return {
        users,
        setUsers,
        changeGeneral,
        focus,
        blur,
        deleteAdmin
    }

}
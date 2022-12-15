import { fetchCustome2 } from '../helpers/fetch';
import { getToken, setToken, nameToken} from '../helpers/token';
import Swal from 'sweetalert2';
import { preload } from '.';
import { types } from '../types/types';

//#region 
/* startLogin ------> Verificamos las credenciales del usuario para el logeo en caso de que sea correcto almacenamos el token en el localstorage y modificamos el estado auth en el reducer
 * endLogin   ------> Limpiamos el estado auth del reducer y eliminamos el token del local storage
 * checkLogin ------> Verificamos que el token almacenado en el local storage sea veridico y este vigente
 */
//#endregion

export const startLogin = (usuario, pass) =>{
   
    return async(dispatch)=>{

        dispatch( preload(true) );//Efecto de carga

        try{
            
            const form = {
                email:usuario,
                password:pass
            }

            const resp = await fetchCustome2({ 
                endpoint : '/auth/login',
                method :'POST',
                body:form,
                json:true,
                token: false
            });

            setToken(resp.access_token);
            /*En este punto sabemos que el token es válido, pero no sabemos de que usuario se trata,
            así que actualizamos la pagina para que en el componente de "" con el token guardado en el local storage se pida a la API mediante el 
            metodo checkLogin los datos del usuario y mostrarle la interfaz que proceda
            */
            window.location.reload(false);
        }
        catch(e){
            Swal.fire({
                icon: 'error',
                title: 'Datos incorrectos',
                text: 'Verifica tus datos',
            });
        }
        finally{
                dispatch(preload(false));//Efecto de carga
        }
    } 
}

export const endLogin = () =>{
    return async(dispatch)=>{

        dispatch( preload(true) );//Efecto de carga

        try{
            //Invalidamos el token en el backend
            await fetchCustome2({ 
                endpoint : '/auth/logout',
                method :'POST',
                body:{},
                json:true,
            });
        }
        catch(e){
        } 
        finally{
            dispatch(endLogin_());
            dispatch(preload(false));//Efecto de carga
            localStorage.removeItem(nameToken);
        }
       
    } 
}

export const checkLogin = () =>{
   
    return async(dispatch)=>{

        const existe = getToken();
        
        if(existe){
            try{
                const resp = await fetchCustome2({ 
                    endpoint : '/auth/me',
                    method :'POST',
                    body:{},
                    json:true,
                });

                dispatch(startLogin_({
                    name:resp.name,
                    access:resp.access,
                    image: resp.img
                }));
            }
            catch(e){
                 Swal.fire({
                     icon: 'info',
                     title: 'La sesión expiró',
                     text: '',
                 });
                 
                 localStorage.removeItem(nameToken);//Removemos el token en caso de que hubiera caducado o no sea valido
            }
            finally{
                 dispatch( preload(false) );//Efecto de carga
            }
        }
        dispatch(preload(false));//Efecto de carga
    } 
}

export const updateImg = (img) =>{
    return (dispatch)=>{
        dispatch(updateImg_(img));     
    }
}


const startLogin_ = ( user ) =>({
    type: types.login,
    payload: user
});

const endLogin_ = ( ) =>({
    type: types.logout
});

const updateImg_ = ( img ) =>({
    type: types.changeImg,
    payload: img
});
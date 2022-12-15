import {types} from '../types/types';

//#region 
/* preload ------> Mostramos(true) u ocultamos(false) el componente de cargando...
 */
//#endregion

export const preload = ( state ) =>{
    return (dispatch)=>{
        dispatch(changeStatePreload(state));
    }
}

const changeStatePreload = ( state ) =>({
    type: types.preload,
    payload: state
});

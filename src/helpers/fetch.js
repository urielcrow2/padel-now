import {getToken,nameToken} from './token';
const baseUrl = process.env.REACT_APP_API_URL;

export const fetchCustome2 = async( params ) =>{

    const { 
        endpoint, 
        body = '', 
        method = 'GET', 
        token = true,
        json = false
    } = params;

    const url = `${ baseUrl }${ endpoint }`;

    const options  = {
        method
    }

    if(token || json){
        const headers = new Headers();

        if(token)
            headers.append(nameToken, `bearer ${getToken()}`);
        if(json)
            headers.append("Content-Type", "application/json");

        options.headers = headers;
    }
    
    if(body !== '')
        options.body = json ? JSON.stringify(body) : body;

    const resp = await fetch(url, options);

    //401 no autenticado = no existe el token o caduco
    //403 autenticado pero sin permisos para esa petición

    if( (resp.status === 401 || resp.status === 403) //Sacamos al usuario cada que no tenga privilegios para alguna petición, caduque el token o no exista el token, no tomamos esas 2 rutas 
    && endpoint !== '/auth/me' //ya que de ellas se encarga el reducer
    && endpoint !== '/auth/login'){
        localStorage.removeItem(nameToken);
        window.location.reload(false);//al recargar estaremos volviendo a pasar por las rutas y ya no pasaremos la validación, igual pudimos 
        //a ver mostrado el componente de logeo pero para no escribir más líneas.
    }

    if (!resp.ok && resp.status !== 400){
        //cualquier otro código que no sea 400
       throw Error(resp.status.toString());
    }
    return await resp.json();
}



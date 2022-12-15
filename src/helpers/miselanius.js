
export const formatDateTimeMx = (date)=>{
    if(!date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}$/))
        return "";
    const datetmp = date.split(' ');
    const onlydate = datetmp[0].split('-');
    return onlydate[2] + "-" +onlydate[1] + "-" + onlydate[0] + " " + datetmp[1];
}

export const formatDateMx = (date)=>{
    if(!date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/))
        return "";
    const datetmp = date.split('-');
    return datetmp[2] + "-" +datetmp[1] + "-" + datetmp[0];
}


//#region recibe una cadena y añade caracteres, ejemplo: recibe 1122334455 return 11-22-33-44-55
export const addChar = (cadena, caracter, pasos) => {
    if(!cadena)return "";
    const longitudCadena = cadena.length;
    let cadenaConCaracteres = "";
    for (let i = 0; i < longitudCadena; i += pasos) {
        if (i + pasos < longitudCadena) 
            cadenaConCaracteres += cadena.substring(i, i + pasos) + caracter;
        else 
            cadenaConCaracteres += cadena.substring(i, longitudCadena);
    }
    return cadenaConCaracteres;
}
//#endregion

//#region con ayuda de la función addChar creamos una mascara para números teléfonicos 
export const maskPhone = (value)=>{
    let temp = value;

    if( !temp.match(/^[0-9-]{0,14}$/) )
        return temp.substring(0, temp.length - 1);;

    temp = temp.replace(/[-]/g,'');
    temp = addChar(temp,'-',2);
    return temp;
}
//#endregion
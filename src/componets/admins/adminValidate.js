
import {infoSwal} from '../utils/swalCustome';

export const adminValidate = (form)=>{

    let error = false;
    const temp = Object.keys(form);

    for(const name of temp){
        if(switchValidate(name,form[name])){
            error = true;
            break;
        }
    }
    return error;
}

export const switchValidate = (name,value)=>{
    switch(name){
        case 'name':
            return validateOnlyText(name,value);
        case 'email':
            return validateEmail(value);
        case 'number':
            return validatePhoneNumber(value);
        case 'club':
            return validateFreeText(name,value,true);
        case 'adress':
            return validateFreeText(name,value,false);
        default:
            return false;
    }
}

const validateOnlyText = (name,value)=>{
    if(value.trim() === "" || !value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(/^[a-zA-Z\s]+$/)){
        infoSwal({title: `${capitalize(esp[name] || name)} es obligatorio y debe tener solo letras y espacios`});
        return true;
    }
}

const validateFreeText = (name,value,required)=>{ 

    const expRegResp = (value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(/[<>"\'&]+/));

    if( required && (value.trim() === "" || expRegResp) ){
        infoSwal({title: `${capitalize( esp[name] || name )} es obligatorio y no debe tener caracteres especiales`});
        return true;
    }

    if(value.trim() !== "" && expRegResp){
        infoSwal({title: `${capitalize( esp[name] || name )} No debe tener caracteres especiales`});
        return true;
    }

}

const validateEmail = (value)=>{
    if( value.trim() === "" || !value.trim().match(/^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)){
        infoSwal({title: 'E-mail es obligatorio y debe ser valido'});
        return true;
    }
}

const validatePhoneNumber = (value)=>{
    if(value !== "" && !value.trim().match(/^[0-9-]{14}$/)){
        infoSwal({title: 'Teléfono a 10 digitos'});
        return true;
    }
}

const esp = {
    'name' : 'nombre',
    'club' : 'nombre del club',
    'adress' : 'dirección'
}

const capitalize = name => name[0].toUpperCase() + name.substring(1);

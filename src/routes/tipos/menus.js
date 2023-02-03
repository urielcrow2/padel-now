import {types} from '../../types/types';


//son los menus que añadimos en el siderbar

//Los módulos que todos los perfiles tienen
const inicio = [
    {
        to: "/inicio",
        name: "Inicio",
        icon: "fa fa-home fa-2x fa-fw"
    }, 
];

//Modulos que solo el usuario estandar tiene
const estandar = [
    {
        to: "/tabla-general",
        name: "Tabla general",
        icon: "fa fa-list-ol fa-2x fa-fw"
    },
    {
        to: "/horarios",
        name: "Horarios",
        icon: "fa fa-clock-o fa-2x fa-fw"
    }
];

//Modulos que solo el usuario administrador tiene
const administrador = [
    {
        to: "/usuarios",
        name: "Jugadores",
        icon: "fa fa-users fa-2x fa-fw"
    },
    {
        to: "/torneos",
        name: "Ligas",
        icon: "fa fa-trophy fa-2x fa-fw"
    },
    /*{
        to: "/tabla-general",
        name: "Tabla general",
        icon: "fa fa-list-ol fa-2x fa-fw"
    },
    {
        to: "/horarios",
        name: "Horarios",
        icon: "fa fa-clock-o fa-2x fa-fw"
    }*/
];

const superAdministrador = [
    {
        to: "/clubs",
        name: "Clubs",
        icon: "fa fa-shield fa-2x fa-fw"
    },
    {
        to: "/administradores",
        name: "Administradores",
        icon: "fa fa-user-secret fa-2x fa-fw"
    },
];

export const menus = (access)=>{
    switch (access) {
        case types.superadmin:
            return [...inicio,...superAdministrador,...administrador];
        case types.admin:
            return [...inicio,...administrador];
        case types.estandar:
            return [...inicio,...estandar];
        default:
            return [...inicio,...estandar];
    }
}
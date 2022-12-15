import { createContext } from 'react';

export const initValue =  {
    titlePage : '', //Asignamos el título de cada módulo
    login : false, //Indicamos si la persona está logeada
    stateLoad : true, //Mostramos el efecto visual de carga de página (Load),
}

export const customeContext = createContext({});
import {createContext,useState,useRef} from 'react';

export const ContextTournamentsVs = createContext();

export const TournamentsProviderVs = ({children})=>{
   
    const [vs,setVs] =  useState([]);
    const [userP,setUserP] =  useState([]);
    const groupVisibility = useRef([]);//sirve para ocultar/mostrar los jugadores de cada cancha

    return (
        <ContextTournamentsVs.Provider value={{
            vs,
            setVs,
            userP,
            setUserP,
            groupVisibility
        }}>
            {children}
        </ContextTournamentsVs.Provider>
    );
}


import {createContext,useState} from 'react';

export const ContextTournamentsVs = createContext();

export const TournamentsProviderVs = ({children})=>{
   
    const [vs,setVs] =  useState([]);
    const [userP,setUserP] =  useState([]);

    return (
        <ContextTournamentsVs.Provider value={{
            vs,
            setVs,
            userP,
            setUserP
        }}>
            {children}
        </ContextTournamentsVs.Provider>
    );
}


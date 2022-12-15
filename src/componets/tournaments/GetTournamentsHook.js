import {useState,useCallback,useEffect,useRef} from 'react';
import { fetchCustome2 } from "../../helpers/fetch";

export const GetTournamentsHook = (tournamentsContext)=>{

    const isMounted = useRef(true);

    const [tournaments, setTournaments] = useState({
        load:true,
        data:[],
        select:[],
        list:[]
    });

    const [idClub,setIdClub] = useState(0);

    const onChangeClub= (e)=>{
        // waitSwal({html:'Cargando usuarios del club'});
        setIdClub(e.target.value);
    }
  
    const getTournaments = useCallback(async()=>{

        setTournaments({
            load:true,
            data:[],
            select:[],
            list:[]
        });
       
        let resp = await fetchCustome2( { endpoint : `/tournaments?status=${tournamentsContext.status}&id=${tournamentsContext.id}&club=${idClub}` } );

        if(!isMounted.current)
            return;

        if(idClub === 0) //Cargamos el id del club la primera vez, despues lo controlamos con los valors del select
            setIdClub(resp.id_club);

        setTournaments({
            load:false,
            select:resp.list,
            data:resp.items,
            list:resp.clubs
        });

    },[tournamentsContext.status,tournamentsContext.id,idClub]);


    useEffect(()=>{
        getTournaments();
    },[getTournaments]);

    useEffect(()=>{
        return () => {
            isMounted.current = false;
        }
    },[]);

    return{
        tournaments,
        getTournaments,
        onChangeClub,
        idClub
    }
}
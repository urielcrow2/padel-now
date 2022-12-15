import {useState,useCallback,useEffect,useRef,useContext} from 'react';
import { fetchCustome2 } from "../../helpers/fetch";
import {ContextTournaments} from '../../context/ContextTournaments';


export const GetUserHook = (existRegister)=>{

    const { tournamentsContext : {idClub} } = useContext(ContextTournaments);

    const isMounted = useRef(true);

    const [users, setUsers] = useState({
        load:true,
        data:[]
    });
  
    const getUsers = useCallback(async()=>{
        let resp = await fetchCustome2( { endpoint : `/users/${idClub}` } );

        if(!isMounted.current)
            return;

        resp = resp.users.map( (user,index) => {
            return{
                ...user,
                lastPosition: index + 1,//debe venir del backend
                select:false,
                positionInit: 1,
            }
        });

        setUsers({
            load:false,
            data:resp
        });

    },[]);

    useEffect(()=>{
        if( existRegister.length > 0 ){
            setUsers({
                load:false,
                data:existRegister
            });
        }
        else
            getUsers();

        return () => {
            isMounted.current = false;
        }
        
    },[getUsers,existRegister]);

    return{
        users,
        setUsers
    }
}
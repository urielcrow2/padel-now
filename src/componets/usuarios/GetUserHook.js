import {useState,useCallback,useEffect,useRef} from 'react';
import {waitSwal,closeSwal} from '../utils/swalCustome';
import { fetchCustome2 } from "../../helpers/fetch";
import {addChar} from '../../helpers/miselanius';

export const GetUserHook = ()=>{

    const [users, setUsers] = useState({
        load:true,
        data:[],
        list:[]//Clubs
    });

    const [usersSearch,setUsersSearch] = useState([]);//Espejo de users para las busquedas

    const [idClub,setIdClub] = useState(0);
    const idClubRef = useRef(0);

    const isMounted = useRef(true);

    const onChangeClub= (e)=>{
        waitSwal({html:'Cargando usuarios del club'});
        setIdClub(e.target.value);
    }

    const getUsers = useCallback(async()=>{
        
        let resp = await fetchCustome2( { endpoint : `/users/${idClub}` } );

        if(!isMounted.current)
            return;

        if(idClub === 0)
            idClubRef.current = resp.clubs[0].id;
        else
            idClubRef.current = idClub;

        const temp = resp.users.map(user => {
            return{
                ...user,
                number:addChar(user.number,'-',2),
                disabledName: true,//Añadimos nuestras propiedades para controlar los inputs para actualizar
                disabledMail: true,//Añadimos nuestras propiedades para controlar los inputs para actualizar
                disabledNumber: true,//Añadimos nuestras propiedades para controlar los inputs para actualizar
                disabledAccess: true,//Añadimos nuestras propiedades para controlar los inputs para actualizar
                disabledBirth: true,//Añadimos nuestras propiedades para controlar los inputs para actualizar
                disabledCategory: true,//Añadimos nuestras propiedades para controlar los inputs para actualizar
                disabledAlias: true,//Añadimos nuestras propiedades para controlar los inputs para actualizar
                btnMoreInfo : true
            }
        });

        setUsersSearch(temp);

        setUsers({
            load:false,
            data:temp,
            list:resp.clubs
        });

    },[idClub]);

    useEffect(()=>{
        getUsers();
    },[getUsers]);

    useEffect(()=>{
        closeSwal();
    },[users])

    useEffect(()=>{
        return () => {
            isMounted.current = false;
        }
    },[]);

    return{
        users,
        setUsers,
        onChangeClub,
        idClubRef,

        usersSearch,
        setUsersSearch
    }
}
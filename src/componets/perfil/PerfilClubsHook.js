import {useState,useCallback,useEffect,useRef} from 'react';
import { fetchCustome2 } from "../../helpers/fetch";
import {addChar} from '../../helpers/miselanius';


export const PerfilClubsHook = (id)=>{

    const [clubs, setClubs] = useState({
        load:true,
        list:[],
        list2:[],
        user:{}
    });


    const[idClub,setIdClub] = useState(0);

    const isMounted = useRef(true);
  
    const getListClubs = useCallback(async()=>{

        try{
            let resp = await fetchCustome2( { endpoint : `/clubs/list` } );

            if(!isMounted.current)
                return;

                console.log(resp)

            setClubs({
                load:false,
                list:[
                    {
                        id:0,
                        name:'Selecciona un club',
                        img:'',
                        number:'',
                        email:''
                    },
                    ...resp.clubs
                ],
                list2:resp.clubs2,
                user:{
                    ...resp.user,
                    number: addChar(resp.user.number,'-',2)
                }
            });
        }
        catch(e){
            setClubs({
                load:false,
                list:[],
                user:{}
            });
        }
    },[id]);

    const onChangeClub= (e)=>{
        if(parseInt(e.target.value) === 0)
            return;
        setIdClub(e.target.value);
    }

    useEffect(()=>{
        getListClubs();
    },[getListClubs]);

    useEffect(()=>{
        return () => {
            isMounted.current = false;
        }
    },[]);

    return{
        clubs,
        onChangeClub,
        idClub,
        setClubs
    }
}
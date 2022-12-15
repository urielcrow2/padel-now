import {useState,useCallback,useEffect} from 'react';
import { fetchCustome2 } from "../../helpers/fetch";


export const GetListTournamentHook = (id)=>{

    const [data, setData] = useState({
        load:true,
        list:[]
    });
  
    const getList = useCallback(async()=>{
    
        try{
            let data = await fetchCustome2( { endpoint : `/tournaments/list/${id}`} );

            console.log(data)
            
            setData({
                load:false,
                list:[
                    {
                        id:0,
                        name:'Selecciona un torneo'
                    },
                    ...data
                ]
                   
            });
        }
        catch(e){
            setData({
                load:false,
                list:[]
            });
        }
    },[id]);

    

    useEffect(()=>{

        if(id === 0)
            return;

        setData(data=>({
            ...data,
            load:true,
        }));

        getList();

    },[getList]);

    return{
        listTournaments:data
    }
}
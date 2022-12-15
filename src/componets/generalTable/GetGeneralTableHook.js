import {useState,useCallback,useEffect} from 'react';
import { fetchCustome2 } from "../../helpers/fetch";


export const GetGeneralTableHook = (id)=>{

    const [data, setData] = useState({
        load:true,
        list:[]
    });
  
    const getList = useCallback(async()=>{
        console.log('llamada Lista...')

        setData(data=>({
            ...data,
            load:true,
        }));

        try{
            let data = await fetchCustome2( { endpoint : `/tournaments/table/${id}` } );
           
            console.log(data)

            setData({
                load:false,
                list:data
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

        getList();

    },[getList]);

    return{
        tableGeneral:data
    }
}
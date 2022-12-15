import {useState,useCallback,useEffect} from 'react';
import { fetchCustome2 } from "../../helpers/fetch";
import {addChar} from '../../helpers/miselanius';


export const GetListTableUserHook = (id)=>{

    const [data, setData] = useState({
        load:true,
        journals:[],
        ranking:"-",
        nextGame:{}
    });
  
    const getList = useCallback(async()=>{


        setData(data=>({
            ...data,
            load:true,
        }));

        try{

            let data = await fetchCustome2( { endpoint : `/tournaments/count/${id}` } );

            let ranking = "-";
            if(data.table.length > 0){
                ranking = data.table[data.table.length-1].positionGeneral;
            }

            console.log(data);

            setData({
                load:false,
                journals:data.table,
                ranking,
                nextGame:data.nextGame
            });
        }
        catch(e){
            setData({
                load:false,
                journals:[],
                ranking:"-",
                nextGame:{}
            });
        }
    },[id]);

    

    useEffect(()=>{

        if(id === 0)
            return;

        getList();

    },[getList]);

    return{
        data
    }
}
import React,{useState,useContext,useEffect} from 'react';
import {ContextTournaments} from '../../context/ContextTournaments';
import {GetGeneralTableHook} from '../generalTable/GetGeneralTableHook';
import {Load2} from '../utils/load2/Load2';
import {ButtonFloat} from '../utils/buttonFloat/ButtonFloatComponent';
import {GeneralTableView1} from '../generalTable/GeneralTableView1';
import {GeneralTableView2} from '../generalTable/GeneralTableView2';


export const TournamentGeneralTable = ()=>{
    const { idTournamentDetail } = useContext(ContextTournaments);
    const { tableGeneral } = GetGeneralTableHook(idTournamentDetail);
    const [totalJournals,setTotalJournals] = useState([]);
    const [widthScreen,setWidthScreen] = useState(window.innerWidth);

    useEffect(()=>{
        const onResize = ()=>setWidthScreen( window.innerWidth )
        
        window.addEventListener('resize',onResize);

        return () => {
            window.removeEventListener('resize',onResize);
        }

    },[]);

    useEffect(()=>{
        let temp = [];
        for(let i=1;i<=tableGeneral.list.journals;i++)    
            temp.push(i);
        setTotalJournals(temp);
    },[tableGeneral.list.journals]);

    return(
        <>
        {

            tableGeneral.load ?
            
            <div style={{marginTop:45}}> 
                <Load2/>
            </div> :

            widthScreen > 760

            ?
                <GeneralTableView1 totalJournals={totalJournals} tableGeneral={tableGeneral} />

            :

                <GeneralTableView2 totalJournals={totalJournals} tableGeneral={tableGeneral}/>

        }

        <ButtonFloat hight={200}/>

        </>
    )
}
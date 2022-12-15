import {useState,useCallback,useEffect,useRef} from 'react';
import { fetchCustome2 } from "../../helpers/fetch";
import {useContext} from 'react';
import {ContextTournamentsVs} from '../../context/ContextTournamentsVs';
import {closeSwal} from '../utils/swalCustome';

export const GetUserHook = (journal,idTournament,idClub)=>{

    const { vs,setVs,setUserP,userP} = useContext(ContextTournamentsVs);

    const [data, setData] = useState({
        load:true,
        times:[],
        number_players_by_court:"...",
        journals_total:"...",
        last_journal_close:"...",
        journal_active:"...",
        initial_date:"...",
        final_date:"...",
        name:"..."
    });

    const isMounted = useRef(true);
  
    const getUsers = useCallback(async()=>{
        try{

            let data = await fetchCustome2( { endpoint : `/tournaments/${idClub}/${idTournament}/${journal}` } );

            closeSwal();

            if(!isMounted.current)
                return;

            const times = {};

            data.times.forEach(e=>{
                times[e.number] = {
                    'date': e.date ? e.date : "",
                    'time': e.time ?  e.time : ""
                }
            });

            /*Los guardo en un provider para manipularlos desde el componente time/ResumenCourt */
            setVs(data.vs)
            setUserP(data.players);
            /********************************************************************************** */
            
            setData({
                load:false,
                times:[times],
                number_players_by_court:data.number_players_by_court,
                journals_total:data.journals_total,
                last_journal_close: data.last_journal_close,
                journal_active:data.journal_active,
                initial_date:data.initial_date,
                final_date:data.final_date,
                name:data.name
            });
        }
        catch(e){
            setData({
                load:false,
                times:[{}],
                number_players_by_court:0,
                journals_total:0,
                last_journal_close:0,
                journal_active:0,
                initial_date:"",
                final_date:"",
                name:""
            });
        }


    },[journal,idTournament,idClub,setVs,setUserP]);

    const onChangePoints = (e,name)=>{
        const temp2 = [
            ...userP
        ];
        const newUsers = temp2.map(user=>{
            if( parseInt(user.id_user) === parseInt(e.target.name) && name==="penalty" ){
                user[name] = e.target.value;
                user.total = user.set1 + user.set2 + user.set3 - user.penalty;
            }
            return user;
        });
        setUserP(newUsers);
    }

    

    /*const onChangeDateMasive = (e)=>{
        const temp = {
            ...data
        };

        Object.keys(temp.times[0]).forEach(element => {
            data.times[0][element].date = e.target.value;
        });

        setData(temp);
    }*/

    const onChangeDateSingle = (e,name)=>{

        const temp = {
            ...data
        };

        Object.keys(temp.times[0]).forEach(element=>{
            if( parseInt(element) === parseInt(e.target.name) ){
                data.times[0][element][name] = e.target.value;
            }
        });

        setData(temp);

    }

    const upPositionUser = (id,position)=>{
        //-1,1,-1
        updatePosition(id,position,1);

    }

    const downPositionUser = (id,position)=>{
        //1,-1,1
        updatePosition(id,position,-1);
    }

    const updatePosition  = (id,position,upOrDown)=>{
        
        /*Temporales para actualizar los equipos VS */
        const user1 = {
            id:0,
            name:"",
            img:"",
            court:0//saber en la cancha que estaba para buscarlo en un indice menor y evitamos buscar en todo  el arreglo
        };
        const user2 = {
            id:0,
            name:"",
            img:"",
            court:0
        };

        /*Actualizamos las posiciones de cada jugador */
        const temp = [
            ...userP
        ]
        temp.forEach( (player,index) =>{
            if( player.position ===  position + (-1 * upOrDown) ){
                player.position = player.position + upOrDown;
                user1.id =  player.id_user;
                user1.name = player.name;
                user1.img = player.img;
                user1.court = Math.ceil( (index + 1) / 4 );
            }
            else if(player.id_user === id){
                player.position = player.position + (-1 * upOrDown);
                user2.id = player.id_user;
                user2.name = player.name;
                user2.img = player.img;
                user2.court = Math.ceil( (index + 1) / 4 );
            }
        });
        temp.sort( (a,b)=> a.position - b.position);
        setUserP(temp);

        /*Debemos actualizar los equipos VS */
        let temp2 = [...vs];
        if(user1.court !== user2.court){//cuando pertenecen a distintas canchas
            temp2 = replaceIdUser(temp2,user1,user2);
            temp2 = replaceIdUser(temp2,user2,user1);
        }
        else{ //cuando pertenecen a las mismas canchas
            temp2 = replaceIdUserselfCourt(temp2,user1,user2);
        }

        setVs(temp2);
    }

    const replaceIdUser = (temp,user,user2)=>{
        for(let set = 0; set < 3; set++){
            for(let tupla=0;tupla < 2; tupla++){

                if(temp[user.court - 1][set][tupla].player1 === user.id){
                    temp[user.court - 1][set][tupla].player1=user2.id;
                    temp[user.court - 1][set][tupla].name1=user2.name;
                    temp[user.court - 1][set][tupla].img1=user2.img;
                }
                else if(temp[user.court - 1][set][tupla].player2 === user.id ){
                    temp[user.court - 1][set][tupla].player2=user2.id;
                    temp[user.court - 1][set][tupla].name2=user2.name;
                    temp[user.court - 1][set][tupla].img2=user2.img;
                }

            }
        }
        return temp;
    }

    const replaceIdUserselfCourt = (temp,user,user2)=>{
        for(let set = 0; set < 3; set++){
            for(let tupla=0;tupla < 2; tupla++){

                //En la primer lectura ponemos en 0 el id para evitar sobreescribirlo en la segunda lectura
                if(temp[user.court - 1][set][tupla].player1 === user.id){
                    temp[user.court - 1][set][tupla].player1=0;
                    temp[user.court - 1][set][tupla].name1=user2.name;
                    temp[user.court - 1][set][tupla].img1=user2.img;
                }
                else if(temp[user.court - 1][set][tupla].player2 === user.id ){
                    temp[user.court - 1][set][tupla].player2=0;
                    temp[user.court - 1][set][tupla].name2=user2.name;
                    temp[user.court - 1][set][tupla].img2=user2.img;
                }

                //En la segunda lectura remplazamos el segundo id
                if(temp[user.court - 1][set][tupla].player1 === user2.id){
                    temp[user.court - 1][set][tupla].player1=user.id;
                    temp[user.court - 1][set][tupla].name1=user.name;
                    temp[user.court - 1][set][tupla].img1=user.img;
                }
                else if(temp[user.court - 1][set][tupla].player2 === user2.id ){
                    temp[user.court - 1][set][tupla].player2=user.id;
                    temp[user.court - 1][set][tupla].name2=user.name;
                    temp[user.court - 1][set][tupla].img2=user.img;
                }

                //En la tercera lectura todo lo que pusimso en 0 lo remplazamos por el primer id
                if(temp[user.court - 1][set][tupla].player1 === 0)
                    temp[user.court - 1][set][tupla].player1=user2.id;
                else if(temp[user.court - 1][set][tupla].player2 === 0)
                    temp[user.court - 1][set][tupla].player2=user2.id;
            }
        }

        return temp;
    }


    useEffect(()=>{
       
        if(idTournament === 0 || idClub === 0)
            return;

        setData(data=>({
            ...data,
            load:true,
        }));

        getUsers();

    },[getUsers]);

    useEffect(()=>{
        return () => {
            isMounted.current = false;
        }
    },[]);

    return{
        data,
        onChangeDateSingle,
        upPositionUser,
        downPositionUser,
        onChangePoints
    }
}
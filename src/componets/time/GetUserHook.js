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
        last_journal_close_real:"...",
        journal_active:"...",
        initial_date:"...",
        final_date:"...",
        name:"..."
    });

    const isMounted = useRef(true);
  
    const getUsers = useCallback(async()=>{
        try{

            let data = await fetchCustome2( { endpoint : `/tournaments/${idClub}/${idTournament}/${journal}` } );
            console.log(data)

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

            data.players =  data.players.map(player=>({        
                ...player,
                visibility:false  
            }))

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
                last_journal_close_real:data.last_journal_close_real,
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
                last_journal_close_real:0,
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

    const onChangeDateMasive = (e)=>{
        const temp = {
            ...data
        };

        Object.keys(temp.times[0]).forEach(element => {
            data.times[0][element].date = e.target.value;
        });

        setData(temp);
    }

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

    const upPositionUser = (id,position,array)=>{
        //-1,1,-1
        updatePosition(id,position,1,array);

    }

    const downPositionUser = (id,position,array)=>{
        //1,-1,1
        updatePosition(id,position,-1,array);
    }

    const updatePosition  = (id,position,upOrDown,array)=>{
        
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
        ];

        
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

        /******************En este parte mantenemos el show hide por grupo*/
        let grupo = -1;
        temp.forEach( (user,index)=>{
            if((index + 4) % 4 === 0)
                grupo++;
            user.visibility = array[grupo];
        });
        /*****************************************************************/

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

    const subeYbaja1 = (array)=>{

        const arraySuben = [];//[4,8,12];
        const arrayBajan = [];//[3,7,11];

        let elementosAcambiar = userP.length / 4 - 1;

        for(let i=0;i<elementosAcambiar;i++){
            arraySuben[i] = 4 * (i + 1)
            arrayBajan[i] = (4 * (i + 1)) - 1
        }

        let bdCopy = [...userP];

        for(let i=0;i<arraySuben.length;i++){
            const temp = bdCopy[arrayBajan[i]];
            bdCopy[arrayBajan[i]] = bdCopy[arraySuben[i]];
            bdCopy[arraySuben[i]] = temp;
        }
        // let temp = bdCopy[3];
        // bdCopy[3] = bdCopy[4]
        // bdCopy[4] = temp;
        bdCopy.forEach((user,index)=>{
            user.position = index + 1;
            user.court = Math.ceil( (index + 1) / 4 );
        })

        /******************En este parte mantenemos el show hide por grupo*/
        let grupo = -1;
        bdCopy.forEach( (user,index)=>{
            if((index + 4) % 4 === 0)
                grupo++;
            user.visibility = array[grupo];
        });
        /*****************************************************************/
        setUserP(bdCopy);

        /*Debemos actualizar los equipos VS */
        reajustarVs(bdCopy);
    }

    const subeYbaja2 = (array)=>{
    
        const arraySuben = [];//[4,5,8,9,12,13];
        const arrayBajan = [];//[2,3,6,7,10,11];

        let elementosAcambiar = (userP.length / 4 - 1) * 2;

        for(let i=0;i<elementosAcambiar;i++){
            if(i%2===0){
                arraySuben[i] = i===0 ? 4 : arraySuben[i-2] + 4;
                arrayBajan[i] = i===0 ? 2 : arrayBajan[i-2] + 4;

            }
            else{
                arraySuben[i] = i===1 ? 5 : arraySuben[i-2] + 4
                arrayBajan[i] = i===1 ? 3 : arrayBajan[i-2] + 4;

            }
        }

        let bdCopy = [...userP];

        for(let i=0;i<arraySuben.length;i++){
            const temp = bdCopy[arrayBajan[i]];
            bdCopy[arrayBajan[i]] = bdCopy[arraySuben[i]];
            bdCopy[arraySuben[i]] = temp;
        }

        bdCopy.forEach((user,index)=>{
            user.position = index + 1;
            user.court = Math.ceil( (index + 1) / 4 );
        })

        /******************En este parte mantenemos el show hide por grupo*/
        let grupo = -1;
        bdCopy.forEach( (user,index)=>{
            if((index + 4) % 4 === 0)
                grupo++;
            user.visibility = array[grupo];
        });
        /*****************************************************************/
        setUserP(bdCopy);

        
        /*Debemos actualizar los equipos VS */
        reajustarVs(bdCopy);
    }


    const reajustarVs = (bd)=>{
    
        const resultado = [];
        const sets = [];
        const tuplas = [];
        const canchas = bd.length / 4;

        let variante = 0; //en cada cancha vamos tomando en orden de 4 jugadores
        for(let cancha=0;cancha < canchas; cancha++){
            for(let set =0;set < 3; set++){
                let variante1 = 0;
                let variante2 = 0;
                for(let tupla=0;tupla<2;tupla++){
                
                    if( set === 1 && tupla === 0)
                        variante2 = 1;
                    else if( set === 1 && tupla === 1)
                        variante1 = -1;
                    else if( set === 2 && tupla === 0)
                        variante2 = 2;
                    else if( set === 2 && tupla === 1){
                        variante1 = -1;
                        variante2 = -1;
                    }

                    const desplazamiento1 = variante + tupla + tupla + variante1;
                    const desplazamiento2 = variante + tupla + tupla + 1 + variante2;

                    tuplas[tupla] = {
                        "player1":bd[desplazamiento1].id_user,
                        "name1":bd[desplazamiento1].name,
                        "img1":bd[desplazamiento1].img,

                        "player2":bd[desplazamiento2].id_user,
                        "name2":bd[desplazamiento2].name,
                        "img2":bd[desplazamiento2].img,

                        "points":0
                    }

                    variante1 = 0;
                    variante2 = 0;
                }
                sets[set] = {...tuplas};
            }
            variante += 4;//nos desplazamos a los siguientes 4 jugadores
            resultado[cancha] = [...sets];
        }

        setVs(resultado);

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
        onChangePoints,
        onChangeDateMasive,
        subeYbaja1,
        subeYbaja2
    }
}
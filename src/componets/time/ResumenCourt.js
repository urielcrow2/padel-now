import {useContext,useState} from 'react';
import {ContextTournamentsVs} from '../../context/ContextTournamentsVs';
import {ContextTournaments} from '../../context/ContextTournaments';
import {EditarHojaResultados} from './EditarHojaResultados';

const img = process.env.PUBLIC_URL +"/assets/img/default/sin-imagen-hoja.jpg";


export const ResumenCourt = ({setShowResumen,disabled,set})=>{


    const { vs,setVs,userP,setUserP} = useContext(ContextTournamentsVs);
    const { idTournamentDetail } = useContext(ContextTournaments);

    const [editImage, setEditImage] = useState({
        id:'',
        cancha:-1,
        img:''
    });

    console.log('cancha: ' + set)
    console.log('torneo: ' + idTournamentDetail)

    const updateData = (id,img)=>{
        // const temp = [
        //     ...clubs.data
        // ];

        // temp.forEach( club => {
        //     if(club.id === id)
        //         club.img = img;
        // });
        
        // setClubs({
        //     ...clubs,
        //     data:temp
        // })
    }

  
    const dataGeneral = ()=>{
        setShowResumen(true);
    }

    const onChange = (e,tupla) =>{
        /* Actualizamos el valor de cada input*/
        const temp = [
            ...vs
        ];
        temp[set][e.target.name][tupla].points = parseInt(e.target.value);
        setVs(temp);

        /* Sacamos la diferencia por set */
        const pointsDiffTupla1 = temp[set][e.target.name][0].points - temp[set][e.target.name][1].points;
        const pointsDiffTupla2 = temp[set][e.target.name][1].points - temp[set][e.target.name][0].points;

        /* Actualizamos con la diferencia de cada set, y establecemos los valores individualmente*/
        const temp2 = [
            ...userP
        ];
        const newUsers = temp2.map(user=>{
            if(user.id_user === temp[set][e.target.name][0].player1 || user.id_user === temp[set][e.target.name][0].player2){
                user[`set${parseInt(e.target.name)+1}`] = pointsDiffTupla1;
                user.total = user.set1 + user.set2 + user.set3 - user.penalty;
            }
            else if(user.id_user === temp[set][e.target.name][1].player1 || user.id_user === temp[set][e.target.name][1].player2){
                user[`set${parseInt(e.target.name)+1}`] = pointsDiffTupla2;
                user.total = user.set1 + user.set2 + user.set3 - user.penalty;
            }
            return user;
        });
        setUserP(newUsers);
    }

     const changeImg = (img)=>{
        setEditImage({
            id:idTournamentDetail,
            cancha:set,
            img,
        });
    }

    return(
        <>
            <div className="d-flex justify-content-between">
                <button type="button" style={{height:50}} className="btn btn-outline-dark me-2 mb-md-0 mb-1 mt-0 d-flex align-items-center" onClick={ dataGeneral }><i className="fa fa-2x fa-arrow-left me-2" aria-hidden="true"></i> Regresar</button>
                {/* <div className="position-relative">

                    <i 
                        className="fa fa-picture-o" 
                        aria-hidden="true" 
                        onClick={()=>changeImg(img)}
                        style={{
                            cursor:'pointer',
                            fontSize:23,
                            position:'absolute',
                            right:-18,
                            top:-9,
                            padding:7,
                            background:'#098BEC',
                            color:'#FFF',
                            borderRadius:'100%',
                            opacity:.8
                        }}>
                    </i> 
                    <img 
                        style={{width:140,boxShadow: "-3px 3px 10px -2px rgba(0,0,0,0.52)"}} 
                        alt="logo" 
                        src={img}
                    />

                </div> */}

            </div>
                {
                    vs[set].map( (item,index) =>(
                        <div className="row" key={index}> 
                            <div className="col-12 mb-3 mt-3">
                                <h5 className="text-center" style={{background:'#0D6EFD',color:'#FFF',padding:10}}>SET {index + 1}</h5>
                            </div>
                            <div className="col-md-5 col-12">
                                <div className="d-flex">
                                    <div className="d-flex justify-content-center flex-column" style={{width:'50%'}}>
                                        <div className="text-center"><img style={{width:'50px',margin:'10px',borderRadius:"50%",boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}} alt="avatar" src={vs[set][index][0].img1} /> </div>
                                        <div className="text-center">{vs[set][index][0].name1}</div>
                                    </div>
                                    <div className="d-flex justify-content-center flex-column" style={{width:'50%'}}>
                                        <div className="text-center"><img style={{width:'50px',margin:'10px',borderRadius:"50%",boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}} alt="avatar" src={vs[set][index][0].img2} /> </div>
                                        <div className="text-center">{vs[set][index][0].name2}</div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <input type="number" value={vs[set][index][0].points} name={index} onChange={(e)=>onChange(e,0)} disabled={disabled} style={{width:80,fontSize:20,textAlign:'center'}}/>
                                </div>
                            </div>
                            <div className="col-md-2 col-12 d-flex justify-content-center align-items-center mt-3">
                                <span style={{fontSize:30}}>VS</span>
                            </div>
                            <div className="col-md-5 col-12">
                                <div className="d-flex">
                                    <div className="d-flex justify-content-center flex-column" style={{width:'50%'}}>
                                        <div className="text-center"><img style={{width:'50px',margin:'10px',borderRadius:"50%",boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}} alt="avatar" src={vs[set][index][1].img1} /> </div>
                                        <div className="text-center">{vs[set][index][1].name1}</div>
                                    </div>
                                    <div className="d-flex justify-content-center flex-column" style={{width:'50%'}}>
                                        <div className="text-center"><img style={{width:'50px',margin:'10px',borderRadius:"50%",boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}} alt="avatar" src={vs[set][index][1].img2} /> </div>
                                        <div className="text-center">{vs[set][index][1].name2}</div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <input type="number" value={vs[set][index][1].points} name={index} onChange={(e)=>onChange(e,1)} disabled={disabled} style={{width:80,fontSize:20,textAlign:'center'}}/>
                                </div>
                            </div>
                        </div>
                    ))
                } 

                {
                    editImage.id
                    &&
                    <EditarHojaResultados editImage={editImage} updateData={updateData}/>
                }
        </>
    )
}



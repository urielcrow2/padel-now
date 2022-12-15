import {useContext , useEffect , useState, useRef} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import Cropper from "react-cropper";
import { updateImg } from '../../actions';
import {GetListTournamentHook} from '../time/GetListTournamentHook';
import {customeContext} from '../../context/context';
import {GetListTableUserHook} from './GetListTableUserHook';
import {Load2} from '../utils/load2/Load2';
import {waitSwal,mixinSwal,infoSwal,closeSwal} from '../utils/swalCustome';
import {fetchCustome2} from "../../helpers/fetch";
import {PerfilData} from './PerfilData'
import {PerfilClubsGestionComponent} from './PerfilClubsGestionComponent';
import {ButtonFloat} from '../utils/buttonFloat/ButtonFloatComponent';
  /*********************Controlamos la lista de clubs*********************/
import {PerfilClubComponent,PerfilClubComponentCarpet} from './PerfilClubComponent';
import {PerfilClubsHook} from './PerfilClubsHook';

import "cropperjs/dist/cropper.css";

const PerfilScreen = ()=>{

    const {image} = useSelector( store => store.auth );
    const dispatch = useDispatch();
    const { setContext } = useContext(customeContext);

    /*********************Controlamos la lista de clubs*********************/
    const {clubs,setClubs,onChangeClub,idClub} = PerfilClubsHook();


 /*********************Controlamos la lista torneos*********************/
    const {listTournaments} = GetListTournamentHook(idClub);
    


    const [idTournament,setIdTournament] = useState(0);
    const {data} = GetListTableUserHook(idTournament);


    const [imageCropper, setImageCropper] = useState(image);
    const cropperRef = useRef();
    const inputFile = useRef(null);
    const [toggleBtnSaveImg,setToggleBtnSaveImg] = useState(true);

    //Controlamos la apertura o cierre de la ventana modal
    const [modalGestionClubs,setModalGestionClubs] = useState(false);


    const [formPass,setFormPass] = useState({
        pass:"",
        pass2:""
    });

    const [input, setInput] = useState({
        type:'password',
        check:'fa-square color-disabled-check'
    });

    const isMounted = useRef(false);

    useEffect(() => {
        setContext( context => (
            {   ...context,
                titlePage : 'Mis datos'
            })
        );
    },[setContext]);

    //#region Controlamos las ventas que indican la carga de datos
    useEffect(() => {
        if(isMounted.current)
            waitSwal({html:'Cargando lista de torneos'});
    },[idClub]);
    useEffect(() => {
        if(isMounted.current)
            closeSwal();
    },[listTournaments.list]);
    useEffect(() => {
        if(isMounted.current)
            closeSwal();
        else
            isMounted.current = true;
    },[data.load]);

    

    const changeType = (val)=>{
        let [type,check] = ['password','fa-square color-disabled-check'];
        
        if(val === 'password'){
            type = 'text';
            check = 'fa-check-square color-enabled-check';
        }

        setInput({
            type,
            check
        });
    }

    const onChangeTournament = (e)=>{
        if(parseInt(e.target.value) === 0)
            return;
        //cada que cambiamos de torneo
        waitSwal({html:'Cargando torneo'});
        setIdTournament(e.target.value);
    }

    const onUpdatePass = async()=>{

        const {pass,pass2} = formPass;

        if(pass !== pass2){
            return infoSwal({
                icon: 'info',
                title: 'Contraseñas incorrectas',
                text: `La contraseña y la confirmación deben ser identicas` ,
            });
        }

        if(!pass.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?_.])[A-Za-z\d@$!%*?_.]{10,15}$/)){
            return infoSwal({
                icon: 'info',
                title: 'Contraseña debil',
                text: `La contraseña debe de tener mínimo 10 y máximo 15 caracteres; al menos 1 número,1 mínuscula, 1 máyuscula y alguno de los siguientes caracteres especiales @ $ ! % * ? . _` ,
            });
        }

         waitSwal({html:'Actualizando contraseña'});
            try{
    
                await fetchCustome2({ 
                    endpoint : '/perfil/passwd',
                    method :'PATCH',
                    body:{
                        'passwd':pass
                    },
                    json:true
                });
    
                setFormPass({
                    pass:"",
                    pass2:""
                })

                mixinSwal({ icon: 'success',title: `La contraseña se actualizó correctamente`});
    
            }
            catch(e){
                infoSwal({
                    icon: 'error',
                    title: 'Ocurrio un error',
                    text: `Error de comunucación con el servidor, intentelo más tarde` ,
                });
            }

    }

    const onChange = (e) => {
        e.preventDefault();
        let file = e.target.files[0];
        if (/\.(?=jpg|jpeg)/gi.test(file.name.toLowerCase())) {
            const reader = new FileReader();
            reader.onload = () => {
                setToggleBtnSaveImg(false);
                setImageCropper(reader.result);
                inputFile.current.value = "";
            };
            reader.readAsDataURL(file);
        }
        else{
            return infoSwal({
                icon: 'info',
                title: 'Formato de imagen inválido',
                text: `Sólo se permiten imagenes jpg o jpeg` ,
            });
        }
    };
      
    const clickInputFile = ()=>{
        inputFile.current.click()
    }
    
    const getCropData = async() => {

        if (typeof cropperRef.current !== "undefined") {
            const newImage = cropperRef.current.cropper.getCroppedCanvas({
                width: 512,//podemos establecer un tamaño fijo en la imagen final en este caso manejamos la relación 16 / 9
                height: 512,
                fillColor: '#fff'
            })
            .toDataURL("image/jpeg",0.7);//bajamos la calidad para disminuir considerablemente el peso sin afectar la calidad

            const blob = await fetch(newImage).then(temp => temp.blob());//con la imagen resultante creamos un blob
            const temp = new File([blob], "temporal.jpg", {type: blob.type});//hecho el blob creamos el archivo


            const form = new FormData();
            form.append("img",temp);
            form.append("_method",'patch');


            waitSwal({html:'Actualizando imagen'});

            try{
    
                const resp = await fetchCustome2({ 
                    endpoint : '/perfil/avatar',
                    method :'POST',
                    body:form
                });
    
               if(resp !== ""){
                   mixinSwal({ icon: 'success',title: `La imagen se actualizó correctamente`});
                   setToggleBtnSaveImg(true);
                   setImageCropper(resp);
                   dispatch(updateImg(resp));
               }
               else{
                    infoSwal({
                        icon: 'error',
                        title: 'Ocurrio un error',
                        text: `Error de comunucación con el servidor, intentelo más tarde` ,
                    });
               }
    
            }
            catch(e){
                infoSwal({
                    icon: 'error',
                    title: 'Ocurrio un error',
                    text: `Error de comunucación con el servidor, intentelo más tarde` ,
                });
            }
            
        }
    };

    return(
        <div className="main-content">


            <div className="main-content-inner">
                <div className="row">
                    <div className="col-lg-12 mt-3">
                        <div className="card">
                            <div className ="card-body">
                                <div className="d-flex justify-content-between">
                                    <div style={{width:'87%'}}>
                                        <PerfilClubComponent clubs={clubs} onChangeClub={onChangeClub}/>
                                    </div>
                                    <button type="button" className="btn btn-primary" onClick={()=>setModalGestionClubs(true)}><i className="fa fa-shield" aria-hidden="true"></i></button>
                                </div>
                                <PerfilClubComponentCarpet clubs={clubs} idClub = {idClub}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                (modalGestionClubs && !clubs.load)
                 
                &&

               <PerfilClubsGestionComponent 
                clubs = {clubs}
                setClubs = {setClubs}
                modalGestionClubs ={modalGestionClubs} 
                setModalGestionClubs = {setModalGestionClubs}
                />
            }

            
            <div className="main-content-inner">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className ="card-body">

                                <div className="row">

                                    <div className="col-12 mb-5" style={{position:"relative"}}>
                                        <span style={{position:"absolute",top:-21,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Selecciona un torneo</span>
                                        <div className="d-flex justify-content-between">
                                            
                                            <select className="form-control text-uppercase" onChange={onChangeTournament} disabled={listTournaments.load} value={idTournament}>
                                                {
                                                    
                                                    listTournaments.load ?

                                                    <option disabled value="0">
                                                        ...
                                                    </option>:

                                                    listTournaments.list.map(item=>(
                                                        <option value={item.id} key={item.id} >{item.name}</option>
                                                    ))
                                                }
                                                
                                            </select>

                                        </div>
                                    </div>

                                    <div className="col-md-6 col-xs-12 mt-3 text-center">
                                        {
                                            data.load ?

                                            // <Load2 className="mt-5"/> :
                                            <></>:

                                            <>
                                                <h4 className="text-center">Próximo juego</h4>
                                                <h5 className="text-center">{data.nextGame.date} </h5>
                                                <hr />
                                                <div className="row">
                                                    <h1 className="text-center">Cancha {data.nextGame.curt} <span className="badge bg-secondary">{data.nextGame.time && data.nextGame.time.slice(0,5)}  hrs.</span></h1>
                                                </div>
                                            </>
                                        }
                                    </div>
                                    <div className="col-md-6 col-xs-12 mt-3 text-center">
                                        {
                                            data.load ?

                                            // <Load2 className="mt-5"/> :
                                            <></>:

                                            <>
                                                <h4>Ranking: </h4>
                                                <span className="badge bg-secondary" style={{fontSize:40,marginTop:10}}> {data.ranking} </span>
                                            </>

                                        }
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-content-inner">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className ="card-body">
                                <div className="row">

                                    {
                                        data.load ?

                                        //<Load2 className="mt-5"/> :
                                        <></>:

                                        <table className="table">
                                            <thead className="table-dark">
                                            <tr>
                                                <th scope="col">Jornada</th>
                                                <th scope="col">Set 1</th>
                                                <th scope="col">Set 2</th>
                                                <th scope="col">Set 3</th>
                                                <th scope="col">Total</th>
                                                <th scope="col">Ranking</th>
                                                <th scope="col">Cancha</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    data.journals.map(journal=>(
                                                        <tr key={journal.journal}>
                                                            <th scope="row">{journal.journal}</th>
                                                            <td>{journal.set1}</td>
                                                            <td>{journal.set2}</td>
                                                            <td>{journal.set3}</td>
                                                            <td>{journal.pointsGeneral}</td>
                                                            <td>{journal.positionGeneral}</td>
                                                            <td>{journal.court}</td>
                                                        </tr>
                                                    ))
                                                }

                                            </tbody>
                                        </table>
                                    }



                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="main-content-inner">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className ="card-body">
                                <div className="row">

                                    <div className="col-md-12 col-xs-12 mt-1 mb-5 text-center">
                                        <h5>Actualiza tus datos</h5>
                                    </div>

                                    {
                                        clubs.load 
                                        ?
                                        <Load2 />
                                        :
                                        <PerfilData {...clubs.user}/>

                                    }


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="main-content-inner">
                <div className="row">
            
                    <div className="col-md-6 col-sm-12">
                        <div className="card">
                            <div className ="card-body">
                                <div className="row">
                                    <div className="col-md-12 col-xs-12 mt-1 mb-3 text-center">
                                        <h5>Actualiza tu imagen</h5>
                                    </div>
                                    <div className="col-md-12 col-xs-12 mt-2 d-flex justify-content-center">
                                       <div className="position-relative" style={{width:220,border:'2px dashed',padding:8,cursor:'pointer'}}>
                                            <Cropper
                                                ref={cropperRef}
                                                src={imageCropper}
                                                style={{ maxHeight: 200,width: 200}}
                                                initialAspectRatio={1}
                                                cropBoxResizable={false}
                                                dragMode = 'move'
                                                guides={false}
                                                viewMode={1}
                                                zoomTo={0.2}
                                                //zoomOnWheel={!toggleBtnSaveImg}
                                                // checkCrossOrigin={false}
                                                // checkOrientation={false}
                                            />
                                            <i className="fa fa-2x fa-picture-o position-absolute" onClick={clickInputFile} style={{top:-20,right:-15,color:'#fff',background:'rgb(9, 139, 206)',padding:12,borderRadius:50}} aria-hidden="true"></i>
                                            <input ref={inputFile} type="file" onChange={onChange} style={{display:'none'}}/>
                                       </div>
                                    </div>
                                    <div className="col-12 mt-4 mb-2 d-flex justify-content-center">
                                        <button type="button" className="btn btn-outline-primary" onClick={getCropData} disabled={toggleBtnSaveImg} style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}}> Actualizar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-sm-12">
                        <div className="card">
                            <div className ="card-body">
                                <div className="row">
                                    <div className="col-md-12 col-xs-12 mt-1 mb-5 text-center">
                                        <h5>Actualiza tu contraseña</h5>
                                    </div>
                                    <div className="col-md-12 col-xs-12 mt-3 text-center">
                                        <div style={{position:"relative"}}>
                                            <span style={{position:"absolute",top:-12,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Nueva contraseña</span>
                                            <input 
                                                type={input.type} 
                                                className="form-control" 
                                                onChange={(e)=>setFormPass(value=>({
                                                    ...value,
                                                    pass:e.target.value.trim()
                                                }))} 
                                                value={formPass.pass}/>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-xs-12 mt-3 text-center">
                                        <div style={{position:"relative"}}>
                                            <span style={{position:"absolute",top:-12,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Repite la nueva contraseña</span>
                                            <input  
                                                type={input.type} 
                                                className="form-control" 
                                                onChange={(e)=>setFormPass(value=>({
                                                    ...value,
                                                    pass2:e.target.value.trim()
                                                }))} 
                                                value={formPass.pass2}/>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-4 mb-2">
                                        <div style={{position:'absolute',cursor:'pointer',zIndex:3}} onClick={()=>changeType(input.type)}>
                                            <i className={`fa ${input.check} fa-2x me-1`} style={{cursor:'pointer'}}></i>
                                            <label className="custom-control-label ml-3" style={{cursor:'pointer'}}>Mostrar</label>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-2 mb-5 d-flex justify-content-end">
                                        <button type="button" className="btn btn-outline-primary" onClick={onUpdatePass} style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}}> Actualizar</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

             <ButtonFloat hight={200}/>


        </div>
    );
}

export default PerfilScreen;
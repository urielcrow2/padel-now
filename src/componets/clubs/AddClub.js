import {useState,useRef} from 'react';
import Cropper from "react-cropper";
import {waitSwal,mixinSwal,infoSwal} from '../utils/swalCustome';
import {adminValidate} from '../admins/adminValidate';
import { fetchCustome2 } from "../../helpers/fetch";
import "cropperjs/dist/cropper.css";

const imgClubDefault = process.env.PUBLIC_URL + '/assets/img/default/no-image-club.png';
const imgUserDefault = process.env.PUBLIC_URL + '/assets/img/default/no-image.jpg';

export const AddClub = ({newClub})=>{

    const [imageCropper, setImageCropper] = useState(imgClubDefault);
    const cropperRef = useRef();
    const inputFile = useRef(null);
    const [form,setForm] = useState({
        club:"",
        adress:""
    });
 
    const onChangeImg = (e) => {
        e.preventDefault();
        let file = e.target.files[0];
        if (/\.(?=jpg|jpeg|png)/gi.test(file.name.toLowerCase())) {
            const reader = new FileReader();
            reader.onload = () => {
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

    const onChangeInput = (e) =>{

        setForm({
            ...form,
            [e.target.name] : e.target.value.toUpperCase()
        })

    }

    const createImg = async()=>{
        if (typeof cropperRef.current !== "undefined" && imageCropper !== imgClubDefault) {
            try{
                const newImage = cropperRef.current.cropper.getCroppedCanvas({
                    width: 420,//podemos establecer un tamaño fijo en la imagen final en este caso manejamos la relación 21 / 9
                    height: 180,
                    fillColor: '#fff'
                })
                .toDataURL("image/jpeg",0.7);//bajamos la calidad para disminuir considerablemente el peso sin afectar la calidad

                setImageCropper(imgClubDefault);
    
                const blob = await fetch(newImage).then(temp => temp.blob());//con la imagen resultante creamos un blob
                const temp = new File([blob], "temporal.jpg", {type: blob.type});//hecho el blob creamos el archivo
    
                return temp;
            }
            catch(e){
                mixinSwal({ icon: 'error',title: `Ocurrio un error al procesar la imagen`});
                return ""
            }
            
        }
        return "";
    }

    const saveForm = async() => {

        if(adminValidate(form))
            return

        const data = new FormData();
        const img = await createImg();
        if(img)
            data.append("img",img);
        data.append('name',form.club.trim());
        data.append('adress',form.adress.trim());

        waitSwal({html:'Creando club'});

        try{
            const resp = await fetchCustome2({ 
                endpoint : '/clubs',
                method :'POST',
                body:data
            });

            console.log(resp)

           if(resp.id){
                newClub( {
                    id:resp.id,
                    club:resp.name,
                    adress:resp.adress,
                    img:resp.img,
                    status:resp.status,
                    root:{
                        id:'',
                        name:'',
                        email:'',
                        number:'',
                        img: imgUserDefault,
                        disabledName:  false,
                        disabledEmail: false,
                        disabledNumber: false       
                    },
                    disabledClub:true,
                    disabledAdress:true,
                    btnMoreInfo:true,
                });

                setForm({
                    club:"",
                    adress:""
                });

                return mixinSwal({ icon: 'success',title: `Club agregado`})
           }
           else{
                infoSwal({
                    icon: 'error',
                    title: 'Ocurrio un error',
                    text: `Error de comunucación con el servidor, intentelo más tarde ashh` ,
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
            
    };

    return(
        <div className="row">

            <div className="col-md-6 col-xs-12 d-flex justify-content-center mb-3">
                <div className="position-relative" style={{width:320,height:'fit-content',border:'2px dashed',padding:8,cursor:'pointer'}}>
                    <Cropper
                        ref={cropperRef}
                        src={imageCropper}
                        style={{ maxHeight: 200,width: 300}}
                        initialAspectRatio={21 / 9}
                        cropBoxResizable={false}
                        dragMode = 'move'
                        guides={false}
                        viewMode={0}
                        zoomTo={.5}
                    />
                    <i className="fa fa-2x fa-picture-o position-absolute" onClick={clickInputFile} style={{top:-20,right:-15,color:'#fff',background:'rgb(9, 139, 206)',padding:12,borderRadius:50}} aria-hidden="true"></i>
                    <input ref={inputFile} type="file" onChange={onChangeImg} style={{display:'none'}}/>
                </div>
            </div>

            <div className="col-md-6 col-xs-12 mt-3">
                <div className="row">
                    <div className="col-12 position-relative">
                        <span style={{position:"absolute",top:-12,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Nombre del club</span>
                        <span style={{position:"absolute",top:-12,right:25,color:"#00a65a"}}><i className="fa fa-plus-circle" aria-hidden="true"></i></span>
                        <input 
                            type="text" 
                            onChange={onChangeInput} 
                            name="club" 
                            className="form-control text-uppercase" 
                            value={form.club}
                        />
                    </div>
                    <div className="col-12 position-relative mt-3">
                        <span style={{position:"absolute",top:-12,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Dirección</span>
                        <textarea 
                            name="adress"
                            value={form.adress}
                            className="form-control text-uppercase" 
                            style={{maxHeight:200}}
                            rows="5"
                            onChange={onChangeInput} 
                        />
                    </div>
                </div>
            </div>
            
            <div className="col-12 mt-3 d-flex justify-content-end">
                <button type="button" className="btn btn btn-outline-primary" onClick={saveForm} style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}}><i className="fa fa-plus" aria-hidden="true"></i></button>
            </div>
        </div>
    )
}
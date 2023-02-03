import {useEffect,useContext,useState,useRef} from 'react';
import Cropper from "react-cropper";
import {Modal} from '../utils/modal/Modal';
import { fetchCustome2 } from "../../helpers/fetch";
import {waitSwal,mixinSwal,infoSwal} from '../utils/swalCustome';
import "cropperjs/dist/cropper.css";

export const EditLogoClub = ({editImage,updateClubs})=>{

    const [modal,setModal] = useState(true);//toggle modal
    const cropperRef = useRef(null);
    const [imageCropper, setImageCropper] = useState(editImage.img);
    const editButton = useRef(true);
    const inputFile = useRef(null);

    useEffect(()=>{
        editButton.current = true;
        setImageCropper(editImage.img)
        setModal(true);
    },[editImage])

    const clickInputFile = ()=>{
        inputFile.current.click()
    }
 
    const onChangeImg = (e) => {
        e.preventDefault();
        let file = e.target.files[0];
        if (/\.(?=jpg|jpeg|png)/gi.test(file.name.toLowerCase())) {
            const reader = new FileReader();
            reader.onload = () => {
                editButton.current = false;
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

    const createImg = async()=>{
        if (typeof cropperRef.current !== "undefined") {
            try{
                const newImage = cropperRef.current.cropper.getCroppedCanvas({
                    width: 420,//podemos establecer un tamaño fijo en la imagen final en este caso manejamos la relación 21 / 9
                    height: 180,
                    fillColor: '#fff'
                })
                .toDataURL("image/jpeg",0.7);//bajamos la calidad para disminuir considerablemente el peso sin afectar la calidad

                const blob = await fetch(newImage).then(temp => temp.blob());//con la imagen resultante creamos un blob
                const temp = new File([blob], "temporal.jpg", {type: blob.type});//hecho el blob creamos el archivo
    
                return temp;
            }
            catch(e){
                infoSwal({
                    icon: 'error',
                    title: 'Ocurrio un error al procesar la imagen',
                    text: `` ,
                });
                return ""
            }
            
        }
        return "";
    }

    const updateImg = async(id)=>{
       
        const form = new FormData();
        form.append("id",id);
        form.append("img",await createImg());
        form.append("_method",'patch');

        waitSwal({html:'Actualizando logo'});

        try{

            const resp = await fetchCustome2({ 
                endpoint : '/clubs/logo',
                method :'POST',
                body:form
            });

            if(resp !== ""){
                mixinSwal({ icon: 'success',title: `El logo se actualizó correctamente`});
                updateClubs(id,resp);
                setModal(false);
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

    return(
       
            <Modal modal={modal} setModal={setModal}>
                <div className="modal-crow-header">
                    <h4>{editImage.club}</h4>
                </div>
                <div className="d-flex justify-content-center">
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
                            cropBoxMovable={false}
                            toggleDragModeOnDblclick={false}
                        />
                        <i className="fa fa-2x fa-picture-o position-absolute" onClick={clickInputFile} style={{top:-20,right:-15,color:'#fff',background:'rgb(9, 139, 206)',padding:12,borderRadius:50}} aria-hidden="true"></i>
                        <input ref={inputFile} type="file" onChange={onChangeImg} style={{display:'none'}}/>
                    </div>
                   
                </div>
                <div className="d-flex justify-content-center mt-5">
                     <button 
                        className="btn btn-primary btn-lg"
                        type="button" 
                        disabled={editButton.current}
                        onClick={()=>updateImg(editImage.id)} 
                        style={{padding:5,margin:5}}
                    >
                       Remplazar imagen
                    </button>
                </div>
            </Modal>
        
    )
    

}
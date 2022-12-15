import {useState,useEffect} from 'react';
import {maskPhone} from '../../helpers/miselanius';
import {adminValidate} from '../admins/adminValidate';
import {waitSwal,mixinSwal,infoSwal} from '../utils/swalCustome';
import { fetchCustome2 } from "../../helpers/fetch";

export const PerfilData = ({
    name,
    alias,
    number,
    birth_at
})=>{
    const [form,setForm] =useState({
        name,
        alias,
        number,
        birth_at
    });

    const [formPrevius,setFormPrevius] =useState({
        name,
        alias,
        number,
        birth_at
    });

    const [disabledInputs,setDisabledInputs] = useState(true);


    const updateData = async()=>{
        
       
        setDisabledInputs(!disabledInputs);

        if(disabledInputs){
            //guardo el previuos
            setFormPrevius({
                ...form
            });
            return;
        }
        else{
            if(adminValidate(form)){
                //Restauro datos
                setForm({
                    ...formPrevius
                })
                return;
            }
        }

        //si no hubo cambios termina el proceso
        let existChanges = false;

        Object.keys(form).forEach(input=>{
            if(form[input] !== formPrevius[input])
                existChanges = true;
        })


        if(!existChanges){
            console.log('No hubo cambios');
            return;
        }
       
        const body = {
            name : form.name,
            alias : form.alias,
            birth_at : form.birth_at,
            number : form.number.replace(/[-]/g,'')
        }

        waitSwal({html:'Actualizando datos'});

        try{

            const resp = await fetchCustome2({ 
                endpoint : '/users/count',
                method :'PATCH',
                body,
                json:true
            });

            if(resp.name)
                mixinSwal({ icon: 'success',title: `Los datos se actualizaron correctamente`});
        }
        catch(e){
            infoSwal({
                icon: 'error',
                title: 'Ocurrio un error',
                text: `Error de comunucación con el servidor, intentelo más tarde` ,
            });
        }
        
    }

    const onchangeInputs = (e)=>{
        let value = '';

        if(e.target.name === 'number')
            value = maskPhone(e.target.value);
        else
            value = e.target.value;

        setForm({
            ...form,
            [e.target.name]:value
        });
    }

    return(
        <>
            <div className="col-md-4 position-relative mt-md-0 mt-4">
                <span style={{position:"absolute",top:-21,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Nombre</span>
                <span style={{position:"absolute",top:-12,right:25,color:"#00a65a"}}><i className="fa fa-plus-circle" aria-hidden="true"></i></span>
                <input type="text" value={form.name} disabled={disabledInputs} onChange={onchangeInputs} name="name" className="form-control text-uppercase" />
            </div>
            <div className="col-md-4 position-relative mt-md-0 mt-4">
                <span style={{position:"absolute",top:-21,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Alias</span>
                <input type="text" value={form.alias ? form.alias : ''} disabled={disabledInputs} onChange={onchangeInputs} name="alias" className="form-control text-uppercase" />
            </div>
            <div className="col-md-4 position-relative mt-md-0 mt-4">
                <span style={{position:"absolute",top:-21,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Teléfono</span>
                <input type="text" value={form.number ? form.number : ''} disabled={disabledInputs} onChange={onchangeInputs} name="number" className="form-control text-lowercase" />
            </div>
            <div className="col-md-4 position-relative mt-4">
                <span style={{position:"absolute",top:-21,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Fecha nacimiento</span>
                <input type="date" value={form.birth_at ? form.birth_at : ''} disabled={disabledInputs} onChange={onchangeInputs} name="birth_at" className="form-control" />
            </div>
            <div className="col-md-8 col-12 mt-4 d-flex justify-content-end">
                <button type="button" className="btn btn-outline-primary" onClick={updateData} style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)",height:43}}> { disabledInputs ? 'Actualizar' : 'Guardar'}</button>
            </div>
        </>
    )
}
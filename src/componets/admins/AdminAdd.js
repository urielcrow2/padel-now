import {useState} from 'react';
import {waitSwal,mixinSwal,infoSwal} from '../utils/swalCustome';
import {maskPhone,addChar} from '../../helpers/miselanius';
import {adminValidate} from './adminValidate';
import { fetchCustome2 } from "../../helpers/fetch";

export const AdminAdd = ({setUsers,users})=>{

    const [form,setForm] = useState({
        name:"",
        email:"",
        number:""
    });
 
    const onChangeInput = (e) =>{

        let temp = "";

        if(e.target.name === "number")
            temp = maskPhone(e.target.value);
        else
            temp = e.target.value;

        setForm({
            ...form,
            [e.target.name] : temp
        })

    }

    const newUser = (newUser) =>{

        const temp = [
            ...users.data,
            newUser
        ];

        temp.sort((a,b) => {
            if(a.name > b.name)
                return 1;
            if(a.name < b.name)
                return -1;
            return 0;
        })

        setUsers({
            ...users,
            data:temp
        })
    }

    const saveForm = async() => {

            if(adminValidate(form))
                return

            const correoExistente = users.data.filter( user => user.email === form.email)
           
            if( correoExistente.length !== 0 ){
                infoSwal({title: 'E-mail ya existe'});
                return true;
            }
           
            const body = {
                name:form.name.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                email:form.email.trim(),
                number:form.number.replace(/[-]/g,'')
            }

        
            waitSwal({html:'Espere..'});

            try{
    
                const resp = await fetchCustome2({ 
                    endpoint : '/users/admin',
                    method :'POST',
                    body,
                    json:true
                });

              
                if(resp.errors){
                    if(resp.errors.email){
                        infoSwal({
                            icon: 'error',
                            title: 'Ocurrio un error',
                            text: `Ya existe un usuario con ese e-mail`
                        });
                        return;
                    }
                    infoSwal({
                        icon: 'error',
                        title: 'Ocurrio un error',
                        text: `Error de comunicación con el servidor, intentelo más tarde`
                    });
                    return;
                }
                else if(resp !== ""){
                    mixinSwal({ icon: 'success',title: `Administrador resgistrado`});
                    
                        newUser({
                            id:resp.id,
                            name:resp.name,
                            email:resp.email,
                            number:addChar(resp.number,'-',2),
                            img:"https://padelnow.app/padel/assets/no-image.jpg",
                            disabledName:true,
                            disabledEmail:true,
                            disabledNumber:true
                        })

                        setForm({
                            name:"",
                            email:"",
                            number:""
                        });
                }
                else{
                        infoSwal({
                            icon: 'error',
                            title: 'Ocurrio un error',
                            text: `Error de comunicación con el servidor, intentelo más tarde` ,
                        });
                }
    
            }
            catch(e){
                infoSwal({
                    icon: 'error',
                    title: 'Ocurrio un error',
                    text: `Error de comunicación con el servidor, intentelo más tarde` ,
                });
            }
            
        
    };

    return(
        <div className="row">

            <div className="col-md-4 col-xs-12 mt-3 position-relative">
                <span style={{position:"absolute",top:-12,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Nombre</span>
                <span style={{position:"absolute",top:-12,right:25,color:"#00a65a"}}><i className="fa fa-plus-circle" aria-hidden="true"></i></span>
                <input 
                    type="text" 
                    onChange={onChangeInput} 
                    name="name" 
                    className="form-control text-uppercase" 
                    value={form.name}
                />  
            </div>

            <div className="col-md-4 col-xs-12 mt-3 text-lowercase position-relative">
                <span style={{position:"absolute",top:-12,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>E-mail</span>
                <span style={{position:"absolute",top:-12,right:25,color:"#00a65a"}}><i className="fa fa-plus-circle" aria-hidden="true"></i></span>
                <input 
                    type="text" 
                    onChange={onChangeInput} 
                    name="email" 
                    className="form-control text-lowercase" 
                    value={form.email}
                />
            </div>

            <div className="col-md-4 col-xs-12 mt-3 position-relative">
                <span style={{position:"absolute",top:-12,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Teléfono</span>
                <input 
                    type="text" 
                    onChange={onChangeInput} 
                    name="number" 
                    className="form-control" 
                    value={form.number}
                />
            </div>
            
            <div className="col-12 mt-3 d-flex justify-content-end">
                <button type="button" className="btn btn btn-outline-primary" onClick={saveForm} style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}}><i className="fa fa-plus" aria-hidden="true"></i></button>
            </div>
        </div>
    )
}
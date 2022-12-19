import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate,useNavigate } from "react-router-dom";
import { useForm,validateCustome,configInput } from '../../hooks/useForm';
import { startLogin } from '../../actions';
import { fetchCustome2 } from "../../helpers/fetch";
import {waitSwal,inputMailSwal,infoSwal} from '../utils/swalCustome';
import {maskPhone} from '../../helpers/miselanius';
import './login.css';

export const Count = () => {

    const {name} = useSelector( store => store.auth );
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [input, setInput] = useState({
        type:'password',
        icon:'fa fa-eye-slash'
    });

    const [form,updateForm,changeInput,focus,blur] = useForm({
        name : configInput( {val:"", type:"onlyText", required:true, focus:false} ),
        email : configInput( {val:"", type:"mail", required:true, focus:false} ),
        pass : configInput( {val:"", type:"text", required:true, focus:false} ),
        phone_number : configInput( {val:"", type:"phone", required:false, focus:false} ),
        alias : configInput( {val:"", type:"text", required:false, focus:false} ),
        birth : configInput( {val:"", type:"text", required:false, focus:true} ),
    });

    const formSubmit = async(e)=>{
        e.preventDefault();

        if(validateCustome(form,updateForm))
            return;
        
        if(!form.pass.val.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?_.])[A-Za-z\d@$!%*?_.]{10,15}$/)){
            return infoSwal({
                icon: 'info',
                title: 'Contraseña debil',
                text: `La contraseña debe de tener mínimo 10 y máximo 15 caracteres; al menos 1 número,1 mínuscula, 1 máyuscula y alguno de los siguientes caracteres especiales @ $ ! % * ? . _` ,
            });
        }

        const body = {
            name: form.name.val.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            email : form.email.val, 
            passwd : form.pass.val, 
            number : form.phone_number.val.replace(/[-]/g,''),
            alias : form.alias.val.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            birth : form.birth.val
        }

        waitSwal({html:'Espera por favor'});

        try{

            const resp = await fetchCustome2({ 
                endpoint : '/users/count',
                method :'POST',
                json:true,
                body
            });

            if(resp.id)
                dispatch( startLogin(resp.email,form.pass.val) );
            else if(resp.errors.email){
                infoSwal({
                    icon: 'error',
                    title: 'Ocurrio un error',
                    text: `El E-mail ya está siendo utilizado por otro usuario` ,
                });
            }
           else{
                infoSwal({
                    icon: 'error',
                    title: 'Ocurrio un error',
                    text: `Verifica tus datos` ,
                });
           }

        }
        catch(e){
            infoSwal({
                icon: 'error',
                title: 'Ocurrio un error',
                text: `Error de comunucación con el servidor, intentelo más tarde noooooooooooooooooooo` ,
            });
        }
    }

    const onMouseDown = ()=>{
        setInput({
            type:'text',
            icon:'fa fa-eye'
        });
    }

    const onMouseUp = ()=>{
        setInput({
            type:'password',
            icon:'fa fa-eye-slash'
        });
    }

    const returnLogin = ()=>{
        navigate('/login');
    }

    if(!!name)
        return <Navigate to="/cuenta"/>;

    return (
        <div className="login-area login-bg">
            <div className="container">
                <div className="login-box create-count ptb--100">
                   <div className="create-count">
                        <div style={{marginBottom:40,position:"relative",width:"100%",height:60,textAlign:"center",display: "flex",justifyContent: "center"}}>
                            <div className="login-form-head2"></div>
                        </div>

                        <div className="login-form-body">

                            <div className="form-gp">
                                <label className={form.name.focus ? 'focusActive' : ''}>Nombre</label>
                                <input name="name" type="text" className="text-uppercase" onChange={changeInput} onFocus={focus} onBlur={blur} value={form.name.val} autoComplete="off"/>
                                <i className="fa fa-user"></i>
                                <div className="text-danger">{ form.name.error && 'Obligatorio' }</div>
                            </div>

                            <div className="form-gp">
                                <label className={form.email.focus ? 'focusActive' : ''}>E-mail</label>
                                <input name="email" type="text" className="text-lowercase" onChange={changeInput} onFocus={focus} onBlur={blur} value={form.email.val} autoComplete="new-password"/>
                                <i className="fa fa-user-circle"></i>
                                <div className="text-danger">{ form.email.error && 'Obligatorio' }</div>
                            </div>

                            <div className="form-gp">
                                <label className={form.pass.focus ? 'focusActive' : ''}>* Contraseña</label>
                                <input name="pass" type={input.type} onChange={changeInput} onFocus={focus} onBlur={blur} value={form.pass.val} autoComplete="new-password" />
                                <i className={input.icon} onMouseDown={onMouseDown} onMouseUp={onMouseUp} style={{cursor:'pointer'}}></i>
                                <div className="text-danger">{ form.pass.error && 'Obligatorio' }</div>
                            </div>

                             <div className="form-gp">
                                <label className={form.phone_number.focus ? 'focusActive' : ''}>Teléfono</label>
                                <input name="phone_number" type="text" onChange={changeInput} onFocus={focus} onBlur={blur} value={form.phone_number.val} autoComplete="off"/>
                                <i className="fa fa-mobile"></i>
                                <div className="text-danger">{ form.phone_number.error && 'A 10 digitos' }</div>
                            </div>

                            <div className="form-gp">
                                <label className={form.alias.focus ? 'focusActive' : ''}>Alias</label>
                                <input name="alias" type="text" className="text-uppercase" onChange={changeInput} onFocus={focus} onBlur={blur} value={form.alias.val} autoComplete="off"/>
                                <i className="fa fa-user-o"></i>
                                <div className="text-danger">{ form.alias.error && 'No caracteres especiales' }</div>
                            </div>

                            <div className="form-gp custome-date-icon">
                                <label className='focusActive'>Fecha nacimiento</label>
                                <input name="birth" type="date" onChange={changeInput} onFocus={focus} onBlur={blur} value={form.birth.val} autoComplete="off"/>
                                <div className="text-danger">{ form.birth.error && 'Formato no valido' }</div>
                            </div>

                            <p style={{fontSize:12,lineHeight:'12px'}}>* Debe tener mínimo 10 y máximo 15 caracteres; al menos 1 número,1 mínuscula, 1 máyuscula y alguno de los siguientes caracteres especiales @ $ ! % * ? . _</p>

                            <div className="submit-btn-area mt-3">
                                <button type="button" onClick={formSubmit}> Crear cuenta <i className="fa fa-arrow-right"></i></button>
                            </div>
                        
                        </div>

                        <div className="section-header"></div>
                        <div className="forgot-passwd">
                            <span style={{cursor:'pointer'}} onClick={returnLogin}><i className="fa fa-arrow-left"></i> Regresar </span>
                        </div>
                    </div> 
                </div> 
            </div>
        </div>
    );

}

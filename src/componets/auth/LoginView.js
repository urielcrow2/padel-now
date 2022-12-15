import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate,useNavigate } from "react-router-dom";
import { useForm,validateCustome,configInput } from '../../hooks/useForm';
import { startLogin } from '../../actions';
import { fetchCustome2 } from "../../helpers/fetch";

import {waitSwal,inputMailSwal,infoSwal} from '../utils/swalCustome';
import './login.css';

export const Login = () => {

    const {name} = useSelector( store => store.auth );
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [input, setInput] = useState({
        type:'password',
        check:'fa-square color-disabled-check'
    });

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

    const [form,updateForm,changeInput,focus,blur] = useForm({
        usuario : configInput( {val:"", type:"mail", required:true, focus:true} ),
        pass : configInput( {val:"", type:"text", required:true, focus:true} )
    });

    const resetPass = ()=>{
        inputMailSwal(async function(email){
            if (email) {
                try{
                    waitSwal({html:'Espere...'});
                    await fetchCustome2({ 
                        endpoint : '/mail/recover',
                        method :'POST',
                        body:{
                            email
                        },
                        json:true
                    });
                    infoSwal({icon: 'success',title: '',text: "En breve recibiras un correo con las instrucciones para recuperar tu contraseña",});
                }
                catch(e){
                    infoSwal({icon: 'error',title: '',text: "Error con el servidor, intentelo más tarde",});
                }
            }
        })
    }

    const sendSubmit = (e)=>{
        e.preventDefault();
        if(!validateCustome(form,updateForm)){
            dispatch( startLogin(form.usuario.val,form.pass.val) );
        }
    }

    const createCount = ()=>{
        navigate('/count');
    }

    if(!!name)
        return <Navigate to="/inicio"/>;

    return (
        <div className="login-area login-bg">
            <div className="container">
                <div className="login-box ptb--100">
                    <form onSubmit={sendSubmit}>

                        <div style={{marginBottom:40,position:"relative",width:"100%",height:60,textAlign:"center",display: "flex",justifyContent: "center"}}>
                            <div className="login-form-head"></div>
                        </div>

                        <div className="login-form-body">

                            <div className="form-gp">
                                <label className={form.usuario.focus ? 'focusActive' : ''}>Usuario</label>
                                <input name="usuario" type="text" onChange={changeInput} onFocus={focus} onBlur={blur} value={form.usuario.val} autoComplete="off"/>
                                <i className="fa fa-user-circle"></i>
                                <div className="text-danger">{ form.usuario.error && 'Obligatorio' }</div>
                            </div>

                            <div className="form-gp">
                                <label className={form.pass.focus ? 'focusActive' : ''}>Contraseña</label>
                                <input name="pass" type={input.type} onChange={changeInput} onFocus={focus} onBlur={blur} value={form.pass.val} autoComplete="off"/>
                                <i className="fa fa-lock"></i>
                                <div className="text-danger">{ form.pass.error && 'Obligatorio' }</div>
                            </div>
        
                            <div className="row custom-control custom-checkbox mr-sm-2 d-flex align-items-center">
                                <div className="col-5">
                                    <div style={{cursor:'pointer',zIndex:3}} onClick={()=>changeType(input.type)}>
                                        <i className={`fa ${input.check} fa-2x me-1`} style={{cursor:'pointer'}}></i>
                                        <label className="custom-control-label ml-3" style={{cursor:'pointer'}}>Mostrar</label>
                                    </div>
                                </div>
                                <div className="col-7" style={{textAlign:'right'}}>
                                    <b style={{cursor:'pointer'}} onClick={createCount}>Crear cuenta</b>
                                </div>
                            </div>

            
                            <div className="submit-btn-area mt-3">
                                <button type="submit">Enviar <i className="fa fa-arrow-right"></i></button>
                            </div>
                        
                        </div>

                        <div className="section-header"></div>
                        <div className="forgot-passwd">
                            <span style={{cursor:'pointer'}} onClick={resetPass}>Olvidé mi contraseña</span>
                        </div>

                    </form>
                   
                </div> 
            </div>
        </div>
    );

}

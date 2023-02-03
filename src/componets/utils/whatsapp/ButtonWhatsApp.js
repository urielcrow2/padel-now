import React from 'react';
import './buttonFloat.css';

const caret = require('./caret.png');

export const ButtonWhatsApp = ({message='¿Necesitas ayuda?'}) =>{
    
    return (
        <> 
            <div className="buttonFloatWhats d-flex justify-content-center align-items-center">
                <a href="https://api.whatsapp.com/send?phone=3310202440&text=Hola%20me%20interesa%20informaci%C3%B3n%20sobre%20el%20banner%20que%20vi%20en%20PadelNow" target="_blank">
                    <i className="fa fa-whatsapp" style={{color:'#FFF',fontSize:45}}></i>
                </a>
            </div>
            <div className="etiqueta-whatsapp">
                <span>{message}</span>
                <div><img src={caret} alt='caret' /></div>
            </div>

        </>
       
    )
}

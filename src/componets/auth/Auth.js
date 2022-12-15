import React from 'react';
import { useSelector } from 'react-redux';
import {Navigate}  from 'react-router-dom';

export const Auth = ({children}) => {
    const { name } = useSelector( store => store.auth );
    return !!name ? children : <Navigate to="login"/>
}

import React from 'react';
import {useDispatch} from 'react-redux';
import {Navigate} from 'react-router-dom';
import { endLogin } from '../../actions'

export const Logout = () => {

    const dispatch = useDispatch();
   
    React.useEffect(()=>{
        dispatch( endLogin() );
    },[dispatch]);
   
    return (
       <Navigate to='login' />
    )
}

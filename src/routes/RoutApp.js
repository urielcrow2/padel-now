import React, { useEffect } from 'react';
import { useRoutes, Navigate} from "react-router-dom";
import { useSelector,useDispatch } from 'react-redux';
import { checkLogin } from '../actions';
import { Login, Logout, Auth, Layout, Load, Count } from '../componets';
import { router } from './router';

export const RoutApp = ()=>{

    const { auth : {access} , preload : {active} } = useSelector( store => store );
    
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch (checkLogin());//verificamos si estamos logeados o no
    }, [dispatch]);

    const all_routes2 = [
        {
            element:(
                <Auth>
                    <Layout />
                </Auth>
            ),
            children: router(access)
        },
        {
            path: '/login',
            element: <Login />,
        },
        {
            path: '/count',
            element: <Count />,
        },
        {
            path: '/logout',
            element: <Logout />,
        },
        {
            path: '/',
            element: <Navigate to="/inicio" />,
        },
        {
            path: '*',
            element: <Navigate to="/" />,
        }
    ];

    

    const all_pages = useRoutes(all_routes2)//Nos crea <Routes> {...<Route></Route>} </Routes>

    return(
            <>
                { active ? <Load /> : all_pages }
            </>
    )

}
 
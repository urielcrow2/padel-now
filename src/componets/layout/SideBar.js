
import React , {useEffect, useRef} from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Link,useLocation,useNavigate} from "react-router-dom";
import { menus } from '../../routes/tipos/menus';

export const SideBar = ({ setShowHideSideBar, widthScreen, showHideSideBar }) => {

    const {name,image,access} = useSelector( store => store.auth );
    const refSideBar = useRef(null);
    const {pathname:location} = useLocation();
    const navigate = useNavigate();
    const [active,setActive] = React.useState({
        [location] : 'active'
    });

    useEffect(()=>{

        const handleClickOutside = (event)=> {
            if (refSideBar.current && !refSideBar.current.contains(event.target) && widthScreen <= 1364 && showHideSideBar === false) 
                setShowHideSideBar(true);
        }
    
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    },[widthScreen,showHideSideBar,setShowHideSideBar]);

   
    const changeActive = (val)=>{
        setActive({
            [val]:'active'
        });

        closeSideBarForClickItem();//si es una resolución baja al dar clic en algún módulo cerramos el sideBar
    }

    const closeSideBarForClickItem = ()=>{
        if(widthScreen <= 1364)
            setShowHideSideBar(true);
    }

    const logout = (e)=>{
        e.preventDefault();
        Swal.fire({
            title: '¿ Deseas cerrar la sesión ?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar',
            cancelButtonText: 'No'
          }).then((result) => {
            if(result.isConfirmed)
                navigate('/logout')
          })
    }

    return (

        <div ref={refSideBar} className="sidebar-menu">
        
            <div className="sidebar-header">
                <div className="logo">
                    {/* <img src="assets/img/logo/logo2.png" alt="logo" /> */}
                    <img src={ `${process.env.PUBLIC_URL}/assets/img/logo/logo2.png`} alt="logo" />
                </div>
            </div>
        
            <div className="col clearfix">
                <div className={`user-profile ${ active['/cuenta'] && 'perfilActive' }`} style={{ marginLeft : -30}}>
                {/* <div className={ ({ isActive }) => isActive ? "user-profile perfilActive" : "user-profile"} style={{ marginLeft : -30}}> */}
                    <div className="container-avatar">
                        <Link to="/cuenta" onClick={()=>changeActive('/cuenta')}> 
                            <img className="avatar user-thumb" alt="avatar" src={image} />
                            <h4 className="user-name"> { name }</h4>
                        </Link>
                    </div>
                </div>
            </div>
        
            <div className="main-menu">
                <div className="menu-inner">
                    <nav>
                        <ul className="metismenu">
                        {
                            menus(access).map(option =>(
                                <li className={active[`${option.to}`]} key={option.name}>
                                    <Link
                                        className="link-principal"
                                        to={`${option.to}`}
                                        onClick={()=>changeActive(`${option.to}`)}
                                    >
                                        <i className={`${option.icon}`}></i> {option.name}
                                    </Link>
                                </li>
                            ))
                        }
                            <li>
                                <Link
                                    className="link-principal"
                                    to=""
                                    onClick={logout}
                                >
                                    <i className="fa fa-sign-out fa-2x fa-fw"></i>Salir
                                </Link>
                            </li>

                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}



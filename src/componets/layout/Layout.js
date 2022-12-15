import React, {useEffect, useState} from 'react';
import { Outlet } from 'react-router-dom';
import { SideBar } from './SideBar';
import { Header } from './Header';
import { Footer } from './Footer'

import '../../styles/stylesGenerals.css';
import '../../styles/stylesResponsive.css';
import '../../styles/typography.css';
import '../../styles/default-css.css';
import '../../styles/styles-3998.css';

export const Layout = () => {

    const [showHideSideBar,setShowHideSideBar] = useState(false);
    const [widthScreen,setWidthScreen] = useState(window.innerWidth);

    useEffect(()=>{

        const onResize = ()=>{
            setWidthScreen( window.innerWidth )
            window.innerWidth <= 1364 ? setShowHideSideBar( true ) : setShowHideSideBar( false );
        }

        window.addEventListener('resize',onResize);

        return () => {
            window.removeEventListener('resize',onResize);
        }

    },[]);

    return(
        <div className={`page-container ${ showHideSideBar && 'sbar_collapsed' }`}>
            <SideBar widthScreen={widthScreen} setShowHideSideBar={setShowHideSideBar} showHideSideBar={showHideSideBar} />
            <div className="main-content">
                <Header setShowHideSideBar={setShowHideSideBar}/>
            </div>
            <Footer />
            <Outlet />
        </div>
    )
}



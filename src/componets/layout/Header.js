import React, {useContext} from 'react';
import {customeContext} from '../../context/context';

export const Header = ({setShowHideSideBar}) => {

    const {context} = useContext(customeContext);

    return (
        <>
            <div className="header-area" >
                <div className="row align-items-center">
                    <div className="col-6  clearfix">
                        <div className="nav-btn pull-left" onClick={()=>setShowHideSideBar(state => !state)}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <div className="col-6 clearfix">
                        <ul className="notification-area pull-right">
                            <li id="full-view"><i className="ti-fullscreen"></i></li>
                            <li id="full-view-exit"><i className="ti-zoom-out"></i></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="page-title-area">
                <div className="row align-items-center" style={{minHeight:50}}>
                    <div className="col-sm-6">
                        <div className="breadcrumbs-area clearfix">
                            <h3 className="page-title pull-left">{context.titlePage}</h3>
                        </div>
                    </div>
                    {/* <div className="col-sm-6 clearfix text-right slider-custome">
                        <span>Perfil control vehícular</span>
                        <label className="switch">
                            <input type="checkbox" />
                            <span className="slider round"></span>
                        </label>
                    </div> */}
                </div>
            </div>
        </>
    )
}

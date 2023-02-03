import React, {useContext} from 'react';
import {customeContext} from '../../context/context';

export const Header = ({setShowHideSideBar}) => {

    const {context} = useContext(customeContext);

    return (
        <>
            <div className="header-area page-title-area">
                <div className="row" style={{minHeight:45}}>
                    <div className="col-6 clearfix">
                        <div className="" onClick={()=>setShowHideSideBar(state => !state)}>
                            <div className="breadcrumbs-area clearfix">
                                <h3 className="page-title pull-left mt-2">{context.titlePage}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 clearfix d-flex justify-content-end">
                        <div className="nav-btn pull-left" onClick={()=>setShowHideSideBar(state => !state)}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                   
                </div>
            </div>

            {/* <div className="page-title-area">
                <div className="row align-items-center" style={{minHeight:50}}>
                    <div className="col-sm-6">
                        <div className="breadcrumbs-area clearfix">
                            <h3 className="page-title pull-left">{context.titlePage}</h3>
                        </div>
                    </div>
                   
                </div>
            </div> */}
        </>
    )
}

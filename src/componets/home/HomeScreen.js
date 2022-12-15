import { useContext , memo, useEffect } from 'react';
import {customeContext} from '../../context/context';

const HomeScreen = memo(() => {

    const { setContext } = useContext(customeContext);

    useEffect(() => {
        setContext( context => (
            {   ...context,
                titlePage : 'Inicio'
            })
        );
    },[setContext]);

    return (
        <div className="main-content">
            <div className="main-content-inner">
                <div className="row">
                    <div className="col-lg-12 mt-3">
                        <div className="card">
                            <div className ="card-body">
                                <h4 className="text-center">INICIO</h4>
                                
            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default HomeScreen;

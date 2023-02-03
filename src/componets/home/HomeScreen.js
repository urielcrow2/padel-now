import { useContext , memo, useEffect } from 'react';
import {customeContext} from '../../context/context';
import {subscribe} from '../../helpers/subscribe';

const HomeScreen = memo(() => {

    const { setContext } = useContext(customeContext);

    useEffect(() => {
        setContext( context => (
            {   ...context,
                titlePage : 'Inicio'
            })
        );
    },[setContext]);

    useEffect(() => {
        console.log('segun inscritos')
        console.log(Notification.permission)
    }, []);

    const notificaciones = ()=>{
        subscribe();
    }

    const msje = async()=>{
        
        const serviceWorkerReg = await navigator.serviceWorker.register('sw.js');

        const options = {
            body: 'Simple piece of body text.\nSecond line of body text :)',
        };

        serviceWorkerReg.showNotification('hola', options);
    }

    return (
        <div className="main-content">
            <div className="main-content-inner">
                <div className="row">
                    <div className="col-lg-12 mt-3">
                        <div className="card">
                            <div className ="card-body">

                                <h4 className="text-center">INICIO</h4>
                                <button className="btn btn-success" onClick={notificaciones}>Recibir notificaciones</button>
                                <button className="btn btn-success" onClick={msje}>a ver</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default HomeScreen;

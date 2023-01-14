

export const subscribe = async () => {
    
    console.log("Iniciando suscribción");

    const serviceWorkerReg = await navigator.serviceWorker.register('sw.js');

    let subscription = await serviceWorkerReg.pushManager.getSubscription();

    if (subscription === null) {

        subscription = await serviceWorkerReg.pushManager.subscribe ({
            userVisibleOnly: true,
            applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
        });

        const url = 'https://notificaciones-push-backend-production.up.railway.app';
        console.log('suscrito a: ' + url );

        const options = {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: subscription,
                id:1024
            })
        }

        fetch( url + '/notificaciones', options);
    }
}
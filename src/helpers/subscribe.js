

export const subscribe = async () => {

    const serviceWorkerReg = await navigator.serviceWorker.register('sw.js');

    let subscription = await serviceWorkerReg.pushManager.getSubscription();
   
    if (subscription === null) {

        subscription = await serviceWorkerReg.pushManager.subscribe ({
            userVisibleOnly: true,
            applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
        });

        console.log(subscription);

        const url = 'http://localhost:9000';

        const options = {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: subscription
            })
        }

        fetch( url + '/notificaciones', options);
    }
}
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.precaching.precacheAndRoute( self.__WB_MANIFEST );

//Escuchamos cualquier notificación push
self.addEventListener('push', async function(event) {

    const message = await event.data.json();
    let {title, body, image, data} = message;

    const promiseChain = self.registration.showNotification(title,{
        body,
        image,
        data
    });
    event.waitUntil(promiseChain);
});


//Evento que ejecutaremos en cuanto se le de click a una notificación push
self.addEventListener('notificationclick', async function(event) {
    event.notification.close();
    // Get all the Window clients
    event.waitUntil(clients.matchAll({ type: 'window' }).then((clientsArr) => {
        // If a Window tab matching the targeted URL already exists, focus that;
        const hadWindowToFocus = clientsArr.some((windowClient) => windowClient.url === event.notification.data.url ? (windowClient.focus(), true) : false);
        // Otherwise, open a new tab to the applicable URL and focus it.
        if (!hadWindowToFocus) clients.openWindow(event.notification.data.url).then((windowClient) => windowClient ? windowClient.focus() : null);
    }));
});


//No se bien como funcionan aún, pero gracias a las 2 siguentes línes en el index.html, funciona el beforeinstallprompt
self.addEventListener('install', () => {
    console.log('instalado')
    //self.skipWaiting()
});
// self.addEventListener('activate', () => self.clients.claim());



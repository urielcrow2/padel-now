importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.precaching.precacheAndRoute( self.__WB_MANIFEST );

window.addEventListener('push', async function (event) {
    const message = await event.data.json ();
    let {title, description, image} = message;
    console.log ({message});
    await event.waitUntil (
      registration.showNotification (title, {
        body: description,
        icon: image,
        actions: [
          {
            title: 'say hi',
          },
        ],
      })
    );
  });

);
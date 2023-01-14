importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.precaching.precacheAndRoute( [{"revision":"eb37e03b370d643d10ab618dda6f790d","url":"asset-manifest.json"},{"revision":"1d496e0006f9dbe6c2fab85f9b553c6a","url":"assets/background/19633.jpg"},{"revision":"94f611f406ff6450037db2014571de04","url":"assets/img/default/no-image-club.png"},{"revision":"3f7d6bbab9a0468ce7c35864a5a11d6a","url":"assets/img/default/no-image.jpg"},{"revision":"f66a22375fcd702f2e2f2ae6efd7c595","url":"assets/img/logo/logo.png"},{"revision":"94f611f406ff6450037db2014571de04","url":"assets/img/logo/logo2.png"},{"revision":"d4cda14d281bb4c279eeabd7a834cc72","url":"favicon.ico"},{"revision":"fe1fa1ad3c0319d6129d2c4b90ed7d9a","url":"icons/icon-128.png"},{"revision":"a26bf0af5fcfb001e8c63d9465aaa49f","url":"icons/icon-144.png"},{"revision":"e26ab66428cd55639302114885f4c14e","url":"icons/icon-152.png"},{"revision":"20edaa3f7c7d4cd64d3cf2b7c1dfda37","url":"icons/icon-192.png"},{"revision":"1ad69a5dc085fa608289e28d6e0cebcb","url":"icons/icon-384.png"},{"revision":"45acf352064d889721abc74cc60a4736","url":"icons/icon-512.png"},{"revision":"82f2fb1a72db1f94b508b575fe18b3bd","url":"icons/icon-72.png"},{"revision":"284d32522cb7f6d1aa2b218e08a486c8","url":"icons/icon-96.png"},{"revision":"467b05c1877c9ead279e1d09912b13de","url":"index.html"},{"revision":"52ea55491eb297c83d94dfe1e413b2c3","url":"manifest.json"},{"revision":"fa1ded1ed7c11438a9b0385b1e112850","url":"robots.txt"},{"revision":"17c5097d2fff35905d438df01549aa35","url":"static/css/10.2f166b2d.chunk.css"},{"revision":"943be67582c31dedf3de75339b4d22a3","url":"static/css/118.30522078.chunk.css"},{"revision":"b87c6bc504726123e11c328aa6789698","url":"static/css/327.68350373.chunk.css"},{"revision":"9e1836d8cfb7cd4cdec4996c8b32cb84","url":"static/css/400.68350373.chunk.css"},{"revision":"f44d76c39a1ceee214a8c2547d102905","url":"static/css/460.0f5b95d6.chunk.css"},{"revision":"89499db9c409c35d073d2c016ad7017f","url":"static/css/585.30522078.chunk.css"},{"revision":"55dbf5772093de78c5ea066152210fb3","url":"static/css/632.e7a99720.chunk.css"},{"revision":"ca764f86fec9f7323b0e58ba27384fff","url":"static/css/952.0f5b95d6.chunk.css"},{"revision":"37d9200f273f1fc798f2c4a5fa7e1ab0","url":"static/css/main.095cc12b.css"},{"revision":"1443debadf66febd22d42949e4b7ba12","url":"static/js/10.2fa0e633.chunk.js"},{"revision":"6698cd0d07f4f1dc395566f99d809f00","url":"static/js/118.9982c4f4.chunk.js"},{"revision":"ab7be7beb70e443a345de6566acba05e","url":"static/js/287.07bbd939.chunk.js"},{"revision":"2cbd59bde96c7af9f1f61c07f6e7bae8","url":"static/js/327.5e7d367c.chunk.js"},{"revision":"315dd13cc36761e730cd5110ed81c086","url":"static/js/400.462d2018.chunk.js"},{"revision":"4401dca5765a1c9b52b793164321aa63","url":"static/js/460.508b88f3.chunk.js"},{"revision":"daa266d63b03b88eb92d243769f4e35a","url":"static/js/526.c38622d3.chunk.js"},{"revision":"9ba1eb77455df5120432dd6bfa8f43d3","url":"static/js/585.c3db844d.chunk.js"},{"revision":"94c73f8d20ce2557fbb1fdff48f41875","url":"static/js/632.18687582.chunk.js"},{"revision":"61532347f3911cd22a62dd87e668e8c6","url":"static/js/720.debff562.chunk.js"},{"revision":"5092c6e04c7faa4b291d51dc5bb6081a","url":"static/js/720.debff562.chunk.js.LICENSE.txt"},{"revision":"37fe28071853964a3b89591e3ad3923b","url":"static/js/942.462b1428.chunk.js"},{"revision":"32f39997c3488213238100abe47ed241","url":"static/js/952.aa812acf.chunk.js"},{"revision":"f16aa3a47e224d772c18ec0f29e488d3","url":"static/js/main.30cbe4ce.js"},{"revision":"bd8833a42ee31a0fcf9c728ce2e2d3b5","url":"static/js/main.30cbe4ce.js.LICENSE.txt"},{"revision":"1d496e0006f9dbe6c2fab85f9b553c6a","url":"static/media/19633.821fe688a587b3cfd1b1.jpg"},{"revision":"94f611f406ff6450037db2014571de04","url":"static/media/logo2.7a2189f3ebc01efe32f0.png"}] );

// self.addEventListener('push', function(event) {
//     const promiseChain = self.registration.showNotification('Hello, World.');
//     event.waitUntil(promiseChain);
// });

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

self.addEventListener('notificationclick', async function(event) {
    event.notification.close();
    // Get all the Window clients
    event.waitUntil(clients.matchAll({ type: 'window' }).then((clientsArr) => {
        // If a Window tab matching the targeted URL already exists, focus that;
        const hadWindowToFocus = clientsArr.some((windowClient) => windowClient.url === event.notification.data.url ? (windowClient.focus(), true) : false);
        // Otherwise, open a new tab to the applicable URL and focus it.
        if (!hadWindowToFocus) clients.openWindow(event.notification.data.url).then((windowClient) => windowClient ? windowClient.focus() : null);
    }));
})



const main = function () {
    this.configureServiceWorker = function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration);
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
        })
    }
    this.bootServiceWorker = function () {
        window.addEventListener('load', this.configureServiceWorker);
    }
    if ('serviceWorker' in navigator) {
        this.bootServiceWorker();
    }

}

main();
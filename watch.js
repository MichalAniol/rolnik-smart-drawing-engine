const chokidar = require('chokidar')
const browserSync = require('browser-sync').create();

const PORT = 3030
const PROXY_PORT = 3033

browserSync.init({
    server: {
        baseDir: "./prod",
    },
    ui: {
        port: PROXY_PORT
    },
    port: PORT,
    open: false
});

const watcher = chokidar.watch(`./prod`, {
    persistent: true // Kontynuowanie działania procesu
})

const reload = () => {
    const now = new Date(Date.now());
    const getZero = num => num < 10 ? '0' + num : num;
    const time = now.getFullYear() + '.' + getZero(now.getMonth() + 1) + '.' + getZero(now.getDate()) + ' ' + getZero(now.getHours()) + ':' + getZero(now.getMinutes()) + ':' + getZero(now.getSeconds());
    console.log(' --- DEVELOP reloaded at: ' + time + ' ---');
    browserSync.reload();
}

watcher
    .on('ready', () => {
        reload()

        watcher
            .on('change', reload)
            .on('add', reload)
            .on('error', (error) => info(`Błąd: ${error}`))
    })

    // "@types/electron": "^1.6.10",
    // "@types/express": "^4.17.21",
    // "@types/node": "^20.10.8",
    // "browser-sync": "^3.0.2",
    // "cheerio": "^1.0.0",
    // "chokidar": "^4.0.3",
    // "cors": "^2.8.5",
    // "cssnano": "^7.0.6",
    // "express": "^4.19.2",
    // "gulp": "^4.0.2",
    // "http": "^0.0.1-security",
    // "ts-loader": "^9.4.3",
    // "ts-node": "^10.9.1",
    // "tsc-watch": "^6.0.4",
    // "tsconfig-paths": "^4.2.0",
    // "typescript": "^4.9.5",
    // "ws": "^8.18.1",
    // "html-minifier": "^4.0.0",
    // "minify": "^11.0.1"
(function() {
    const electron = require('electron');
    const app = electron.app;
    const BrowserWindow = electron.BrowserWindow;
    const globalShortcut = electron.globalShortcut;
    let mainWindow;

    function createWindow() {
        mainWindow = new BrowserWindow({
            maximizable: true,
            minimizable: true,
            closable: true,
            movable: true,
            title: "ESRG - Estabilidade de Solo Reforçado com Geossintéticos",
            show: true,
            autoHideMenuBar: true,
            titleBarStyle: 'hidden-inset'
        })

        mainWindow.loadURL(`file://${__dirname}/source/index.html`);
        mainWindow.webContents.openDevTools();
        mainWindow.on('closed', function() {
            mainWindow = null;
        })
        mainWindow.maximize()
    }

    app.on('ready', createWindow);

    app.on('window-all-closed', function() {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    })

    app.on('activate', function() {
        if (mainWindow === null) {
            createWindow();
        }
    })

})();
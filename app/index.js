(function() {
    const electron = require('electron');
    const fs = require('fs')
    const moment = require('moment')
    const app = electron.app;
    const BrowserWindow = electron.BrowserWindow;
    const globalShortcut = electron.globalShortcut;
    const ipc = electron.ipcMain
    const shell = electron.shell
    const { dialog } = require('electron')
    let mainWindow;
    const remote = require('electron').remote;
    const appPath = process.env.NODE_ENV === 'production' ? remote.app.getAppPath() : __dirname;

    const _isProduction = false;

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

        if (!_isProduction) {
            mainWindow.webContents.openDevTools();
        }

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

    ipc.on('print-to-pdf', function(event) {
        var d = new Date();
        var timeStamp = moment().format('YYYYMMDD-HHmm');
        const fileName = "relatorio" + timeStamp + '.pdf';
        let pdfPath = appPath + '/dist/relatorio.pdf';

        const win = BrowserWindow.fromWebContents(event.sender)

        win.webContents.printToPDF({
            marginsType: 0,
            printBackground: false,
            printSelectionOnly: false,
            landscape: false
        }, (error, data) => {
            fs.writeFile(pdfPath, data, (error) => {
                var savePath = dialog.showSaveDialog(win, {
                    title: fileName,
                    defaultPath: fileName
                }, function(result) {
                    if (!result) {
                        return;
                    }
                    let readStream = fs.createReadStream(pdfPath);
                    readStream.once('error', (err) => {
                        console.error(err);
                    });
                    readStream.once('end', () => {});
                    readStream.pipe(fs.createWriteStream(result));
                });
            })
        })
    })


})();
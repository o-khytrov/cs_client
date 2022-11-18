// Modules to control application life and create native browser window
const {
  app,
  ipcMain,
  dialog,
  BrowserWindow
} = require('electron')
const path = require('path')
const net = require('net');
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("log", (event, args) => {
  console.log(args);

})

ipcMain.on("request", (event, args) => {
  let client = new net.Socket();
  client.on('data', function (data) {
    mainWindow.webContents.send("response", {
      payload: data,
    });
    client.destroy();
  });
  client.connect(args.port, args.host, () => {
    var payload = args.payload
    var strData = `${args.user}\0${args.bot}\0${payload}\0`
    var data = Buffer.from(strData, 'utf8');
    client.write(data);
  })
});


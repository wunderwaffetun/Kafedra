const { app, Tray, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const xlsx = require('xlsx');
// tree /F
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}



const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'MAI_logo_contour_color.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true
    },
  });

  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));

  mainWindow.loadURL('http://localhost:8080')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

const headers = [
  '№ п/п', 'ФИО', 'Моб. телефон',
  'Взвод', 'Учебная группа', 'Ответственный оффицер',
  'Кафедра', 'Местонахождение анкеты', 'Примечание',
  'Признак двойного гражданства', 'Допуск оформлен',
];

ipcMain.handle('get-output-path-info', () => { // куда буду сохранять данные в зависимости от: в разработке или в сборке 
  let outputPath;

  if (app.isPackaged) {
    // Если приложение упаковано, путь будет рядом с .exe
    outputPath = path.join(path.dirname(process.execPath) );
  } else {
    // В режиме разработки
    outputPath = path.join(__dirname, 'files');
  }
  return {
    path: outputPath,
    isPackaged: app.isPackaged // Отправляем путь обратно в рендерер
  }
});

ipcMain.handle('move-admin-folder', async () => {
  try {
    const outputInfo = await ipcMain.invoke('get-output-path-info');
    const outputDir = outputInfo.path;
    const adminFolderPath = path.join(outputDir, 'resources', 'app', 'src', 'files', 'Администрирование');
    const newAdminFolderPath = path.join(outputDir, 'Администрирование');

    // Перемещаем папку
    fs.renameSync(adminFolderPath, newAdminFolderPath);
    console.log('Папка Администрирование перемещена в корень сборки.');
  } catch (error) {
    console.error("Ошибка при перемещении папки Администрирование:", error);
  }
});


ipcMain.on('backup-and-exit', (event, filename, data) => { // К сожалению из preload js нельзя сделать app.quit
  try {
    

    const filePath = path.join(__dirname, 'files', 'Backups', filename);
    const worksheet = xlsx.utils.aoa_to_sheet([headers, ...data.map(row => [...Object.values(row)])]);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Data');
    xlsx.writeFile(workbook, filePath);

    console.log(`Backup saved at ${filePath}`);
    app.quit(); // Завершаем приложение
  } catch (e) {
    console.error(`Error during backup and exit: ${e.message}`);
  }
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  const tray = new Tray(path.join(__dirname, 'MAI_logo_contour_color.png')); // Путь к иконке
  tray.setToolTip('ВУЦ МАИ');
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

module.exports = { headers }
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

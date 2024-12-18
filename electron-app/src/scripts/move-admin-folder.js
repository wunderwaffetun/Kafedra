// move-admin-folder.js
const fs = require('fs');
const path = require('path');

async function moveAdminFolder() {
  try {
    console.log(__dirname, '../', 'out', 'vuc_mai-win32-x64', 'resources', 'app', 'src', 'files', 'Администрирование')
    // Путь к папке "Администрирование" в resources
    const adminFolderPath = path.join(__dirname, '../', '../', 'out', 'vuc_mai-win32-x64', 'resources', 'app', 'src', 'files', 'Администрирование');
    const newAdminFolderPath = path.join(__dirname, '../', '../', 'out', 'vuc_mai-win32-x64', 'Администрирование');

    // Перемещаем папку
    fs.renameSync(adminFolderPath, newAdminFolderPath);
    console.log('Папка Администрирование перемещена в корень сборки.');
  } catch (error) {
    console.error("Ошибка при перемещении папки Администрирование:", error);
  }
}

moveAdminFolder();

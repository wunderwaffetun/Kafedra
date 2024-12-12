const { contextBridge, shell, ipcRenderer } = require('electron')
const { generateWordTable, createWordDocs } = require("./generateWord/wordgenerator");
const path = require('path')
const mammoth = require('mammoth')
const fs = require('fs')
const xlsx = require('xlsx');
const { electron } = require('process');




const saveExcelData = (filename, data) => {
  try { 
    const filePath = path.join(__dirname, 'files\\' + filename)
    const workbook = xlsx.readFile(filePath)
    const sheetName = workbook.SheetNames[0]

    // Первая строка — это заголовки, а все остальные данные — это данные
    const headers = ['№ п/п', 'ФИО', 'Моб. телефон', 
      'Взвод', 'Учебная группа', 'Ответственный оффицер', 
      'Кафедра', 'Местонахождение анкеты', 'Примечание', 
      'Признак двойного гражданства', 'Допуск оформлен'
    ]
    const dataWithHeaders = [headers,  ...data]

    // Создаем новый лист с данными и заголовками
    const newSheet = xlsx.utils.aoa_to_sheet(dataWithHeaders)

    // Записываем новый лист обратно в книгу
    workbook.Sheets[sheetName] = newSheet
    xlsx.writeFile(workbook, filePath);
    console.log(`File saved successfully: ${filePath}`);
    return true;

  } catch(e) {
    console.log(e)
    return false;
  }
}

const extractQuestionnairePlaces = async ( filename ) => { // загрузить данные о возожных местах расположения анкеты в React
  const filePath = path.join(__dirname, 'Администрирование', filename)
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const buffer = fs.readFileSync(filePath);
  try{
    const { value } = await mammoth.extractRawText({ buffer })
    const places = value.split('\n').map(line => line.trim()).filter( line => line !== '') 
    return places
  } 
  catch (e) {
    console.log(e)
  }
}

contextBridge.exposeInMainWorld('electron', {

  getExcelData: (filename) => {
    try {
      const workbook = xlsx.readFile(path.join(__dirname, 'files\\' + filename));
      const sheetName = workbook.SheetNames[0]; // Read the first sheet
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' }); // Convert to 2D array
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }, 

  saveExcelData,
  createWordDocs,
  extractQuestionnairePlaces,

  generateWordTable: async (groups, outputFilename) => {
    try {
      const outputPath = await generateWordTable(groups, outputFilename);
      return 'success'; // Возвращаем путь к созданному файлу
    } catch (error) {
      console.error("Ошибка при генерации Word-документа:", error);
      return 'error';
    }
  },

  openWordFile: (filename) => {
    filePath = path.join(__dirname, 'Администрирование', filename)
    try {
      shell.openPath(filePath)
      return true
    }
    catch (e) {
      console.log(e)
      return false
    }
  },

  backUpAndExit: async (filename, data) => {
    try {
      ipcRenderer.send('backup-and-exit', filename, data);
      
    } catch (e) {
      console.log(e)
      return false
    }
  }
})

// (async () => {
//   try {
//     // Получаем статус упаковки и путь через IPC
//     const [appIsPacked, rootPath] = await ipcRenderer.send('getStatusOfPacked');

//     console.log('App is packed:', appIsPacked);
//     console.log('Root path:', rootPath);

//     // Пример использования rootPath
//     const outputFilePath = path.join(rootPath, 'outputFile.txt');
//     console.log('File will be saved at:', outputFilePath);

//   } catch (error) {
//     console.error('Error fetching status:', error);
//   }
// })();
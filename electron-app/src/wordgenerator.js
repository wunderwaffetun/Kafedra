// const fs = require("fs");
// const path = require("path");
// const { app, ipcRenderer } = require('electron');
// const {
//   Document,
//   Packer,
//   Paragraph,
//   Table,
//   TableCell,
//   TableRow,
//   AlignmentType,
//   WidthType,
//   TextRun 
// } = require("docx");


// // Определяем путь для сохранения в зависимости от того, упаковано приложение или нет

// async function getOutputPathInfo() {
//   try {
//     const outputInfo = await ipcRenderer.invoke('get-output-path-info'); // Получаем путь от главного процесса
//     return outputInfo;
//   } catch (error) {
//     console.error("Ошибка при получении пути для сохранения:", error);
//     return null;
//   }
// }



// function createAllRows() {
//   const allRows = [];

//   allRows.push(
//     new TableRow({
//       children: [
//         new TableCell({ children: [new Paragraph("№ п/п")] }),
//         new TableCell({ children: [new Paragraph("Взвод")] }),
//         new TableCell({ children: [new Paragraph("Ф.И.О.")] }),
//         new TableCell({ children: [new Paragraph("Учебная группа")] }),
//         new TableCell({ children: [new Paragraph("Примечание")] }),
//       ],
//     })
//   );

//   return allRows
// }

// function createNewDoc(allRows) { // Создание документа каждого типа 
//   const table = new Table({
//     rows: allRows,
//     width: {
//       size: 100,
//       type: WidthType.PERCENTAGE,
//     },
//   });

//   return new Document({
//     creator: "Electron App",
//     title: "Сводная таблица групп",
//     description: "Документ с объединёнными таблицами групп",
//     sections: [
//       {
//         properties: {},
//         children: [table],
//       },
//     ],
//   });
// }

// async function saveFile(fileName, doc, timestamp) {
//   const outputInfo = await getOutputPathInfo()
//   const resPath = path.join(outputInfo.path, 'output', timestamp, fileName);
//     try {
//       const buffer = await Packer.toBuffer(doc);
//       fs.writeFileSync(resPath, buffer);
//       console.log(`Документ успешно сохранён: ${resPath}`);
//       return resPath;
//     } catch (err) {
//       console.error("Ошибка при сохранении документа:", err);
//       throw err;
//     }
// }

// const createWordDocs = async (data, docsNeeded) => {
//   const outputInfo = await getOutputPathInfo()
//   const now = new Date(); // Генерация папки с временем создания
//   const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1)
//     .toString()
//     .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}_${now
//     .getHours()
//     .toString()
//     .padStart(2, "0")}-${now.getMinutes().toString().padStart(2, "0")}`;

//   const dynamicFolderPath = path.join(outputInfo.path, 'output', timestamp);

  

  

//     // Создаём папку, если её ещё нет
//   if (!fs.existsSync(dynamicFolderPath)) {
//     fs.mkdirSync(dynamicFolderPath, { recursive: true });
//   }
  
//   if (docsNeeded["Список должников"]) { // Для каждого документа свой if
//     const grouped = new Map()
//     data.forEach(person => {
//       const { officer, squad, FIO, group, note } = person
//       if (!grouped.has(officer)) {
//         grouped.set(officer, [])
//       } 
//       grouped.get(officer).push({ squad, name: FIO, group, note: note.join(',')})
//     })
//     const groups = Array.from(grouped.entries()).map(([officer, members]) => ({
//       officer,
//       members,
//     }));
//     console.log('1')
//     const allRows = createAllRows()

//     groups.forEach((group) => {
//       // Добавляем строку с названием группы
//       allRows.push(
//         new TableRow({
//           children: [
//             new TableCell({
//               children: [
//                 new Paragraph({
//                   text: group.officer,
//                   alignment: AlignmentType.CENTER,
//                 }),
//               ],
//               columnSpan: 5, // Объединяем все столбцы
//             }),
//           ],
//         })
//       );
//     console.log('2')
      
//       // Добавляем строку с заголовками столбцов
    
  
//       // Добавляем строки с данными участников группы
//       group.members.forEach((member, index) => {
//         allRows.push(
//           new TableRow({
//             children: [
//               new TableCell({ children: [new Paragraph((index + 1).toString())] }),
//               new TableCell({ children: [new Paragraph(member.squad || "-")] }),
//               new TableCell({ children: [new Paragraph(member.name || "-")] }),
//               new TableCell({ children: [new Paragraph(member.group || "-")] }),
//               new TableCell({ children: [new Paragraph(member.note || "" )] }),
//             ],
//           })
//         );
//       });
//     });
//     console.log('3')

//     const listOfLeakedDocx = createNewDoc(allRows)
//     const result = await saveFile("Список должников.docx", listOfLeakedDocx, timestamp)
//     console.log(result)
    
//   }
//   if (docsNeeded["Список студентов с двойным граждантсвом"]) {

//     const list = data.filter( person => person.doubleCity )
//     console.log('4')


//     const allRows = createAllRows()

    
  
//       // Добавляем строку с заголовками столбцов
      
  
//       // Добавляем строки с данными участников группы
//     list.forEach((member, index) => {
      
//       allRows.push(
//         new TableRow({
//           children: [
//             new TableCell({ children: [new Paragraph((index + 1).toString())] }),
//             new TableCell({ children: [new Paragraph(member.squad || "-")] }),
//             new TableCell({ children: [new Paragraph(member.name || "-")] }),
//             new TableCell({ children: [new Paragraph(member.group || "-")] }),
//             new TableCell({ children: [new Paragraph(typeof member.note !== 'string' ? member.note.join(',') || "" : member.note)] }),
//           ],
//         })
//       );
//     });
//     console.log('5')
    

//     const listOfdoubleCity = createNewDoc(allRows)
//     const result = await saveFile("Список студентов с двойным граждантсвом.docx", listOfdoubleCity, timestamp)
//     console.log(result)
    
//   }
//   if (docsNeeded["Список в алфавитном порядке"]) {
//     const list = data.sort((a, b) => a.FIO.localeCompare(b.FIO))


//     const allRows = createAllRows()

    
  
//       // Добавляем строку с заголовками столбцов
      
  
//       // Добавляем строки с данными участников группы
//     list.forEach((member, index) => {
//       allRows.push(
//         new TableRow({
//           children: [
//             new TableCell({ children: [new Paragraph((index + 1).toString())] }),
//             new TableCell({ children: [new Paragraph(member.squad || "-")] }),
//             new TableCell({ children: [new Paragraph(member.FIO || "-")] }),
//             new TableCell({ children: [new Paragraph(member.group || "-")] }),
//             new TableCell({ children: [new Paragraph(member.note || "")] }),
//           ],
//         })
//       );
//     });
    

//     const result = await saveFile("Список в алфавитном порядке.docx", createNewDoc(allRows), timestamp)
//   }
//   if (docsNeeded["Список по группам"]) {
//   }
//   if (docsNeeded["Список по группам в алфавитном порядке"]) {
//   }
//   if (docsNeeded["Список студентов с оформленным допуском"]) {
//   }


  
//   return false
// }


// module.exports = { createWordDocs };

const fs = require("fs");
const path = require("path");
const { app, ipcRenderer } = require('electron');
const { Document, Packer, Table, TableCell, TableRow, AlignmentType, WidthType, Paragraph, HeadingLevel } = require("docx");

// Получение пути для сохранения
async function getOutputPathInfo() {
  try {
    const outputInfo = await ipcRenderer.invoke('get-output-path-info');
    return outputInfo;
  } catch (error) {
    console.error("Ошибка при получении пути для сохранения:", error);
    return null;
  }
}

function generateCurrentTime() { 
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}_${now.getHours().toString().padStart(2, "0")}-${now.getMinutes().toString().padStart(2, "0")}`;
}
// Создание строк с заголовками таблицы
function createHeaderRow() {
  return new TableRow({
    children: [
      new TableCell({ children: [new Paragraph("№ п/п")] }),
      new TableCell({ children: [new Paragraph("Взвод")] }),
      new TableCell({ children: [new Paragraph("Ф.И.О.")] }),
      new TableCell({ children: [new Paragraph("Учебная группа")] }),
      new TableCell({ children: [new Paragraph("Примечание")] }),
    ],
  });
}

// Функция для добавления данных в таблицу
function createTableRows(data, startIndex = 0) {
  const rows = []; // Массив для строк таблицы
  let stopIndex = startIndex; // Устанавливаем начальный индекс

  data.forEach((member, index) => {
    rows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph((stopIndex + 1).toString())] }), // Нумерация с использованием stopIndex
          new TableCell({ children: [new Paragraph(member.squad || "")] }),
          new TableCell({ children: [new Paragraph(member.FIO || "")] }),
          new TableCell({ children: [new Paragraph(member.group || "")] }),
          new TableCell({ children: [new Paragraph("")] }),
        ],
      })
    );
    stopIndex++; // Увеличиваем индекс для следующего члена
  });

  return { rows, stopIndex }; // Возвращаем обновлённые строки и новый stopIndex
}


// Создание документа
function createDocument(tableRows, pageTitle) {
  const table = new Table({
    rows: tableRows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });

  const date = generateCurrentTime().substring(0, 10).split("-")

  return new Document({
    creator: "Electron App",
    title: "Сводная таблица групп",
    description: "Документ с объединёнными таблицами групп",
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: `${pageTitle} ${date[2]}.${date[1]}.${date[0]}`,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER, // Центрирование текста
            spacing: {
              after: 200, // Отступ после параграфа (200 = 0.2 inch)
            },
          }),
          table
        ],
      },
    ],
  });
}

// Сохранение документа
async function saveFile(fileName, doc, timestamp) {
  const outputInfo = await getOutputPathInfo();
  if (!outputInfo) return;

  const resPath = path.join(outputInfo.path, 'output', timestamp, fileName);
  try {
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(resPath, buffer);
    console.log(`Документ успешно сохранён: ${resPath}`);
    return resPath;
  } catch (err) {
    console.error("Ошибка при сохранении документа:", err);
    throw err;
  }
}

// Функция для создания всех необходимых документов
async function createWordDocs(data, docsNeeded) {
  const outputInfo = await getOutputPathInfo();
  if (!outputInfo) return;

  const timestamp = generateCurrentTime()
  
  const dynamicFolderPath = path.join(outputInfo.path, 'output', timestamp);

  if (!fs.existsSync(dynamicFolderPath)) {
    fs.mkdirSync(dynamicFolderPath, { recursive: true });
  }

  if (docsNeeded["Список должников"]) {
    const grouped = data.reduce((acc, person) => {
      const { officer, squad, FIO, group, note } = person;
      if (!acc[officer]) acc[officer] = [];
      acc[officer].push({ squad, FIO, group, note: note.join(',') });
      return acc;
    }, {});

    let currentIndex = 0

    const allRows = [createHeaderRow()];
    Object.entries(grouped).forEach(([officer, members]) => {
      allRows.push(new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({ text: officer, alignment: AlignmentType.CENTER }),
            ],
            columnSpan: 5,
          }),
        ],
      }));
      const { rows, stopIndex } = createTableRows(members, currentIndex)
      allRows.push( ...rows );
      currentIndex = stopIndex
    });

    const doc = createDocument(allRows, "Список студентов - должников для оформления допуска  по форме N3 на ");
    await saveFile("Список должников.docx", doc, timestamp);
  }

  if (docsNeeded["Список студентов с двойным граждантсвом"]) {
    const list = data.filter(person => person.doubleCity);
    const { rows } = createTableRows(list)
    const allRows = [createHeaderRow(), ...rows];

    const doc = createDocument(allRows, "Список студентов с двойным гражданством на ");
    await saveFile("Список студентов с двойным граждантсвом.docx", doc, timestamp);
  }

  if (docsNeeded["Список студентов с оформленным допуском"]) {
    console.log(data)
    const list = data.filter(person => person.allowance);
    const { rows } = createTableRows(list)
    const allRows = [createHeaderRow(), ...rows];

    const doc = createDocument(allRows, "Список студентов с оформленным допуском на ");
    await saveFile("Список студентов с оформленным допуском.docx", doc, timestamp);
  }

  if (docsNeeded["Список в алфавитном порядке"]) {
    const list = data.sort((a, b) => a.FIO.localeCompare(b.FIO));
    const { rows } = createTableRows(list)
    const allRows = [createHeaderRow(), ...rows];

    const doc = createDocument(allRows, "Список студентов подлежащих к оформлению допуска по форме N 3 расположенных в алфавитном порядке на ");
    await saveFile("Список в алфавитном порядке.docx", doc, timestamp);
  }


  // Добавьте другие документы по аналогии
  return dynamicFolderPath;
}

module.exports = { createWordDocs };

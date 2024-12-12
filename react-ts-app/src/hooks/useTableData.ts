import { useState, useEffect, useRef } from 'react';
import { TableRow } from '../types';
import { useElectronAPI } from '../hooks/useElectronAPI'


//Кастомынй хук, задающий основные хуки приложения и преобразующий входные от бэка 

export const useTableData = () => {
  const [data, setData] = useState<TableRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null); // Отображение редактируемой строки
  const [editedRow, setEditedRow] = useState<TableRow | null>(null); // Хранение изменяемых данных
  const [currentPlace, setCurrentPlace] = useState<string>("Выберите..."); 
  const [currentNote, setCurrentNote] = useState<string>(''); 
  const [isSaveTriggered, setIsSaveTriggered] = useState<boolean>(false);
  // const [isExcelClosedTrigger, setIsExcelClosedTrigger ] = useState<boolean>(false)
  const startData = useRef<TableRow[]>([])
  const [saveExcelResult, setSaveExcelResult] = useState<{[key: string]: boolean | null}>({'result': null})
  const saveFileName: string = 'DB\\Тест 1.xlsx'
  const { isElectronAvailable, handleLoadData, handleSaveData, extractQuestionnairePlaces} = useElectronAPI()
  const QuestionnairePlaces = useRef<string[]>([])

  useEffect(() => { // Загрузка вариантов местонахождения анкеты 
    //remove this test
    extractQuestionnairePlaces('Варианты местонахождения анкеты.docx')
      .then(result => QuestionnairePlaces.current = ["Выберите...", ...result])
  }, [])

  useEffect(() => {
    
    handleLoadData(saveFileName)
      .then(result => {
        return result.filter((item: any[], i: number) => i !== 0)
      }) // Убираем строку заголовка
      .then(arr => {
        const transformedData = arr.map((row: any[], i: number) => {
          let [id, FIO, mobile, squad, group, officer, kafedra, questionnairePlace, note, doubleCity, allowance] = row;
          questionnairePlace = questionnairePlace.split(';')
          note = note.split(';')
          // Преобразуем строку в объект типа TableRow
          const tableRow: TableRow = {
            id: i + 1,
            FIO: FIO ?? '',
            mobile: mobile ?? '',
            squad: squad ?? '',
            group: group ?? '',
            officer: officer ?? '',
            kafedra: kafedra ?? '',
            questionnairePlace: Array.isArray(questionnairePlace) ? questionnairePlace : (questionnairePlace ? [questionnairePlace] : []),
            note: Array.isArray(note) ? note : (note ? [note] : []),
            doubleCity: doubleCity ?? false,
            allowance: allowance ?? false,
          };

          return tableRow;
        });

        setData(transformedData); // Сохраняем преобразованные данные
        startData.current = transformedData; // Обновляем начальные данные

        handleSaveData(saveFileName, transformedData) // использую, чтобы обновить id в excel, чтобы были уникальными
          .then( result => {console.log(result)})
      })
      .catch(error => console.error('Error loading Excel data:', error));
  }, [isElectronAvailable]);  // Load data only when Electron API is available

  useEffect(() => {
    if (isSaveTriggered && editedRow) {
      const updatedData = startData.current.map((row) => (row.id === editedRow.id ? editedRow : row));
      startData.current = updatedData
      handleSaveData(saveFileName, updatedData) // использую, чтобы обновить id в excel, чтобы были уникальными
          .then( result => { 
            // setIsExcelClosedTrigger(prev => !prev) // Если excel открыт будет срабатывать триггер, который меняет своё состояние
            setSaveExcelResult({'result': result}) // result = true 
          })
          .catch(() => {
            setSaveExcelResult({'result': false})
          })
          
      setIsSaveTriggered(false)
    }
  }, [isSaveTriggered]);


  return {
    data,
    setData,
    startData, 
    editedRow,
    selectedRow,
    setSelectedRow,
    setEditedRow,
    currentPlace,
    setCurrentPlace,
    currentNote,
    setCurrentNote,
    isSaveTriggered,
    // isExcelClosedTrigger,
    saveExcelResult,
    setIsSaveTriggered,
    QuestionnairePlaces
  };
};
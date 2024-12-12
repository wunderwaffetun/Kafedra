import React, { useState, useEffect } from "react"
import { TableRow } from '../types'


const getNow = (): string => {
  const date = new Date
  const nowDate = ((date.getDate() < 10)?"0":"") + date.getDate() +"-"+(((date.getMonth()+1) < 10)?"0":"") + (date.getMonth()+1) +"-"+ date.getFullYear();
  const nowTime = ((date.getHours() < 10)?"0":"") + date.getHours() +"-"+ ((date.getMinutes() < 10)?"0":"") + date.getMinutes() +"-"+ ((date.getSeconds() < 10)?"0":"") + date.getSeconds()
  return `${nowDate}@${nowTime}.xlsx`
}

interface member {
  squad: string, 
  name: string, 
  group: string, 
  note: string

}

interface Group { 
officer: string, 
members: member[]
}

const dataFormatToSave = (data: TableRow[]): (string | number | boolean | undefined)[][] => {
  return data.map(row =>
    Object.values(row).map(item => {
      if (Array.isArray(item)) {
        return item.join(';'); // Преобразование массивов в строки
      }
      return item; // Возвращаем значение как есть
    })
  );
}

export const useElectronAPI = (): {
  isElectronAvailable: boolean;
  handleLoadData: (filename: string) => Promise<any[][]>;
  handleSaveData: (filename: string, data: TableRow[]) => Promise<boolean>;
  handleOpenWordFile: (filename: string) => Promise<boolean>;
  backUpAndExit: (data: TableRow[]) => Promise<boolean>;
  // writeListOfLeaked: (data: TableRow[]) => Promise<void>;
  createWordDocs: (data: TableRow[], docsNeeded: {[key: string]: boolean}) => Promise<boolean>; 
  extractQuestionnairePlaces: (filname: string) => Promise<string[]>
} => {
  const [isElectronAvailable, setIsElectronAvailable] = useState(false);

  const handleLoadData = async (filename: string): Promise<any[][]> => {
    return await window.electron.getExcelData(filename);
  };

  

  const handleSaveData = async (filename: string, data: TableRow[]): Promise<boolean> => {
    return await window.electron.saveExcelData(filename, dataFormatToSave(data));
  };

  const handleOpenWordFile = async (filename: string): Promise<boolean> => {
    return window.electron.openWordFile(filename)
  }

  const backUpAndExit = async (data: TableRow[]): Promise<boolean> => {
    return window.electron.backUpAndExit(getNow(), dataFormatToSave(data))
  }

  const createWordDocs = async (data: TableRow[], docsNeeded: {[key: string]: boolean}): Promise<boolean> => {
    console.log(data)
    return window.electron.createWordDocs(data, docsNeeded)
  }

  const extractQuestionnairePlaces = async (filename: string): Promise<string[]> => {
    return window.electron.extractQuestionnairePlaces(filename)
  }

  

  useEffect(() => {
    if (window.electron) {
      setIsElectronAvailable(true);
      console.log('Electron API is available ');
    } else {
      console.error('Electron API is not available');
    }
  }, []);

  return {
    isElectronAvailable,
    handleLoadData,
    handleSaveData,
    handleOpenWordFile,
    createWordDocs,
    backUpAndExit, 
    // writeListOfLeaked
    extractQuestionnairePlaces
  };
};

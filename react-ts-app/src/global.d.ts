
interface Window {
  electron: {
    // loadFromExcel: (filePath: string) => Promise<string[][]>;
    // saveToExcel: (data: string[][], filePath: string) => Promise<string | null>;
    getFileNames: () => any
    getExcelData: (filename: string) => Promise<any[][]>
    saveExcelData: (filename: string, data: TableRow[]) => Promise<boolean>
    // generateWordTable: (groups: Array, outputFilename: string) => Promise<String>
    createWordDocs: (data: TableRow[], docsNeeded: {[key: string]: boolean}) => Promise<boolean>
    openWordFile: (filename: string) => Promise<boolean>
    backUpAndExit: (time: string, data: TableRow[]) => Promise<boolean>
    extractQuestionnairePlaces: (filename: string) => Promise<string[]>
  };
}
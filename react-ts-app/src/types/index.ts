// export enum QuestionnairePlaces {
//   "Выберите..." = "Выберите...",
//   "Получена от отв-го оффицера" = "Получена от отв-го оффицера",
//   "Получена от студента" = "Получена от студента",
//   "Получена из ГАК" = "Получена из ГАК",
//   "Передана Марине Игоревне" = "Передана Марине Игоревне",
//   "Передана Иванову М.А." = "Передана Иванову М.А.",
//   "Передана ответ-ному офицеру" = "Передана ответ-ному офицеру",
//   "Передана студенту" = "Передана студенту",
//   "Передана в 3 отдел" = "Передана в 3 отдел",
//   "В проекте приказа" = "В проекте приказа",
//   "Иное" = "Иное",
// }


export type TableRow = {
  id: number | string;
  FIO: string;
  mobile: number | string;
  squad: string;
  officer: string;
  group: string;
  kafedra: string;
  questionnairePlace:  string[]; // string нужен, чтобы хранить в excel
  note: string[];
  doubleCity: boolean | undefined; 
  allowance: boolean  | undefined;
};


// export const testData: TableRow[] = [
//   { id: 1, FIO: 'Иванов Антон Сергеевич', mobile: '', squad: '', officer: '', group: '', kafedra: '', questionnairePlace: [], note: [], doubleCity: false, allowance: false },
//   { id: 4, FIO: 'Иванов Сергей Сергеевич', mobile: '', squad: '', officer: '', group: '', kafedra: '', questionnairePlace: [], note: [], doubleCity: false, allowance: false },

//   { id: 2, FIO: 'Петров Данила Владимирович', mobile: '', squad: '', officer: '', group: '', kafedra: '', questionnairePlace: [], note: [], doubleCity: false, allowance: false },
//   { id: 3, FIO: 'Сидоров Василий Константинович', mobile: '', squad: '', officer: '', group: '', kafedra: '', questionnairePlace: [], note: [], doubleCity: false, allowance: false }
// ];
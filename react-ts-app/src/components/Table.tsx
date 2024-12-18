import React, { useState, useEffect, useRef } from 'react';
import {  TableRow } from '../types';
import { useTableData } from '../hooks/useTableData'
import { Searcher } from './Searcher';
import { EditControls } from './EditControls';
import { MovementOfChange } from './MovementOfChange';
import { NoteShow } from './NoteShow';
import { Toast } from './Toast';
import { Modal } from './Modal'
import { Header } from './Header';




const Table: React.FC = () => {
  const { data, setData, startData, selectedRow, setSelectedRow, editedRow, setEditedRow, currentPlace, setCurrentPlace, currentNote, setCurrentNote, saveExcelResult, setIsSaveTriggered, QuestionnairePlaces} = useTableData()
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number | null>(null)

  const searcherSaveRef = useRef<string>('')

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  
  
  // Обработчик клика на строку
  const handleRowClick = (row: TableRow) => {
    setScrollPosition(window.scrollY)
    setSelectedRow(row);
    setEditedRow({ ...row });
  };

  // Обработчик изменения значений в редактируемой строке
  


  // Сохранение отредактированной строки
  const handleSave = () => {
    if (editedRow) {

      setEditedRow({
        ...editedRow,
        questionnairePlace: editedRow.questionnairePlace ? (currentPlace !== "Выберите..." ? [...editedRow.questionnairePlace, currentPlace] : [...editedRow.questionnairePlace]) //если выбрано место, оно сохраняется, если нет, не сохраняется
                                                        : [currentPlace],
        note: currentNote.length === 0 ? [...editedRow.note] : [...editedRow.note, currentNote]
      })
      setIsSaveTriggered(true); // чтобы useEffect вызывался только при сохранении 
      setCurrentNote('')
      setCurrentPlace(QuestionnairePlaces.current[0])

      // setSelectedRow(null); // Скрыть редактируемую строку после сохранения
    }
  };

  const handlePlaceDelete = (index: number, field: 'note' | 'questionnairePlace') => {
    if(editedRow){
      setEditedRow({
        ...editedRow, 
        [field]: editedRow[field].filter( (place, i) => i != index)
      })
    }
  }


  // Отмена редактирования
  const handleCancel = () => {
    setEditedRow(null);
    setSelectedRow(null); // Скрыть редактируемую строку
    
  };

  useEffect(() => { // Скролл по выходе из редактируемого элемента
    if(selectedRow === null && scrollPosition !== null) {
      window.scrollTo({
        top: scrollPosition,
        behavior: 'instant'
      });
    }
  }, [selectedRow])

  return (
    <div className=''>
      <Header data={data} setData={setData} startData={startData} handleOpenModal={handleOpenModal} editedRow={editedRow} searcherSaveRef={searcherSaveRef}  />
      
      <table className="table table-light table-striped table-hover table-bordered" style={{position: 'relative', top: "50px"}}>
        <thead>
          <tr>
            <th scope="col">№ п/п</th>
            <th scope="col">ФИО</th>
            <th scope="col">Моб. телефон</th>
            <th scope="col">Взвод</th>
            <th scope="col">Учебная группа</th>
            <th scope="col">Ответственный офицер</th>
            <th scope="col">Кафедра</th>
            <th scope="col">Местонахождение анкеты</th>
            <th scope="col">Примечание</th>
            {
              selectedRow === null ? null : (
                <>
                  <th scope="col">Признак двойнгого гражданства</th>
                  <th scope="col">Допуск оформлен</th>
                </>
              )
            }
          </tr>
        </thead>
        <tbody>
          {/* Отображаем только выбранную строку */}
          {selectedRow === null ? (
            data.map((row) => (
              <tr key={row.id} onClick={() => handleRowClick(row)}>
                <th scope="row">{row.id}</th>
                <td style={{color: row.allowance ? 'green': (row.doubleCity ? 'red' : ''), fontWeight:  row.allowance ? '800': (row.doubleCity ? '800' : 'inherit')}}>{row.FIO}</td>
                <td>{row.mobile ? row.mobile : 'N/A'}</td>
                <td>{row.squad ? row.squad : 'N/A'}</td>
                <td>{row.group ? row.group : 'N/A'}</td>
                <td>{row.officer ? row.officer : 'N/A'}</td>
                <td>{row.kafedra ? row.kafedra : 'N/A'}</td>
                <td>{row.questionnairePlace ? row.questionnairePlace[row.questionnairePlace.length - 1] : 'N/A'}</td>
                <td>{row.note ? row.note[row.note.length - 1] : 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <th scope="row">{selectedRow.id}</th>
              <EditControls
                editedRow={editedRow}
                setEditedRow={setEditedRow}
                currentPlace={currentPlace}
                setCurrentPlace={setCurrentPlace}
                currentNote={currentNote}
                setCurrentNote={setCurrentNote}
                setIsSaveTriggered={setIsSaveTriggered}
                QuestionnairePlaces={QuestionnairePlaces}
              />
            </tr>
          )}
        </tbody>
      </table>

      {
        editedRow && (
          <div style={{position: "relative", top: "50px"}}>
            <div className='d-flex align-items-center flex-column' >
              <MovementOfChange editedRow={editedRow} handlePlaceDelete={handlePlaceDelete} />
              <NoteShow editedRow={editedRow} handlePlaceDelete={handlePlaceDelete} />
            </div>
            <div className='d-flex justify-content-center mt-2'>
              <button onClick={handleSave} className="btn btn-success me-1">Сохранить</button>
              <button onClick={handleCancel} className="btn btn-secondary">Назад</button>
            </div>
          </div>
        )
      }
      
     

      <Toast  saveExcelResult={saveExcelResult} />
      
      {/* <GenerateDocument /> */}
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} data={data} />
      
    </div>
  );
};

export default Table;

// По нажатии на элемент таблицы на главном экране появится это поле редакирования 

import React from 'react';
import { TableRow } from '../types';

interface EditControlsProps {
  editedRow: TableRow | null;
  setEditedRow: React.Dispatch<React.SetStateAction<TableRow | null>>;
  currentPlace: string;
  setCurrentPlace: React.Dispatch<React.SetStateAction<string>>;
  currentNote: string;
  setCurrentNote: React.Dispatch<React.SetStateAction<string>>;
  setIsSaveTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  QuestionnairePlaces: React.MutableRefObject<string[]>
}



export const EditControls: React.FC<EditControlsProps> = ({
  editedRow,
  setEditedRow,
  currentPlace,
  setCurrentPlace,
  currentNote,
  setCurrentNote,
  QuestionnairePlaces
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof TableRow) => {
    if (editedRow) {
        setEditedRow({
          ...editedRow,
          [field]: e.target.value || null, // Если значение пустое, присваиваем null
        });
    }
  };

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof TableRow) => {
    if (editedRow) {
      setEditedRow({
        ...editedRow,
        ['allowance']: false,
        ['doubleCity']: false,
        [field]: !editedRow[field]

        } // Если значение пустое, присваиваем null
      )
    }
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof TableRow) => {
    if (editedRow) {
      const cNote = e.target.value as string
      setCurrentNote(cNote)
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, field: keyof TableRow) => {
    if (editedRow) {
      const selectedPlace = e.target.value as string
      setCurrentPlace(selectedPlace)
      
    }
  };

  return (
    <>
      <td>
                <label> {editedRow?.FIO || ''}</label>
              </td>
              <td>
                <input
                  type="text"
                  value={editedRow?.mobile || ''}
                  onChange={(e) => handleInputChange(e, 'mobile')}
                />
              </td>
              <td>
                <label> {editedRow?.squad || ''}</label>
              </td>
              <td>
                <label > {editedRow?.group || ''} </label>
              </td>
              <td>
                <input
                  type="text"
                  value={editedRow?.officer || ''}
                  onChange={(e) => handleInputChange(e, 'officer')}
                />
              </td>
              <td>
                <label>{editedRow?.kafedra || ''}</label>
              </td>
              <td>
                
                <select 
                  value={currentPlace as string}
                  onChange={(e) => handleSelectChange(e, 'questionnairePlace')}
                  className="form-select form-select-sm" aria-label="Small select example"
                >
                  {Object.values(QuestionnairePlaces.current).map((place) => (
                    <option key={place} value={place}>
                      {place}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={currentNote}
                  onChange={(e) => handleNoteChange(e, 'note')}
                />
              </td>
              <td>
                <input 
                  onChange={(e) => handleCheckBoxChange(e, 'doubleCity')}
                  className="form-check-input" type="checkbox" value="" checked={editedRow?.doubleCity} id="defaultCheck1" 
                />
              </td>
              <td>
                <input 
                  onChange={(e) => handleCheckBoxChange(e, 'allowance')}
                  className="form-check-input" type="checkbox" checked={editedRow?.allowance} id="defaultCheck2" 
                />
              </td>
    </>
  )
}
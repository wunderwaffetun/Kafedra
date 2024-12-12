import React from "react";
import {  TableRow } from "types";

interface NoteShowProps {
  editedRow: TableRow, 
  handlePlaceDelete: (index: number, field: 'note' | 'questionnairePlace') => void
}

export const NoteShow: React.FC<NoteShowProps> = ({editedRow, handlePlaceDelete}) => {
  return (
    <>
      <div className=' fs-3'>
        Примечание
      </div>
      <div className='vstack gap-3 fs-5'>
        {
          editedRow.note.length === 0 ? "Примечаний нет" : editedRow.note.map( (place, i) => {
            return (
              <div className='d-flex justify-content-center'>
                <div>
                  {i + 1}. {place}
                </div>
                <button
                  onClick={ () => { handlePlaceDelete(i, 'note')} }
                  type="button" 
                  className="btn btn-danger align-middle"
                  style={{maxHeight: "24px", maxWidth: "50px", fontSize: "8px", marginLeft: "5px", marginTop: "5px"}}
                >удалить</button>
              </div>
            )
          } )
        }
      </div>
    </>
  )
}
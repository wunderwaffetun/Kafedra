import React from "react";
import {  TableRow } from "types";

interface MovementOfChangeProps {
  editedRow: TableRow, 
  handlePlaceDelete: (index: number, field: 'note' | 'questionnairePlace') => void
}

export const MovementOfChange: React.FC<MovementOfChangeProps> = ({editedRow, handlePlaceDelete}) => {
  return (
    <>
      <div className=' fs-3'>
        Движение изменений
      </div>
      <div className='vstack gap-3 fs-5'>
        {
          editedRow.questionnairePlace.length === 0  ? "Изменений нет" : editedRow.questionnairePlace.map( (place, i) => {
            return (
              <div className='d-flex justify-content-center' key={i}>
                <div>
                  {i + 1}. {place}
                </div>
                <button
                  onClick={ () => { handlePlaceDelete(i, 'questionnairePlace')} }
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
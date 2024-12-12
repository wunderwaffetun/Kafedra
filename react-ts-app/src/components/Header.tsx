import React from 'react'
import { TableRow } from '../types'
import { Searcher } from './Searcher'
import { useElectronAPI } from '../hooks/useElectronAPI'

interface Header { 
  data: TableRow[], 
  setData: React.Dispatch<React.SetStateAction<TableRow[]>>,
  startData: React.RefObject<TableRow[]>,
  handleOpenModal: () => void,
  editedRow: TableRow | null
}



export const Header: React.FC<Header> = ({data, setData, startData, handleOpenModal, editedRow }) => {
  const {handleOpenWordFile, backUpAndExit} = useElectronAPI()

  

  return (
    <>
      {!editedRow ? (
      <div className='d-flex position-fixed' style={{width: '100vw', zIndex: 10, backgroundColor: 'white', padding: "0 10px "}}>
        <Searcher data={data} setData={setData} startData={startData.current ?? []} />
        <button className="btn btn-primary mb-3 mt-1" style={{height: "40px", marginLeft: "10px "}} onClick={handleOpenModal}>
          Режим экспорта
        </button>
        <button className="btn btn-secondary mb-3 mt-1" style={{height: "40px", marginLeft: "10px"}} onClick={() => {handleOpenWordFile('Инструкция.docx')}}>
          Инструкция
        </button>
        <button className="btn btn-secondary mb-3 mt-1" style={{height: "40px", marginLeft: "10px"}} onClick={() => {handleOpenWordFile('список телефонов ППС по кафедрам 2024.doc')}}>
          Контакты
        </button>
        <button className="btn btn-secondary mb-3 mt-1" style={{height: "40px", marginLeft: "10px"}} onClick={() => {handleOpenWordFile('Варианты местонахождения анкеты.docx')}}>
          Варианты местонахождения
        </button>
        <button className="btn btn-secondary mb-3 mt-1" style={{height: "40px", position: "absolute", right: "22px" }} onClick={() => {backUpAndExit(data)}}>
          Выход
        </button>
      </div>
    ) : (
      <div className="d-flex justify-content-center mb-2 fs-3">История студента</div>
    )}
    </>
  )
}

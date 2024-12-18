import React, { useEffect, useState } from "react";

import { TableRow } from "types";
import { useElectronAPI } from "../hooks/useElectronAPI";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TableRow[]
}

interface CheckBoxes {
  [key: string]: boolean;
}

const checkboxInitial: CheckBoxes = { 
  "Список должников": false, 
  "Список студентов с двойным граждантсвом": false, 
  "Список в алфавитном порядке": false, 
  "Список студентов с оформленным допуском": false
}


export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
  const [checkBoxes, setCheckBoxes ] = useState<CheckBoxes>(checkboxInitial)
  const { createWordDocs, handleOpenWordFile } = useElectronAPI()
  

  const handleExport = async (): Promise<void> => {
    console.log('1')
    const result = await createWordDocs(data, checkBoxes)
    const dirpath = result.split("\\").at(-1)
    console.log('2')

    Object.entries(checkBoxes).forEach( (checkBox) => {
      const [key, value] = checkBox; 
      if(value) {
        handleOpenWordFile(`../output/${dirpath}/${key}.docx`)
      }
    } )
    console.log('3')

  }

  const handleSelectAll = () => {
    // Проверяем, выбраны ли все чекбоксы
    const allSelected = Object.values(checkBoxes).every((value) => value);
    
    // Если все выбраны, снимаем выбор, иначе выбираем все
    const updatedCheckBoxes = Object.fromEntries(
      Object.entries(checkBoxes).map(([key]) => [key, !allSelected])
    );
    
    setCheckBoxes(updatedCheckBoxes);
  };

  const handleCheckboxChange = (key: string) => {
    setCheckBoxes((prev) => ({
      ...prev,
      [key]: !prev[key], // Переключаем значение конкретного чекбокса
    }));
  };

  useEffect(() => {
    const modal = document.getElementById("modal");
    if (isOpen) {
      modal?.classList.add("show");
      modal?.classList.add("fade");
      document.body.style.overflow = "hidden"; // Блокирует скролл страницы
    } else {
      modal?.classList.remove("show");
      modal?.classList.remove("fade");
      document.body.style.overflow = ""; // Возвращает скролл
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal fade"
        id="modal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden={!isOpen}
        style={{ display: "block" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Режим экспорта</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="checkboxes-modall">
                {
                  Object.keys(checkBoxes).map((key) => (
                    <div className="form-check" style={{fontSize: '14px'}} key={key}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={key}
                        checked={checkBoxes[key]}
                        onChange={() => handleCheckboxChange(key)}
                      />
                      <label className="form-check-label" htmlFor={key}>
                        {key}
                      </label>
                    </div>
                  ))
                }
              </div>
              <div className="modal-buttonss">

              </div>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <div className="d-flex">
                <button
                    type="button"
                    className="btn btn-primary me-1 "
                    onClick={() => {handleExport()}}
                  >
                    Экспорт
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {handleSelectAll()}}
                  >
                    Выбрать всё
                </button>
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Закрыть
              </button>
              
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal-backdrop fade ${isOpen ? "show" : ""}`}
        style={{ position: "fixed", inset: "0", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      ></div>
    </>
  );
};

// const CheckBox: React.FC = () => {
//   return 
// }
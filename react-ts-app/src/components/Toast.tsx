import React, { useEffect, useState } from 'react';

export const Toast: React.FC<{saveExcelResult: {[key: string]: boolean | null}}> = ({saveExcelResult}) => {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [message, setMessage] = useState<Array<String>>([]);

  useEffect(() => {
      if(saveExcelResult.result !== null ) {
        setShowToast(true); // Показываем Toast
        setMessage(saveExcelResult.result ? ['Успех', 'Изменения сохранены', 'Excel обновлён'] : ['Ошибка', "Ошибка сохранения файла", "Закройте Excel"]);
        const timer = setTimeout(() => setShowToast(false), 3000); // Автоматически скрываем через 3 секунды
        return () => clearTimeout(timer); // Чистим таймер при размонтировании
      }
      
  }, [saveExcelResult]);

  return (
    <div>
      {/* Остальной ваш код */}
      {showToast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: '11' }}>
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">{message[0]}</strong>
              <small>{message[1]}</small>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={() => setShowToast(false)} // Скрываем при нажатии кнопки
              ></button>
            </div>
            <div className="toast-body">{message[2]}</div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { TableRow } from '../types';

interface TableRowProps {
  row: TableRow;
  onClick: () => void;
}

export const TableRowComponent: React.FC<TableRowProps> = ({ row, onClick }) => {
  console.log(row.group)
  return (
    <tr onClick={onClick}>
      <th scope="row">{row.id}</th>
      <td>{row.FIO}</td>
      <td>{row.mobile ? row.mobile : 'N/A'}</td>
      <td>{row.squad || 'N/A '}</td>
      <td>{row.group || 'N/A'}</td>
      <td>{row.officer || 'N/A'}</td>
      <td>{row.kafedra || 'N/A'}</td>
      <td>{row.questionnairePlace.length > 0 ? row.questionnairePlace.join(', ') : 'N/A'}</td>
      <td>{row.note.length > 0 ? row.note.join(', ') : 'N/A'}</td>
      <td>{row.doubleCity ? 'Да' : 'Нет'}</td>
      <td>{row.allowance ? 'Да' : 'Нет'}</td>
    </tr>
  );
};
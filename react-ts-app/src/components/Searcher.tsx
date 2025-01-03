import { useEffect, useRef, useState } from "react";
import React from "react";
import { TableRow } from '../types';

interface props {
  data: TableRow[], 
  setData: (data: TableRow[])=> void, 
  startData: TableRow[], 
  searcherSaveRef: React.MutableRefObject<string>
} 

export const Searcher: React.FC<props> = ({data, setData, startData, searcherSaveRef}) => {
  const [value, setValue] = useState<string>('')

  useEffect(() => {
    if (searcherSaveRef.current) {
      setValue(searcherSaveRef.current)
    }
  }, [])

  const searcherHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  useEffect(() => {
    const filteredData = startData.filter(item => 
      item.FIO.split(" ")[0].toLowerCase().includes(value.toLowerCase()) || 
      item.note.join(',').toLowerCase().includes(value.toLocaleLowerCase()) ||
      item.squad.toLowerCase().includes(value.toLocaleLowerCase())
    );
    searcherSaveRef.current = value
    setData(filteredData); 
  }, [value])


  return (
    <div className="input-group mb-3 mt-1 w-25">
      <input 
        onChange={(e) => searcherHandler(e)} 
        value={value} 
        type="text" 
        className="form-control" 
        placeholder="Поиск (по фамилии)" 
        aria-label="Recipient's username" 
        aria-describedby="button-addon2"
      />
    </div>
  )
}


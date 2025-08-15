'use client'
import { useState } from 'react';

import './modalcreatefolder.css'
export default function ModalCreateFolder(props) {

  const { getnewfolderinputvalue, changeOpen } = props;

  const [newfolderinpuvalue, setnewfolderinputvalue] = useState('');


  const onClickoutside = (e) => {
    if (e.target.className === 'modalouterdiv') {
      changeOpen(false);
    }
  }


  const onSubmit = () => {
    if (newfolderinpuvalue.trim() !== '') {

      let isValid = isValidFolderName(newfolderinpuvalue);

      if (!isValid) {
        alert('Invalid folder name. Please use only alphanumeric characters, underscores, and hyphens, and avoid reserved names.');
        changeOpen(false);
      }
      else {
        getnewfolderinputvalue(newfolderinpuvalue);
        changeOpen(false);
      }

    }
  }
  function isValidFolderName(name) {
    // Check type and length
    if (typeof name !== 'string' || name.length === 0 || name.length > 255) return false;

    // Disallow special/reserved characters and only allow alphanumeric, underscore, hyphen
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validPattern.test(name)) return false;

    // Disallow reserved names
    const reserved = [
      '.', '..', 'CON', 'PRN', 'AUX', 'NUL',
      'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
      'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
    ];
    if (reserved.includes(name.toUpperCase())) return false;

    return true;
  }


  return (
    <div className="modalouterdiv" onClick={(e) => onClickoutside(e)}>

      <div className="modalinner">
        <form onSubmit={() => onSubmit()}>
          <div className="flex flex-row">
            <div id="newfolderinputdiv" className="flex flex-col">
              <label htmlFor="newfoldername">New folder name: </label>
              <input type="text" name="newfoldername" onChange={(e) => setnewfolderinputvalue(e.target.value)} autoFocus required />

            </div>
            <svg onClick={() => changeOpen(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x-lg cursor-pointer" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </div>
          <div className="flex flex-row justify-between pt-5">
            <button type="submit" className="button button-primary"
            /*  onClick={() => onSubmit()} */
            >Submit
            </button>

          </div>
        </form>
      </div>
    </div >
  );
}

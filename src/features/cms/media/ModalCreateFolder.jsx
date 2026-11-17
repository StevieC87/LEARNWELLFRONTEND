'use client'
import { useState } from 'react';
import SoftModal from '@/components/ui/SoftModal.jsx';
export default function ModalCreateFolder(props) {

  const { open, getnewfolderinputvalue, changeOpen } = props;

  const [newfolderinpuvalue, setnewfolderinputvalue] = useState('');

  // It stays mounted between openings now, so the name is cleared each time.
  const close = () => {
    setnewfolderinputvalue('');
    changeOpen(false);
  };


  const onSubmit = (e) => {
    e.preventDefault();
    if (newfolderinpuvalue.trim() !== '') {

      let isValid = isValidFolderName(newfolderinpuvalue);

      if (!isValid) {
        alert('Invalid folder name. Please use only alphanumeric characters, underscores, and hyphens, and avoid reserved names.');
        close();
      }
      else {
        getnewfolderinputvalue(newfolderinpuvalue);
        close();
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
    <SoftModal open={Boolean(open)} onClose={close} title="New folder" width={400}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div id="newfolderinputdiv" className="ui-field">
          <label className="ui-label" htmlFor="newfoldername">New folder name</label>
          <input type="text" name="newfoldername" id="newfoldername" className="ui-input" value={newfolderinpuvalue} onChange={(e) => setnewfolderinputvalue(e.target.value)} data-autofocus required />
        </div>
        <div className="flex flex-row justify-end">
          <button className="ui-btn ui-btn-primary" type="submit">Create folder</button>
        </div>
      </form>
    </SoftModal>
  );
}

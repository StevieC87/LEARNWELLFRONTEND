'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './media.css';

export default function MediaPage() {

  const [basefiles, setBaseFiles] = useState([]);
  const [basefolders, setBaseFolders] = useState([]);
  const [currentfolder, setCurrentFolder] = useState(''); // State to track the current folder

  useEffect(() => {
    const fetchbasefilesandfolders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/getbasefolder`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data, "data from media page");
        setBaseFiles(data.files);
        setBaseFolders(data.folders);
      } catch (error) {
        console.error('Error fetching base files and folders:', error);
      }
    }
    fetchbasefilesandfolders();

  }
    , []);

  useEffect(() => {

  }, [currentfolder]);


  const changeFolder = (folderName) => {

  }

  return (
    <div className="flex flex-col ">
      <h1 className="">Media Page</h1>

      <div className="mediaouterdiv">
        {basefolders.length > 0 && (
          <div className="folderslistdiv">
            {basefolders.map((folder, index) => (
              <div key={index} className="folderitem">
                <Image src="/images/folder-cyan.svg" width={60} height={60} alt="folder"></Image>
                <span>{folder}</span>
              </div>
            ))}
          </div>
        )}
        {basefiles.length > 0 && (
          <div className="fileslistdiv">
            {basefiles.map((file, index) => (
              <div key={index} className="fileitem">
                <Image src="/images/" width={60} height={60} ></Image>
                <span>{file}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
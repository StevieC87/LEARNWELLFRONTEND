'use client';
import { useState, useEffect } from 'react';
import './userspage.css'
import Caret from '@/app/dash/pages/components/caret';


export default function UsersPage() {

  const [pagenumber, setPageNumber] = useState(1);
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [refreshList, setRefreshList] = useState(0);
  const [filteredusers, setFilteredUsers] = useState([]);
  const [pageswenedArray, setPagesWenedArray] = useState([]);
  const [columnsorted, setColumnSorted] = useState('email');
  const [sortdirection, setSortDirection] = useState('desc');

  const [searchterm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch users from the API
    const fetchasync = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/users/listusers?page=${pagenumber}&limit=${paginationLimit}&sort=${columnsorted}&direction=${sortdirection}&searchterm=${searchterm}`;
        console.log(url, 'urlforfetch')

        const response = await fetch(url,

          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for authentication
          }

        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data.users, 'datausers')
        setFilteredUsers(data.users);
        //  setPagesWenedArray(data.pagesArray);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    fetchasync();
  }, [refreshList, pagenumber, paginationLimit, sortdirection]);

  const searchrecords = (searchTerm) => {

  }

  const sorttable = (column) => {
    console.log('column clicked:', column);
    console.log('direction:', sortdirection);
    setColumnSorted(column);
    let direction = sortdirection === 'asc' ? 'desc' : 'asc';
    console.log('direction2,:', direction);
    setSortDirection(direction);
    //set refres 
    setRefreshList((prev) => prev + 1);
  }

  return (
    <div id="tablediv" className="tablediv" >
      <div id="filterdiv" className="flex flex-row" >
        <div id="searchdiv" className="postspagesearchinput">
          <input
            type="text"
            placeholder="Search by title"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => searchrecords(e.target.value)}
          />
        </div>
        <div id="paginationdiv" className="ml-5">
          <select name="paginationpages" id=""
            onChange={(e) => {
              setPageNumber(1);
              const newLimit = parseInt(e.target.value, 10);
              setPaginationLimit(newLimit);
              setRefreshList((prev) => prev + 1);
            }
            }
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>

          </select>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th className="cursor-pointer" onClick={() => sorttable('email')}
            >
              <div className="flex flex-row justify-between items-center">
                email
                {columnsorted === 'email' && (
                  <Caret direction={sortdirection === 'asc' ? 'asc' : 'desc'} />
                )
                }
              </div>
            </th>

            <th className="cursor-pointer" onClick={() => sorttable('role')}
              style={{ width: '140px' }}
            >
              <div className="flex flex-row justify-between items-center"
                style={{ textAlign: 'center' }}
              >
                role
                {columnsorted === 'role' && (
                  <Caret direction={sortdirection === 'asc' ? 'asc' : 'desc'} />
                )
                }
              </div>
            </th>
            <th className="cursor-pointer" onClick={() => sorttable('username')}
              style={{ width: '140px' }}
            >
              <div className="flex flex-row justify-between items-center"
                style={{ textAlign: 'center' }}
              >
                username
                {columnsorted === 'username' && (
                  <Caret direction={sortdirection === 'asc' ? 'asc' : 'desc'} />
                )
                }
              </div>
            </th>

          </tr>
        </thead>
        <tbody>
          {/* THIS IS TO SHOW THE LIST OF EXISTING PAGES */}
          {filteredusers.length > 0 && filteredusers.map((page, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-4 py-2">{page.email}</td>
              <td className="px-4 py-2" style={{ textAlign: 'center' }}>{page.role}</td>
              <td className="px-4 py-2" style={{ textAlign: 'center' }}>{page.username}</td>
            </tr>
          ))}



        </tbody>
      </table>


      <div className="flex flex-row justify-between items-end">
        <div id="pagination ">
          {pageswenedArray.length > 1 && (
            <div className="flex flex-row  gap-2 mt-5">
              {pageswenedArray.map((page) => (
                <button key={page} className={`button ${pagenumber === page ? 'button-primary' : 'button-outline'}`} onClick={() => {
                  setPageNumber(page);
                  setRefreshList((prev) => prev + 1);
                }}>
                  {page}
                </button>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
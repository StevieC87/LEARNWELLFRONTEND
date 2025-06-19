'use client';
import { useState, useEffect } from 'react';
import './userspage.css'
import Caret from '@/app/dash/pages/components/caret';
import Deleteuser from './Deleteuser'
import { useSelector } from 'react-redux';
export default function UsersPage() {

  const [pagenumber, setPageNumber] = useState(1);
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [refreshList, setRefreshList] = useState(0);
  const [filteredusers, setFilteredUsers] = useState([]);
  const [pageswenedArray, setPagesWenedArray] = useState([]);
  const [columnsorted, setColumnSorted] = useState('email');
  const [sortdirection, setSortDirection] = useState('desc');

  const [searchterm, setSearchTerm] = useState('');

  const userid = useSelector((state) => state.DashSlice.userid); // Get the user ID from Redux store

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
  }, [refreshList, pagenumber, paginationLimit, sortdirection, searchterm]);

  const searchrecords = (searchValue) => {
    if (searchValue === '') {
      setSearchTerm(''); // Reset to original list if search is empty
      return;
    }
    else if (searchValue.length > 0) {
      setSearchTerm(searchValue);
    }
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
      <h1 >Users</h1>
      <div className="pb-5">Manage users and their roles</div>
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
            <th className="cursor-pointer">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {/* THIS IS TO SHOW THE LIST OF EXISTING PAGES */}
          {filteredusers.length > 0 && filteredusers.map((user, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="" style={{}}>{user.role}</td>
              <td className="">{user.email}</td>

              <td className="" style={{ textAlign: 'center' }}>{user.username}</td>

              <td className="tdpageslist"
                style={{ width: '60px' }}>
                {((user._id.toString() !== userid) || (user.role !== 'superadmin')) && (
                  <div>

                    <Deleteuser userid={user._id.toString()} RefreshList1={() => setRefreshList((prev) => prev + 1)} pagenumber={pagenumber} pageindexinarray={index} totalpageindexes={filteredusers.length} />
                  </div>

                )}
              </td>
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
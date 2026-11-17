'use client';
import { useState, useEffect } from 'react';
import '@/features/account/users/userspage.css'
import Deleteuser from '@/features/account/users/Deleteuser'
import Reset2fa from '@/features/account/users/Reset2fa'
import { useSelector } from 'react-redux';
import ModalInvite from '@/features/account/users/ModalInvite';
import Link from 'next/link';
import PageTitle from "@/components/layout/PageTitle.jsx";
import { mayManage } from '@/lib/accountRoles';

const day = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : null

// lastLogin stays put while a session keeps refreshing, so take the later one.
const lastSeen = (user) => [user.lastActive, user.lastLogin].filter(Boolean).sort().at(-1)

export default function UsersPage() {

  const [pagenumber, setPageNumber] = useState(1);
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [refreshList, setRefreshList] = useState(0);
  const [filteredusers, setFilteredUsers] = useState([]);
  const [pageswenedArray, setPagesWenedArray] = useState([]);
  const [columnsorted, setColumnSorted] = useState('email');
  const [sortdirection, setSortDirection] = useState('desc');

  const [searchterm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [inactiveDays, setInactiveDays] = useState('');

  const userid = useSelector((state) => state.DashSlice.userid); // Get the user ID from Redux store
  const userrole = useSelector((state) => state.DashSlice.userrole);

  useEffect(() => {
    // Fetch users from the API
    const fetchasync = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/users/listusers?pagenumber=${pagenumber}&paginationlimit=${paginationLimit}&columnsorted=${columnsorted}&direction=${sortdirection}&searchterm=${encodeURIComponent(searchterm)}&plan=${planFilter}&inactivedays=${inactiveDays}`;

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
        setFilteredUsers(data.users);
        setPagesWenedArray(Array.from({ length: data.pagesweneed || 1 }, (_, i) => i + 1));
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    }
    fetchasync();
  }, [refreshList, pagenumber, paginationLimit, sortdirection, columnsorted, searchterm, planFilter, inactiveDays]);

  // Debounce search input -> update real `searchterm` used by fetch
  useEffect(() => {
    const id = setTimeout(() => {
      setPageNumber(1);
      setSearchTerm(searchInput);
      setRefreshList((prev) => prev + 1);
    }, 350);

    return () => clearTimeout(id);
  }, [searchInput]);

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
    setColumnSorted(column);
    let direction = sortdirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(direction);
    //set refres 
    setRefreshList((prev) => prev + 1);
  }

  const sortable = (column, label) => (
    <th aria-sort={columnsorted === column ? (sortdirection === 'asc' ? 'ascending' : 'descending') : undefined}>
      <button type="button" className="ui-sort" onClick={() => sorttable(column)}>{label}</button>
    </th>
  );

  return (
    <div className="users-page">
      <ModalInvite isOpen={showModal} changeOpen={setShowModal} />
      {/* Customer accounts are a superadmin's; an admin sees content manager accounts (backend listusers). */}
      <PageTitle icon="users" title="Users"
        actions={<button type="button" className="ui-btn ui-btn-primary" onClick={() => setShowModal((prevValue) => !prevValue)}>Invite user</button>}>
        {userrole === 'superadmin' ? 'Manage users and their roles' : 'Content manager accounts up to your role'}
      </PageTitle>
      <section className="ui-card">
        <div className="ui-card-body">
          <div className="users-toolbar">
            <input type="search" placeholder="Search by email" aria-label="Search by email"
              className="ui-input users-search" onChange={(e) => setSearchInput(e.target.value)} />
            {userrole === 'superadmin' && (
              <select className="ui-input" aria-label="Plan" value={planFilter} onChange={(e) => { setPageNumber(1); setPlanFilter(e.target.value); }}>
                <option value="">Any plan</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="deleting">Being deleted</option>
              </select>
            )}
            <select className="ui-input" aria-label="Not seen for" value={inactiveDays} onChange={(e) => { setPageNumber(1); setInactiveDays(e.target.value); }}>
              <option value="">Seen any time</option>
              <option value="30">Not seen for 30 days</option>
              <option value="60">Not seen for 60 days</option>
              <option value="90">Not seen for 90 days</option>
              <option value="180">Not seen for 180 days</option>
              <option value="365">Not seen for a year</option>
            </select>
            <select className="ui-input users-perpage" aria-label="Users per page" name="paginationpages"
              onChange={(e) => {
                setPageNumber(1);
                setPaginationLimit(parseInt(e.target.value, 10));
                setRefreshList((prev) => prev + 1);
              }}>
              <option value="10">10 a page</option>
              <option value="20">20 a page</option>
              <option value="50">50 a page</option>
              <option value="100">100 a page</option>
            </select>
          </div>
          <div className="users-scroll">
            <table className="ui-table users-table">
              <thead>
                <tr>
                  {sortable('email', 'Email')}
                  {sortable('role', 'Role')}
                  {sortable('username', 'Username')}
                  <th>Plan</th>
                  <th>Last seen</th>
                  <th>Deletes on</th>
                  <th>2FA</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredusers.length === 0 && (
                  <tr><td colSpan={8} className="ui-help">No users match.</td></tr>
                )}
                {filteredusers.map((user, index) => (
                  <tr key={user._id}>
                    <td><Link href={`/dash/users/profile?userid=${user._id}`}>{user.email}</Link></td>
                    <td>{user.role}</td>
                    <td>{user.username}</td>
                    <td>{user.plan || 'free'}</td>
                    <td>{day(lastSeen(user)) || 'Never'}</td>
                    <td>{day(user.inactive_deletes_at) || '—'}</td>
                    <td>
                      {user.twoFactorEnabled ? 'On' : 'Off'}
                      {user.twoFactorEnabled && userrole === 'superadmin' && user.role !== 'superadmin' && (
                        <Reset2fa userid={user._id.toString()} email={user.email} onDone={() => setRefreshList((prev) => prev + 1)} />
                      )}
                    </td>
                    <td className="ui-cell-actions">
                      {/* Lower ranks only, and customers only for a superadmin (the backend's mayManage). */}
                      {user._id.toString() !== userid && mayManage(userrole, user.role) && (
                        <Deleteuser userid={user._id.toString()} RefreshList1={(pageBack) => {
                          if (pageBack) setPageNumber(pageBack);
                          setRefreshList((prev) => prev + 1);
                        }} pagenumber={pagenumber} pageindexinarray={index} totalpageindexes={filteredusers.length} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pageswenedArray.length > 1 && (
            <nav className="ui-pager" aria-label="Pages">
              {pageswenedArray.map((page) => (
                <button key={page} type="button" aria-current={pagenumber === page ? 'page' : undefined}
                  className={pagenumber === page ? 'ui-btn ui-btn-primary' : 'ui-btn ui-btn-secondary'}
                  onClick={() => { setPageNumber(page); setRefreshList((prev) => prev + 1); }}>
                  {page}
                </button>
              ))}
            </nav>
          )}
        </div>
      </section>
    </div>
  )
}

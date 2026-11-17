'use client';
import { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import Link from "next/link";
import '@/features/cms/pages/pageslist.css'
import DeletePage from "@/features/cms/pages/Deletepage";
import TrashPage from "@/features/cms/pages/Trash";
import { useSearchParams } from 'next/navigation';
import { set } from "react-hook-form";
import Showschemasnopages from "@/features/cms/pages/Showschemasnopages";
import { usePathname } from 'next/navigation'
import PageTitle from "@/components/layout/PageTitle.jsx";

export default function Pages() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pagetype = searchParams.get('pagetype');


  const lastUrl = useRef('');
  const [urlchanged, setUrlChanged] = useState(0); // State to trigger useEffect when URL changes


  const multilingual = useSelector((state) => state.DashSlice.settings.multilingual);
  const userrole = useSelector((state) => state.DashSlice.userrole);
  const defaultlanguage = useSelector((state) => state.DashSlice.settings.defaultlanguage);
  const languages = useSelector((state) => state.DashSlice.settings.languages);

  const [pageslist, setPagesList] = useState([]);
  const [filteredpages, setFilteredPages] = useState(pageslist);
  const [schemanopages, setSchemaNoPages] = useState([]);
  const [issuperadmin, setIsSuperAdmin] = useState(false);

  //for posts
  const [multischemas, setMultischemas] = useState([]);

  const [refreshlist, setRefreshList] = useState(0);

  const [paginationlimit, setPaginationLimit] = useState(10); // default pagination limit
  const [pagenumber, setPageNumber] = useState(1); // default page number
  const [pageswenedArray, setPagesWeNeedArray] = useState([]); // array of pages we need

  const [columnsorted, setColumnSorted] = useState('lastModified');

  const [sortdirection, setSortDirection] = useState('desc');

  const [uniquenumberofschemas, setUniquenumberofschemas] = useState([]); // to store unique schemas from filtered pages

  const [searchterm, setSearchTerm] = useState(''); // to store search term

  const [trashedview, setTrashedView] = useState(false); // to store if trashed view is active

  const [filtertypeS, setFilterTypeS] = useState(''); // to store filter type
  const [filterLang, setFilterLang] = useState(''); // to store filter language

  //THIS IS TO GET OUT OF THE TRASH VIEW if e.g. clicks on 'pages' which in 'posts' and in trash view 
  useEffect(() => {
    const currentUrl = pathname + '?' + searchParams.toString();
    if (lastUrl.current === currentUrl) return;
    else {
      // alert('URL changed: ');
      setUrlChanged(prev => prev + 1); // Increment the state to trigger useEffect
      lastUrl.current = currentUrl; // Update the lastUrl reference
      setTrashedView(false); // Reset trashed view when URL changes`
      setPageNumber(1);
    }

    // lastUrl.current = currentUrl;
    // your fetch logic here
  }, [pathname, searchParams]);
  // import LexicalField from '../uicomponents/customfields/Lexical/LexicalField';

  useEffect(() => {
    if (userrole === "superadmin") {
      setIsSuperAdmin(true);
    }

    // a later request (new search, filter or page) supersedes this one
    let stale = false;
    const fetchpageslist = async () => {
      if (pagetype !== 'post' && pagetype !== 'page') return;
      // encoded, so a search like "a&b" or "#" can't break the other parameters
      const query = new URLSearchParams({
        paginationlimit, pagenumber, columnsorted, sortdirection, pagetype, searchterm,
        trashedview, filtertype: filtertypeS, filterlang: filterLang,
      });
      const url = `${process.env.NEXT_PUBLIC_API_URL}/pagesposts/getpagespostslist?${query}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          //'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
        credentials: 'include', // Include cookies in the request
      });
      if (stale) return;
      if (!response.ok) {
      }
      else if (response.ok) {
        const data = await response.json();
        if (stale) return;
        setPagesList(data.pages);
        setUniquenumberofschemas(data.numberofschemas);

        //  setPagesWeNeed(data.pagesweneed); //number
        // always replaced: a search with one page of results must drop the old buttons
        setPagesWeNeedArray(Array.from({ length: data.pagesweneed || 0 }, (_, index) => index + 1));

        if (pagetype === 'page') {
          setSchemaNoPages(data.schemasnopages);
        }
        else if (pagetype === 'post') {
          setMultischemas(data.multischemas);
        }

      }
    }
    fetchpageslist().catch(() => { });
    return () => { stale = true; };

    //setPageLinkUrl
  }, [userrole, pagetype, refreshlist, searchterm, trashedview, filtertypeS, filterLang, pagenumber]);

  useEffect(() => {
    setFilteredPages(pageslist);
  }, [pageslist]);


  const Trashcallback = (pagenumber) => {
    if (pagenumber) {
      setPageNumber(pagenumber); // Set the page number to the one passed from DeletePage component
    }
    setRefreshList((prev) => prev + 1);
  }

  const sorttable = (column) => {
    //try this
    setColumnSorted(column);
    let direction = sortdirection === 'asc' ? 'desc' : 'asc';

    /*     pageslist.sort((a, b) => {
          let av = a[column] || '';
          let bv = b[column] || '';
          return direction === 'asc'
            ? av.localeCompare(bv)
            : bv.localeCompare(av);
        });
     */
    setSortDirection(direction);
    //set refres 
    setRefreshList((prev) => prev + 1);

  }

  const searchrecords = (searchValue) => {
    // a new search, filter or view starts at page 1: page 3 of the old list may not exist
    setPageNumber(1);
    if (searchValue === '') {
      setSearchTerm(''); // Reset to original list if search is empty
      return;
    }
    else if (searchValue.length > 0) {
      setSearchTerm(searchValue);
    }

  }

  function getCsrfToken() {
    if (typeof document !== 'undefined') {
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrfToken='))
        ?.split('=')[1];
    }
    return null; // Return null if running on the server
  }
  const csrfToken = getCsrfToken();
  const restorepage = async (pageid) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pagesposts/restorepage/${pageid}?pagetype=${pagetype}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-CSRF-Token": csrfToken
      },
      credentials: 'include', // Include cookies in the request
    });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setRefreshList((prev) => prev + 1); // Refresh the list after restoring
  }

  const sortable = (column, label) => (
    <th aria-sort={columnsorted === column ? (sortdirection === 'asc' ? 'ascending' : 'descending') : undefined}>
      <button type="button" className="ui-sort" onClick={() => sorttable(column)}>{label}</button>
    </th>
  );
  const canRemove = issuperadmin || pagetype === 'post';
  const columns = 2 + (uniquenumberofschemas > 1 ? 1 : 0) + (multilingual ? 1 : 0) + (canRemove ? 1 : 0);
  const pageLink = (page) => `/dash/pages/${page._id}?pagetype=${pagetype}&schema=${page.schema}&language=${multilingual ? page.locale : defaultlanguage}`;

  return (
    <div className="pageslistdiv">
      <PageTitle icon="page" title={`${trashedview ? "Trashed " : ""}${pagetype === "post" ? "posts" : "pages"}`.replace(/^./, (c) => c.toUpperCase())}
        actions={
          <>
            {/* Pages are one per content type: offers the types that have none yet. */}
            <Showschemasnopages multilingual={multilingual} defaultlanguage={defaultlanguage} pagetype={pagetype} schemanopages={schemanopages} />
            {pagetype === "post" && multischemas.map((schema) => (
              <Link key={schema} href={`/dash/pages/newpage?pagetype=post&schema=${schema}`} className="ui-btn ui-btn-primary">
                New {schema}
              </Link>
            ))}
          </>
        } />

      <section className="ui-card">
        <div className="ui-card-body">
          <div className="pageslist-toolbar">
            <input type="search" placeholder="Search by title" aria-label="Search by title"
              className="ui-input pageslist-search" onChange={(e) => searchrecords(e.target.value)} />
            {pagetype === "post" && multischemas.length > 1 && (
              <select className="ui-input" aria-label="Type" onChange={(e) => { setPageNumber(1); setFilterTypeS(e.target.value); }}>
                <option value='all'>All types</option>
                {multischemas.map((schema) => (
                  <option key={schema} value={schema}>{schema}</option>
                ))}
              </select>
            )}
            {multilingual && (
              <select className="ui-input" aria-label="Language" name="languagefilter"
                onChange={(e) => { setPageNumber(1); setFilterLang(e.target.value); }}>
                <option value="all">All languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            )}
            <select className="ui-input" aria-label="Per page" name="paginationpages"
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
            <button type="button" className="ui-btn ui-btn-quiet pageslist-trash"
              onClick={() => { setPageNumber(1); setTrashedView((prev) => !prev); }}>
              {trashedview ? `Back to ${pagetype === 'post' ? 'posts' : 'pages'}` : 'View trash'}
            </button>
          </div>

          <div className="pageslist-scroll">
            <table className="ui-table pageslist-table">
              <thead>
                <tr>
                  {sortable('title', 'Title')}
                  {uniquenumberofschemas > 1 && sortable('schema', 'Type')}
                  {multilingual && sortable('locale', 'Language')}
                  {sortable('lastModified', 'Modified')}
                  {canRemove && <th><span className="sr-only">Actions</span></th>}
                </tr>
              </thead>
              <tbody>
                {filteredpages.length === 0 && (
                  <tr><td colSpan={columns} className="ui-help">
                    {trashedview ? 'Nothing in the trash.' : `No ${pagetype === 'post' ? 'posts' : 'pages'} yet.`}
                  </td></tr>
                )}
                {filteredpages.map((page) => (
                  <tr key={page._id}>
                    <td><Link href={pageLink(page)}>{page.title || 'Untitled'}</Link></td>
                    {uniquenumberofschemas > 1 && <td>{page.schema}</td>}
                    {multilingual && <td>{page.locale}</td>}
                    <td className="pageslist-date">
                      {page.lastModified && new Date(page.lastModified).toLocaleString(undefined, {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    {canRemove && (
                      <td className="ui-cell-actions">
                        {trashedview && (
                          <button type="button" className="ui-btn ui-btn-quiet ui-btn-sm" onClick={() => restorepage(page._id)}>Restore</button>
                        )}
                        {!trashedview ?
                          <TrashPage pagetype={pagetype} pageid={page._id} pageindexinarray={filteredpages.findIndex(p => p._id === page._id)}
                            pagenumber={pagenumber} totalpageindexes={filteredpages.length} RefreshList1={Trashcallback} />
                          : <DeletePage pagetype={pagetype} pageid={page._id} pageindexinarray={filteredpages.findIndex(p => p._id === page._id)}
                            pagenumber={pagenumber} totalpageindexes={filteredpages.length} RefreshList1={Trashcallback} />
                        }
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {pageswenedArray.length > 1 && (
          <footer className="ui-card-foot pageslist-foot">
            <nav className="ui-pager" aria-label="Pages">
              {pageswenedArray.map((page) => (
                <button key={page} type="button" aria-current={pagenumber === page ? 'page' : undefined}
                  className={pagenumber === page ? 'ui-btn ui-btn-primary' : 'ui-btn ui-btn-secondary'}
                  onClick={() => { setPageNumber(page); setRefreshList((prev) => prev + 1); }}>
                  {page}
                </button>
              ))}
            </nav>
          </footer>
        )}
      </section>
    </div>
  );
}
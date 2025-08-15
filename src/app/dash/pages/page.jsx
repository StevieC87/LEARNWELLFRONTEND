'use client';
import { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import Link from "next/link";
import './pageslist.css'
import DeletePage from "./components/Deletepage";
import TrashPage from "./components/Trash";
import { useSearchParams } from 'next/navigation';
import Caret from "./components/caret";
import { set } from "react-hook-form";
import Showschemasnopages from "./components/Showschemasnopages";
import { usePathname } from 'next/navigation'

export default function Pages() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pagetype = searchParams.get('pagetype');
  console.log('pagetype', pagetype);


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
    }

    // lastUrl.current = currentUrl;
    // your fetch logic here
  }, [pathname, searchParams]);
  // import LexicalField from '../uicomponents/customfields/Lexical/LexicalField';

  useEffect(() => {
    console.log(userrole, "userroleinpageslist");
    if (userrole === "superadmin") {
      console.log("userrole is superadmin");
      setIsSuperAdmin(true);
    }

    const fetchpageslist = async () => {
      let url;
      /*  if (data.totalpostpages <= 10) {
         setPageNumber(1); // Reset to first page if total pages are less than or equal to 10
       } */
      if (pagetype === 'post') {
        url = `${process.env.NEXT_PUBLIC_API_URL}/pagesposts/getpagespostslist?paginationlimit=${paginationlimit}&pagenumber=${pagenumber}&columnsorted=${columnsorted}&sortdirection=${sortdirection}&pagetype=${pagetype}&searchterm=${searchterm}&trashedview=${trashedview}&filtertype=${filtertypeS}&filterlang=${filterLang}`;
      } else if (pagetype === 'page') {
        url = `${process.env.NEXT_PUBLIC_API_URL}/pagesposts/getpagespostslist?paginationlimit=${paginationlimit}&pagenumber=${pagenumber}&columnsorted=${columnsorted}&sortdirection=${sortdirection}&pagetype=${pagetype}&searchterm=${searchterm}&trashedview=${trashedview}&filtertype=${filtertypeS}&filterlang=${filterLang}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          //'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
        credentials: 'include', // Include cookies in the request
      });
      if (!response.ok) {
        console.log("respo0nse not ok");
        console.log(response, "response");
      }
      else if (response.ok) {
        console.log("response ok");
        const data = await response.json();
        console.log('data22222222', data);
        setPagesList(data.pages);
        setUniquenumberofschemas(data.numberofschemas);

        //  setPagesWeNeed(data.pagesweneed); //number
        if (data.pagesweneed > 0) {
          const pagesArray = Array.from({ length: data.pagesweneed }, (_, index) => index + 1);
          console.log(pagesArray, "pagesArray");
          setPagesWeNeedArray(pagesArray);
        }

        if (pagetype === 'page') {
          setSchemaNoPages(data.schemasnopages);
        }
        else if (pagetype === 'post') {
          setMultischemas(data.multischemas);
        }

      }
    }
    fetchpageslist();


    //setPageLinkUrl
  }, [userrole, pagetype, refreshlist, searchterm, trashedview, filtertypeS, filterLang]);

  useEffect(() => {
    setFilteredPages(pageslist);
  }, [pageslist]);


  const Trashcallback = (pagenumber) => {
    if (pagenumber) {
      setPageNumber(pagenumber); // Set the page number to the one passed from DeletePage component
    }
    console.log(pagenumber, "pagenumber in deletecallback");
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
      console.log('Failed to restore page:', response.statusText);
      return;
    }
    const data = await response.json();
    console.log('Page restored:', data);
    setRefreshList((prev) => prev + 1); // Refresh the list after restoring
  }

  return (
    <>
      <div className="pageslistdiv">
        {/*    <h1 className="">Pages</h1> */}
        {/*       <LexicalField /> */}
        <div>
          {/* THIS IS TO SHOW THE MISSING PAGES FOR PAGE SCHEMA*/}
          <Showschemasnopages multilingual={multilingual} defaultlanguage={defaultlanguage} pagetype={pagetype} schemanopages={schemanopages} />


          {(pagetype === "post" && multischemas.length > 0) && (
            <span>Create New: </span>

          )}
          {pagetype === "post" && multischemas.length > 0 && multischemas.map((schema) => (
            <Link key={schema} href={`/dash/pages/newpage?pagetype=post&schema=${schema}`} className="button button-primary m-3">{schema}</Link>

          ))}
        </div>
        <h1 className="text-2xl pt-10">
          {pagetype === "page" && (
            trashedview ? <span>Trashed Pages </span> : <span>Pages List</span>
          )}
          {pagetype === "post" && (
            trashedview ? <span>Trashed Posts </span> : <span>Posts List</span>
          )}
        </h1>


        <div id="tablediv" className="tablediv" >
          <div id="filterdiv" className="flex flex-row gap-3" >
            <div id="searchdiv" className="postspagesearchinput">
              <input
                type="text"
                placeholder="Search by title"
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => searchrecords(e.target.value)}
              />
            </div>
            <div id="paginationdiv" className="">
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
            <div id="filtertypediv">
              {pagetype === "post" && (
                <select name="" id="" onChange={(e) => {
                  setFilterTypeS(e.target.value);
                }
                }>
                  <option value='all'>All Types</option>
                  {pagetype === "post" && multischemas.length > 0 && multischemas.map((schema) => (
                    <option key={schema} value={schema} >{schema}</option>
                  ))}
                </select>
              )}
            </div>
            <div id="languagefilter">
              {multilingual && (
                <select name="languagefilter" id="languagefilter"
                  onChange={(e) => {
                    setFilterLang(e.target.value);
                  }}
                >
                  <option value="all">All Languages</option>
                  {languages.map((page) => (
                    <option key={page} value={page} >{page}</option>
                  ))}
                </select>
              )}
            </div>

            {/* <Link key={schema} href={`/dash/pages/newpage?pagetype=post&schema=${schema}`} className="button button-primary m-3">{schema}</Link> */}
          </div>
          <table>
            <thead>
              <tr>
                <th className="cursor-pointer" onClick={() => sorttable('title')}
                >
                  <div className="flex flex-row justify-between items-center">
                    Title
                    {columnsorted === 'title' && (
                      <Caret direction={sortdirection === 'asc' ? 'asc' : 'desc'} />
                    )
                    }
                  </div>


                </th>
                {uniquenumberofschemas > 1 && (

                  <th className="cursor-pointer width70" onClick={() => sorttable('schema')} >
                    <div className="flex flex-row justify-between items-center">
                      Type
                      {columnsorted === 'schema' && (
                        <Caret direction={sortdirection === 'asc' ? 'asc' : 'desc'} />
                      )

                      }
                    </div>
                  </th>
                )}

                {multilingual && (
                  <th className="cursor-pointer width58" onClick={() => sorttable('locale')} >
                    <div className="flex flex-row justify-between items-center">
                      Lang
                      {columnsorted === 'locale' && (
                        <Caret direction={sortdirection === 'asc' ? 'asc' : 'desc'} />
                      )

                      }
                    </div>
                  </th>
                )}

                <th className="cursor-pointer width140" onClick={() => sorttable('lastModified')}



                >
                  <div className="flex flex-row justify-between items-center text-center"

                  >
                    Modified

                    {columnsorted === 'lastModified' && (
                      <Caret direction={sortdirection === 'asc' ? 'asc' : 'desc'} />
                    )

                    }
                  </div>
                </th>
                {/*    <th className="cursor-pointer" onClick={() => sorttable('createdAt')}>
                <div className="flex flex-row justify-between items-center">

                  Created
                  {columnsorted === 'createdAt' && (

                    <Caret direction={sortdirection === 'asc' ? 'asc' : 'desc'} />
                  )

                  }
                </div>
              </th> */}
                {trashedview && (
                  <th className="width40">
                    Restore
                  </th>
                )}


                {(issuperadmin || pagetype === 'post') && (
                  <th className={trashedview ? 'trashedview' : ''}>
                    {!trashedview ? 'Trash' : 'Delete'}
                  </th>
                )}


              </tr>
            </thead>
            <tbody>
              {/* THIS IS TO SHOW THE LIST OF EXISTING PAGES */}
              {filteredpages.length > 0 && filteredpages.map((page, index) => (
                <tr key={page._id} className="pageitem ">
                  <td className="tdpageslist poppinsSemiBold">
                    {multilingual && (
                      <Link key={page._id} href={`/dash/pages/${page._id}?pagetype=${pagetype}&schema=${page.schema}&language=${page.locale}`} className="">
                        <div>{page.title}</div></Link>
                    )}
                    {!multilingual && (
                      <Link key={page._id} href={`/dash/pages/${page._id}?pagetype=${pagetype}&schema=${page.schema}&language=${defaultlanguage}`} className="">
                        <div>{page.title}</div>
                      </Link>
                    )}
                  </td>
                  {uniquenumberofschemas > 1 && (

                    <td data-label="Type:"
                      className="tdpageslist">
                      {page.schema}
                    </td>
                  )}
                  {multilingual && (
                    <td className="tdpageslist text-center" data-label="Language:">{page.locale}</td>
                  )}


                  <td data-label="Modified:" className="tdpageslist fontsize1p2 text-center" >
                    {page.lastModified && (

                      new Date(page.lastModified).toLocaleDateString('en-UK', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })

                    )}
                  </td>
                  {/*   <td data-label="Created:" className="">
                  {new Date(page.createdAt).toLocaleDateString('en-UK', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td> */}
                  {trashedview && (
                    <td>
                      <div className="flex justify-center">
                        <svg onClick={() => restorepage(page._id)} xmlns="http://www.w3.org/2000/svg" width="24 " height="24" fill="currentColor" className="bi bi-arrow-clockwise cursor-pointer" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                          <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                        </svg>
                      </div>
                    </td>
                  )}

                  {(issuperadmin || pagetype === 'post') && (
                    <td data-label="Trash:" className="tdpageslist width60">
                      <span>
                        {!trashedview ?
                          <TrashPage pagetype={pagetype} pageid={page._id} pageindexinarray={filteredpages.findIndex(p => p._id === page._id)}
                            pagenumber={pagenumber}
                            totalpageindexes={filteredpages.length}
                            /*   changePagefunction={changePagefunction} */
                            RefreshList1={Trashcallback}
                          />
                          : <DeletePage pagetype={pagetype} pageid={page._id} pageindexinarray={filteredpages.findIndex(p => p._id === page._id)}
                            pagenumber={pagenumber}
                            totalpageindexes={filteredpages.length}
                            /*   changePagefunction={changePagefunction} */
                            RefreshList1={Trashcallback}
                          />
                        }
                      </span>
                    </td>

                  )}

                </tr>
              ))}



            </tbody>
          </table>
        </div>

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
          <div id="viewtrashed">
            <button className="button button-outline"
              onClick={() => {
                setTrashedView((prev) => !prev)
              }}
            >
              {trashedview ? 'View Active' : 'View Trashed'}
            </button>
          </div>
        </div>





      </div>


    </>
  );
}
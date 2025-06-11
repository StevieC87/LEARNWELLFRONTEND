'use client';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Link from "next/link";
import './pageslist.css'
import DeletePage from "./components/Deletepage";
import { useSearchParams } from 'next/navigation';
import Caret from "./components/caret";
import { set } from "react-hook-form";
import Showschemasnopages from "./components/Showschemasnopages";

// import LexicalField from '../uicomponents/customfields/Lexical/LexicalField';

export default function Pages() {
  const searchParams = useSearchParams();
  const pagetype = searchParams.get('pagetype');
  console.log('pagetype', pagetype);

  const multilingual = useSelector((state) => state.DashSlice.settings.multilingual);
  const userrole = useSelector((state) => state.DashSlice.userrole);
  const defaultlanguage = useSelector((state) => state.DashSlice.settings.defaultlanguage);

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
        url = `http://localhost:3000/pagesposts/getpagespostslist?paginationlimit=${paginationlimit}&pagenumber=${pagenumber}&columnsorted=${columnsorted}&sortdirection=${sortdirection}&pagetype=${pagetype}&searchterm=${searchterm}`;
      } else if (pagetype === 'page') {
        url = `http://localhost:3000/pagesposts/getpagespostslist?paginationlimit=${paginationlimit}&pagenumber=${pagenumber}&columnsorted=${columnsorted}&sortdirection=${sortdirection}&pagetype=${pagetype}&searchterm=${searchterm}`;
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
  }, [userrole, pagetype, refreshlist, searchterm]);

  useEffect(() => {
    setFilteredPages(pageslist);
  }, [pageslist]);


  const Deletecallback = (pagenumber) => {
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


  return (
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
          <span>Pages List</span>
        )}
        {pagetype === "post" && (
          <span>Posts List</span>
        )}
      </h1>


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

                <th className="cursor-pointer" onClick={() => sorttable('schema')} style={{ width: '70px' }}>
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
                <th className="cursor-pointer" onClick={() => sorttable('locale')} style={{ width: '58px' }}>
                  <div className="flex flex-row justify-between items-center">
                    Lang
                    {columnsorted === 'locale' && (
                      <Caret direction={sortdirection === 'asc' ? 'asc' : 'desc'} />
                    )

                    }
                  </div>
                </th>
              )}

              <th className="cursor-pointer" onClick={() => sorttable('lastModified')}
                style={{ width: '140px' }}


              >
                <div className="flex flex-row justify-between items-center"
                  style={{ textAlign: 'center' }}
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

              {(issuperadmin || pagetype === 'post') && (
                <th >Delete</th>
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


                <td data-label="Modified:" className="tdpageslist" style={{ fontSize: '1.2rem', textAlign: 'center' }}>
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

                {(issuperadmin || pagetype === 'post') && (
                  <td data-label="Delete:" className="tdpageslist"
                    style={{ width: '60px' }}
                  >
                    <span><DeletePage pagetype={pagetype} pageid={page._id} pageindexinarray={filteredpages.findIndex(p => p._id === page._id)}
                      pagenumber={pagenumber}
                      totalpageindexes={filteredpages.length}
                      /*   changePagefunction={changePagefunction} */
                      RefreshList1={Deletecallback}
                    /></span>
                  </td>

                )}

              </tr>
            ))}



          </tbody>
        </table>
      </div>

      <div id="pagination">
        {pageswenedArray.length > 1 && (
          <div className="flex flex-row  gap-2 mt-5">
            {pageswenedArray.map((page) => (
              <button key={page} className={`button ${pagenumber === page ? 'button-primary' : 'button-secondary'}`} onClick={() => {
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
  );
}
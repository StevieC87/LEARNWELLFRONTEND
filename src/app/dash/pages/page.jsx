'use client';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Link from "next/link";
import './pageslist.css'
import DeletePage from "./components/Deletepage";
import { useSearchParams } from 'next/navigation';
import Caret from "./components/caret";
import { set } from "react-hook-form";

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

  const [pagelinkurl, setPageLinkUrl] = useState('');

  const [paginationlimit, setPaginationLimit] = useState(10); // default pagination limit
  const [pagenumber, setPageNumber] = useState(1); // default page number
  const [totalpostpages, setTotalPostsPages] = useState(0); // total number of pages for pagination
  const [pageswenedArray, setPagesWeNeedArray] = useState([]); // array of pages we need

  const [columnsorted, setColumnSorted] = useState('lastModified');

  const [sortdirection, setSortDirection] = useState('desc');


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
        url = `http://localhost:3000/getpostslist?paginationlimit=${paginationlimit}&pagenumber=${pagenumber}&columnsorted=${columnsorted}&sortdirection=${sortdirection}`;
      } else if (pagetype === 'page') {
        url = `http://localhost:3000/getpageslist?paginationlimit=${paginationlimit}&pagenumber=${pagenumber}&columnsorted=${columnsorted}&sortdirection=${sortdirection}`;
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
        setTotalPostsPages(data.totalpostspages);


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
  }, [userrole, pagetype, refreshlist]);

  useEffect(() => {
    setFilteredPages(pageslist);
  }, [pageslist]);

  useEffect(() => {

    console.log('schemanopages44444444444', schemanopages);
  }, [schemanopages]);
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


  useEffect(() => {
    console.log('Columnsorted:', columnsorted);

  }, [columnsorted])

  return (
    <div className="pageslist">
      {/*    <h1 className="">Pages</h1> */}
      {/*       <LexicalField /> */}
      <div>
        {/* THIS IS TO SHOW THE MISSING PAGES */}
        {(pagetype === "page" && schemanopages.length > 0) && (
          <span>Schemas without pages:</span>
        )}
        {pagetype === "page" && schemanopages.length > 0 && schemanopages.map((schema, index) => (
          <div key={`${schema.schema}${schema.language}`} data-key={`${schema.schema}${schema.language} `} className="pageitem pt-2 flex flex-row gap-10">
            <div className="flex flex-col">
              {multilingual && (
                <Link href={`/dash/pages/newpage?pagetype=page&schema=${schema.schema}&language=${schema.language || defaultlanguage}`} className="underline">{schema.schema} {schema.language}</Link>
              )}
              {!multilingual && (
                <Link href={`/dash/pages/newpage?pagetype=page&schema=${schema.schema}&language=${schema.language || defaultlanguage} `} className="underline">{schema.schema}</Link>
              )}
            </div>
          </div>

        ))}
        {(pagetype === "post" && multischemas.length > 0) && (
          <Link className="" href="/dash/pages/newpage?pagetype=post&schema=blog">Create New: </Link>

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


      <div className="" >
        <div className="flex flex-row" >
          <div className="postspagesearchinput">
            <input
              type="text"
              placeholder="Search by title"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => {
                const searchValue = e.target.value.toLowerCase();
                if (searchValue === '') {
                  //alert('Search is empty');
                  setFilteredPages(pageslist); // Reset to original list if search is empty
                  return;
                }
                else {
                  const filteredPages1 = pageslist.filter(page =>
                    page.title.toLowerCase().includes(searchValue)

                  );
                  console.log(filteredPages1, "filteredPages in search input");
                  setFilteredPages(filteredPages1);
                }



              }}
            />
          </div>
          <div className="ml-5">
            <select name="paginationpages" id=""
              onChange={(e) => {
                setPageNumber(1); // Reset to first page when changing limit
                const newLimit = parseInt(e.target.value, 10);
                setPaginationLimit(newLimit);
                //setPageNumber(1); // Reset to first page when changing limit
                // Fetch the pages again with the new limit
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
              <th className="cursor-pointer" onClick={() => sorttable('schema')}>
                <div className="flex flex-row justify-between items-center">
                  Type
                  {columnsorted === 'schema' && (
                    <Caret direction={sortdirection === 'asc' ? 'asc' : 'desc'} />
                  )

                  }
                </div>
              </th>

              {multilingual && (
                <th className="cursor-pointer" onClick={() => sorttable('locale')} style={{ width: '40px' }}>
                  <div className="flex flex-row justify-between items-center">
                    Lang
                    {columnsorted === 'locale' && (
                      <Caret direction={sortdirection === 'asc' ? 'asc' : 'desc'} />
                    )

                    }
                  </div>
                </th>
              )}
              <th >Seo</th>
              <th >JSON-LD</th>

              <th className="cursor-pointer" onClick={() => sorttable('lastModified')}>
                <div className="flex flex-row justify-between items-center">
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
                <td data-label="Title:" className="underline">
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
                <td data-label="Type:">
                  {page.schema}
                </td>
                {multilingual && (
                  <td className="text-center" data-label="Language:">{page.locale}</td>
                )}
                <td data-label="Seo" id="seo" className="underline">
                  <Link key={page._id} href={`/dash/pages/seo?pageid=${page._id}&pagetype=${pagetype}&schema=${page.schema}&language=${page.locale || defaultlanguage}slug=${page.slug}`} className="">Seo</Link>
                </td>
                <td data-label="JSON-LD" id="jsonld">
                  <Link key={page._id} href={`/dash/pages/jsonld?pageid=${page._id}&pagetype=${pagetype}&schema=${page.schema}&language=${page.locale || defaultlanguage}&slug=${page.slug}`} className="">JSON-LD</Link>
                </td>

                <td data-label="Modified:" className="">
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
                  <td data-label="Delete:" className="">
                    <span><DeletePage pagetype={pagetype} pageid={page._id} pageindexinarray={filteredpages.findIndex(p => p._id === page._id)}
                      pagenumber={pagenumber}

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

      <div>
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
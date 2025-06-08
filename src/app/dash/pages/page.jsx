'use client';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Link from "next/link";
import './pageslist.css'
import DeletePage from "./components/Deletepage";
import { useSearchParams } from 'next/navigation';
import Caret from "./components/caret";

// import LexicalField from '../uicomponents/customfields/Lexical/LexicalField';

export default function Pages() {
  const searchParams = useSearchParams();
  const pagetype = searchParams.get('pagetype');
  console.log('pagetype', pagetype);

  const multilingual = useSelector((state) => state.DashSlice.settings.multilingual);
  const userrole = useSelector((state) => state.DashSlice.userrole);
  const defaultlanguage = useSelector((state) => state.DashSlice.settings.defaultlanguage);

  const [pageslist, setPagesList] = useState([]);
  const [schemanopages, setSchemaNoPages] = useState([]);
  const [issuperadmin, setIsSuperAdmin] = useState(false);

  //for posts
  const [multischemas, setMultischemas] = useState([]);

  const [refreshlist, setRefreshList] = useState(0);

  const [pagelinkurl, setPageLinkUrl] = useState('');

  useEffect(() => {
    console.log(userrole, "userroleinpageslist");
    if (userrole === "superadmin") {
      console.log("userrole is superadmin");
      setIsSuperAdmin(true);
    }



    const fetchpageslist = async () => {
      let url;
      if (pagetype === 'post') {
        url = "http://localhost:3000/getpostslist";
      } else if (pagetype === 'page') {
        url = "http://localhost:3000/getpageslist";
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

    console.log('schemanopages44444444444', schemanopages);
  }, [schemanopages]);
  const Deletecallback = (pageid) => {
    console.log('Deletecallback called with pageid:', pageid);
    setRefreshList((prev) => prev + 1);
  }


  const [columnsorted, setColumnSorted] = useState('CreatedAt');

  const [sortdirection, setSortDirection] = useState('asc');
  const sorttable = (column) => {
    //try this
    setColumnSorted(column);
    let direction = sortdirection === 'asc' ? 'desc' : 'asc';
    pageslist.sort((a, b) => {
      if (direction === 'asc') {
        return a[column].localeCompare(b[column]);
      } else {
        return b[column].localeCompare(a[column]);
      }
    }
    );
    setSortDirection(direction);

  }

  useEffect(() => {
    console.log('Columnsorted:', columnsorted);

  }, [columnsorted])

  //! add default sort order -> and REFLECT that in the UI BY SETTING THE COLUMNSROTED in the begining + the direction in the state so caret visible on MODIFIED DATE whatever

  // here i will list all the page - to take some complexity off the sidenav for now - wordpress style
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
                <th className="cursor-pointer" onClick={() => sorttable('locale')}>
                  <div className="flex flex-row justify-between items-center">

                    Language
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
              <th className="cursor-pointer" onClick={() => sorttable('createdAt')}>
                <div className="flex flex-row justify-between items-center">

                  Created
                  {columnsorted === 'createdAt' && (

                    <Caret direction={sortdirection === 'asc' ? 'asc' : 'desc'} />
                  )

                  }
                </div>
              </th>

              {(issuperadmin || pagetype === 'post') && (
                <th >Delete</th>
              )}


            </tr>
          </thead>
          <tbody>
            {/* THIS IS TO SHOW THE LIST OF EXISTING PAGES */}
            {pageslist.length > 0 && pageslist.map((page, index) => (
              <tr key={page._id} className="pageitem ">
                <td data-label="Title:" className="underline">
                  {multilingual && (
                    <Link key={page._id} href={`/dash/pages/${page._id}?pagetype=${pagetype}&schema=${page.schema}&language=${page.locale}`} className="">{page.title}</Link>
                  )}
                  {!multilingual && (
                    <Link key={page._id} href={`/dash/pages/${page._id}?pagetype=${pagetype}&schema=${page.schema}&language=${defaultlanguage}`} className="">{page.title}</Link>
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
                <td data-label="Created:" className="">
                  {new Date(page.createdAt).toLocaleDateString('en-UK', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>

                {(issuperadmin || pagetype === 'post') && (
                  <td data-label="Delete:" className="">
                    <span><DeletePage pagetype={pagetype} pageid={page._id}
                      RefreshList1={Deletecallback}
                    /></span>
                  </td>

                )}

              </tr>
            ))}



          </tbody>
        </table>
      </div>






    </div>
  );
}
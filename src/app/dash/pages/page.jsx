'use client';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Link from "next/link";
import './pageslist.css'
import DeletePage from "./components/Deletepage";
import { useSearchParams } from 'next/navigation';


// import LexicalField from '../uicomponents/customfields/Lexical/LexicalField';

export default function Pages() {
  const searchParams = useSearchParams();
  const pagetype = searchParams.get('pagetype');
  console.log('pagetype', pagetype);

  const multilingual = useSelector((state) => state.DashSlice.settings.multilingual);
  const userrole = useSelector((state) => state.DashSlice.userrole);

  const [pageslist, setPagesList] = useState([]);
  const [schemanopages, setSchemaNoPages] = useState([]);
  const [issuperadmin, setIsSuperAdmin] = useState(false);

  //for posts
  const [multischemas, setMultischemas] = useState([]);


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
  }, [userrole, pagetype]);


  useEffect(() => {

    console.log('schemanopages44444444444', schemanopages);
  }, [schemanopages]);

  // here i will list all the page - to take some complexity off the sidenav for now - wordpress style
  return (
    <div className="pageslist">
      {/*    <h1 className="">Pages</h1> */}
      {/*       <LexicalField /> */}
      <div>
        {(pagetype === "page" && schemanopages.length > 0) && (
          <span>Schemas without pages:</span>
        )}
        {pagetype === "page" && schemanopages.length > 0 && schemanopages.map((schema, index) => (
          <div key={`${schema.schema}${schema.language}`} data-key={`${schema.schema}${schema.language} `} className="pageitem pt-2 flex flex-row gap-10">
            <div className="flex flex-col">
              {multilingual && (
                <Link href={`/dash/pages/newpage?pagetype=page&schema=${schema.schema}&language=${schema.language}`} className="underline">{schema.schema} {schema.language}</Link>
              )}
              {!multilingual && (
                <Link href={`/dash/pages/newpage?pagetype=page&schema=${schema.schema}&language=${schema.language}`} className="underline">{schema.schema}</Link>
              )}
            </div>
          </div>

        ))}
        {(pagetype === "post" && multischemas.length > 0) && (
          <Link className="" href="/dash/pages/newpage?pagetype=post&schema=blog">Create New: </Link>

        )}
        {pagetype === "post" && multischemas.length > 0 && multischemas.map((schema) => (
          <Link key={schema} href={`/dash/pages/newpage?pagetype=post&schema=${schema}`} className="button button-secondary m-3">{schema}</Link>

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
              <th>Page</th>
              <th>Schema</th>
              {multilingual && (
                <th>Language</th>
              )}
              <th>Seo</th>
              <th>JSON-LD</th>
              {(issuperadmin || pagetype === 'post') && (
                <th>Delete</th>
              )}


            </tr>
          </thead>
          <tbody>
            {pageslist.length > 0 && pageslist.map((page, index) => (
              <tr key={page._id} className="pageitem ">
                <td className="">
                  {multilingual && (
                    <Link key={page._id} href={`/dash/pages/${page._id}?pagetype=${pagetype}&schema=${page.schema}&language=${page.locale}`} className="">{page.title}</Link>
                  )}
                  {!multilingual && (
                    <Link key={page._id} href={`/dash/pages/${page._id}?pagetype=${pagetype}&schema=${page.schema}&language=${page.locale}`} className="">{page.title}</Link>
                  )}
                </td>
                <td>
                  {page.schema}
                </td>
                {multilingual && (
                  <td>{page.locale}</td>
                )}
                <td id="seo">
                  <Link key={page._id} href={`/dash/pages/seo?pageid=${page._id}&pagetype=${pagetype}&schema=${page.schema}&language=${page.locale}slug=${page.slug}`} className="">Seo</Link>
                </td>
                <td id="jsonld">
                  <Link key={page._id} href={`/dash/pages/jsonld?pageid=${page._id}&pagetype=${pagetype}&schema=${page.schema}&language=${page.locale}&slug=${page.slug}`} className="">JSON-LD</Link>
                </td>
                {(issuperadmin || pagetype === 'post') && (
                  <td className="">
                    <span><DeletePage pagetype='page' pageid={page._id} /></span>
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
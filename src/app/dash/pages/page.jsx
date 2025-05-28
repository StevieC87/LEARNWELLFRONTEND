'use client';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Link from "next/link";
import './pageslist.css'
import DeletePage from "./components/Deletepage";
// import LexicalField from '../uicomponents/customfields/Lexical/LexicalField';
export default function Pages() {
  const multilingual = useSelector((state) => state.DashSlice.settings.multilingual);
  const userrole = useSelector((state) => state.DashSlice.userrole);

  const [pageslist, setPagesList] = useState([]);
  const [schemanopages, setSchemaNoPages] = useState([]);
  const [issuperadmin, setIsSuperAdmin] = useState(false);

  const [pagelinkurl, setPageLinkUrl] = useState('');

  useEffect(() => {
    if (userrole === "superadmin") {
      setIsSuperAdmin(true);
    }



    const fetchpageslist = async () => {

      const response = await fetch("http://localhost:3000/pages/getpageslist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      });
      if (!response.ok) {
        console.log("respo0nse not ok");
        console.log(response, "response");


      }
      else if (response.ok) {
        console.log("response ok");
        const data = await response.json();
        setPagesList(data.pages);

        setSchemaNoPages(data.schemasnopages);
      }
    }
    fetchpageslist();


    //setPageLinkUrl
  }, [userrole]);


  useEffect(() => {

    console.log('schemanopages44444444444', schemanopages);
  }, [schemanopages]);

  // here i will list all the page - to take some complexity off the sidenav for now - wordpress style
  return (
    <div className="pageslist">
      {/*    <h1 className="">Pages</h1> */}
      {/*       <LexicalField /> */}
      <div>
        {schemanopages.length > 0 && (
          <span>Schemas without pages:</span>
        )}
        {schemanopages.length > 0 && schemanopages.map((schema, index) => (
          <div key={`${schema.schema}${schema.language}`} data-key={`${schema.schema}${schema.language} `} className="pageitem pt-2 flex flex-row gap-10">
            <div className="flex flex-col">
              {multilingual && (
                <Link href={`/dash/pages/newpage?pagetype=page&schema=${schema.schema}&language=${schema.language}`} className="underline">{schema.schema} {schema.language}</Link>
              )}
              {!multilingual && (
                <Link href={`/dash/pages/newpage?pagetype=page&schema=${schema.schema}`} className="underline">{schema.schema}</Link>
              )}
            </div>
          </div>

        ))}
      </div>
      <h1 className="text-2xl">Pages List</h1>

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
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {pageslist.length > 0 && pageslist.map((page, index) => (
              <tr key={page._id} className="pageitem ">
                <td className="">
                  {multilingual && (
                    <Link key={page._id} href={`/dash/pages/${page._id}?pagetype=page&schema=${page.schema}&language=${page.locale}`} className="">{page.title}</Link>
                  )}
                  {!multilingual && (
                    <Link key={page._id} href={`/dash/pages/${page._id}?pagetype=page&schema=${page.schema}`} className="">{page.title}</Link>
                  )}
                </td>
                <td>
                  {page.schema}
                </td>
                {multilingual && (
                  <td>{page.locale}</td>
                )}
                <td>

                </td>
                {issuperadmin && (
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
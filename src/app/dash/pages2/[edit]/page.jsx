"use client";
import { useEffect, useState } from "react";
import EditPageComp from "./editpage";
import { ObjectId } from 'bson';
//import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function EditPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const edit = params.edit;
  const pagetype = searchParams.get('pagetype');
  console.log(edit, "edit333");
  console.log(pagetype, "pagetype333");

  const [settings, setSettings] = useState();
  const [pagefieldsdata, setPageFieldsData] = useState([]);
  const [pagedata, setPageData] = useState();
  const [schema, setSchema] = useState();
  const [neworexisting, setNewOrExisting] = useState();
  const [pageidfromserver, setPageIdFromServer] = useState();
  const [existingpagenewerror, setExistingPageNewError] = useState(false);
  const [currentlanguage, setCurrentLanguage] = useState();
  const [data, setData] = useState({})


  useEffect(() => {

    const FetchPageData = async () => {
      // let createID = new ObjectId().toString();
      let url;
      const pageid = edit;
      //set URL depending if new/existing page
      if (pageid !== "newpage") {
        url = `http://localhost:3000/schema/${pageid}?pagetype=${pagetype}`;
      }
      else if (pageid === "newpage") {
        let schemaq = searchParams.get('schema');
        url = `http://localhost:3000/schema/newpage?pagetype=${pagetype}&schemaname=${schemaq}`;
      }
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            //'Authorization': `Bearer ${ process.env.NEXT_PUBLIC_API_KEY } `,
          },
        });
        if (!response.ok) {
          console.log("respo0nse not ok");
          console.log(response, "response");
          const data = await response.json();
          console.log(data, "data321");
          console.log(data.erroris, "data.erroris");
          if (data.erroris === 'pageexists') {
            setExistingPageNewError(true);
            console.log(existingpagenewerror, "existingpagenewerror");
          }
          else {
            setExistingPageNewError(false);
          }

        }
        else if (response.ok) {
          console.log("response ok");
          const data = await response.json();
          setData(data);
          console.log(data, "data123321");
          setSchema(data.schema);
          setSettings(data.settings);
          setPageFieldsData(data.pagefieldsdata);
          setPageData(data.pagedata);
          setNewOrExisting(data.neworexisting);
          setPageIdFromServer(data.pageid);
        }

      } catch (error) {
        console.log("error", error);
      }
    }
    FetchPageData();
  }, []);

  /*  useEffect(() => {
     console.log("settings333333", settings);
     console.log("pagefieldsdata", pagefieldsdata);
     console.log("pagedata", pagedata);
     console.log("schema", schema);
     console.log("neworexisting", neworexisting);
     console.log("pageidfromserver", pageidfromserver);
     //   console.log("existingpagenewerror", existingpagenewerror);
     //  console.log("currentlanguage", currentlanguage);
     //  console.log("pagetype", pagetype);
 
   }, [settings, pagefieldsdata, pagedata, schema, neworexisting, pageidfromserver]);
  */
  return (
    <>
      <span>hello</span>

      {data && Object.keys(data).length > 0 && (
        <>
          <span>yes</span>

          <EditPageComp
            schema={schema}
            settings={settings}
            pagefieldsdata={pagefieldsdata}
            pagedata={pagedata}
            neworexisting={neworexisting}
            pageid={pageidfromserver}
            pagetype={searchParams.pagetype}
          />


        </>
      )}

      {/* <EditPageComp
        schema={schema}
        
      />   */}
      {/*   {data.existingpagenewerror && (
        <span>Page already exists</span>
      )} */}
      {/*      {!data.existingpagenewerror && ( */}
      {/*  */}
      {/* )} */}
    </>
  );
}
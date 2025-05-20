
import EditPageComp from "./editpage";
import { ObjectId } from 'bson';

export default async function EditPage({ params, searchParams }) {
  let createID = new ObjectId().toString();

  // const { edit } = await params;
  const { edit } = await params;
  const pageid = edit;
  //get query params

  const pagetype = searchParams.pagetype; // query param ?
  console.log(pagetype, "pagetype");

  let schemaname
  if (edit === "newpage") {
    schemaname = searchParams.schema; // query param ?


  }
  let schema;
  let settings;
  let pagefieldsdata = [];
  let pagedata;
  let neworexisting;
  let pageidfromserver;

  let url;
  console.log(schema, "schema");
  if (pageid === "newpage") {
    //we still need to fetch the settings  and the schema 
    url = `http://localhost:3000/schema/newpage?pagetype=${pagetype}&schemaname=${schemaname}`;

  }

  else if (pageid !== "newpage") {
    url = `http://localhost:3000/schema/${pageid}?pagetype=${pagetype}`;
  }
  //    const url = `http://localhost:3000/schema/${pageid}?pagetype=${pagetype}`;
  console.log(url, "url");
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
  } else if (response.ok) {
    console.log("response ok");
    const data = await response.json();
    console.log(data, "data123321");

    schema = data.schema;
    settings = data.settings;
    pagefieldsdata = data.pagefieldsdata;
    pagedata = data.pagedata;
    neworexisting = data.neworexisting;
    pageidfromserver = data.pageid;
    /*  fieldsdata = data.pagefields;
     pagedata = data.pagedata;
     multilingalBool = data.multilingual;
     multilingualLangs = data.languages; */
    // console.log(fieldsdata, "fieldsdata");
  }

  /*  function getFieldValue(fieldsdata, fieldName) {
     const field = fieldsdata.find((f) => f.field === fieldName);
     return field?.content || "";
   } */
  //pull in existing fields 

  return (
    <>
      <EditPageComp
        schema={schema}
        settings={settings}
        pagefieldsdata={pagefieldsdata}
        pagedata={pagedata}
        neworexisting={neworexisting}
        pageid={pageidfromserver}

      />
      {/* fieldsdata={fieldsdata} pagedata={pagedata} multilingalBool={multilingalBool} multilingualLangs={multilingualLangs}  */}
    </>
  );
}
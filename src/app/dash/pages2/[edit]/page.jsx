
import EditPageComp from "./editpage";
import { ObjectId } from 'bson';

export default async function EditPage({ params, searchParams }) {
  let createID = new ObjectId().toString();

  //if new monoschema page exists, and user tries aanew - stop them
  let existingpagenewerror = false;

  // const { edit } = await params;
  const { edit } = await params;
  const pageid = edit;
  //get query params

  const pagetype = await searchParams.pagetype; // query param ?
  console.log(pagetype, "pagetype");

  let schema;
  //when creating a new POST -> WE PASS THE SCHEMA WE WANT IN THE URL (e.g blog for new blog etc)
  if (edit === "newpage") {
    schema = await searchParams.schema; // query param ?
  }
  //! ISSUE NOW SCHEM AAINT BEING SET OR PASSED
  //HOW DID I DO IT BEFORE 


  let settings;
  let pagefieldsdata = [];
  let pagedata;
  let neworexisting;
  let pageidfromserver;

  let url;
  //console.log(schema, "schema");

  //. ------- CREATING URL FOR FETCHING SCHEMA AND DATA -----------
  //. if new page:
  // 1. we change the url -> so backend recognises
  // 2. in the backend we
  //  a) return schema but no fields data (they dont exist yet)
  //  b) return settings
  //  c) return pagedata (empty)
  //  d) return neworexisting (new)
  //  e) return pageid (new) - which we create in the backend

  if (pageid === "newpage") {
    //we still need to fetch the settings  and the schema
    //instead of an id im sening the string: newpage
    url = `http://localhost:3000/schema/newpage?pagetype=${pagetype}&schemaname=${schema}`;

    //in the backend: if it's a new page, and it's of pagetype page, i need to make sure it doesnt exist in the db
  }

  //. IF EXISTING PAGE -> FETCH DATA FROM DB (for component)

  else if (pageid !== "newpage") {
    url = `http://localhost:3000/schema/${pageid}?pagetype=${pagetype}`;
  }

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
    console.log(data, "data");
    console.log(data.erroris, "data.erroris");
    if (data.erroris = 'pageexists') {

      existingpagenewerror = true;
      console.log(existingpagenewerror, "existingpagenewerror");
    }
    //existingpagenewerror

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

    console.log(schema, "schema5555");
    console.log(settings, "settings5555");
    console.log(pagefieldsdata, "pagefieldsdata5555");
    console.log(pagedata, "pagedata5555");
    console.log(neworexisting, "neworexisting5555");
    console.log(pageidfromserver, "pageidfromserver5555");


  }

  return (
    <>
      {existingpagenewerror && (
        <span>Page already exists</span>
      )}
      {!existingpagenewerror && (


        <EditPageComp
          schema={schema}
          settings={settings}
          pagefieldsdata={pagefieldsdata}
          pagedata={pagedata}
          neworexisting={neworexisting}
          pageid={pageidfromserver}
          pagetype={pagetype}

        />
      )}

    </>
  );
}
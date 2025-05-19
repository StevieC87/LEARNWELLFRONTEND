
import EditPageComp from "./editpage";

export default async function EditPage({ params }) {



  const { edit } = await params;
  console.log(edit, "edit");
  let pageslug = edit;
  let multilingalBool;
  let multilingualLangs = [];

  /* WE NEED TO CHEKC IF THIS WEBSITE IS TO MULTILINGUAL */

  const url = `http://localhost:3000/pages/edit/${pageslug}`;
  console.log(url, "url");
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      //'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
  });
  let fieldsdata;
  let pagedata;
  // let headertitle = "";

  if (!response.ok) {
    console.log("respo0nse not ok");
    console.log(response, "response");
  } else if (response.ok) {
    console.log("response ok");
    const data = await response.json();
    console.log(data, "data");

    fieldsdata = data.pagefields;
    pagedata = data.pagedata;
    multilingalBool = data.multilingual;
    multilingualLangs = data.languages;
    // console.log(fieldsdata, "fieldsdata");
  }

  /*  function getFieldValue(fieldsdata, fieldName) {
     const field = fieldsdata.find((f) => f.field === fieldName);
     return field?.content || "";
   } */
  //pull in existing fields 

  return (
    <>
      <EditPageComp fieldsdata={fieldsdata} pagedata={pagedata} multilingalBool={multilingalBool} multilingualLangs={multilingualLangs} />
    </>
  );
}
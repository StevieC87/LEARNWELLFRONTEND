import { redirect } from 'next/navigation';

export default async function Home({ params }) {


  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/monolingual/homepage`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      //'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
  });
  let fieldsdata;
  // let headertitle = "";

  if (!response.ok) {
    console.log("respo0nse not ok");
    console.log(response, "response");
  } else if (response.ok) {
    //console.log("response ok");
    const data = await response.json();
    // console.log(data, "data");
    fieldsdata = data.pagefields;
    // console.log(fieldsdata, "fieldsdata");
  }

  function getFieldValue(fieldName) {
    const field = fieldsdata.find((f) => f.name === fieldName);
    return field?.content || "";
  }

  /*  return <>{<p>Title: {getFieldValue(fieldsdata, "HeaderH1Title")}</p>}</>; */
  /*   return <>{<p>Title: {getFieldValue("HeaderH1Title")}</p>}</>; */

  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <p>This is a simple example of a Next.js page.</p>
    </div>
  );
}






/*  function getFieldValue2(fieldsdata, fieldName) {
   const field = fieldsdata.find((f) => f.name === fieldName);
   return field?.content || "";
 
 }
*/
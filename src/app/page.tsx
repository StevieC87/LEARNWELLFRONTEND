export default async function Home() {
  /*  let Homepagedata = {};
  let Homepagefields = []; */
  /*  const response = await fetch("http://localhost:3000/pages/homepage", {
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
    console.log("response ok");
    const data = await response.json();
    console.log(data, "data");
    fieldsdata = data.pagefields;
    console.log(fieldsdata, "fieldsdata");
  }

  function getFieldValue(fieldsdata, fieldName) {
    const field = fieldsdata.find((f) => f.field === fieldName);
    return field?.content || "";
  }

  return <>{<p>Title: {getFieldValue(fieldsdata, "Header1Title")}</p>}</>; */

  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <p>This is a simple example of a Next.js page.</p>
    </div>
  );
}

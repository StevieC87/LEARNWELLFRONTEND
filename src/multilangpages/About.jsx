import { headers } from 'next/headers'


export default async function AboutPage({ params }) {

  let params1 = await params;
  if (!params1) {
    console.log("No params found, redirecting to default language");
  }
  let langslug = await params1.lang; // e.g. 'en', 'fr', 'de'
  //let searchparams = await searchParams;
  const allHeaders = await headers();
  const fullUrl = allHeaders.get('x-full-url');
  const pathname = allHeaders.get('x-custom-pathname');
  let slugsinurl = pathname.split("/").filter(Boolean);;
  let slugsinurlcount = slugsinurl.length;
  let pageslug;
  let showerror = false;
  if (slugsinurlcount === 0) {
    pageslug = "homepage";

  }
  else {
    langslug
      = slugsinurl[0];
    //pages slug is the rest of the path after the language slug
    pageslug = slugsinurl.slice(1).join("/"); // e.g. 'about', 'contact', etc.
    console.log(pageslug, "pageslug from slugsinurl");
  }


  try {
    const response = await fetch(`http://localhost:3000/api/multilingual/${pageslug}?language=${langslug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

      //cache: 'no-store', // Ensures fresh data on each request
    });
    if (!response.ok) {
      // console.error("Failed to fetch page data");
      showerror = true;
    }
    else {
      data = await response.json();
      console.log("Fetched page data:", data);
      fieldsdata = data.pagefields;
      console.log("Pagefields:", fieldsdata);
      showerror = false;
    }
  }
  catch (error) {
    console.error("Error fetching page data:");
    showerror = true;
  }

  function getFieldValue(fieldName) {
    if (!showerror) {
      console.log(data, "data in getFieldValue");
      console.log(fieldsdata, "fieldsdata in getFieldValue");
      const field = fieldsdata.find((f) => f.name === fieldName);
      return field?.content || "";
    }
  }

  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page for the application.</p>
      <p>It provides information about the application and its purpose.</p>
    </div>
  );
}


import { headers } from 'next/headers'

export default async function HomeMultilang({ params }) {

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
  }


  let fieldsdata;
  let data;
  //,GET PAGE DATA 
  try {
    const response = await fetch(`http://localhost:3000/api/multilingual/homepage?language=${langslug}`, {
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
    <>
      {showerror && (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
          <h1 className="text-4xl font-bold mb-4">Error</h1>
          <p className="text-lg text-red-600">Page not found or an error occurred.</p>
        </div>
      )}
      {!showerror && (
        <>
          <span>hello from multilingual page</span>
          <p>Title: {getFieldValue("HeaderH1Title")}</p>
          {/*   {showerror && (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
          <h1 className="text-4xl font-bold mb-4">Error</h1>
          <p className="text-lg text-red-600">Page not found or an error occurred.</p>
        </div>
      )
      }
      {!showerror && (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
          <h1 className="text-4xl font-bold mb-4">{pagefields.title.content}</h1>
          <p className="text-lg text-gray-700">This is a placeholder for the multilingual page.</p>
          <p className="text-sm text-gray-500 mt-2">You can add your content here.</p>
        </div>
      )}*/}
        </>
      )}
    </>
  );
}
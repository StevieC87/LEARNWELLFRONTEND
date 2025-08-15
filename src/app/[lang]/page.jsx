
import { headers } from 'next/headers'

export default async function HomeMultilang({ params }) {
  console.log('HELOOOOO')
  let params1 = await params;
  if (!params1) {
    console.log("No params found, redirecting to default language");
  }
  console.log(params1, "params in multilingual page");
  let langslug = await params1.lang; // e.g. 'en', 'fr', 'de'
  //let searchparams = await searchParams;
  console.log(langslug, "langslug in multilingual page");
  const allHeaders = await headers();
  const fullUrl = allHeaders.get('x-full-url');
  console.log(fullUrl, "fullUrl from headers");
  const pathname = allHeaders.get('x-custom-pathname');
  console.log(pathname, "pathname from headers");
  let slugsinurl = pathname.split("/").filter(Boolean);;
  console.log(slugsinurl, "slugsinurlfromheaders"); //e.g. ['en', 'services', 'wedesign']
  let slugsinurlcount = slugsinurl.length;
  let pageslug;
  let showerror = false;
  langslug = slugsinurl[0];
  console.log(langslug, "langslug");
  /*   if (slugsinurlcount === 0) {
      pageslug = "homepage";
  
    }
    else {
      langslug
        = slugsinurl[0];
    }
   */
  console.log('jello aagain')
  let fieldsdata;
  let data;
  //,GET PAGE DATA 
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/multilingual/homepage?language=${langslug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

      //cache: 'no-store', // Ensures fresh data on each request
    });
    if (!response.ok) {
      showerror = true;
    }
    else {
      data = await response.json();
      console.log("Fetched page data:", data);
      // fieldsdata = data.pagefields;
      //console.log("Pagefields:", fieldsdata);
      fieldsdata = data.pagefieldsarray;
      showerror = false;
    }
  }
  catch (error) {
    console.log("Error fetching page data:");
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
          <p>Title: {getFieldValue("pageheadlineH1")}</p>
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
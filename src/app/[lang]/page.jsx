
import { headers } from 'next/headers'

export default async function HomeMultilang({ params }) {

  let langslug = params.lang;
  //let searchparams = await searchParams;
  const allHeaders = headers();
  const fullUrl = allHeaders.get('x-full-url');
  const pathname = allHeaders.get('x-custom-pathname');
  let slugsinurl = pathname.split("/");
  let slugsinurlcount = slugsinurl.length;
  let pageslug;
  let showerror = false;
  if (slugsinurlcount === 2) {
    pageslug = "home";

  }
  else if (slugsinurlcount > 2) {
    pageslug = slugsinurl[2]; // e.g. about  
  }

  let pagefields = [];

  const response = await fetch(`http://localhost:3000/api/${pageslug}?language=${langslug}`, {
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
    const data = await response.json();
    console.log("Fetched page data:", data);
    pagefields = data.pagefields;
    console.log("Pagefields:", pagefields);
    showerror = false;
  }



  return (
    <>
      {showerror && (
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
      )}
    </>
  );
}
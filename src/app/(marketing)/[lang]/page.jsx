import { headers } from 'next/headers'
import { notFound } from 'next/navigation';
import Image from 'next/image'; // Import Image from next/image
import { fetchPageData, getFieldValue } from '@/lib/pageData'; // adjust relative path if needed
export default async function HomeMultilang({ params }) {
  //  console.log('HELOOOOO')
  let params1 = await params;
  if (!params1) {
    //  console.log("No params found, redirecting to default language");
  }
  // console.log(params1, "params in multilingual page");
  let langslug = await params1.lang; // e.g. 'en', 'fr', 'de'
  //let searchparams = await searchParams;
  // console.log(langslug, "langslug in multilingual page");
  const allHeaders = await headers();
  const pathname = allHeaders.get('x-custom-pathname');
  let slugsinurl = pathname.split("/").filter(Boolean);
  langslug = slugsinurl[0];

  // Use reusable fetch
  const { error: fetchError, fields } = await fetchPageData('homepage', langslug);
  // A path that isn't a CMS page (e.g. /status) is a real 404, not a 200 "error" page.
  if (fetchError) notFound();
  const showerror = false;

  // Return JSX from the component
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
          <div className='bg-yellow-200 p-4 m-4'>
            <p>Title: {getFieldValue(fields, "pageheadlineH1")}</p>
            <p>Title: {getFieldValue(fields, "title")}</p>
            <p>HeaderH1Title: {getFieldValue(fields, "HeaderH1Title")}</p>
            <p>Headertext: {getFieldValue(fields, "Headertext")}</p>
            {getFieldValue(fields, "Headerimage", "medialibrary") ? (
              // Use next/image for remote images (ensure next.config.js allows the host)
              <img src={getFieldValue(fields, "Headerimage", "medialibrary")} alt="Header Image" width={600} height={400} />
            ) : null}
          </div>
        </>
      )
      }
    </>
  );
}
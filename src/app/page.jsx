import { redirect } from 'next/navigation';
import { fetchPageData, getFieldValue } from '@/lib/pageData';
export default async function Home({ params }) {
  // let Homepagedata = {};
  // let Homepagefields = [];
  let langslug = await params.lang;
  if (langslug) {
    console.log(langslug, 'langslug')
    redirect('/langslug'); // or detect language dynamically
  }
  /* else {
    redirect('/en'); // or detect language dynamically

  } */
  //! this is for MONOLINGUAL 
  //TRY AFTER MULTILINGAUL 
  // redirect('/en'); // or detect language dynamically

  const { error: fetchError, fields } = await fetchPageData('homepage', langslug);
  const showerror = !!fetchError;
  const fieldsdata = fields;
  //console.log(fieldsdata, 'fieldatafieldata');
  //console.log('hellohello from homepage.jsx');

  /*  return <>{<p>Title: {getFieldValue(fieldsdata, "HeaderH1Title")}</p>}</>; */
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
          <p>Title: {getFieldValue(fields, "HeaderH1Title")}</p>

          <div>
            <h1>Welcome to the Homepage</h1>
            <p>This is a simple example of a Next.js page.</p>
          </div>
        </>
      )}
    </>
  );



}






/*  function getFieldValue2(fieldsdata, fieldName) {
   const field = fieldsdata.find((f) => f.name === fieldName);
   return field?.content || "";
 
 }
*/
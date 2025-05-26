import { headers } from 'next/headers'


export default function AboutPage({ params }) {

  let langslug = params.lang;
  //let searchparams = await searchParams;
  console.log("Language slug:", langslug);
  const allHeaders = headers();
  const fullUrl = allHeaders.get('x-full-url');
  console.log("Full URL from headers:", fullUrl);
  const pathname = allHeaders.get('x-custom-pathname');
  console.log("Pathname from headers:", pathname);

  let slugsinurl = pathname.split("/");
  console.log(slugsinurl, "slugsinurl");
  let slugsinurlcount = slugsinurl.length;
  console.log(slugsinurlcount, 'slugsinurlcount')
  //console.log("NumberofslugsinURL:", slugsinurlcount);
  let pageslug;
  if (slugsinurlcount === 2) {
    //it's the ome page
    console.log('itsthehomepage')
    pageslug = "home";

  }
  pageslug = slugsinurl[2];
  console.log(pageslug, "pageslug");


  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page for the application.</p>
      <p>It provides information about the application and its purpose.</p>
    </div>
  );
}

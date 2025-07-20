import { headers } from 'next/headers'

export async function generateMetadata({ params }) {
  const allHeaders = await headers();
  const fullUrl = allHeaders.get('x-full-url');
  const pathname = allHeaders.get('x-custom-pathname');
  let slugsinurl = pathname.split("/").filter(Boolean);;
  // console.log(fullUrl, "fullUrl from headers");
  //  console.log(pathname, "pathname from headers");
  //  console.log(slugsinurl, "slugsinurl from headers");
  let slugsinurlcount = slugsinurl.length;
  let slugpath = pathname;
  let langslug
  if (slugsinurlcount === 0) {
    slugpath = 'homepage';
  }
  else {
    //get first slug in array
    langslug
      = slugsinurl[0]; // e.g. 'en', 'fr', 'de'
  }
  /*  const response = await fetch(
     `${process.env.NEXT_PUBLIC_API_URL}/api/multilingualmetadata/${slugpath}?language=${langslug}`,
     {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
       },
     }
   );
   let fieldsdata;
   // let headertitle = "";
   // <meta name="description" content="Default Description">
   if (!response.ok) {
     console.log('didnt fetch metadata');
 
   } else if (response.ok) {
     console.log('fetched metadata');
     const data = await response.json();
     console.log(data, "data");
     // fieldsdata = data.pagefields;
     // console.log(fieldsdata, "fieldsdata");
 
     const metadata = data.metadata;
     console.log(metadata, "metadata from monolingual metadata API");
 
     let robotsobject
 
     if (metadata.robots == 'index, follow') {
       robotsobject = {
         index: true,
         follow: true,
       }
     }
     else if (metadata.robots == 'noindex, nofollow') {
       robotsobject = {
         index: false,
         follow: false,
       }
 
     } else if (metadata.robots == 'noindex, follow') {
       robotsobject = {
         index: false,
         follow: true,
       }
     }
     else if (metadata.robots == 'index, nofollow') {
       robotsobject = {
         index: true,
         follow: false,
       }
 
 
     } else {
       robotsobject = {
         index: true,
         follow: true,
       }
     }
 
       return {
         title: metadata.metatitle || "1234",
         description: metadata.metadescription || "Default Description",
         hreflang: metadata.hreflang || "en",
         openGraph: {
           title: metadata.metatitle || "Default Title",
           description: metadata.metadescription || "Default Description",
           //url: fullUrl,
           url: metadata.canonicalurl || fullUrl, // Use the canonical URL if available
           siteName: metadata.ogsitename,
           //! PUT FULL URL FOR IMAGE HERE
           images: [
             {
   
               // url: `${fullUrl}/og-image.png`, // Adjust the image URL as needed
               url: metadata.ogimage || `${fullUrl}/og-image.png`, // Use the ogimage from data or default
               width: 1200,
               height: 630,
               alt: "Open Graph Image",
             },
           ],
           //ogtype
           type: metadata.ogtype || "website", // Use the ogtype from data or default to "website"
         },
         twitter: {
           card: "summary_large_image",
           title: metadata.metatitle || "Default Title",
           description: metadata.metadescription || "Default Description",
           images: [metadata.ogimage], // Adjust the image URL as needed
         },
         //robots, ando
         robots: robotsobject,
       }
    
   } */
}

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>ForgeCMS</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}


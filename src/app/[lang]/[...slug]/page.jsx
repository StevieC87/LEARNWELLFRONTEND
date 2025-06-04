import { notFound } from 'next/navigation';
import { headers } from 'next/headers'

// import AboutPage from '@/multilangpags/AboutPage';
import AboutPage from '@/multilangpages/AboutPage';
// import ContactPage from '@/components/pages/ContactPage';
// import other shared components...

export default async function Page({ params }) {

  //HERE I INCLUDE !ALL! THE PAGE COMPONENTS (about, contact, what have you)
  const componentMap = {
    AboutPage,
    //ContactPage,
    // ServicesPage,
  };
  let SelectedComponent;
  //! here i need to fetch the page data based on the slug and lang
  // -> see what page component it is  (frm its schema taht is saved in db)
  // -> render it and pass data as props 


  const { lang, slug } = await params;
  console.log(lang, 'lang') // e.g. 'fr'
  console.log(slug, 'slug') //e.g ['services', 'wedesign']
  const fullSlug = Array.isArray(slug) ? slug.join('/') : slug;
  console.log(fullSlug, 'fullSlug') //e.g. 'services/wedesign'


  //let searchparams = await searchParams;
  const allHeaders = await headers();
  const fullUrl = allHeaders.get('x-full-url');
  const pathname = allHeaders.get('x-custom-pathname');
  let slugsinurl = pathname.split("/").filter(Boolean);
  console.log(slugsinurl, "slugsinurlfromheaders"); //e.g. ['en', 'services', 'wedesign']

  let slugsinurlcount = slugsinurl.length;
  console.log(slugsinurlcount, "slugsinurlcountfromheaders");
  let pageslug;
  let pagesslugwithlang// e.g. 'en/services/wedesign'
  //let langslug;
  let showerror = false;


  //pages slug is the rest of the path after the language slug
  pageslug = slugsinurl.slice(1).join("/"); // e.g. 'about', 'contact', etc.
  console.log(pageslug, 'pageslugpageslug')
  let pagesslug2 = pageslug.replace(/\//g, '-'); // e.g. 'en-services-wedesign'
  console.log(pagesslug2, 'pagesslug2 from slugsinurl');
  pagesslugwithlang = slugsinurl.join("/"); // e.g. 'en/services/wedesign'
  //i wanna turn this to replace / with - 
  pagesslugwithlang = pagesslugwithlang.replace(/\//g, '-'); // e.g. 'en-services-wedesign'
  console.log(pagesslugwithlang, "pagesslugwithlang from slugsinurl");
  console.log(pageslug, "pageslug from slugsinurl");


  let frontendcomponent;
  try {
    const response = await fetch(`http://localhost:3000/api/multilingual/${pagesslugwithlang}?language=${lang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

      //cache: 'no-store', // Ensures fresh data on each request
    });
    if (!response.ok) {
      console.error("Failed to fetch page data");
      showerror = true;
    }
    else {
      console.log('data fetched successfully')
        ;
      let data = await response.json();
      console.log("Fetched page data:", data);
      frontendcomponent = data.frontendcomponent;
      SelectedComponent = componentMap[frontendcomponent];
      console.log("Frontend component:", frontendcomponent);
      let alldata = data.pagedata;
      console.log(alldata, "alldata keys");
      fieldsdata = data.fields;
      console.log("Pagefields:", fieldsdata);
      showerror = false;
    }
  }
  catch (error) {
    // console.error("Error fetching page data:");
    // showerror = true;
  }

  return (
    <>
      <SelectedComponent />;
    </>
  )
  // const pageKey = slugToPageKey[lang]?.[slug];

  // if (!pageKey) notFound();

  // const PageComponent = pagesByKey[pageKey];
  //  if (!PageComponent) notFound();

  //  return <PageComponent lang={lang} />;
}

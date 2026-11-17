import { headers } from 'next/headers'
import { fetchPageData, getFieldValue } from '@/lib/pageData';

export default async function AboutPage({ params, searchParams }) {

  const { lang, slug } = await params;
  const allHeaders = await headers();
  const pathname = allHeaders.get('x-custom-pathname');
  let slugsinurl = pathname.split("/").filter(Boolean);
  let slugpath = slugsinurl.join("/");
  if (slugsinurl.length > 1) {
    slugpath = slugpath.replace(/\//g, '*');
  }

  let queryparams = await searchParams;
  let ispreview = queryparams?.preview === 'true' ? true : false;
  let previewtoken = queryparams?.previewtoken || null;

  const { error: fetchError, data, fields } = await fetchPageData(slugpath, lang);
  if (fetchError) {
    // console.log("Error fetching page data");
    return <div>Error fetching page data</div>;
  }

  return (
    <div className="aboutPage">
      <h1 className="aboutPageh1">
        <p>{getFieldValue(fields, "title")}</p>
        <p>{getFieldValue(fields, "summary")}</p>
      </h1>
    </div>
  )
}
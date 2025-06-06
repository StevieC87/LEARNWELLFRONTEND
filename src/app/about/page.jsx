

import { FetchpagedataStatic } from "@/utilities/fetchpagedatastatic";
import { headers } from 'next/headers'

export default async function AboutPage({ params, searchParams }) {

  //, THIS IS FOR SLUGPATH - to send for fetch
  //first we need to get the slugpath
  const { lang, slug } = await params;
  const allHeaders = await headers();
  const fullUrl = allHeaders.get('x-full-url');
  const pathname = allHeaders.get('x-custom-pathname');
  let slugsinurl = pathname.split("/").filter(Boolean);
  console.log(slugsinurl, "slugsinurl");
  //e.g. ['about', 'team']

  let slugpath = slugsinurl.join("/");
  //e.g. 'about/team'
  console.log(slugpath, 'slugpath')

  //if more than 1 length -> replace / with *
  let slugsinurlcount = slugsinurl.length;
  if (slugsinurlcount > 1) {
    slugpath = slugpath.replace(/\//g, '*');
  }
  console.log(slugpath, 'slugpath after replace / with *')

  //,this is for the preview token
  let queryparams = await searchParams;
  let ispreview = queryparams?.preview === 'true' ? true : false;
  console.log(ispreview, "ispreviewornot");
  let previewtoken = queryparams?.previewtoken || null;
  console.log(previewtoken, "previewtken");

  let getpagedata = await FetchpagedataStatic(ispreview, previewtoken, slugpath);
  if (!getpagedata) {
    console.log("Error fetching page data");
    return <div>Error fetching page data</div>;
  }
  let data = getpagedata.data;
  console.log(data, "data from FetchpagedataStatic in AboutPage");
  let pagedata = data.pagedata;
  console.log(pagedata, "pagedata in AboutPage");
  let pagefieldsarray = data.pagefieldsarray;
  console.log(pagefieldsarray, "pagefieldsarray in AboutPage");

  function getFieldValue(fieldName) {
    // if (!showerror) {
    // console.log(data, "data in getFieldValue");
    console.log(pagefieldsarray, "fieldsdata in getFieldValue");
    const field = pagefieldsarray.find((f) => f.name === fieldName);
    return field?.content || "";
    // }
  }

  return (
    <div className="aboutPage">
      <h1 className="aboutPageh1">  <p>{getFieldValue("title")}</p></h1>

    </div>
  )
}
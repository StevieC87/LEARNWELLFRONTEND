// import { Fetchpreview } from './components/Fetchpreview';

export default async function ArticlePage(props) {
  const { pagedata, pagefieldsarray, ispreview, lang, pagesslugwithlang } = props;
  /* 
    if (ispreview) {
      console.log("This is a preview mode for ArticlePage");
      let data = await Fetchpreview(pagesslugwithlang, lang);
      let pagedata = data.pagedata;
      let fieldsdata = data.fieldsdata;
    } */

  console.log(pagedata, "pagedata in ArticlePage");
  console.log(pagefieldsarray, "fieldsdata in ArticlePage");

  function getFieldValue(fieldName) {
    // if (!showerror) {
    // console.log(data, "data in getFieldValue");
    console.log(pagefieldsarray, "fieldsdata in getFieldValue");
    const field = pagefieldsarray.find((f) => f.name === fieldName);
    return field?.content || "";
    // }
  }
  /* function getFieldValue(fieldName) {

    console.log(fieldsdata, "fieldsdata in getFieldValue");
    const field = fieldsdata.find((f) => f.name === fieldName);
    return field?.content || "";
    //}
  } */


  return (
    <div>
      <p>Title: {getFieldValue("title")}</p>
      <p>This is the articles page for the application.</p>
      <p>It provides a list of articles and their details.</p>
    </div>
  );

}


export default async function ArticlePage(props) {

  const { pagedata, fieldsdata } = props;
  console.log(pagedata, "pagedata in ArticlePage");
  console.log(fieldsdata, "fieldsdata in ArticlePage");


  function getFieldValue(fieldName) {

    console.log(fieldsdata, "fieldsdata in getFieldValue");
    const field = fieldsdata.find((f) => f.name === fieldName);
    return field?.content || "";
    //}
  }


  return (
    <div>
      <p>Title: {getFieldValue("title")}</p>
      <p>This is the articles page for the application.</p>
      <p>It provides a list of articles and their details.</p>
    </div>
  );

}



export default function CreateCategory({ params }) {
  const { lang, category } = params;

  return (
    <div>
      <div>View Categories</div>
      <select name="" id="">
        <option value="category1">Category 1</option>
        <option value="category2">Category 2</option>
        <option value="category3">Category 3</option>
        <option value="category4">Category 4</option>
      </select>
      {/*  <h1>Blog Category: {category}</h1>
      <p>Language: {lang}</p>
      <p>This is a placeholder for the blog category page.</p>
      <p>Content will be dynamically loaded based on the selected language and category.</p> */}
    </div>
  );
}
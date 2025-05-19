
import Link from "next/link";
import './pageslist.css'

export default async function Pages() {

  let pageslist = [];
  const response = await fetch("http://localhost:3000/pages/getpageslist", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      //'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
  });
  if (!response.ok) {
    console.log("respo0nse not ok");
    console.log(response, "response");
  }
  else if (response.ok) {
    console.log("response ok");
    const data = await response.json();
    pageslist = data.pages;
    console.log(pageslist, "pageslist");
  }

  // here i will list all the page - to take some complexity off the sidenav for now - wordpress style
  return (
    <div className="pageslist">
      <h1 className="">Pages</h1>
      <p className="">This is the pages page</p>
      <p>Here you can create top-level page like About,Services, etc</p>

      <Link href="/dash/pages/createnew" className=" button-primary t-10 mb-10">Create New Page</Link>

      <div className="">
        <h1 className="text-2xl">Pages List</h1>
        <table>
          <thead>
            <tr>
              <th>Page</th>
              <th>Seo</th>

            </tr>
          </thead>
          <tbody>
            {pageslist.map((page) => (
              <tr key={page._id} className="pageitem ">
                <td className="">
                  <Link href={`/dash/pages2/${page.slug}`} className="">{page.title}</Link>
                </td>
                <td className="">
                  <Link href={`/dash/pages2/editseo/${page.slug}`} className="">Page SEO settings</Link>
                </td>

              </tr>
            ))}



          </tbody>
        </table>
        {/* {pageslist.map((page) => (
          <div key={page._id} className="pageitem pt-10 flex flex-row gap-10">
            <div className="flex flex-col">
              <Link href={`/dash/pages/${page.slug}`} className="">{page.title}</Link>
            </div>
            <div className="flex flex-col gap">
              <Link href={`/dash/pages/editseo/${page.slug}`} className="">Page SEO settings</Link>
            </div>
          
          </div>
        ))} */}
      </div>



    </div>
  );
}
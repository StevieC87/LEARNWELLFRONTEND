import Link from "next/link";
// import { redirect } from 'next/navigation';
import DeletePage from "../pages2/components/Deletepage";

export default async function PostsPage() {

  let postslist = [];
  const response = await fetch("http://localhost:3000/getpostslist", {
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
    postslist = data.postpages;
    console.log(postslist, "postslist");
  }

  //! probabyl make this client component or include - COZ WE WANNA DEFINE WHAT WE WANT A BLOG, AN ARTICLE, A PRODUCT ETC - and we gotta send that to get the corresponding schema
  return (
    <>
      <div>
        <h1>Posts Page</h1>
        <p>This is the posts page.</p>
        {/* <button onClick={() => createPost()} ></button> */}
        <Link className="button button-primary" href="/dash/pages2/newpage?pagetype=post&schema=blog">Create New page</Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Page</th>
            <th>Seo</th>
            <th>Delete</th>


          </tr>
        </thead>
        <tbody>
          {postslist.length > 0 && postslist.map((post) => (
            <tr key={post._id} className="pageitem ">
              <td className="">
                <Link href={`/dash/pages2/${post._id}?pagetype=post`} className="">{post.title}</Link>
              </td>
              <td className="">
                <Link href={`/dash/pages2/editseo/${post._id}?pagetype=post`} className="">Page SEO settings</Link>
              </td>
              <td className="">
                <span><DeletePage pagetype='post' pageid={post._id} /></span>
              </td>

            </tr>
          ))}



        </tbody>
      </table>

    </>

  );
}
import Link from "next/link";


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

  return (
    <>
      <div>
        <h1>Posts Page</h1>
        <p>This is the posts page.</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Page</th>
            <th>Seo</th>

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

            </tr>
          ))}



        </tbody>
      </table>

    </>

  );
}
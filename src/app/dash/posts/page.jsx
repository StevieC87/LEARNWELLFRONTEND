'use client';
import Link from "next/link";
// import { redirect } from 'next/navigation';
import DeletePage from "../pages/components/Deletepage";
import { useEffect, useState } from "react";


export default function PostsPage() {


  //let postslist = [];
  // let multischemas = [];
  const [postslist, setPosts] = useState([]);
  const [multischemas, setMultischemas] = useState([]);

  useEffect(() => {
    // This effect runs only once when the component mounts
    console.log("PostsPage component mounted");

    const fetchfunction = async () => {
      const response = await fetch("http://localhost:3000/getpostslist", {
        method: "GET",

        credentials: 'include',
        // this is what sends/receives cookie
      });
      if (!response.ok) {
        console.log("respo0nse not ok");
        console.log(response, "response");
      }
      else if (response.ok) {
        console.log("response ok");
        const data = await response.json();
        console.log(data, "data");
        // postslist = data.postpages;
        setPosts(data.postpages);
        // schemas = data.postschemas;
        setMultischemas(data.multischemas);
        console.log("data fetched successfully");
        //multischemas = data.multischemas;
        console.log(postslist, "postslist");
        console.log(multischemas, "multischemas");
      }
    }
    fetchfunction();

  }, []);



  //! probabyl make this client component or include - COZ WE WANNA DEFINE WHAT WE WANT A BLOG, AN ARTICLE, A PRODUCT ETC - and we gotta send that to get the corresponding schema
  return (
    <>
      <div>
        <h1>Posts Page</h1>
        <div className="pt-5"  >
          {/* <button onClick={() => createPost()} ></button> */}
          <Link className="" href="/dash/pages/newpage?pagetype=post&schema=blog">Create New: </Link>

          {multischemas.length > 0 && multischemas.map((schema) => (
            <Link key={schema} href={`/dash/pages/newpage?pagetype=post&schema=${schema}`} className="button button-secondary m-3">{schema}</Link>

          ))}
        </div>
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
                <Link href={`/dash/pages/${post._id}?pagetype=post&schema=${post.schema}`} className="">{post.title}</Link>
              </td>
              <td className="">
                <Link href={`/dash/pages/editseo/${post._id}?pagetype=post`} className="">Page SEO settings</Link>
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
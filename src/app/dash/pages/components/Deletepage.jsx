'use client';
import { useEffect } from "react";
import { useRouter } from 'next/navigation';


export default function DeletePage(props) {
  const router = useRouter();

  const { pagetype, pageid, RefreshList1 } = props;
  console.log(pagetype, "pagetypeindeletepage");
  console.log(pageid, "pageidindeletepage");
  const onclickDelete = async (e) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/schema/${pageid}?pagetype=${pagetype}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",

      },
      credentials: 'include', // this is what sends/receives cookie


    });

    if (!response.ok) {
      console.log("respo0nse not ok");
      console.log(response, "response");
    }
    else if (response.ok) {
      console.log("response ok");
      const data = await response.json();
      console.log(data, "data222");
      let urlredirectto;

      RefreshList1(); // Call the RefreshList1 function passed as a prop to refresh the list after deletion
      // const query = window.location.search;
      //window.location.href = '/dash/pages' + query;
      // urlredirectto = '/dash/pages';
      // router.push(router.asPath);
      // router.push(urlredirectto);
    }

  }

  return (
    <>
      <div onClick={onclickDelete}>
        <span>{pagetype}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
        </svg>
      </div>
    </>
    /*  <div className="deletepage">
       <h1>Delete Page</h1>
       <p>Are you sure you want to delete this page?</p>
       <p>Page ID: {pageid}</p>
       <p>Page Type: {pagetype}</p>
       <button className="button button-primary">Delete Page</button>
     </div> */
  )

}
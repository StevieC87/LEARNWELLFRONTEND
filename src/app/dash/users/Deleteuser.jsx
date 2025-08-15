'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import ModalYesNo from '@/components/global/ModalYesNo';

export default function DeletePage(props) {
  const router = useRouter();


  const { userid, RefreshList1, pageindexinarray, pagenumber, totalpageindexes } = props;

  const [showModal, setShowModal] = useState(false);

  const getModalAnswer = (answer) => {
    if (answer) {
      //IF YES, DO TRASH PAGE
      doDeleteUser()
      setShowModal(false);
    }
    else {
      //IF NO, CLOSE MODAL
      setShowModal(false);
    }
  }
  const onclickDelete = async (e) => {
    setShowModal(true);
  }
  function getCsrfToken() {
    if (typeof document !== 'undefined') {
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrfToken='))
        ?.split('=')[1];
    }
    return null; // Return null if running on the server
  }
  const csrfToken = getCsrfToken();

  const doDeleteUser = async () => {
    console.log(pagenumber, 'pagenumber');
    console.log(pageindexinarray, "pageindexinarray111111");
    console.log(typeof pageindexinarray, "typeof pageindexinarray");
    const url = `${process.env.NEXT_PUBLIC_API_URL}/users/deleteuser/${userid}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken


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
      let pageredirectifneedbe
      if (pagenumber > 1 && pageindexinarray === 0 && totalpageindexes === 1) {
        pageredirectifneedbe = pagenumber - 1
        //IF THERE ARE MORE INDEXES AFTER IT
      }

      RefreshList1(pageredirectifneedbe); // Call the RefreshList1 function passed as a prop to refresh the list after deletion
      // const query = window.location.search;
      //window.location.href = '/dash/pages' + query;
      // urlredirectto = '/dash/pages';
      // router.push(router.asPath);
      // router.push(urlredirectto);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center ">

        <svg onClick={onclickDelete} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash cursor-pointer text-center" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
        </svg>
      </div>
      <ModalYesNo
        textchoice={`Are you sure you want to permanently delete this user?`}
        isOpen={showModal}
        changeOpen={setShowModal}
        getModalAnswer={getModalAnswer}
        buttontextconfirm="Yes"
        buttontextcancel="No"
        context='delete'
      />
    </>

  )

}
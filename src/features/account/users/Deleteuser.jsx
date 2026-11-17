'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import ModalYesNo from '@/components/ui/ModalYesNo';

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
    }
    else if (response.ok) {
      const data = await response.json();
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
      <button type="button" className="ui-btn ui-btn-quiet ui-btn-sm is-danger" onClick={onclickDelete}>Delete</button>
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
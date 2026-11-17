'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import ModalYesNo from '@/components/ui/ModalYesNo';
//src/components/global/Modal.jsx
export default function TrashPage(props) {
  const router = useRouter();

  //we would need to know 


  const { pagetype, pageid, RefreshList1, pageindexinarray, pagenumber, totalpageindexes } = props;

  const [showModal, setShowModal] = useState(false);

  const getModalAnswer = (answer) => {
    if (answer) {
      //IF YES, DO TRASH PAGE
      doTrashPage();
      setShowModal(false);
    }
    else {
      //IF NO, CLOSE MODAL
      setShowModal(false);
    }
  }

  const onclickTrash = async (e) => {
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


  const doTrashPage = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/pagesposts/trashpage/${pageid}?pagetype=${pagetype}`;
    const response = await fetch(url, {
      method: "POST",
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

      RefreshList1(pageredirectifneedbe); // Call the 
    }

  }

  return (
    <>
      <button type="button" className="ui-btn ui-btn-quiet ui-btn-sm is-danger" onClick={onclickTrash}>Trash</button>

      <ModalYesNo
        textchoice={`Are you sure you want to move this ${pagetype} to trash?`}
        isOpen={showModal}
        changeOpen={setShowModal}
        getModalAnswer={getModalAnswer}
        buttontextconfirm="Yes"
        buttontextcancel="No"

      />
    </>

  )

}
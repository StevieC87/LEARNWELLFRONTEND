
'use client';

// import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FieldRenderer from '@/app/dash/pages/[edit]/FieldRenderer';
import { useDispatch, useSelector } from "react-redux";
import { updateField } from '@/redux/slices/PagesSlice';
import ModalYesNo from "../../../../components/global/ModalYesNo";
import { useRouter } from 'next/navigation';

export default function UserProfile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const useridparams = searchParams.get('userid'); // Get user ID from URL parameters
  const [userRole, setUserRole] = useState('');
  const [useremail, setUserEmail] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [saved, setSaved] = useState(false);
  const [errorsave, setErrorSave] = useState('');

  const [errormessage, setErrormessage] = useState('');
  const [successmessage, setSuccessmessage] = useState('');

  const [userschemafields, setUserschemafields] = useState(null);
  const [fieldsdata, setFieldsData] = useState(null);
  const [fieldswithdataifany, setFieldsWithDataIfAny] = useState(null);
  const currentuserrole = useSelector((state) => state.DashSlice.userrole);

  const reduxfieldsdata = useSelector((state) => state.PagesSlice.fields);
  const [fieldsdatatosend, setFieldsDataForSend] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [triggerfetch, setTriggerFetch] = useState(0); // For re-fetching data

  const [twofactorenabled, setTwoFactorEnabled] = useState(false);

  //,FIRST WE FETCH SCHEMA AND FIELDS DATA
  useEffect(() => {

    const fetchprofile = async () => {
      try {
        const fetchprofile = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/getuserprofile?userid=${useridparams}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // This is important for cookies to be sent
          }
        );
        if (!fetchprofile.ok) {
          setErrormessage('Failed to fetch user profile');
          console.log('Failed to fetch user profile:', fetchprofile.statusText);
          return;
        }
        setLoaded(true); // Set loaded to true after fetching data
        const data = await fetchprofile.json();
        console.log('User profile data:', data);
        setUserschemafields(data.schemaFields); // Set schema fields for display
        setFieldsData(data.fieldsdata); // Set fields data for display
        console.log(data.fieldsdata, 'fieldsdatafromprofile page');
        setUserId(data.fieldsdata._id);
        setUserRole(data.fieldsdata.role); // Set user role for display
        console.log(data.fieldsdata.role, 'userrole from profile page');
        setTwoFactorEnabled(data.fieldsdata.twoFactorEnabled || false); // Set two-factor authentication status
        // Set user ID for display
        /*      setUserEmail(data.email); // Set user email for display
             setUserRole(data.userrole); // Set user role for display
             setUsername(data.username); // Set username for display
             setUserId(data._id); // Set user ID for display */


      }
      catch (error) {
        setErrormessage('An error occurred while fetching user profile');
        console.log('Error fetching user profile:', error);
      }



    }
    fetchprofile();
  }, [triggerfetch])


  //, THEN WE MERGE THEM TOGETHER AND SET THEM TO STATE AND REDUX
  useEffect(() => {
    if (!userschemafields || !fieldsdata) {
      console.log("Schema fields or fields data not available yet")
      return
    }
    console.log('helooo')
    if (userschemafields && fieldsdata) {
      console.log('overher1234')
      console.log(userschemafields, 'userschemafields userschemafieldsuserschemafields')
      console.log(fieldsdata, 'fieldsdata2222')
      const fieldsWithData = userschemafields.map(field => {
        console.log(field, "field in UserProfile")
        const fieldData = fieldsdata[field.name];
        console.log(fieldData, "fieldData111 in UserProfile")
        return {
          ...field,
          value: fieldData ? fieldData : ''
        };
      });
      setFieldsWithDataIfAny(fieldsWithData);
      console.log(fieldsWithData, "fieldsWithData in UserProfile");

      //ADD THEM TO TEH REDUX - BECAUSE THAT'S HOW I SET UP THE FIELD RENDERER TO WORK 
      fieldsWithData.forEach((item) => {
        console.log(item, 'mergedinitialitem')
        dispatch(updateField({
          name: item.name, content: item.value || '',
          type: item.type || '',
          required: item.required || false,
          placeholder: item.placeholder || '',
          label: item.label || item.name || '',
          // fields: item.fields || null
        }))
      });
    }


  }, [userschemafields, fieldsdata]);


  //, THEN WE GET LATEST FIELDS FROM REDUX - TO SEND EM
  useEffect(() => {

    if (!reduxfieldsdata) {
      console.log("Redux fields data not available yet")
      return
    }
    let fieldswithdataifany2 = Object.values(reduxfieldsdata).map((field) => {
      return {
        name: field.name,
        content: field.content,
      }
    })
    console.log(fieldswithdataifany2, "fieldswithdataifany2")
    //  setFieldsWithDataIfAny(fieldswithdataifany2);
  }, [reduxfieldsdata]);

  const changepassword = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/forgotpasswordrequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: useremail }),
    });
    if (
      response.status === 429
    ) {
      setErrormessage("You tried too many times. Please try again later.");
    }
    if (
      response.status === 200
    ) {
      // setSending(false);
      setSuccessmessage("We have sent a password reset link to your email.");
      //setErrormessage("Reset link sent to your email");

    }
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
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const sendfields = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/updateuserprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({
          fields: reduxfieldsdata,
          userId: userId,
          userRole: userRole,
        }),
        credentials: 'include', // Include cookies in the request
      });
      if (!sendfields.ok) {
        console.log('fetchnotok');
        setSaved(false);
        setErrorSave('Failed to update user profile. Please try again.');
        return;
      }
      const data = await sendfields.json();
      console.log(data, "result from save user profile");


      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      setSuccessmessage('User profile updated successfully');
      setErrormessage('');
    }

    catch (error) {
      console.log('Error updating user profile:', error);
      setSaved(false);
      setErrorSave('Failed to update user profile. Please try again.');
    }



  }

  const [showModal, setShowModal] = useState(false);

  const getModalAnswer = (answer) => {
    if (answer) {
      //IF YES, DO TRASH PAGE
      //doDeletePage()
      disable2fa();

      setShowModal(false);
    }
    else {
      //IF NO, CLOSE MODAL
      setShowModal(false);
    }
  }

  //,here do fetch disable 

  const disable2fa = async () => {
    //alert('Disabling Two-factor Authentication');
    const fetchdisable2fa = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/disable2fa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userid: userId }),
      credentials: 'include', // Include cookies in the request
    });
    if (!fetchdisable2fa.ok) {
      console.log('Failed to disable Two-factor Authentication');
      setErrormessage('Failed to disable Two-factor Authentication');
      return;
    }

    setTriggerFetch(triggerfetch + 1); // Increment trigger to re-fetch data


  }

  return (
    <>
      <ModalYesNo
        textchoice={`Are you sure you want to disable Two-factor Authentication?`}
        isOpen={showModal}
        changeOpen={setShowModal}
        getModalAnswer={getModalAnswer}
        buttontextconfirm="Yes"
        buttontextcancel="No"
        context="delete"
      />
      {!loaded && <div></div>}
      {fieldswithdataifany && fieldswithdataifany.length > 0 && (
        <form className="card">
          <div className="flex flex-row justify-between items-center align-center">
            <h1 className="pb-10">User profile</h1>
            <button className="button button-primary" type="submit" onClick={(e) => onSubmit(e)}>
              {saved ? 'Saved!' : 'Save'}
              {errorsave && <span className="text-red-500">{errorsave}</span>}
            </button>
          </div>

          <div className="flex flex-col">
            {fieldswithdataifany.map((field, index) => (
              <FieldRenderer
                key={index}
                name={field.name}
                value={field.value || ''}
                type={field.type}
                required={field.required || ''}
                placeholder={field.placeholder || ''}
                label={field.label || field.name || ''}
                source="userprofile"
                fielddata={field}
                onChange2={(name, value) => { }}
              />
            ))}
          </div>
          {(currentuserrole === 'admin' || currentuserrole === 'superadmin') && (
            <div>
              <div className="mt-4">
                <label htmlFor="role">Role: </label> <span>{userRole}</span>
              </div>
              <label htmlFor="">Edit Role: </label>
              <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                <option value="superadmin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="author">Author</option>
                <option value="contributor">Contributor</option>
                <option value="registered">Registered</option>
              </select>
            </div>
          )}
          <input
            type="hidden"
            value={userId}
            onChange={(e) => {
              console.log('donothing');
            }}
          />
          <div>
            <label htmlFor="password">Password: </label>
            <button className="button button-outline changepassbutton" onClick={() => changepassword()}>
              Change password
            </button>
            <div>
              <span className="text-green-500">{successmessage}</span>
              <span className="text-red-500">{errormessage}</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="poppinsSemiBold">Two-factor Authentication</span>

            {!twofactorenabled && (
              <button className="button button-outline ml-5"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default form submission
                  router.push('/dash/users/profile/twofactor');
                }}
              /* ?userid=' + useridparams */
              >
                Enable</button>
            )}
            {twofactorenabled && (
              <button
                className="button button-outline ml-5"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default form submission
                  setShowModal(true);
                }}
              >
                Disable
              </button>
            )}
          </div>

        </form>
      )}
    </>
  );
}
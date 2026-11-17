'use client';
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function RelationField({ name, value, label, onChange, options, placeholder, required, disabled, relation }) {

  const [relationS, setRelation] = useState(relation || null);
  const [relationData, setRelationData] = useState([]);

  const currentuserid = useSelector((state) => state.DashSlice.userid);

  const [valueofselectid, setValueOfSelectId] = useState(value || '');

  useEffect(() => {
    const asyncfetch = async () => {
      const fetchrelation = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pagesposts/relation/${relationS}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        }

      );
      if (!fetchrelation.ok) {
      }
      else {
        const data = await fetchrelation.json();
        setRelationData(data.data);
      }


    }

    asyncfetch()

    if (relationS === 'users') {
      // Set the default value to the current user ID if relation is 'users'
      setValueOfSelectId(currentuserid);
    }

  }, [relation]);

  useEffect(() => {



  }, [name, value, label, onChange, options, placeholder, required, disabled, relation]);



  const customonChange = (e) => {
    const selectedValue = e.target.value;
    setValueOfSelectId(selectedValue);
    onChange(e); // Call the passed onChange function
  };

  return (
    <>
      <strong>{label}</strong>
      {/* MAKE IT MATCH CURRENT AUTHOR BY DEFUALT BY ID  */}
      <select name="" id="" onChange={(e) => customonChange(e)} value={valueofselectid}  /*className="form-select" required={required} disabled={disabled} */>
        {/*   <option >Select Author</option> */}
        {relationData && relationData.length > 0 && relationData.map((item, index) => (

          <option value={item._id} key={index}>{item.username}</option>


          /*  <div key={index}>
             <h3>{item.title}</h3>
             <p>{item.description}</p>
           </div> */
        ))}
      </select>

    </>
  )

}
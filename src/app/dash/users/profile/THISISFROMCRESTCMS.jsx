'use client';
import './editpage.css'
import { useEffect, useState } from 'react';
import { ObjectId } from 'bson';

export default function EditPageComp(props) {

  //. SO I THINK: UNFILTERED FIELDS: all languages
  //. filteredFieldsS: only selected language (FOR DISPLAY)

  const { multilingalBool, multilingualLangs, fieldsdata, pagedata } = props
  const [selectedLang, setSelectedLang] = useState(multilingualLangs[0]);
  const [filteredFieldsS, setFilteredFieldsS] = useState([]);
  const [unfilteredFields, setUnfilteredFields] = useState(fieldsdata);
  const [fieldid, setFieldId] = useState("");


  const pageid = fieldsdata ? fieldsdata[0]?.belongsto : "0";
  const author = 1;

  console.log('pageid', pageid)
  console.log('fieldsdata', fieldsdata);
  useEffect(() => {
    if (unfilteredFields && unfilteredFields.length > 0) {
      console.log("unfilteredFields", unfilteredFields);
      const filteredFields = unfilteredFields.map((field) => {
        const langContent = field?.content?.find(c => c.locale === selectedLang);
        const currentVersion = langContent?.versions.find(v => v.isCurrent);

        return {
          _id: field._id,
          field: field.field,
          author: field.author,
          content: currentVersion?.content || '',
        };
      });
      setFilteredFieldsS(filteredFields);
      console.log(filteredFields, "filteredFields222");
    }
  }, [unfilteredFields, selectedLang]);

  useEffect(() => {
    console.log("filteredFieldsS123123", filteredFieldsS);

  }, [filteredFieldsS]);
  // const getCurrentVersion 
  //could get numer of langueaes, exclude current, and add new one for each

  // CREATING NEW FIELD - TESTING

  function CreateNewField() {
    //IM THINKING NOW - first thought - SAVE IT STRAIGHT AWAY - return id
    let newfieldobject = {
      _id: new ObjectId(),
      belongsto: pageid,
      author: author,
      field: "",
      content: [],
      isNew: true,

    }

    let arrayempty = []
    const contentnewfield = multilingualLangs.forEach((lang) => {

      let object = {
        locale: lang,
        versions: [
          {
            isCurrent: '',
            content: "",
            //timestamp: new Date(),
          },
        ],
      }
      //arrayempty.push(object)
      newfieldobject.content.push(object)
    });
    // return newfieldobject;
    // fieldsdata.push(object);
    setUnfilteredFields((prevFields) => [...prevFields, newfieldobject]);
    //console.log(fieldsdata, "fieldsdataAFTERPUSH");
    // console.log(newfieldobject, "newfieldobject");
  }

  const onChangeField = (e) => {
    const fieldType = e.target.dataset.type; // Get the type of field (blockname or blockcontent)
    const fieldId = e.target.id.split("-")[0]; // Extract the field ID from the input ID
    const newValue = e.target.value; // Get the new value

    //GET PREVIOUS VALUE

    const now = new Date().toISOString();

    setUnfilteredFields((prevFields) => {
      return prevFields.map((field) => {
        if (field._id.toString() === fieldId) {
          return {
            ...field,
            content: field.content.map((entry) => {
              if (entry.locale === selectedLang) {
                const updatedVersions = [
                  ...entry.versions.map((v) => ({ ...v, isCurrent: false })),
                  {
                    isCurrent: true,
                    content: newValue,
                    timestamp: now,
                  },
                ]
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .slice(0, 3);

                return {
                  ...entry,
                  versions: updatedVersions,
                };
              }
              return entry;
            }),
          };
        }
        return field;
      });
    });




    /*  setFilteredFieldsS((prevFields) =>
         prevFields.map((field) => {
           if (field._id.toString() === fieldId) {
             // Update the correct field
             return {
               ...field,
               [fieldType === "blockname" ? "field" : "content"]: newValue,
             };
           }
           return field;
         })
       ); */
  }
  //TO SAVE: PROBABLY HAVE TO FIND THEM IN THE FIELDS ARRAY AND REPLACE THE CONTENTS



  const SaveFields = async () => {
    //. every field is a separate record in the db 
    // so we COULD make a copy o the fields original - and compare them, and only send the ones that are different
    // OR i SEND ALL OF THEM - REGARDLESS if change -> OVERWRITE
    //START WITH B
    //NO WE SEND THE WHOLE UNFILTERED FIELDS, NOT EACH INDIVIDUAL
    //UNLESS WE SAVE EM EACH ON CHANGE (NO 'save' button )
    //BUT there's a MICROINTERACTION to show it as been saved


    //SEND UNFILTERED FIELDS TO THE BACKEND - with ID

    /* const savefieldsbulk = filteredFieldsS.map(async (field) => {
      const { isNew, ...cleanField } = field;
      if (isNew) {
        const fetchpost = await fetch('http://localhost:3000/pages/insertnewfield', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...cleanField
          }),
        });
        if (!fetchpost.ok) {
          console.log("respo0nse not ok");
          delete field.isNew;
          //setFilteredFieldsS((prevFields) => [...prevFields, field]);
          setFilteredFieldsS([...fields])
        }
      }
    }) */
  }

  return (
    <>
      <div className="editpagecontainer">

        <div className="topbuttons p-4">
          {multilingalBool && (
            <div className="langpicker flex flex-row gap-5">
              <label htmlFor="lang" className="block text-sm font-medium text-gray-700 self-center">
                Language</label>
              <select name="" id="" onChange={(e) => setSelectedLang(e.target.value)}>
                {multilingualLangs.map((lang) => {
                  return (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  );
                })}
              </select>

            </div>
          )}

          <button className="button button-primary">Save</button>
        </div>





        <h1 className="">Edit {pagedata?.title} </h1>



        <div>
          {filteredFieldsS.map((field) => (

            <div key={field._id} className="fielddivblock">
              <label htmlFor={field.field} className="block text-sm font-medium text-gray-700">Text Block Title

              </label>
              <input
                type="text"
                className="editfield"
                data-type="blockname"
                id={`${field._id.toString()}-fieldid`}
                name={field.field}
                value={field.field}
                onChange={onChangeField}
              />
              <label htmlFor={field.field} className="block text-sm font-medium text-gray-700">Text Block Content

              </label>
              <input
                type="text"
                data-type="blockcontent"
                id={`${field._id.toString()}-contentid`}
                name={field.content}
                value={field.content}
                onChange={onChangeField}
              />
            </div>

          ))}


        </div>

        <div className="flex flex-col gap-5" style={{ width: "300px" }}>
          <button onClick={CreateNewField} className="button button-primary">+</button>


        </div>
      </div>

    </>
  )
}
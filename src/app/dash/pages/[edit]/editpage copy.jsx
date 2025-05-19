'use client';

import { useState } from 'react';

export default function EditPageComp(props) {

  const { multilingalBool, multilingualLangs, fieldsdata, pagedata } = props
  const [selectedLang, setSelectedLang] = useState(multilingualLangs[0]);

  const GetCurrentLanguageField = (currentlang, arraycontent) => {

  }

  // const getCurrentVersion 

  return (
    <>
      {multilingalBool && (

        <div className="langpicker">
          <label htmlFor="lang" className="block text-sm font-medium text-gray-700">
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
          {selectedLang}
        </div>
      )}
      <div className="">
        <h1 className="">Edit {pagedata.title} Page</h1>
        <p className="">This is the edit page</p>

        <div>
          {fieldsdata.map((field) => {
            return (
              <div key={field._id} className="mb-4">
                <span>{field.author}</span>
                <span>hello</span>
                <label htmlFor={field.field} className="block text-sm font-medium text-gray-700">
                  {field.field}
                </label>
                {field.content.map((content, index) => {
                  return (
                    <>
                      {/*   {GetCurrentLanguageField(selectedLang, content)} */}
                      <div key={content.locale}>
                        {content.locale === selectedLang && (
                          <>

                            {content.versions.map((version, index) => {
                              if (version.isCurrent) {
                                return (
                                  <div key={index}>
                                    <span>{version.isCurrent ? 'Current' : 'Not Current'}</span>
                                    <label htmlFor={field.field} className="block text-sm font-medium text-gray-700">
                                      {field.field}
                                    </label>
                                    <input
                                      type="text"
                                      id={field.field}
                                      name={field.field}
                                      defaultValue={version.content}
                                    />
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </>

                        )}
                      </div>

                    </>
                  )
                })}
              </div>
            )

          }
          )}

        </div>

        <p>Here you can edit the page</p>
      </div>
    </>
  )
}
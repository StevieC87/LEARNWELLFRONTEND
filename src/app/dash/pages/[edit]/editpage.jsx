'use client';
import './editpage.css'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import PageContentTab from './components/PageContentTab';
import SEOTab from './components/SEOTab';
import JsonLDPage from './components/jsonld/page';

export default function EditPageComp(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  //.  GET DATA FROM PROPS  ------------------------

  const { schema, settings, pagefieldsdata, pagedata, neworexisting, pageid, pagetype, language, pagetitle, publishstatus, triggerrefreshonsavechild, frontendcomponent,
    numberofdrafts, latestdraftcreationdate, remainingdraftsv, precedingdraftsv, totalnumberofdraftsv, islatestversion
  } = props;
  console.log(schema, 'schemainEditPageComp');
  const schematype = schema.name;
  const [pagecontent, setPageContent] = useState(true);
  const [seocontentvisible, setSEOVisible] = useState(false);
  const [jsonldvisible, setJsonldVisible] = useState(false);

  const toggleTabs = (tab) => {
    if (tab === "pagecontent") {
      setPageContent(true);
      setSEOVisible(false);
      setJsonldVisible(false);
    }
    else if (tab === "seocontent") {
      setSEOVisible(true);
      setPageContent(false);
      setJsonldVisible(false);
    }

    else if (tab === "jsonld") {
      setPageContent(false);
      setSEOVisible(false);
      setJsonldVisible(true);
    }
  }


  return (
    <>
      <div /* className={`editpagecontainer fade-in2 `} */>
        <div className="formtabs flex flex-row">
          <button onClick={(e) => toggleTabs('pagecontent')} className={`${pagecontent ? 'activetab' : ''} button button-outline tabbutton`}>Content</button>
          <button onClick={(e) => toggleTabs('seocontent')} className={`${seocontentvisible ? 'activetab' : ''} button button-outline tabbutton`}>SEO</button>
          {(schematype === 'Blog' || schematype === 'Article') && (
            <button onClick={(e) => toggleTabs('jsonld')} className={`${jsonldvisible ? 'activetab' : ''} button button-outline tabbutton`}>JSON-LD</button>
          )}
        </div>

        <div id="pagecontent" className={`pagecontent ${pagecontent ? 'visible' : 'hidden'}`}>
          <div className="formlabelvertical">
            {pagecontent && (
              <PageContentTab
                schema={schema}
                settings={settings}
                pagefieldsdata={pagefieldsdata}
                pagedata={pagedata}
                neworexisting={neworexisting}
                pageid={pageid}
                pagetype={pagetype}
                language={language}
                pagetitle={pagetitle}
                publishstatus={publishstatus}
                triggerrefreshonsavechild={triggerrefreshonsavechild}
                frontendcomponent={frontendcomponent}
                numberofdrafts={numberofdrafts}
                latestdraftcreationdate={latestdraftcreationdate}
                remainingdraftsv={remainingdraftsv}
                precedingdraftsv={precedingdraftsv}
                totalnumberofdraftsv={totalnumberofdraftsv}
                islatestversion={islatestversion}
              />
            )}
          </div>
        </div>
        <div id="seocontent" className={`seocontent ${seocontentvisible ? 'visible' : 'hidden'}`}>
          <div className="formlabelvertical">
            {seocontentvisible && (
              <SEOTab pageid={pageid} />
            )}
          </div>
        </div>
        <div id="metatagscontent" className={`seocontent ${jsonldvisible ? 'visible' : 'hidden'}`}>
          <div className="formlabelvertical">
            {jsonldvisible && (
              <JsonLDPage />

            )}
          </div>
        </div>



      </div>

    </>
  )
}
"use client";
import { useEffect, useState } from "react";
import EditPageComp from "@/features/cms/pages/edit/editpage";
//import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { setSelectedLanguage, setMultilingualSharedId } from '@/redux/slices/DashSlice';

export default function EditPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const edit = params.edit;
  const pageid = edit;
  const schemaq = searchParams.get('schema');
  const pagetype = searchParams.get('pagetype');
  const language = searchParams.get('language');
  const [settings, setSettings] = useState();
  const [pagefieldsdata, setPageFieldsData] = useState([]);
  const [pagedata, setPageData] = useState();
  const [schema, setSchema] = useState();
  const [neworexisting, setNewOrExisting] = useState();
  const [pageidfromserver, setPageIdFromServer] = useState();
  const [existingpagenewerror, setExistingPageNewError] = useState(false);
  const [loaderror, setLoadError] = useState('');
  const [data, setData] = useState({})

  const selectedLanguage = useSelector((state) => state.DashSlice.selectedLanguage);
  const multilingualsharedid = useSelector((state) => state.DashSlice.multilingualsharedid);
  const defaultlanguage = useSelector((state) => state.DashSlice.settings.defaultlanguage);


  const pageexiststhislanguage = useSelector((state) => state.DashSlice.pageexiststhislanguage);

  const [publishstatus, setPublishStatus] = useState(false);
  const [frontendcomponent, setFrontendComponent] = useState('');
  const [numberofdrafts, setNumberOfDrafts] = useState(0);
  //when load, tell us the latest draft creation date
  //if it exists
  const [latestdraftcreationdate, setLatestDraftCreationDate] = useState(null); // 
  const [triggerrefresh, setTriggerRefresh] = useState(0);


  const [remainingdraftsv, setRemainingDrafts] = useState(0);
  const [precedingdraftsv, setPrecedingDrafts] = useState(0);
  const [totalnumberofdraftsv, setTotalNumberOfDrafts] = useState(0);
  const [islatestversion, setIsLatestVersion] = useState(false);
  useEffect(() => {
    // a newer load (another language, page or schema) supersedes this one
    let stale = false;
    const FetchPageData = async () => {
      let url;
      //set URL depending if new/existing page
      if (pageid === "newpage") {

        url = `${process.env.NEXT_PUBLIC_API_URL}/pagesposts/schema/newpage?pagetype=${pagetype}&schemaname=${schemaq}`;
      }
      else if (pageid !== "newpage") {
        url = `${process.env.NEXT_PUBLIC_API_URL}/pagesposts/schema/${pageid}?pagetype=${pagetype}&schemaname=${schemaq}&language=${language}&multilingualsharedid=${multilingualsharedid}`;
      }
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",

          },
          cache: 'no-store',
          credentials: 'include', // this is what sends/receives cookie
        });
        if (stale) return;
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          if (stale) return;
          // drop the previous page's data: left on screen, a save would write it under the new params
          setData({});
          setExistingPageNewError(data.erroris === 'pageexists');
          setLoadError(data.error || data.message || 'This page could not be loaded.');
        }
        else if (response.ok) {
          const data = await response.json();
          if (stale) return;
          setExistingPageNewError(false);
          setLoadError('');
          setData(data);
          setSchema(data.schema);
          setSettings(data.settings);
          setPageFieldsData(data.pagefieldsdata);

          setPageData(data.pagedata);
          setNewOrExisting(data.neworexisting);
          setPageIdFromServer(data.pageid);
          if (!selectedLanguage && data.settings) {
            dispatch(setSelectedLanguage(data.settings.defaultlanguage))
          };
          dispatch(setMultilingualSharedId(data.multilingualsharedid));
          setPublishStatus(data.publishstatus);
          setFrontendComponent(data.frontendcomponent)
          setNumberOfDrafts(data.pagedata?.numberofdrafts || 0);
          //latestdraftcreationdate, 
          setLatestDraftCreationDate(data.pagedata?.latestdraftcreationdate || null);
          setRemainingDrafts(data.remainingdrafts)
          setPrecedingDrafts(data.precedingdrafts);
          setTotalNumberOfDrafts(data.totalnumberofdrafts);
          setIsLatestVersion(data.islatestversion);


        }

      } catch (error) {
        if (stale) return;
        setData({});
        setLoadError('This page could not be loaded. Check your connection and reload.');
      }
    }
    FetchPageData();
    return () => { stale = true; };
    // multilingualsharedid is read, not watched: every load and save writes it back to redux
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerrefresh, pageid, pagetype, schemaq, language]);

  const triggerrefreshonsavechild = () => {
    setTriggerRefresh(prev => prev + 1);
  }
  return (
    <>
      {loaderror && (
        <p className="ui-status is-error">
          {existingpagenewerror ? 'This page already exists in this language.' : loaderror}
        </p>
      )}
      {data && Object.keys(data).length > 0 && (
        <>

          <EditPageComp
            schema={schema}
            settings={settings}
            pagefieldsdata={pagefieldsdata}
            pagedata={pagedata}
            neworexisting={neworexisting}
            pageid={pageidfromserver}
            pagetype={pagetype}
            language={language || selectedLanguage}
            pagetitle={pagedata ? pagedata.title : ""}
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


        </>
      )}

      {/* <EditPageComp
        schema={schema}
        
      />   */}
      {/*   {data.existingpagenewerror && (
        <span>Page already exists</span>
      )} */}
      {/*      {!data.existingpagenewerror && ( */}
      {/*  */}
      {/* )} */}
    </>
  );
}
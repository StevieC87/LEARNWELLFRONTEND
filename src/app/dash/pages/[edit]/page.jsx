"use client";
import { useEffect, useState } from "react";
import EditPageComp from "./editpage";
import { ObjectId } from 'bson';
//import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { setSelectedLanguage, setMultilingualSharedId } from '../../../../redux/slices/DashSlice';

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
    console.log(triggerrefresh, "triggerrefreshinuseEffect");
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
        if (!response.ok) {
          console.log("respo0nse not ok");
          console.log(response, "response");
          const data = await response.json();
          console.log(data, "data321");
          console.log(data.erroris, "data.erroris");
          if (data.erroris === 'pageexists') {
            setExistingPageNewError(true);
            console.log(existingpagenewerror, "existingpagenewerror");
          }
          else {
            setExistingPageNewError(false);
          }

        }
        else if (response.ok) {
          console.log("response ok");
          const data = await response.json();
          setData(data);
          console.log(data, "data123321");
          setSchema(data.schema);
          setSettings(data.settings);
          console.log(data.pagefieldsdata, 'datapagefieldsdata12121')
          setPageFieldsData(data.pagefieldsdata);

          setPageData(data.pagedata);
          console.log(data.pagedata, "pagedatapagedata");
          setNewOrExisting(data.neworexisting);
          setPageIdFromServer(data.pageid);
          if (!selectedLanguage) {
            dispatch(setSelectedLanguage(data.settings.defaultlanguage))
          };
          dispatch(setMultilingualSharedId(data.multilingualsharedid));
          setPublishStatus(data.publishstatus);
          setFrontendComponent(data.frontendcomponent)
          setNumberOfDrafts(data.pagedata.numberofdrafts);
          //latestdraftcreationdate, 
          setLatestDraftCreationDate(data.pagedata.latestdraftcreationdate || null);
          setRemainingDrafts(data.remainingdrafts)
          console.log('precedingdraftsBEFORE', data.precedingdrafts);
          setPrecedingDrafts(data.precedingdrafts);
          setTotalNumberOfDrafts(data.totalnumberofdrafts);
          setIsLatestVersion(data.islatestversion);


        }

      } catch (error) {
        console.log("error", error);
      }
    }
    FetchPageData();
  }, [triggerrefresh]); //

  const triggerrefreshonsavechild = () => {
    console.log('triggerrefreshonsavechild called');
    setTriggerRefresh(prev => prev + 1);
  }
  return (
    <>
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
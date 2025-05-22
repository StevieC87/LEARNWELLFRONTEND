"use client";
import { useEffect, useState } from "react";
import EditPageComp from "./editpage";
import { ObjectId } from 'bson';

export default function EditPage({ params, searchParams }) {
  const [data, setData] = useState({
    schema: null,
    settings: null,
    pagefieldsdata: [],
    pagedata: null,
    neworexisting: null,
    pageidfromserver: null,
    existingpagenewerror: false,
  });

  useEffect(() => {
    let createID = new ObjectId().toString();
    let existingpagenewerror = false;
    const { edit } = params;
    const pageid = edit;
    const pagetype = searchParams.pagetype;
    let schema;
    if (edit === "newpage") {
      schema = searchParams.schema;
    }
    let url;
    if (pageid === "newpage") {
      url = `http://localhost:3000/schema/newpage?pagetype=${pagetype}&schemaname=${schema}`;
    } else if (pageid !== "newpage") {
      url = `http://localhost:3000/schema/${pageid}?pagetype=${pagetype}`;
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (!response.ok) {
        const data = await response.json();
        if (data.erroris === 'pageexists') {
          existingpagenewerror = true;
        }
        setData(prev => ({
          ...prev,
          existingpagenewerror
        }));
      } else {
        const dataRes = await response.json();
        setData({
          schema: dataRes.schema,
          settings: dataRes.settings,
          pagefieldsdata: dataRes.pagefieldsdata,
          pagedata: dataRes.pagedata,
          neworexisting: dataRes.neworexisting,
          pageidfromserver: dataRes.pageid,
          existingpagenewerror: false,
        });
      }
    });
    // eslint-disable-next-line
  }, [params, searchParams]);

  return (
    <>
      {data.existingpagenewerror && (
        <span>Page already exists</span>
      )}
      {!data.existingpagenewerror && (
        <EditPageComp
          schema={data.schema}
          settings={data.settings}
          pagefieldsdata={data.pagefieldsdata}
          pagedata={data.pagedata}
          neworexisting={data.neworexisting}
          pageid={data.pageidfromserver}
          pagetype={searchParams.pagetype}
        />
      )}
    </>
  );
}
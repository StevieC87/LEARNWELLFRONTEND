'use client'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsPopupInfoOpen, setPopupInfo, setPopupInfoPosition } from "@/redux/slices/UISlice";


export default function (props) {
  const dispatch = useDispatch();
  const { field } = props
  const Arraymetafieldsinfo = [
    {
      field: "metaTitle",
      info: "Shown in browser tab and search results. Keep under 60–64 characters. Keep it concise and unique per page. By default, it uses the page title but you can edit it and make it 'custom'. After you make it 'custom', it will not change automatically if you change the page title, until you make it 'default' again and save",
    },
    {
      field: "metaDescription",
      info: "Displayed in search engine results. Keep under 155–160 characters. By default, it uses the page summary but you can edit it and make it 'custom'. After you make it 'custom', it will not change automatically if you change the page summary, until you make it 'default' again and save",
    },
    {
      field: "ogTitle",
      info: "This is the title that will be shown when the page is shared on social media platforms like Facebook, Twitter, LinkedIn, etc. By default it uses the page title but you can edit it and make it 'custom'. After you make it 'custom', it will not change automatically if you change the Ppage title, until you make it 'default' again and save",
    },
    {
      field: "ogDescription",
      info: "Description for Open Graph. Should match or complement Meta Description. Used by social platforms. By default, it uses the 'summary' field but you can edit it and make it 'custom'. After you make it 'custom', it will not change automatically if you change the 'summary' field, until you make it 'default' again and save",
    },
    {
      field: "ogImage",
      info: "Image for social sharing. This is what will be shown when the page is shared on social media platforms like Facebook, Twitter, LinkedIn, etc. Recommended size: 1200x630px. Minimum recommended image size: 300×157 pixels. Use JPG/ PNG/WEBP format. By default will use the default image set in the Site Details section."
    },
    {
      field: "twitterCardType",
      info: "This is for sharing on X (former Twitter). If the OG Image is size: 1200x630px, then you can use 'summary_large_image'. If the image is smaller, then select 'summary'. "
    },
    {
      field: "OGSitename",
      info: "Name of your website  This is what will be shown when the page is shared on social media platforms like Facebook, Twitter, LinkedIn, etc. By default, it uses the site name set in the Site Details section."
    },
    {
      field: "robots",
      info: "This is for search engines. The default is index,follow which means search engines can index this page and follow links on it. You can change it to noindex, nofollow to prevent search engines, for drafts or private pages."
    },
    {
      field: "canonicalUrl",
      info: "Preferred URL for this page. Avoids duplicate content issues. One per page."
    },
    {
      field: "hreflang",
      info: "This is for multilingual SEO. Matches language and regional versions. Use ISO codes. Example: en:/en, fr:/fr. Required for multilingual sites to indicate language/region alternate URLs. You can use e.g. 'fr' but ideally, for better SEO, you should use 'fr-FR' for France, 'fr-CA' for Canada, etc. This is required for multilingual sites to indicate language/region alternate URLs."
    },
    {
      field: "ogType",
      info: "Open Graph object type. Example: website, article, product. Required by Open Graph protocol."
    }

  ]
  const [fieldinfo, setFieldinfo] = useState({});

  const ispopupinfoopen = useSelector((state) => state.UISlice.ispopupinfoopen);


  const openPopup = (e) => {
    let fieldinfobyfieldname = Arraymetafieldsinfo.find((item) => item.field === field);
    console.log(fieldinfobyfieldname, "fieldinfobyfieldnamefieldinfobyfieldname");
    //setFieldinfo(fieldinfobyfieldname || {});
    // console.log("fieldinfofieldinfofieldinfofieldinfo", fieldinfo);

    dispatch(setPopupInfo(fieldinfobyfieldname || {}));
    dispatch(setIsPopupInfoOpen(!ispopupinfoopen));


    let positions = getPosition(e);
    console.log(positions, "positionspositionspositionspositionspositions");
    dispatch(setPopupInfoPosition(positions.positions));

  }

  //get browser size
  const [browserWidth, setBrowserWidth] = useState(window.innerWidth);




  useEffect(() => {
    const handleResize = () => setBrowserWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  //function get x and y position of the svg icon
  const getPosition = (e) => {
    const rect = e.target.getBoundingClientRect();
    let x
    if (browserWidth < 768) {
      x = rect.left + window.scrollX
    }
    else if (browserWidth >= 768) {
      x = rect.left + window.scrollX - 290; // add 20px to the left position
    }

    let y = rect.top + window.scrollY + 20;

    return {
      positions: {
        x: x,
        y: y
      },
    };

  }


  return (
    <>

      <div id="popupicondiv" className="popupicondiv">
        <svg id="popupsvg" onClick={(e) => openPopup(e)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle cursor-pointer" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
        </svg>
      </div>
    </>
  )
}
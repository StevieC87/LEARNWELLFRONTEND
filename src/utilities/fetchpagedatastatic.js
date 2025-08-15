//FOR STATIC PAGES - TO AVOID
/* pagedata: data.pagedata,
pagefields: data.pagefields,
pagefieldsarray: data.pagefieldsarray, */
export const FetchpagedataStatic = async (
  previewyesno,
  previewtoken,
  slugpath
) => {
  let response;
  if (previewyesno) {
    console.log("Fetching page data for preview mode");
    response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/monolingualpreview/${slugpath}?previewtoken=${previewtoken}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } else {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/monolingual/${slugpath}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch page data for ${slugpath}`);
    return false;
  } else {
    let data = await response.json();
    return {
      data: data,
      // frontendcomponent: data.frontendcomponent,
      pageData: data.pageData,
      pagefieldsarray: data.pagefieldsarray,
      showerror: false,
      message: "Page data fetched successfully",
    };
  }
};

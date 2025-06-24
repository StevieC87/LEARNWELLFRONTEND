'use client';
import { useEffect, useState } from 'react';



export default function LineAnalyticsPerc(props) {

  const { topcountriestotalvisits, thiscountryvisits, thiscountryname } = props;

  const [countrypercentage, setCountryPercentage] = useState(0);

  const [linewidth, setLineWidth] = useState(0);

  useEffect(() => {

    console.log(topcountriestotalvisits, 'topcountriestotalvisits');
    console.log(thiscountryvisits, 'thiscountryvisits');

    let getpercentage = (thiscountryvisits / topcountriestotalvisits) * 100;
    //roundit up integer
    getpercentage = Math.round(getpercentage);
    setCountryPercentage(getpercentage.toFixed(2));
    console.log(getpercentage, 'getpercentage');

    let getwidth = getpercentage * 3;
    console.log(getwidth, 'getwidth');
    console.log(thiscountryname, 'thiscountryname');
    setLineWidth(getwidth);


  }, [topcountriestotalvisits, thiscountryvisits]);

  return (
    <>
      <style jsx>{`
    .line-analytics-perc {
      height: 1px;
      background-color: blue;
     
    }
      
  `}</style>


      <div style={{ position: 'relative', width: '300px', height: '1px' }}>
        <div style={{ width: '300px', height: '1px', background: 'lightgray', position: 'absolute', left: 0, top: 0 }} />
        <div className="line-analytics-perc" style={{ width: `${linewidth}px`, position: 'relative', zIndex: 1 }} />
      </div>

    </>
  );
}
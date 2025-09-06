'use client';
import { useEffect, useState } from 'react';
import { useNonce } from '@/hooks/useNonce'



export default function LineAnalyticsPerc(props) {
  const noncea = useNonce()

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

      {/* I THINK CLASS GETS OVERWRITTEN  */}
      {noncea && (
        <style nonce={noncea}>{`
        .line-analytics-perc-container {
          position: relative;
          width: 300px;
          height: 1px;
        }
        .line-analytics-perc-background {
          width: 300px;
          height: 1px;
          background: lightgray;
          position: absolute;
          left: 0;
          top: 0;
        }
        .line-analytics-perc-${thiscountryname} {
          height: 1px;
          background-color: blue;
          position: relative;
          z-index: 1;
         
          width: ${linewidth}px;
        }
        
      `}</style>
      )}{/*  width: ${linewidth}px; */}

      <div className="line-analytics-perc-container">
        <div className="line-analytics-perc-background" />
        <div className={`line-analytics-perc-${thiscountryname}`} />
      </div>
    </>
  );
}
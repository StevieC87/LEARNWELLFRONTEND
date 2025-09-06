import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCountryFilter } from "@/redux/slices/AnalyticsSlice";
import './filterchip.css'; // Import the CSS file for styling

export default function CountryFilter(props) {
  const dispatch = useDispatch();
  const { country } = props;
  const countryfilter = useSelector((state) => state.AnalyticsSlice.countryfilter);

  return (
    <>
      {country && (
        <div onClick={() => {
          dispatch(setCountryFilter(""));

        }}
          className="cursor-pointer "
        >
          <span className="chip">
            {country}
            <span className="remove-x" aria-label="Remove"
            >
              &#10005;</span>
          </span>
        </div>
      )}
    </>

  )
}
import { useSelector } from "react-redux";

export const ProgressBar = () => {
  const totalWordsKnown = useSelector(
    (state) => state.flashcardSlice.totalwordsknown
  );
  const totalWordsRemaining = useSelector(
    (state) => state.flashcardSlice.totalwordsremaining
  );

  const calculatePercentage = () => {
    let totalwords = totalWordsKnown + totalWordsRemaining;
    let percentage = (totalWordsKnown / totalwords) * 100;
    //round it 2 decimal places
    percentage = percentage.toFixed(2);
    return percentage;
  };

  return (
    <>
      <div className="progress" style={{ height: "20px" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${calculatePercentage()}%` }}
          /*  style={{ width: "100%" }} */
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
        {calculatePercentage()}%
      </div>
    </>
  );
};

export default ProgressBar;

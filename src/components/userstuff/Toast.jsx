

export default function Toast() {
  let toasttext = "Special Offer";
  const fetchToastData = async () => {
    /*  try {
       const response = await fetch("http://localhost:3000/api/toast", {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
         },
       
       });
 
       if (!response.ok) {
         console.error("Failed to fetch toast data");
         return;
       }
 
       const data = await response.json();
       console.log("Toast data fetched:", data);
     } catch (error) {
       console.error("Error fetching toast data:", error);
     } */

  }


  return (
    <div className="toast-container">
      <div className="toast">
        <div className="toast-content">
          <p>Special Offer </p>
        </div>
        <button className="toast-close" onClick={() => console.log('Toast closed')}>
          &times;
        </button>
      </div>
    </div>
  );
}
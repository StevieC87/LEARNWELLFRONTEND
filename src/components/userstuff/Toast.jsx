

export default function Toast() {
  let toasttext = "Special Offer";
  const fetchToastData = async () => {
    /*  try {
       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/toast`, {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
         },
       
       });
 
       if (!response.ok) {
         console.log("Failed to fetch toast data");
         return;
       }
 
       const data = await response.json();
       console.log("Toast data fetched:", data);
     } catch (error) {
       console.log("Error fetching toast data:", error);
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
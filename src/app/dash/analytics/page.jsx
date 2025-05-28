import MapAnalyticsComponent from "./Map";
export default async function Analytics() {
  let countriesdata;
  const response = await fetch('http://localhost:3000/testanalytics', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    credentials: 'include', // Include cookies in the request
  });
  console.log("Status OK:", response.ok);
  if (!response.ok) {
    return {
      notFound: true,
    };
  }
  else if (response.ok) {
    const data = await response.json();
    console.log(data, 'data');
    console.log(data.data, 'data.data');
    countriesdata = data.data;
    console.log(typeof countriesdata, 'typeof data.message');

  }
  /* console.log(response, 'response')
 const data = await response.json();
 console.log(data, 'data')
 
*/


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Analytics</h1>
      <p className="text-lg">This is the analytics page.</p>
      <div className="mt-8 fade-in mapsdiv">
        {countriesdata && Object.keys(countriesdata).length > 0 ? (
          <MapAnalyticsComponent countriesdata={countriesdata} />
        ) : (
          <div className="text-red-500">
            No data available for the map.
          </div>
        )}

      </div>
    </div>
  );
}
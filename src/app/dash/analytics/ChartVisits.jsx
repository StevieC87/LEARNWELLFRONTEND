import Chart from 'chart.js/auto';

export default function ChartVisits() {

  Chart.defaults.interaction.mode = 'nearest';

  // Interaction mode is set to nearest because it was not overridden here
  // const labels = Utils.months({ count: 7 });
  const data = {
    labels: labels,
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const chartInteractionModeNearest = new Chart(ctx, {
    type: 'line',
    data: data
  });

  // This chart would have the interaction mode that was passed in
  const chartDifferentInteractionMode = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      interaction: {
        // Overrides the global setting
        mode: 'index'
      }
    }
  });


  return (
    <>
      <div>i am the chart</div>


    </>


  )
}
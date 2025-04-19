
const ctx = document.getElementById('trafficChart').getContext('2d');
const trafficChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: Array.from({length: 10}, (_, i) => `T-${10 - i}`),
    datasets: [{
      label: 'Packets per Second',
      data: Array(10).fill(0),
      borderColor: '#0d6efd',
      backgroundColor: 'rgba(13, 110, 253, 0.2)',
      borderWidth: 2,
      fill: true
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// Simulate real-time update
setInterval(() => {
  const newPacket = Math.floor(Math.random() * 100);
  trafficChart.data.datasets[0].data.shift();
  trafficChart.data.datasets[0].data.push(newPacket);
  trafficChart.update();

  document.getElementById('packets').innerText = newPacket;
  document.getElementById('connections').innerText = Math.floor(Math.random() * 10);
  document.getElementById('latency').innerText = `${Math.floor(Math.random() * 200)}ms`;
}, 2000);

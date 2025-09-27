const userId = 1;  // Example user
const year = 2025; // Example year
let chartInstance = null;

async function uploadFile() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) return alert('Please select a file first');

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`http://localhost:5000/api/finances/upload/${userId}/${year}`, {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  alert(data.message);
  fetchData();
}

async function fetchData() {
  const res = await fetch(`http://localhost:5000/api/finances/${userId}/${year}`);
  const data = await res.json();

  // Update user + year info
  document.getElementById('userName').innerText = `User: ${data.user}`;
  document.getElementById('year').innerText = `Year: ${data.year}`;

  // Fill table
  const tableBody = document.getElementById('dataTable');
  tableBody.innerHTML = '';
  const months = [], amounts = [];

  data.records.forEach(r => {
    const row = document.createElement('tr');
    row.innerHTML = `<td class="py-2 px-4">${r.month}</td><td class="py-2 px-4">${r.amount}</td>`;
    tableBody.appendChild(row);
    months.push(r.month);
    amounts.push(r.amount);
  });

  // Update chart
  const ctx = document.getElementById('barChart').getContext('2d');
  if (chartInstance) chartInstance.destroy(); // Prevent multiple charts

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'Amount',
        data: amounts,
        backgroundColor: 'rgba(37, 99, 235, 0.6)',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

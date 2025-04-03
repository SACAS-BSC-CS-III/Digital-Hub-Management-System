// Get the canvas element for the bar chart
const barCtx = document.getElementById('barChart').getContext('2d');

// Sales & Profit data
const salesData = [5000, 7000, 6500, 8000, 7200, 9000, 10000];  // Sales in ₹
const profitData = [1200, 2000, 1800, 2500, 2100, 3000, 3500];  // Profit in ₹

// Create the Bar Chart
new Chart(barCtx, {
    type: 'bar',
    data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // X-Axis: Days
        datasets: [
            {
                label: 'Sales (₹)',
                data: salesData,
                backgroundColor: 'rgb(95, 20, 255)', // Blue color
                borderColor: 'rgb(255, 255, 255)',
                borderWidth: 1
            },
            {
                label: 'Profit (₹)',
                data: profitData,
                backgroundColor: 'rgb(255, 12, 65)', // Red color
                borderColor: 'rgb(255, 255, 255)',
                borderWidth: 1
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1000 // Y-axis interval of ₹1000
                }
            }
        }
    }
});


// Get the canvas element for the pie chart
const ctx = document.getElementById('pieChart').getContext('2d');

const pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Xerox', 'Print', 'Recharge', 'Lamination', 'Others'],
        datasets: [{
            data: [50, 20, 15, 8, 2],
            backgroundColor: ['#ff6384', '#36a2eb', '#ffcc00', '#66c2a5', '#8a2be2'],
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,  // ✅ Prevents automatic shrinking
        layout: {
            padding: 10  // ✅ Adds space to prevent content from squeezing
        }
    }
});


// // Function to display top categories next to the chart
// function displayTopCategories() {
//     const categoriesList = document.getElementById('topCategories');
//     categoriesList.innerHTML = ''; // Clear previous content

//     // Get the labels & data
//     const labels = pieData.labels;
//     const data = pieData.datasets[0].data;

//     // Loop through data and format it properly
//     for (let i = 0; i < labels.length; i++) {
//         let item = document.createElement('p');
//         item.textContent = `${labels[i]} - ${data[i]}%`;
//         item.style.margin = '5px 0';
//         item.style.fontSize = '14px';
//         item.style.whiteSpace = 'nowrap';  // Ensures text stays in one line
//         categoriesList.appendChild(item);
//     }
// }

// // Call function to update the text
// displayTopCategories();

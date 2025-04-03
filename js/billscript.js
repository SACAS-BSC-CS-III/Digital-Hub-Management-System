// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize services
    const services = [
        { name: 'Xerox', defaultAmount: 2 },
        { name: 'Printout', defaultAmount: 5 },
        { name: 'Money Transfer', defaultAmount: 10 },
        { name: 'Lamination', defaultAmount: 15 },
        { name: 'Recharge', defaultAmount: 0 }
    ];

    let selectedServices = [];
    let billHistory = JSON.parse(localStorage.getItem('billHistory')) || [];
    let selectedServiceButton = null;

    // DOM Elements
    const serviceButtonsDiv = document.getElementById('serviceButtons');
    const amountInput = document.getElementById('amount');
    const addServiceBtn = document.getElementById('addServiceBtn');
    const customerNameInput = document.getElementById('customerName');
    const selectedServicesTbody = document.getElementById('selectedServices');
    const totalAmountSpan = document.getElementById('totalAmount');
    const billHistoryTbody = document.getElementById('billHistory');
    const searchHistoryInput = document.getElementById('searchHistory');

    // Initialize the page
    renderServiceButtons();
    renderBillHistory();

    // Event Listeners
    amountInput.addEventListener('input', function() {
        if (this.value && selectedServiceButton) {
            addServiceBtn.disabled = false;
        } else {
            addServiceBtn.disabled = true;
        }
    });

    // Functions
    function renderServiceButtons() {
        serviceButtonsDiv.innerHTML = '';
        services.forEach(service => {
            const button = document.createElement('button');
            button.textContent = service.name;
            button.className = 'service-btn';
            button.onclick = () => selectService(service, button);
            serviceButtonsDiv.appendChild(button);
        });
    }

    function selectService(service, button) {
        // Reset previously selected button
        if (selectedServiceButton) {
            selectedServiceButton.classList.remove('selected');
        }

        // Set new selected button
        selectedServiceButton = button;
        button.classList.add('selected');
        
        amountInput.value = service.defaultAmount;
        amountInput.disabled = false;
        amountInput.focus();
    }

    function addService() {
        if (!selectedServiceButton) return;
        
        const serviceName = selectedServiceButton.textContent;
        const amount = parseFloat(amountInput.value);
        
        if (isNaN(amount)) {
            alert('Please enter a valid amount');
            return;
        }

        selectedServices.push({ name: serviceName, amount: amount });
        renderSelectedServices();
        
        // Reset selection
        selectedServiceButton.classList.remove('selected');
        selectedServiceButton = null;
        amountInput.value = '';
        amountInput.disabled = true;
        addServiceBtn.disabled = true;
    }

    function renderSelectedServices() {
        selectedServicesTbody.innerHTML = '';
        selectedServices.forEach((service, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service.name}</td>
                <td>₹${service.amount.toFixed(2)}</td>
                <td>
                    <button class="action-btn" onclick="removeService(${index})">Remove</button>
                </td>
            `;
            selectedServicesTbody.appendChild(row);
        });
        calculateTotal();
    }

    function calculateTotal() {
        const total = selectedServices.reduce((sum, service) => sum + service.amount, 0);
        totalAmountSpan.textContent = total.toFixed(2);
    }

    function saveBill() {
        const customerName = customerNameInput.value.trim();
        if (!customerName) {
            alert('Please enter customer name');
            return;
        }

        if (selectedServices.length === 0) {
            alert('Please add at least one service');
            return;
        }

        const total = parseFloat(totalAmountSpan.textContent);
        const newBill = {
            id: Date.now(),
            customerName,
            date: new Date().toLocaleString(),
            services: [...selectedServices],
            total
        };

        billHistory.unshift(newBill);
        localStorage.setItem('billHistory', JSON.stringify(billHistory));
        
        // Reset form
        selectedServices = [];
        renderSelectedServices();
        customerNameInput.value = '';
        totalAmountSpan.textContent = '0';
        
        renderBillHistory();
        alert('Bill saved successfully!');
    }

    function printBill() {
        if (selectedServices.length === 0) {
            alert('No services to print');
            return;
        }
        
        const customerName = customerNameInput.value.trim() || 'Walk-in Customer';
        const total = parseFloat(totalAmountSpan.textContent);
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Bill Receipt</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { text-align: center; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .total { font-weight: bold; }
                    .footer { margin-top: 30px; text-align: center; }
                </style>
            </head>
            <body>
                <h1>Kalaivani Hub</h1>
                <p><strong>Customer:</strong> ${customerName}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${selectedServices.map(service => `
                            <tr>
                                <td>${service.name}</td>
                                <td>₹${service.amount.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                        <tr class="total">
                            <td>Total</td>
                            <td>₹${total.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="footer">
                    <p>Thank you for your business!</p>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    function printHistoryBill(billId) {
        const bill = billHistory.find(b => b.id === billId);
        if (!bill) return;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Bill Receipt</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { text-align: center; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .total { font-weight: bold; }
                    .footer { margin-top: 30px; text-align: center; }
                </style>
            </head>
            <body>
                <h1>Kalaivani Hub</h1>
                <p><strong>Customer:</strong> ${bill.customerName}</p>
                <p><strong>Date:</strong> ${bill.date}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bill.services.map(service => `
                            <tr>
                                <td>${service.name}</td>
                                <td>₹${service.amount.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                        <tr class="total">
                            <td>Total</td>
                            <td>₹${bill.total.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="footer">
                    <p>Thank you for your business!</p>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    function deleteBill(billId) {
        if (confirm('Are you sure you want to delete this bill?')) {
            billHistory = billHistory.filter(bill => bill.id !== billId);
            localStorage.setItem('billHistory', JSON.stringify(billHistory));
            renderBillHistory();
            alert('Bill deleted successfully!');
        }
    }

    function renderBillHistory() {
        billHistoryTbody.innerHTML = '';
        billHistory.forEach((bill, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${bill.customerName}</td>
                <td>${bill.date}</td>
                <td>₹${bill.total.toFixed(2)}</td>
                <td><button class="action-btn" onclick="printHistoryBill(${bill.id})">Print</button></td>
                <td><button class="action-btn" onclick="deleteBill(${bill.id})">Delete</button></td>
            `;
            billHistoryTbody.appendChild(row);
        });
    }

    function filterHistory() {
        const searchTerm = searchHistoryInput.value.toLowerCase();
        const rows = billHistoryTbody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const name = row.cells[1].textContent.toLowerCase();
            const date = row.cells[2].textContent.toLowerCase();
            if (name.includes(searchTerm) || date.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Make functions available globally
    window.addService = addService;
    window.calculateTotal = calculateTotal;
    window.saveBill = saveBill;
    window.printBill = printBill;
    window.printHistoryBill = printHistoryBill;
    window.deleteBill = deleteBill;
    window.removeService = function(index) {
        selectedServices.splice(index, 1);
        renderSelectedServices();
        calculateTotal();
    };
    window.filterHistory = filterHistory;
});
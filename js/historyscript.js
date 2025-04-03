// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderBillHistory();
    updateStats();
    
    // Add event listeners for search/filter
    document.getElementById('searchCustomer').addEventListener('input', function() {
        filterBills();
    });
    
    document.getElementById('searchDate').addEventListener('change', function() {
        filterBills();
    });
});

// Load bills from localStorage
function loadBills() {
    const bills = localStorage.getItem('bills');
    return bills ? JSON.parse(bills) : [];
}

// Render all bills in the table
function renderBillHistory() {
    const bills = loadBills();
    const billHistoryTable = document.getElementById('billHistory');
    
    billHistoryTable.innerHTML = '';
    
    if (bills.length === 0) {
        const row = billHistoryTable.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5;
        cell.textContent = 'No bills found.';
        cell.style.textAlign = 'center';
        cell.style.padding = '2rem';
        return;
    }
    
    bills.forEach((bill, index) => {
        const row = billHistoryTable.insertRow();
        
        // Date & Time
        const dateCell = row.insertCell();
        dateCell.textContent = formatDateTime(bill.date);
        
        // Customer Name
        const nameCell = row.insertCell();
        nameCell.textContent = bill.customerName;
        
        // Services
        const servicesCell = row.insertCell();
        const servicesList = document.createElement('div');
        servicesList.className = 'services-list';
        
        bill.services.forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';
            serviceItem.innerHTML = `
                <span>${service.name}</span>
                <span>₹${service.price.toFixed(2)}</span>
            `;
            servicesList.appendChild(serviceItem);
        });
        servicesCell.appendChild(servicesList);
        
        // Total Amount
        const amountCell = row.insertCell();
        amountCell.innerHTML = `<strong>₹${bill.total.toFixed(2)}</strong>`;
        
        // Actions
        const actionsCell = row.insertCell();
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';
        
        const printButton = document.createElement('button');
        printButton.className = 'print-btn';
        printButton.innerHTML = '<i class="fas fa-print"></i> Print';
        printButton.onclick = () => printBill(index);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i> Delete';
        deleteButton.onclick = () => confirmDelete(index);
        
        actionButtons.appendChild(printButton);
        actionButtons.appendChild(deleteButton);
        actionsCell.appendChild(actionButtons);
    });
    
    updateStats();
}

// Filter bills based on search criteria
function filterBills() {
    const bills = loadBills();
    const customerQuery = document.getElementById('searchCustomer').value.toLowerCase();
    const dateQuery = document.getElementById('searchDate').value;
    
    const filteredBills = bills.filter(bill => {
        const matchesCustomer = bill.customerName.toLowerCase().includes(customerQuery);
        const matchesDate = dateQuery ? new Date(bill.date).toISOString().split('T')[0] === dateQuery : true;
        return matchesCustomer && matchesDate;
    });
    
    renderFilteredBills(filteredBills);
}

// Render filtered bills
function renderFilteredBills(filteredBills) {
    const billHistoryTable = document.getElementById('billHistory');
    billHistoryTable.innerHTML = '';
    
    if (filteredBills.length === 0) {
        const row = billHistoryTable.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5;
        cell.textContent = 'No matching bills found.';
        cell.style.textAlign = 'center';
        cell.style.padding = '2rem';
        return;
    }
    
    filteredBills.forEach((bill, index) => {
        const row = billHistoryTable.insertRow();
        
        // Date & Time
        const dateCell = row.insertCell();
        dateCell.textContent = formatDateTime(bill.date);
        
        // Customer Name
        const nameCell = row.insertCell();
        nameCell.textContent = bill.customerName;
        
        // Services
        const servicesCell = row.insertCell();
        const servicesList = document.createElement('div');
        servicesList.className = 'services-list';
        
        bill.services.forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';
            serviceItem.innerHTML = `
                <span>${service.name}</span>
                <span>₹${service.price.toFixed(2)}</span>
            `;
            servicesList.appendChild(serviceItem);
        });
        servicesCell.appendChild(servicesList);
        
        // Total Amount
        const amountCell = row.insertCell();
        amountCell.innerHTML = `<strong>₹${bill.total.toFixed(2)}</strong>`;
        
        // Actions
        const actionsCell = row.insertCell();
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';
        
        const printButton = document.createElement('button');
        printButton.className = 'print-btn';
        printButton.innerHTML = '<i class="fas fa-print"></i> Print';
        printButton.onclick = () => printBill(bills.indexOf(bill));
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i> Delete';
        deleteButton.onclick = () => confirmDelete(bills.indexOf(bill));
        
        actionButtons.appendChild(printButton);
        actionButtons.appendChild(deleteButton);
        actionsCell.appendChild(actionButtons);
    });
}

// Print bill function
function printBill(index) {
    const bills = loadBills();
    const bill = bills[index];
    
    if (!bill) {
        alert('Bill not found!');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    const printContent = `
        <html>
            <head>
                <title>Bill Receipt</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #2b5797; border-bottom: 2px solid #2b5797; padding-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background-color: #f2f2f2; }
                    .total-row { font-weight: bold; }
                    .text-right { text-align: right; }
                </style>
            </head>
            <body>
                <h1>Digital Hub Services</h1>
                <p><strong>Customer:</strong> ${bill.customerName}</p>
                <p><strong>Date:</strong> ${formatDateTime(bill.date)}</p>
                
                <table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th class="text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bill.services.map(service => `
                            <tr>
                                <td>${service.name}</td>
                                <td class="text-right">₹${service.price.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                        <tr class="total-row">
                            <td>Total</td>
                            <td class="text-right">₹${bill.total.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
                
                <p style="margin-top: 30px; text-align: center;">
                    Thank you for your business!<br>
                    Visit us again at Digital Hub Services
                </p>
            </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Confirm before deleting a bill
function confirmDelete(index) {
    if (confirm('Are you sure you want to delete this bill? This action cannot be undone.')) {
        deleteBill(index);
    }
}

// Delete a bill
function deleteBill(index) {
    const bills = loadBills();
    bills.splice(index, 1);
    localStorage.setItem('bills', JSON.stringify(bills));
    renderBillHistory();
    updateStats();
    showToast('Bill deleted successfully!', 'success');
}

// Update statistics
function updateStats() {
    const bills = loadBills();
    const today = new Date().toISOString().split('T')[0];
    
    // Total Bills
    document.getElementById('totalBills').textContent = bills.length;
    
    // Total Revenue
    const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0);
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toFixed(2)}`;
    
    // Today's Bills
    const todaysBills = bills.filter(bill => 
        new Date(bill.date).toISOString().split('T')[0] === today
    ).length;
    document.getElementById('todaysBills').textContent = todaysBills;
}

// Format date and time
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
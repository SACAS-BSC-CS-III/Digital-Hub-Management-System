let selectedService = "";
let services = [];
let availableServices = JSON.parse(localStorage.getItem("availableServices")) || ["Xerox", "Printout", "Money Transfer", "Lamination", "Recharge", "Spiral"];
let bills = JSON.parse(localStorage.getItem("bills")) || [];

function showPopupMessage(message) {
    const popup = document.createElement("div");
    popup.className = "popup-message";
    popup.innerText = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 3000);
}

function renderServiceButtons() {
    const serviceButtons = document.getElementById('serviceButtons');
    serviceButtons.innerHTML = "";
    availableServices.forEach(service => {
        const btn = document.createElement("button");
        btn.innerText = service;
        btn.onclick = () => selectService(service, btn);
        serviceButtons.appendChild(btn);
    });
}

function selectService(service, button) {
    document.querySelectorAll('#serviceButtons button').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    selectedService = service;
    document.getElementById('amount').disabled = false;
    document.getElementById('addServiceBtn').disabled = false;
}

function addService() {
    const amount = parseFloat(document.getElementById('amount').value);
    if (isNaN(amount) || amount <= 0) {
        showPopupMessage("Please enter a valid amount.");
        return;
    }
    services.push({ name: selectedService, price: amount });
    document.getElementById('amount').value = "";
    updateSelectedServices();
    calculateTotal();
}

function updateSelectedServices() {
    const selectedServicesTable = document.getElementById('selectedServices');
    selectedServicesTable.innerHTML = "";
    services.forEach((service, index) => {
        const row = selectedServicesTable.insertRow();
        const nameCell = row.insertCell();
        const priceCell = row.insertCell();
        const actionsCell = row.insertCell();
        nameCell.textContent = service.name;
        priceCell.textContent = service.price;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeService(index);
        actionsCell.appendChild(removeButton);
    });
}

function removeService(index) {
    services.splice(index, 1);
    updateSelectedServices();
    calculateTotal();
}

function calculateTotal() {
    let total = services.reduce((sum, s) => sum + s.price, 0);
    document.getElementById('totalAmount').innerText = total;
}

function saveBill() {
    const customerName = document.getElementById('customerName').value.trim();
    if (!customerName) {
        showPopupMessage("Please enter customer name.");
        return;
    }
    if (services.length === 0) {
        showPopupMessage("Cannot save an empty bill.");
        return;
    }
    const total = parseFloat(document.getElementById('totalAmount').innerText);
    const newBill = {
        customerName: customerName,
        date: new Date().toLocaleString(),
        total: total,
        services: [...services]
    };
    bills.push(newBill);
    localStorage.setItem("bills", JSON.stringify(bills));
    renderBillHistory();
    services = [];
    updateSelectedServices();
    calculateTotal();
    document.getElementById('customerName').value = "";
    showPopupMessage("Bill saved successfully!");
}

function printBill(index) {
    if (index < 0 || index >= bills.length) {
        showPopupMessage("Invalid bill index.");
        return;
    }
    const bill = bills[index];
    if (!bill) {
        showPopupMessage("Bill not found.");
        return;
    }
    let printContent = `<h2>Bill Details</h2><p>Customer Name: ${bill.customerName}</p><p>Date: ${bill.date}</p><table border='1' style='border-collapse: collapse;'><tr><th>Service</th><th>Amount</th></tr>`;
    bill.services.forEach(service => {
        printContent += `<tr><td>${service.name}</td><td>${service.price}</td></tr>`;
    });
    printContent += `<tr><td>Total</td><td>${bill.total}</td></tr></table>`;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>Print Bill</title></head><body>${printContent}</body></html>`);
    printWindow.document.close();
    printWindow.print();
    showPopupMessage("Bill printed successfully!");
}

function deleteBill(index) {
    bills.splice(index, 1);
    localStorage.setItem("bills", JSON.stringify(bills));
    renderBillHistory();
    showPopupMessage("Bill deleted successfully!");
}

function filterHistory() {
    const searchQuery = document.getElementById('searchHistory').value.toLowerCase();
    const filteredBills = bills.filter(bill =>
        bill.customerName.toLowerCase().includes(searchQuery) ||
        bill.date.toLowerCase().includes(searchQuery)
    );
    renderFilteredHistory(filteredBills);
}

function renderFilteredHistory(filteredBills) {
    const billHistoryTable = document.getElementById('billHistory');
    billHistoryTable.innerHTML = "";
    filteredBills.forEach((bill, index) => {
        const row = billHistoryTable.insertRow();
        const snoCell = row.insertCell();
        const nameCell = row.insertCell();
        const dateCell = row.insertCell();
        const amountCell = row.insertCell();
        const printCell = row.insertCell();
        const deleteCell = row.insertCell();
        snoCell.textContent = index + 1;
        nameCell.textContent = bill.customerName;
        dateCell.textContent = bill.date;
        amountCell.textContent = bill.total;
        const printButton = document.createElement('button');
        printButton.textContent = 'Print';
        printButton.onclick = () => printBill(index);
        printCell.appendChild(printButton);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteBill(index);
        deleteCell.appendChild(deleteButton);
    });
}

renderServiceButtons();
renderBillHistory();
document.addEventListener("DOMContentLoaded", function () {
    let selectedServices = [];
    const serviceButtons = document.querySelectorAll("#serviceButtons button");
    const amountInput = document.getElementById("amount");
    const addServiceBtn = document.getElementById("addServiceBtn");
    const selectedServicesTable = document.getElementById("selectedServices");
    const totalAmountSpan = document.getElementById("totalAmount");
    const billHistory = document.getElementById("billHistory");
    
    serviceButtons.forEach(button => {
        button.addEventListener("click", function () {
            serviceButtons.forEach(btn => btn.style.opacity = "1");
            this.style.opacity = "0.2";
            amountInput.disabled = false;
            addServiceBtn.disabled = false;
            amountInput.value = "";
            amountInput.focus();
            amountInput.dataset.service = this.textContent;
        });
    });

    addServiceBtn.addEventListener("click", function () {
        const serviceName = amountInput.dataset.service;
        const amount = parseFloat(amountInput.value);
        if (!serviceName || isNaN(amount) || amount <= 0) return;
        selectedServices.push({ serviceName, amount });
        updateSelectedServicesTable();
    });

    function updateSelectedServicesTable() {
        selectedServicesTable.innerHTML = "";
        selectedServices.forEach((service, index) => {
            let row = document.createElement("tr");
            row.innerHTML = `<td>${service.serviceName}</td><td>₹${service.amount.toFixed(2)}</td>
                             <td><button onclick="removeService(${index})">Remove</button></td>`;
            selectedServicesTable.appendChild(row);
        });
    }

    window.removeService = function (index) {
        selectedServices.splice(index, 1);
        updateSelectedServicesTable();
    };

    window.calculateTotal = function () {
        let total = selectedServices.reduce((sum, item) => sum + item.amount, 0);
        totalAmountSpan.textContent = total.toFixed(2);
    };

    window.printBill = function () {
        let printWindow = window.open("", "", "width=600,height=800");
        printWindow.document.write(`<h2 style='text-align:center; font-weight:bold;'>Kalaivani Hub</h2>`);
        printWindow.document.write(`<p>Date: ${new Date().toLocaleString()}</p>`);
        printWindow.document.write(`<table border='1' width='100%'><tr><th>Service</th><th>Amount</th></tr>`);
        selectedServices.forEach(service => {
            printWindow.document.write(`<tr><td>${service.serviceName}</td><td>₹${service.amount.toFixed(2)}</td></tr>`);
        });
        printWindow.document.write(`</table>`);
        printWindow.print();
    };

    window.saveBill = function () {
        let customerName = document.getElementById("customerName").value.trim();
        if (!customerName || selectedServices.length === 0) return;
        let total = selectedServices.reduce((sum, item) => sum + item.amount, 0);
        let bill = {
            id: Date.now(),
            name: customerName,
            date: new Date().toLocaleString(),
            total: total.toFixed(2),
            services: [...selectedServices]
        };
        let bills = JSON.parse(localStorage.getItem("bills")) || [];
        bills.push(bill);
        localStorage.setItem("bills", JSON.stringify(bills));
        updateBillHistory();
    };

    function updateBillHistory() {
        billHistory.innerHTML = "";
        let bills = JSON.parse(localStorage.getItem("bills")) || [];
        bills.forEach((bill, index) => {
            let row = document.createElement("tr");
            row.innerHTML = `<td>${index + 1}</td><td>${bill.name}</td><td>${bill.date}</td>
                             <td>₹${bill.total}</td>
                             <td><button onclick="printSavedBill(${bill.id})">Print</button></td>
                             <td><button onclick="deleteBill(${bill.id})">Delete</button></td>`;
            billHistory.appendChild(row);
        });
    }

    window.printSavedBill = function (id) {
        let bills = JSON.parse(localStorage.getItem("bills")) || [];
        let bill = bills.find(b => b.id === id);
        if (!bill) return;
        let printWindow = window.open("", "", "width=600,height=800");
        printWindow.document.write(`<h2 style='text-align:center; font-weight:bold;'>Kalaivani Hub</h2>`);
        printWindow.document.write(`<p>Date: ${bill.date}</p>`);
        printWindow.document.write(`<p>Customer: ${bill.name}</p>`);
        printWindow.document.write(`<table border='1' width='100%'><tr><th>Service</th><th>Amount</th></tr>`);
        bill.services.forEach(service => {
            printWindow.document.write(`<tr><td>${service.serviceName}</td><td>₹${service.amount.toFixed(2)}</td></tr>`);
        });
        printWindow.document.write(`<tr><td><b>Total</b></td><td><b>₹${bill.total}</b></td></tr>`);
        printWindow.document.write(`</table>`);
        printWindow.print();
    };

    window.deleteBill = function (id) {
        let bills = JSON.parse(localStorage.getItem("bills")) || [];
        bills = bills.filter(b => b.id !== id);
        localStorage.setItem("bills", JSON.stringify(bills));
        updateBillHistory();
    };

    updateBillHistory();
});

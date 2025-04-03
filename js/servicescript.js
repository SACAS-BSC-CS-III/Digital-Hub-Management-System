// Service Tracker with localStorage persistence
class ServiceTracker {
    constructor() {
        this.services = this.loadServices();
        this.initDOMElements();
        this.setupEventListeners();
        this.init();
    }

    initDOMElements() {
        this.serviceTableBody = document.getElementById('serviceTableBody');
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.addNewButton = document.getElementById('addNewButton');
        this.serviceModal = document.getElementById('serviceModal');
        this.closeModal = document.getElementById('closeModal');
        this.serviceForm = document.getElementById('serviceForm');
        this.documentUpload = document.getElementById('documentUpload');
        this.uploadPreview = document.getElementById('uploadPreview');
        this.documentModal = document.getElementById('documentModal');
        this.closeDocModal = document.getElementById('closeDocModal');
        this.docModalTitle = document.getElementById('docModalTitle');
        this.documentViewerContent = document.getElementById('documentViewerContent');
    }

    setupEventListeners() {
        this.searchButton.addEventListener('click', () => this.searchServices());
        this.searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') this.searchServices();
        });
        this.addNewButton.addEventListener('click', () => {
            this.serviceModal.style.display = 'block';
        });
        this.closeModal.addEventListener('click', () => {
            this.serviceModal.style.display = 'none';
        });
        this.closeDocModal.addEventListener('click', () => {
            this.documentModal.style.display = 'none';
        });
        window.addEventListener('click', (event) => {
            if (event.target === this.serviceModal) {
                this.serviceModal.style.display = 'none';
            }
            if (event.target === this.documentModal) {
                this.documentModal.style.display = 'none';
            }
        });
        this.serviceForm.addEventListener('submit', (e) => this.addNewService(e));
        this.documentUpload.addEventListener('change', (e) => this.handleDocumentUpload(e));
    }

    init() {
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
        this.renderServices(this.services);
    }

    loadServices() {
        const savedServices = localStorage.getItem('xeroxShopServices');
        if (savedServices) {
            try {
                return JSON.parse(savedServices);
            } catch (e) {
                console.error('Failed to parse saved services', e);
            }
        }
        return [ ];
    }

    saveServices() {
        localStorage.setItem('xeroxShopServices', JSON.stringify(this.services));
    }

    updateCurrentTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        document.getElementById('currentTime').textContent = now.toLocaleDateString('en-IN', options);
    }

    renderServices(servicesToRender) {
        this.serviceTableBody.innerHTML = '';
        
        servicesToRender.forEach(service => {
            const row = document.createElement('tr');
            
            let documentCell = 'No document';
            if (service.document) {
                const icon = service.document.type.startsWith('image/') ? '🖼️' : '📄';
                documentCell = `
                    <span class="document-link" data-id="${service.id}">
                        <span class="document-icon">${icon}</span>
                        ${service.document.name}
                    </span>
                `;
            }
            
            row.innerHTML = `
                <td>${service.id}</td>
                <td>${service.customerName}</td>
                <td>${service.serviceType}</td>
                <td>${service.pages}</td>
                <td>${new Date(service.dateTime).toLocaleString()}</td>
                <td>₹${service.amount.toFixed(2)}</td>
                <td class="document-cell">${documentCell}</td>
                <td><span class="status status-${service.status}">${service.status.charAt(0).toUpperCase() + service.status.slice(1)}</span></td>
                <td>
                    ${service.status === 'pending' ? 
                        `<button class="action-button complete-btn" data-id="${service.id}">Complete</button>
                         <button class="action-button cancel-btn" data-id="${service.id}">Cancel</button>` : 
                        ''}
                    <button class="action-button delete-btn" data-id="${service.id}">Delete</button>
                </td>
            `;
            
            this.serviceTableBody.appendChild(row);
        });
        
        this.addActionButtonListeners();
    }

    addActionButtonListeners() {
        document.querySelectorAll('.complete-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.completeService(button.dataset.id);
            });
        });
        
        document.querySelectorAll('.cancel-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.cancelService(button.dataset.id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this service record?')) {
                    this.deleteService(button.dataset.id);
                }
            });
        });

        document.querySelectorAll('.document-link').forEach(link => {
            link.addEventListener('click', () => {
                this.viewDocument(link.dataset.id);
            });
        });
    }

    viewDocument(serviceId) {
        const service = this.services.find(s => s.id === serviceId);
        if (!service || !service.document) return;

        this.docModalTitle.textContent = `Document: ${service.document.name}`;
        this.documentViewerContent.innerHTML = '';

        if (service.document.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = service.document.content;
            img.alt = service.document.name;
            this.documentViewerContent.appendChild(img);
        } else if (service.document.type === 'application/pdf') {
            const iframe = document.createElement('iframe');
            iframe.src = service.document.content;
            this.documentViewerContent.appendChild(iframe);
        } else {
            const unsupportedMsg = document.createElement('div');
            unsupportedMsg.className = 'unsupported-doc';
            unsupportedMsg.textContent = 'Document preview not available. Please download the file to view it.';
            this.documentViewerContent.appendChild(unsupportedMsg);
            
            const downloadLink = document.createElement('a');
            downloadLink.href = service.document.content;
            downloadLink.download = service.document.name;
            downloadLink.textContent = 'Download Document';
            downloadLink.className = 'view-doc-btn';
            downloadLink.style.display = 'block';
            downloadLink.style.marginTop = '20px';
            this.documentViewerContent.appendChild(downloadLink);
        }

        this.documentModal.style.display = 'block';
    }

    completeService(id) {
        this.services = this.services.map(service => {
            if (service.id === id) {
                return { ...service, status: 'completed' };
            }
            return service;
        });
        this.saveServices();
        this.renderServices(this.services);
    }

    cancelService(id) {
        this.services = this.services.map(service => {
            if (service.id === id) {
                return { ...service, status: 'cancelled' };
            }
            return service;
        });
        this.saveServices();
        this.renderServices(this.services);
    }

    deleteService(id) {
        const service = this.services.find(s => s.id === id);
        if (service && service.document && service.document.content.startsWith('blob:')) {
            URL.revokeObjectURL(service.document.content);
        }
        this.services = this.services.filter(service => service.id !== id);
        this.saveServices();
        this.renderServices(this.services);
    }

    searchServices() {
        const searchTerm = this.searchInput.value.toLowerCase();
        if (!searchTerm) {
            this.renderServices(this.services);
            return;
        }
        
        const filteredServices = this.services.filter(service => 
            service.customerName.toLowerCase().includes(searchTerm) || 
            service.id.toLowerCase().includes(searchTerm) ||
            (service.document && service.document.name.toLowerCase().includes(searchTerm))
        );
        
        this.renderServices(filteredServices);
    }

    generateJobId() {
        const lastId = this.services.length > 0 ? 
            parseInt(this.services[this.services.length - 1].id.split('-')[1]) : 1000;
        return `ESV00${lastId + 1}`;
    }

    handleDocumentUpload(event) {
        this.uploadPreview.innerHTML = '';
        this.uploadPreview.style.display = 'none';
        
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.uploadPreview.style.display = 'block';
            
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                this.uploadPreview.appendChild(img);
            }
            
            const fileInfo = document.createElement('div');
            fileInfo.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
            this.uploadPreview.appendChild(fileInfo);
        }
    }

    addNewService(event) {
        event.preventDefault();
        
        let uploadedDocument = null;
        
        if (this.documentUpload.files.length > 0) {
            const file = this.documentUpload.files[0];
            uploadedDocument = {
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified,
                content: URL.createObjectURL(file)
            };
        }
        
        const newService = {
            id: this.generateJobId(),
            customerName: document.getElementById('customerName').value,
            serviceType: document.getElementById('serviceType').value,
            pages: parseInt(document.getElementById('pages').value) || 1,
            dateTime: new Date().toISOString(),
            amount: parseFloat(document.getElementById('amount').value),
            status: 'pending',
            document: uploadedDocument
        };
        
        this.services.push(newService);
        this.saveServices();
        this.renderServices(this.services);
        this.serviceModal.style.display = 'none';
        this.serviceForm.reset();
        this.uploadPreview.style.display = 'none';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new ServiceTracker();
});
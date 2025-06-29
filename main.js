// Configuration
const CONFIG = {
    SHEET_ID: '17MHb6_7adccMAAzQZpceWRgCiu8DETcDNmFXDWQXBvo', // Replace with your Google Sheet ID
    API_KEY: 'AIzaSyDo2jcgXLyef3Myck6BekuVcWVyoGiuS2o', // Replace with your Google Sheets API key
    SHEET_NAME: 'UNEECO Delivery Sheet'
};

// Global variables
let deliveriesData = [];
let filteredData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadData();
    setDefaultDate();
    
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 2000);
}

function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Filter functionality
    document.getElementById('statusFilter').addEventListener('change', handleFilter);
    
    // Form submission
    document.getElementById('deliveryForm').addEventListener('submit', handleFormSubmit);
    
    // Modal close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

// Google Sheets API Functions
async function loadData() {
    try {
        showLoading();
        
        // If no API key or Sheet ID configured, use sample data
        if (!CONFIG.API_KEY || CONFIG.API_KEY === 'YourApiKeyHere') {
            loadSampleData();
            return;
        }
        
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${CONFIG.SHEET_NAME}?key=${CONFIG.API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        processSheetData(data.values);
        
    } catch (error) {
        console.error('Error loading data:', error);
        showToast('Failed to load data. Using sample data.', 'error');
        loadSampleData();
    } finally {
        hideLoading();
    }
}

function loadSampleData() {
    // Sample data for demonstration
    deliveriesData = [
        {
            date: '2025-06-30',
            invoice: 'INV-001',
            supervisor: 'John Smith',
            deliveryPerson: 'Alex Brown',
            dispatchTime: '09:00',
            arrivalTime: '09:30',
            duration: 30,
            status: 'Success'
        },
        {
            date: '2025-06-30',
            invoice: 'INV-002',
            supervisor: 'Sarah Johnson',
            deliveryPerson: 'Maria Garcia',
            dispatchTime: '10:15',
            arrivalTime: '11:00',
            duration: 45,
            status: 'Success'
        },
        {
            date: '2025-06-30',
            invoice: 'INV-003',
            supervisor: 'Mike Davis',
            deliveryPerson: 'David Kim',
            dispatchTime: '14:30',
            arrivalTime: '15:45',
            duration: 75,
            status: 'Failed'
        },
        {
            date: '2025-06-29',
            invoice: 'INV-004',
            supervisor: 'John Smith',
            deliveryPerson: 'Alex Brown',
            dispatchTime: '08:45',
            arrivalTime: '09:15',
            duration: 30,
            status: 'Success'
        },
        {
            date: '2025-06-29',
            invoice: 'INV-005',
            supervisor: 'Sarah Johnson',
            deliveryPerson: 'Maria Garcia',
            dispatchTime: '11:00',
            arrivalTime: '11:35',
            duration: 35,
            status: 'Success'
        }
    ];
    
    filteredData = [...deliveriesData];
    updateUI();
}

function processSheetData(values) {
    if (!values || values.length === 0) {
        deliveriesData = [];
        filteredData = [];
        updateUI();
        return;
    }
    
    // Skip header row
    const dataRows = values.slice(1);
    
    deliveriesData = dataRows.map(row => {
        const dispatchTime = row[4] || '';
        const arrivalTime = row[5] || '';
        const duration = calculateDuration(dispatchTime, arrivalTime);
        
        return {
            date: row[0] || '',
            invoice: row[1] || '',
            supervisor: row[2] || '',
            deliveryPerson: row[3] || '',
            dispatchTime: dispatchTime,
            arrivalTime: arrivalTime,
            duration: duration,
            status: duration > 60 ? 'Failed' : 'Success'
        };
    });
    
    filteredData = [...deliveriesData];
    updateUI();
}

async function saveToSheet(deliveryData) {
    try {
        // If no API key configured, just update local data
        if (!CONFIG.API_KEY || CONFIG.API_KEY === 'YourApiKeyHere') {
            deliveriesData.unshift(deliveryData);
            filteredData = [...deliveriesData];
            updateUI();
            showToast('Delivery added successfully!');
            return;
        }
        
        // Prepare data for Google Sheets
        const values = [[
            deliveryData.date,
            deliveryData.invoice,
            deliveryData.supervisor,
            deliveryData.deliveryPerson,
            deliveryData.dispatchTime,
            deliveryData.arrivalTime
        ]];
        
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${CONFIG.SHEET_NAME}:append?valueInputOption=RAW&key=${CONFIG.API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: values
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save data');
        }
        
        // Refresh data after successful save
        await loadData();
        showToast('Delivery saved successfully!');
        
    } catch (error) {
        console.error('Error saving data:', error);
        showToast('Failed to save delivery', 'error');
    }
}

// Utility Functions
function calculateDuration(dispatchTime, arrivalTime) {
    if (!dispatchTime || !arrivalTime) return 0;
    
    const dispatch = new Date(`2000-01-01 ${dispatchTime}`);
    const arrival = new Date(`2000-01-01 ${arrivalTime}`);
    
    const diffInMs = arrival - dispatch;
    return Math.round(diffInMs / (1000 * 60)); // Convert to minutes
}

function formatDuration(minutes) {
    if (minutes === 0) return '--';
    if (minutes < 60) return `${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// UI Update Functions
function updateUI() {
    updateKPIs();
    updateTable();
}

function updateKPIs() {
    const today = new Date().toISOString().split('T')[0];
    const todayDeliveries = deliveriesData.filter(d => d.date === today);
    
    // Success Rate
    const successCount = todayDeliveries.filter(d => d.status === 'Success').length;
    const successRate = todayDeliveries.length > 0 ? 
        Math.round((successCount / todayDeliveries.length) * 100) : 0;
    document.getElementById('successRate').textContent = `${successRate}%`;
    
    // Average Time
    const validDurations = todayDeliveries
        .map(d => d.duration)
        .filter(d => d > 0);
    const avgTime = validDurations.length > 0 ? 
        Math.round(validDurations.reduce((a, b) => a + b, 0) / validDurations.length) : 0;
    document.getElementById('avgTime').textContent = formatDuration(avgTime);
    
    // Total Deliveries
    document.getElementById('totalDeliveries').textContent = todayDeliveries.length;
}

function updateTable() {
    const tbody = document.getElementById('deliveryTableBody');
    tbody.innerHTML = '';
    
    if (filteredData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #9ca3af;">
                    No deliveries found
                </td>
            </tr>
        `;
        return;
    }
    
    filteredData.forEach((delivery, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(delivery.date)}</td>
            <td><strong>${delivery.invoice}</strong></td>
            <td>${delivery.supervisor}</td>
            <td>${delivery.deliveryPerson}</td>
            <td>${formatDuration(delivery.duration)}</td>
            <td>
                <span class="status-badge status-${delivery.status.toLowerCase()}">
                    ${delivery.status}
                </span>
            </td>
            <td>
                <button class="action-btn" onclick="deleteDelivery(${index})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Event Handlers
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    applyFilters(searchTerm);
}

function handleFilter() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    applyFilters(searchTerm);
}

function applyFilters(searchTerm = '') {
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredData = deliveriesData.filter(delivery => {
        const matchesSearch = !searchTerm || 
            delivery.invoice.toLowerCase().includes(searchTerm) ||
            delivery.supervisor.toLowerCase().includes(searchTerm) ||
            delivery.deliveryPerson.toLowerCase().includes(searchTerm);
        
        const matchesStatus = !statusFilter || delivery.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    updateTable();
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const dispatchTime = formData.get('dispatchTime') || document.getElementById('dispatchTime').value;
    const arrivalTime = formData.get('arrivalTime') || document.getElementById('arrivalTime').value;
    
    // Validate times
    if (dispatchTime >= arrivalTime) {
        showToast('Arrival time must be after dispatch time', 'error');
        return;
    }
    
    const duration = calculateDuration(dispatchTime, arrivalTime);
    
    const deliveryData = {
        date: document.getElementById('date').value,
        invoice: document.getElementById('invoice').value,
        supervisor: document.getElementById('supervisor').value,
        deliveryPerson: document.getElementById('deliveryPerson').value,
        dispatchTime: dispatchTime,
        arrivalTime: arrivalTime,
        duration: duration,
        status: duration > 60 ? 'Failed' : 'Success'
    };
    
    // Disable submit button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    saveToSheet(deliveryData).finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save';
        closeModal();
        document.getElementById('deliveryForm').reset();
        setDefaultDate();
    });
}

function deleteDelivery(index) {
    if (confirm('Are you sure you want to delete this delivery record?')) {
        const originalIndex = deliveriesData.findIndex(d => 
            d.invoice === filteredData[index].invoice && 
            d.date === filteredData[index].date
        );
        
        if (originalIndex > -1) {
            deliveriesData.splice(originalIndex, 1);
            filteredData = deliveriesData.filter(delivery => {
                const searchTerm = document.getElementById('searchInput').value.toLowerCase();
                const statusFilter = document.getElementById('statusFilter').value;
                
                const matchesSearch = !searchTerm || 
                    delivery.invoice.toLowerCase().includes(searchTerm) ||
                    delivery.supervisor.toLowerCase().includes(searchTerm) ||
                    delivery.deliveryPerson.toLowerCase().includes(searchTerm);
                
                const matchesStatus = !statusFilter || delivery.status === statusFilter;
                
                return matchesSearch && matchesStatus;
            });
            
            updateUI();
            showToast('Delivery record deleted');
        }
    }
}

// Modal Functions
function openModal() {
    document.getElementById('deliveryModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('deliveryModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Utility Functions
function showLoading() {
    // Could add a loading indicator here
}

function hideLoading() {
    // Could hide loading indicator here
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlide 0.3s ease reverse';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 3000);
}
// script.js

// Global variables for data storage
let deliveryData = [];
let currentEditIndex = -1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateDashboard();
    setupEventListeners();
    
    // Set today's date as default
    document.getElementById('deliveryDate').value = new Date().toISOString().split('T')[0];
});

// Setup event listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('deliveryForm').addEventListener('submit', handleFormSubmit);
    
    // Time change listeners for real-time status updates
    document.getElementById('dispatchTime').addEventListener('change', updateDeliveryStatus);
    document.getElementById('arrivalTime').addEventListener('change', updateDeliveryStatus);
    
    // Import file listener
    document.getElementById('importFile').addEventListener('change', handleFileImport);
    
    // Auto-save data every 30 seconds
    setInterval(saveData, 30000);
}

// Tab Management
function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
    
    // Update data when switching to certain tabs
    if (tabName === 'dashboard') {
        updateDashboard();
    } else if (tabName === 'records') {
        populateRecordsTable();
    }
}

// Form Management
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        id: currentEditIndex >= 0 ? deliveryData[currentEditIndex].id : Date.now(),
        invoiceNumber: document.getElementById('invoiceNumber').value,
        deliveryDate: document.getElementById('deliveryDate').value,
        dispatchTime: document.getElementById('dispatchTime').value,
        arrivalTime: document.getElementById('arrivalTime').value,
        storeSupervisor: document.getElementById('storeSupervisor').value,
        deliveryPerson: document.getElementById('deliveryPerson').value,
        vehicleNumber: document.getElementById('vehicleNumber').value || 'N/A',
        timestamp: new Date().toISOString()
    };
    
    // Calculate delivery time and status
    const deliveryStats = calculateDeliveryStats(formData.dispatchTime, formData.arrivalTime);
    formData.deliveryTimeMinutes = deliveryStats.minutes;
    formData.isSuccessful = deliveryStats.isSuccessful;
    
    // Validate required fields
    if (!validateForm(formData)) {
        return;
    }
    
    // Save data
    if (currentEditIndex >= 0) {
        deliveryData[currentEditIndex] = formData;
        showMessage('Delivery record updated successfully!', 'success');
    } else {
        deliveryData.push(formData);
        showMessage('Delivery record added successfully!', 'success');
    }
    
    // Reset form and update displays
    clearForm();
    saveData();
    updateDashboard();
    populateRecordsTable();
}

function validateForm(data) {
    const required = ['invoiceNumber', 'deliveryDate', 'dispatchTime', 'arrivalTime', 'storeSupervisor', 'deliveryPerson'];
    
    for (let field of required) {
        if (!data[field] || data[field].trim() === '') {
            showMessage(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
            return false;
        }
    }
    
    // Check if arrival time is after dispatch time
    if (data.dispatchTime >= data.arrivalTime) {
        showMessage('Arrival time must be after dispatch time', 'error');
        return false;
    }
    
    return true;
}

function clearForm() {
    document.getElementById('deliveryForm').reset();
    document.getElementById('deliveryDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('statusIndicator').className = 'status-indicator';
    document.getElementById('statusText').textContent = 'Enter times to calculate';
    document.getElementById('deliveryTimeDisplay').textContent = '';
    currentEditIndex = -1;
}

function updateDeliveryStatus() {
    const dispatchTime = document.getElementById('dispatchTime').value;
    const arrivalTime = document.getElementById('arrivalTime').value;
    
    if (dispatchTime && arrivalTime) {
        const stats = calculateDeliveryStats(dispatchTime, arrivalTime);
        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        const deliveryTimeDisplay = document.getElementById('deliveryTimeDisplay');
        
        statusIndicator.className = 'status-indicator ' + (stats.isSuccessful ? 'status-success' : 'status-failed');
        statusText.textContent = stats.isSuccessful ? 'On Time Delivery' : 'Delayed Delivery';
        deliveryTimeDisplay.textContent = `${stats.minutes} minutes`;
    }
}

// Calculation Functions
function calculateDeliveryStats(dispatchTime, arrivalTime) {
    const dispatch = new Date(`1970-01-01T${dispatchTime}:00`);
    const arrival = new Date(`1970-01-01T${arrivalTime}:00`);
    
    // Handle next day delivery
    if (arrival < dispatch) {
        arrival.setDate(arrival.getDate() + 1);
    }
    
    const diffMs = arrival - dispatch;
    const minutes = Math.round(diffMs / (1000 * 60));
    
    return {
        minutes: minutes,
        isSuccessful: minutes <= 45
    };
}

// Dashboard Functions
function updateDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const weekStart = getWeekStart(new Date());
    
    // Calculate daily stats
    const todayDeliveries = deliveryData.filter(d => d.deliveryDate === today);
    const todaySuccessful = todayDeliveries.filter(d => d.isSuccessful).length;
    const todaySuccessRate = todayDeliveries.length > 0 ? (todaySuccessful / todayDeliveries.length * 100) : 0;
    
    // Calculate weekly stats
    const weeklyDeliveries = deliveryData.filter(d => new Date(d.deliveryDate) >= weekStart);
    const dailyStats = groupDeliveriesByDate(weeklyDeliveries);
    const activeDays = Object.keys(dailyStats).length;
    const weeklyAverage = activeDays > 0 ? 
        Object.values(dailyStats).reduce((sum, day) => sum + day.successRate, 0) / activeDays : 0;
    
    // Update header stats
    document.getElementById('todaySuccess').textContent = todaySuccessRate.toFixed(1) + '%';
    document.getElementById('weeklyAverage').textContent = weeklyAverage.toFixed(1) + '%';
    
    // Update dashboard cards
    document.getElementById('dailyKPI').textContent = todaySuccessRate.toFixed(1) + '%';
    document.getElementById('dailyTotal').textContent = todayDeliveries.length;
    document.getElementById('dailySuccessful').textContent = todaySuccessful;
    
    document.getElementById('weeklyKPI').textContent = weeklyAverage.toFixed(1) + '%';
    document.getElementById('activeDays').textContent = activeDays;
    document.getElementById('weeklyTotal').textContent = weeklyDeliveries.length;
    
    // Update target achievement
    const targetAchievement = (weeklyAverage / 95) * 100;
    document.getElementById('targetAchievement').textContent = Math.min(targetAchievement, 100).toFixed(1) + '%';
    document.getElementById('targetProgress').style.width = Math.min(targetAchievement, 100) + '%';
    
    // Update chart (simple bar representation)
    updateWeeklyChart(dailyStats);
}

function groupDeliveriesByDate(deliveries) {
    const grouped = {};
    
    deliveries.forEach(delivery => {
        const date = delivery.deliveryDate;
        if (!grouped[date]) {
            grouped[date] = { total: 0, successful: 0, successRate: 0 };
        }
        grouped[date].total++;
        if (delivery.isSuccessful) {
            grouped[date].successful++;
        }
        grouped[date].successRate = (grouped[date].successful / grouped[date].total) * 100;
    });
    
    return grouped;
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

function updateWeeklyChart(dailyStats) {
    const canvas = document.getElementById('weeklyChart');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const dates = Object.keys(dailyStats).slice(-7); // Last 7 days
    if (dates.length === 0) return;
    
    const maxRate = 100;
    const barWidth = canvas.width / dates.length - 10;
    const barMaxHeight = canvas.height - 40;
    
    // Draw bars
    dates.forEach((date, index) => {
        const rate = dailyStats[date].successRate;
        const barHeight = (rate / maxRate) * barMaxHeight;
        const x = index * (barWidth + 10);
        const y = canvas.height - barHeight - 20;
        
        // Bar color based on performance
        ctx.fillStyle = rate >= 95 ? '#27ae60' : rate >= 80 ? '#f39c12' : '#e74c3c';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Date label
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(new Date(date).getDate(), x + barWidth/2, canvas.height - 5);
        
        // Rate label
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.fillText(rate.toFixed(0) + '%', x + barWidth/2, y - 5);
    });
}

// Records Table Functions
function populateRecordsTable() {
    const tbody = document.getElementById('recordsTableBody');
    tbody.innerHTML = '';
    
    // Sort by date (newest first)
    const sortedData = [...deliveryData].sort((a, b) => new Date(b.deliveryDate) - new Date(a.deliveryDate));
    
    sortedData.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(record.deliveryDate)}</td>
            <td>${record.invoiceNumber}</td>
            <td>${record.dispatchTime}</td>
            <td>${record.arrivalTime}</td>
            <td>${record.deliveryTimeMinutes} min</td>
            <td><span class="status-badge ${record.isSuccessful ? 'status-success' : 'status-failed'}">
                ${record.isSuccessful ? 'Success' : 'Delayed'}
            </span></td>
            <td>${record.storeSupervisor}</td>
            <td>${record.deliveryPerson}</td>
            <td>${record.vehicleNumber}</td>
            <td>
                <button class="action-btn edit" onclick="editRecord(${deliveryData.indexOf(record)})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteRecord(${deliveryData.indexOf(record)})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editRecord(index) {
    const record = deliveryData[index];
    currentEditIndex = index;
    
    // Populate form with record data
    document.getElementById('invoiceNumber').value = record.invoiceNumber;
    document.getElementById('deliveryDate').value = record.deliveryDate;
    document.getElementById('dispatchTime').value = record.dispatchTime;
    document.getElementById('arrivalTime').value = record.arrivalTime;
    document.getElementById('storeSupervisor').value = record.storeSupervisor;
    document.getElementById('deliveryPerson').value = record.deliveryPerson;
    document.getElementById('vehicleNumber').value = record.vehicleNumber === 'N/A' ? '' : record.vehicleNumber;
    
    // Update status display
    updateDeliveryStatus();
    
    // Switch to entry tab
    showTab('entry');
    
    showMessage('Record loaded for editing', 'success');
}

function deleteRecord(index) {
    if (confirm('Are you sure you want to delete this record?')) {
        deliveryData.splice(index, 1);
        saveData();
        populateRecordsTable();
        updateDashboard();
        showMessage('Record deleted successfully', 'success');
    }
}

function filterRecords() {
    const filterDate = document.getElementById('filterDate').value;
    if (!filterDate) {
        populateRecordsTable();
        return;
    }
    
    const tbody = document.getElementById('recordsTableBody');
    tbody.innerHTML = '';
    
    const filteredData = deliveryData.filter(record => record.deliveryDate === filterDate);
    
    filteredData.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(record.deliveryDate)}</td>
            <td>${record.invoiceNumber}</td>
            <td>${record.dispatchTime}</td>
            <td>${record.arrivalTime}</td>
            <td>${record.deliveryTimeMinutes} min</td>
            <td><span class="status-badge ${record.isSuccessful ? 'status-success' : 'status-failed'}">
                ${record.isSuccessful ? 'Success' : 'Delayed'}
            </span></td>
            <td>${record.storeSupervisor}</td>
            <td>${record.deliveryPerson}</td>
            <td>${record.vehicleNumber}</td>
            <td>
                <button class="action-btn edit" onclick="editRecord(${deliveryData.indexOf(record)})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteRecord(${deliveryData.indexOf(record)})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    showMessage(`Found ${filteredData.length} records for ${formatDate(filterDate)}`, 'success');
}

function clearFilter() {
    document.getElementById('filterDate').value = '';
    populateRecordsTable();
    showMessage('Filter cleared', 'success');
}

// Export/Import Functions
function exportToCSV() {
    if (deliveryData.length === 0) {
        showMessage('No data to export', 'error');
        return;
    }
    
    const headers = [
        'Date', 'Invoice Number', 'Dispatch Time', 'Arrival Time', 
        'Delivery Time (minutes)', 'Status', 'Store Supervisor', 
        'Delivery Person', 'Vehicle Number'
    ];
    
    const csvContent = [
        headers.join(','),
        ...deliveryData.map(record => [
            record.deliveryDate,
            record.invoiceNumber,
            record.dispatchTime,
            record.arrivalTime,
            record.deliveryTimeMinutes,
            record.isSuccessful ? 'Success' : 'Delayed',
            record.storeSupervisor,
            record.deliveryPerson,
            record.vehicleNumber
        ].join(','))
    ].join('\n');
    
    downloadFile(csvContent, 'delivery-records.csv', 'text/csv');
    showMessage('CSV file downloaded successfully', 'success');
}

function exportToJSON() {
    if (deliveryData.length === 0) {
        showMessage('No data to export', 'error');
        return;
    }
    
    const jsonContent = JSON.stringify({
        exportDate: new Date().toISOString(),
        recordCount: deliveryData.length,
        data: deliveryData
    }, null, 2);
    
    downloadFile(jsonContent, 'delivery-backup.json', 'application/json');
    showMessage('JSON backup downloaded successfully', 'success');
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            if (file.name.endsWith('.json')) {
                const importedData = JSON.parse(e.target.result);
                if (importedData.data && Array.isArray(importedData.data)) {
                    deliveryData = importedData.data;
                    saveData();
                    updateDashboard();
                    populateRecordsTable();
                    showMessage(`Imported ${importedData.data.length} records successfully`, 'success');
                } else {
                    throw new Error('Invalid JSON format');
                }
            } else if (file.name.endsWith('.csv')) {
                // Simple CSV parsing - in production, use a proper CSV parser
                const lines = e.target.result.split('\n');
                const headers = lines[0].split(',');
                const imported = [];
                
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',');
                    if (values.length >= 8) {
                        imported.push({
                            id: Date.now() + i,
                            deliveryDate: values[0],
                            invoiceNumber: values[1],
                            dispatchTime: values[2],
                            arrivalTime: values[3],
                            deliveryTimeMinutes: parseInt(values[4]),
                            isSuccessful: values[5] === 'Success',
                            storeSupervisor: values[6],
                            deliveryPerson: values[7],
                            vehicleNumber: values[8] || 'N/A',
                            timestamp: new Date().toISOString()
                        });
                    }
                }
                
                deliveryData = imported;
                saveData();
                updateDashboard();
                populateRecordsTable();
                showMessage(`Imported ${imported.length} records from CSV`, 'success');
            }
        } catch (error) {
            showMessage('Error importing file: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Data Persistence Functions
function saveData() {
    try {
        // In a real application, this would send data to a server
        // For now, we'll use localStorage as a fallback
        const dataToSave = {
            version: '1.0',
            lastUpdate: new Date().toISOString(),
            records: deliveryData
        };
        
        // Note: In the Claude.ai environment, localStorage isn't available
        // This is where you would integrate with your preferred cloud storage
        console.log('Data saved:', dataToSave);
        
        // Example cloud storage integration points:
        // - Firebase Firestore
        // - Google Sheets API
        // - Custom REST API
        // - Airtable API
        
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function loadData() {
    try {
        // In a real application, this would fetch data from a server
        // For demo purposes, we'll start with empty data
        
        // Example data for demonstration
        deliveryData = [
            {
                id: 1,
                invoiceNumber: 'INV-001',
                deliveryDate: new Date().toISOString().split('T')[0],
                dispatchTime: '09:00',
                arrivalTime: '09:30',
                deliveryTimeMinutes: 30,
                isSuccessful: true,
                storeSupervisor: 'John Smith',
                deliveryPerson: 'Mike Johnson',
                vehicleNumber: 'ABC-123',
                timestamp: new Date().toISOString()
            },
            {
                id: 2,
                invoiceNumber: 'INV-002',
                deliveryDate: new Date().toISOString().split('T')[0],
                dispatchTime: '10:00',
                arrivalTime: '11:00',
                deliveryTimeMinutes: 60,
                isSuccessful: false,
                storeSupervisor: 'Jane Doe',
                deliveryPerson: 'Sarah Wilson',
                vehicleNumber: 'XYZ-789',
                timestamp: new Date().toISOString()
            }
        ];
        
        console.log('Sample data loaded');
        
    } catch (error) {
        console.error('Error loading data:', error);
        deliveryData = [];
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showMessage(message, type = 'success') {
    const container = document.getElementById('messageContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer; opacity: 0.7;">×</button>
        </div>
    `;
    
    container.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 5000);
}

// Cloud Storage Integration Examples
// Deployment id AKfycby7rViLIC_TS5_DaNtHsEzIiMNnraAdPTKg1XxHFfytbHOeV_Wb3bVnvHkY5GoHqyXV
// Google Sheets API Example
async function saveToGoogleSheets() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycby7rViLIC_TS5_DaNtHsEzIiMNnraAdPTKg1XxHFfytbHOeV_Wb3bVnvHkY5GoHqyXV/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'saveData',
                data: deliveryData
            })
        });
        
        if (response.ok) {
            showMessage('Data synced to Google Sheets', 'success');
        } else {
            throw new Error('Failed to sync');
        }
    } catch (error) {
        showMessage('Error syncing to Google Sheets: ' + error.message, 'error');
    }
}
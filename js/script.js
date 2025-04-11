// Connect to WebSocket server
const socket = io();

// Update connection status
socket.on('connect', () => {
    document.querySelector('.connection-status').textContent = 'Connected';
    document.querySelector('.status-dot').classList.add('connected');
});

socket.on('disconnect', () => {
    document.querySelector('.connection-status').textContent = 'Disconnected';
    document.querySelector('.status-dot').classList.remove('connected');
});

// Handle incoming sensor data
socket.on('sensorData', (data) => {
    // Update temperature
    if (data.temperature !== undefined) {
        document.getElementById('temperature').textContent = `${data.temperature}°C`;
    }
    
    // Update humidity
    if (data.humidity !== undefined) {
        document.getElementById('humidity').textContent = `${data.humidity}%`;
    }
    
    // Update soil moisture
    if (data.soilMoisture !== undefined) {
        document.getElementById('soil-moisture').textContent = `${data.soilMoisture}%`;
    }
    
    // Update gas level
    if (data.gas !== undefined) {
        document.getElementById('gas').textContent = data.gas;
    }
    
    // Update light intensity
    if (data.light !== undefined) {
        document.getElementById('light').textContent = `${data.light} lux`;
    }
    
    // Update motion
    if (data.motion !== undefined) {
        document.getElementById('motion').textContent = data.motion;
    }
    
    // Update rain status
    if (data.rain !== undefined) {
        document.getElementById('rain').textContent = data.rain;
    }

    // Add alerts based on sensor readings
    if (parseFloat(data.soilMoisture) < 30) {
        addAlert('Low soil moisture detected! Water pump activated.', 'warning');
    } else if (parseFloat(data.soilMoisture) > 80) {
        addAlert('Soil moisture is high! Water pump deactivated.', 'info');
    }

    if (data.gas === 'Detected!') {
        addAlert('Gas detected! Please check the environment.', 'danger');
    }

    if (data.motion === 'Detected') {
        addAlert('Motion detected! Buzzer activated.', 'info');
    }

    if (data.rain === 'Wet') {
        addAlert('Rain detected!', 'info');
    }
});

// Handle control switches
document.querySelectorAll('.switch input').forEach(switchInput => {
    switchInput.addEventListener('change', (e) => {
        const deviceId = e.target.id;
        const state = e.target.checked;
        
        // Send control command to server
        socket.emit('controlCommand', {
            device: deviceId,
            state: state
        });

        // Add alert for control action
        const deviceName = deviceId === 'pump' ? 'Water pump' : 'Buzzer';
        addAlert(`${deviceName} ${state ? 'activated' : 'deactivated'}`, 'info');
    });
});

// Function to add alerts
function addAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    alertContainer.appendChild(alert);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Handle system alerts
socket.on('alert', (alert) => {
    addAlert(alert.message, alert.type);
}); 
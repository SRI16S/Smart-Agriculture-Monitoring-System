const socket = io();

// Listen for sensor data from server
socket.on('sensorData', (data) => {
    document.getElementById('temperature').textContent = `${data.temperature}°C`;
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('soil-moisture').textContent = `${data.soilMoisture}%`;
    document.getElementById('gas').textContent = data.gas;
    document.getElementById('light').textContent = `${data.light} lux`;
    document.getElementById('motion').textContent = data.motion;
    document.getElementById('rain').textContent = data.rain;

    // Optional: Trigger alert messages
    const alertContainer = document.getElementById('alert-container');
    if (data.gas === 'Detected!') {
        addAlert('Gas detected! Please check immediately.', alertContainer);
    }
    if (data.motion === 'Detected') {
        addAlert('Motion detected near the field.', alertContainer);
    }
});

// Function to add alerts dynamically
function addAlert(message, container) {
    const alert = document.createElement('div');
    alert.classList.add('alert');
    alert.textContent = message;
    container.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000); // Remove alert after 5 seconds
}

// Handle control switches
document.getElementById('pump').addEventListener('change', (e) => {
    socket.emit('controlCommand', {
        device: 'pump',
        state: e.target.checked
    });
});

document.getElementById('buzzer').addEventListener('change', (e) => {
    socket.emit('controlCommand', {
        device: 'buzzer',
        state: e.target.checked
    });
});

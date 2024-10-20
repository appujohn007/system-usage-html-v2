document.getElementById('date-select').addEventListener('change', async function () {
    const date = this.value;
    if (date) {
        // Make an AJAX call to get the data for the selected date
        const response = await fetch(`/usage/${date}`);
        const data = await response.json();

        // Update the CPU usage section
        const cpuList = document.getElementById('cpu-usage');
        cpuList.innerHTML = '';  // Clear previous data
        if (data.cpu.length > 0) {
            data.cpu.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `Time: ${item.time}, CPU Usage: ${item.usage}%`;
                cpuList.appendChild(li);
            });
        } else {
            cpuList.innerHTML = '<li>No CPU data available</li>';
        }

        // Update the RAM usage section
        const ramList = document.getElementById('ram-usage');
        ramList.innerHTML = '';  // Clear previous data
        if (data.ram.length > 0) {
            data.ram.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `Time: ${item.time}, RAM Usage: ${item.usage}%`;
                ramList.appendChild(li);
            });
        } else {
            ramList.innerHTML = '<li>No RAM data available</li>';
        }
    }
});

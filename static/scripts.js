document.getElementById('date-select').addEventListener('change', async function () {
    const date = this.value;
    if (date) {
        const response = await fetch(`/usage/${date}`);
        const data = await response.json();

        // Update CPU usage
        const cpuList = document.getElementById('cpu-usage');
        cpuList.innerHTML = '';
        data.cpu.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `Time: ${item.time}, CPU Usage: ${item.usage}%`;
            cpuList.appendChild(li);
        });

        // Update RAM usage
        const ramList = document.getElementById('ram-usage');
        ramList.innerHTML = '';
        data.ram.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `Time: ${item.time}, RAM Usage: ${item.usage}%`;
            ramList.appendChild(li);
        });
    }
});

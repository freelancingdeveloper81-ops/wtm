document.addEventListener('DOMContentLoaded', () => {
    // Page load hote hi logs dikhayein
    displayLogs();

    // 1. Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // 2. Default Time
    const setTime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        document.getElementById('opDateTime').value = new Date(now - offset).toISOString().slice(0, 16);
    };
    setTime();

    // 3. Live Calculation
    const productType = document.getElementById('productType');
    const quantity = document.getElementById('quantity');
    const volDisplay = document.getElementById('totalVol');

    const calculateVolume = () => {
        const size = parseFloat(productType.value) || 0;
        const qty = parseFloat(quantity.value) || 0;
        volDisplay.innerText = (size * qty).toFixed(1);
    };

    productType.addEventListener('change', calculateVolume);
    quantity.addEventListener('input', calculateVolume);

    // 4. Save to Storage & Internal Link
    const form = document.getElementById('fillingLogForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const logEntry = {
            id: Date.now(),
            product: productType.options[productType.selectedIndex].text,
            qty: quantity.value,
            total: volDisplay.innerText,
            operator: document.getElementById('operator').value,
            time: document.getElementById('opDateTime').value
        };

        // Local Storage Linking
        let logs = JSON.parse(localStorage.getItem('fillingLogs')) || [];
        logs.push(logEntry);
        localStorage.setItem('fillingLogs', JSON.stringify(logs));

        alert("✅ PRODUCTION LOG SAVED");
        form.reset();
        setTime();
        volDisplay.innerText = "0";
        displayLogs(); // Refresh Table
    });
});

// 5. Function to display stored data
function displayLogs() {
    const logs = JSON.parse(localStorage.getItem('fillingLogs')) || [];
    const tbody = document.getElementById('logTableBody');
    const entryCount = document.getElementById('entryCount');
    
    tbody.innerHTML = "";
    entryCount.innerText = logs.length;

    // Latest entries pehle dikhane ke liye reverse kiya
    logs.reverse().slice(0, 5).forEach(log => {
        tbody.innerHTML += `
            <tr>
                <td>${log.time.replace('T', ' ')}</td>
                <td><strong>${log.product}</strong></td>
                <td>${log.qty} Units</td>
                <td><b style="color:var(--primary)">${log.total}L</b></td>
                <td>${log.operator}</td>
            </tr>
        `;
    });
}

// Clear storage for testing
function clearLogs() {
    if(confirm("Delete all production logs?")) {
        localStorage.removeItem('fillingLogs');
        location.reload();
    }
}
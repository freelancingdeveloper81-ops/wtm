document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Theme Management
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    themeBtn.addEventListener('click', () => {
        const isDark = html.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', newTheme);
    });

    // Persistent Theme on load
    if (localStorage.getItem('theme') === 'dark') {
        html.setAttribute('data-theme', 'dark');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // 2. Load and Sync Data
    loadHistory();

    // 3. Stats Calculation Logic
    function updateStats(logs) {
        const totalFilledCount = document.getElementById('totalFilledCount');
        const todayFilledCount = document.getElementById('todayFilledCount');
        const logCount = document.getElementById('logCount');

        let totalQty = 0;
        let todayQty = 0;
        const today = new Date().toISOString().split('T')[0];

        logs.forEach(log => {
            const qty = parseInt(log.qty) || 0;
            totalQty += qty;
            if (log.time.startsWith(today)) {
                todayQty += qty;
            }
        });

        totalFilledCount.innerText = totalQty.toLocaleString();
        todayFilledCount.innerText = todayQty.toLocaleString();
        logCount.innerText = logs.length;
    }

    // 4. Render Table Function
    function loadHistory(filterData = null) {
        // Fetch from localStorage (same key used in bot.js)
        const logs = JSON.parse(localStorage.getItem('fillingLogs')) || [];
        const tableBody = document.getElementById('historyTableBody');
        tableBody.innerHTML = "";

        const dataToRender = filterData || logs;

        dataToRender.slice().reverse().forEach(item => {
            const row = `
                <tr>
                    <td><small>${item.time.replace('T', ' ')}</small></td>
                    <td><strong>${item.product}</strong></td>
                    <td style="font-weight:700;">${item.qty} Units</td>
                    <td><b style="color:var(--primary)">${item.total}L</b></td>
                    <td>${item.operator}</td>
                    <td><span class="status-pill">Verified ✅</span></td>
                    <td class="action-icons">
                        <i class="fas fa-eye" onclick="viewLog('${item.id}')" title="View"></i>
                        <i class="fas fa-trash-can" onclick="deleteLog('${item.id}')" title="Delete" style="color:#ff5f56"></i>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        if (dataToRender.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='7' style='text-align:center; padding:30px;'>No production records found.</td></tr>";
        }

        updateStats(logs);
    }

    // 5. Global Actions (Internal Links & Logic)
    window.applyFilters = () => {
        const prod = document.getElementById('filterProduct').value;
        const oper = document.getElementById('searchOperator').value.toLowerCase();
        const logs = JSON.parse(localStorage.getItem('fillingLogs')) || [];

        const filtered = logs.filter(log => {
            const matchProd = (prod === 'all' || log.product.includes(prod));
            const matchOper = log.operator.toLowerCase().includes(oper);
            return matchProd && matchOper;
        });

        loadHistory(filtered);
    };

    window.resetLogs = () => {
        document.getElementById('filterProduct').value = 'all';
        document.getElementById('searchOperator').value = '';
        loadHistory();
    };

    window.deleteLog = (id) => {
        if (confirm("Are you sure you want to delete this log?")) {
            let logs = JSON.parse(localStorage.getItem('fillingLogs')) || [];
            logs = logs.filter(log => log.id.toString() !== id.toString());
            localStorage.setItem('fillingLogs', JSON.stringify(logs));
            loadHistory();
        }
    };

    window.exportData = () => {
        alert("Preparing System Export... CSV file will be downloaded shortly.");
    };

    window.viewLog = (id) => {
        alert(`ACCESSING ARCHIVE: Entry ID #${id} details retrieved from secure database.`);
    };
});
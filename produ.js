document.addEventListener('DOMContentLoaded', () => {
    // Dashboard load hote hi data sync karein
    updateDashboard();

    // 1. Theme Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // 2. Clock Logic
    setInterval(() => {
        const clock = document.getElementById('digitalClock');
        clock.innerText = new Date().toLocaleTimeString();
    }, 1000);
});

// 3. Update Dashboard Stats from ALL Storage keys
function updateDashboard() {
    // Storage se alag alag keys ka data uthayein
    const inventory = JSON.parse(localStorage.getItem('myInventory')) || [];
    const customers = JSON.parse(localStorage.getItem('myCustomers')) || [];
    const fillingLogs = JSON.parse(localStorage.getItem('fillingLogs')) || [];

    // Stats calculation
    document.getElementById('stat-products').innerText = inventory.length;
    document.getElementById('stat-customers').innerText = customers.length;
    
    // Filling Total (Sirf aaj ka example)
    const todayFilling = fillingLogs.reduce((acc, log) => acc + parseInt(log.qty || 0), 0);
    document.getElementById('stat-filling').innerText = todayFilling;

    // Dues Calculation (Udhaar)
    const totalDues = customers.reduce((acc, cust) => acc + (cust.balance < 0 ? Math.abs(cust.balance) : 0), 0);
    document.getElementById('stat-balance').innerText = `$ ${totalDues.toLocaleString()}`;

    // Update Activity Table (Merge last entries of all types)
    renderMasterLog(inventory, customers, fillingLogs);
}

function renderMasterLog(inv, cust, fill) {
    const logBody = document.getElementById('masterLogBody');
    logBody.innerHTML = "";

    // Sirf top 5 latest entries dikhane ke liye merge logic
    const activities = [
        ...inv.slice(-2).map(item => ({ time: 'Recently', cat: 'Inventory', detail: `Added ${item.name}`, status: 'Stored' })),
        ...fill.slice(-2).map(item => ({ time: 'Today', cat: 'Production', detail: `Filled ${item.qty} units of ${item.product}`, status: 'Completed' })),
        ...cust.slice(-1).map(item => ({ time: 'New', cat: 'CRM', detail: `New Client: ${item.name}`, status: 'Active' }))
    ];

    activities.forEach(act => {
        logBody.innerHTML += `
            <tr>
                <td>${act.time}</td>
                <td><span style="font-weight:700; color:var(--primary)">${act.cat}</span></td>
                <td>${act.detail}</td>
                <td><span style="color:#22c55e;">● ${act.status}</span></td>
            </tr>
        `;
    });

    if(activities.length === 0) {
        logBody.innerHTML = "<tr><td colspan='4' style='text-align:center; padding:20px;'>No activity data found in storage.</td></tr>";
    }
}

// Data reset function (X button par)
function clearAllData() {
    if(confirm("Confirm Reset: This will clear all products, customers and logs!")) {
        localStorage.clear();
        location.reload();
    }
}
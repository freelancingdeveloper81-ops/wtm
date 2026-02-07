document.addEventListener('DOMContentLoaded', () => {
    // Initial Load from Storage
    renderStaff();

    // 1. Theme Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // 2. Add Employee Logic
    const staffForm = document.getElementById('addStaffForm');
    staffForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newStaff = {
            id: Date.now(),
            name: document.getElementById('sName').value,
            type: document.getElementById('sType').value,
            salary: parseFloat(document.getElementById('sSalary').value),
            commRate: parseFloat(document.getElementById('sComm').value) || 0,
            phone: document.getElementById('sPhone').value,
            jars: Math.floor(Math.random() * 500), // Simulated Jars delivered
            status: "online"
        };

        let staffList = JSON.parse(localStorage.getItem('myStaff')) || [];
        staffList.push(newStaff);
        localStorage.setItem('myStaff', JSON.stringify(staffList));

        alert("✅ STAFF REGISTERED SUCCESSFULLY");
        staffForm.reset();
        openTab('directory');
        renderStaff();
    });

    // 3. Live Clock for Footer
    setInterval(() => {
        document.getElementById('clock').innerText = new Date().toLocaleTimeString();
    }, 1000);
});

// 4. Render and Calculation Function
function renderStaff() {
    const staffList = JSON.parse(localStorage.getItem('myStaff')) || [];
    const tbody = document.getElementById('staffTableBody');
    const pbody = document.getElementById('payrollTableBody');
    
    tbody.innerHTML = "";
    pbody.innerHTML = "";

    let fieldCount = 0;

    staffList.forEach(s => {
        if(s.type === "Field") fieldCount++;

        // Render Directory Row
        tbody.innerHTML += `
            <tr>
                <td><strong>${s.name}</strong></td>
                <td><span class="badge badge-${s.type.toLowerCase()}">${s.type === 'Field' ? 'Delivery Boy' : 'Office Staff'}</span></td>
                <td>${s.phone}</td>
                <td><span class="status-dot ${s.status}"></span> ${s.status.toUpperCase()}</td>
                <td><button class="btn-sm" onclick="deleteStaff(${s.id})"><i class="fas fa-trash"></i></button></td>
            </tr>
        `;

        // Render Payroll Row with Logic
        const commission = s.type === "Field" ? (s.jars * s.commRate) : 0;
        const total = s.salary + commission;

        pbody.innerHTML += `
            <tr>
                <td><strong>${s.name}</strong></td>
                <td>$${s.salary.toLocaleString()}</td>
                <td>${s.type === "Field" ? s.jars : '-'}</td>
                <td>${commission > 0 ? '$'+commission.toLocaleString() : '-'}</td>
                <td class="payable">$${total.toLocaleString()}</td>
            </tr>
        `;
    });

    // Update Top Stats
    document.getElementById('countTotal').innerText = staffList.length;
    document.getElementById('countField').innerText = fieldCount;
}

// Global Tab Switcher
window.openTab = (tabId) => {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
};

function deleteStaff(id) {
    if(confirm("Terminate this employee record?")) {
        let staffList = JSON.parse(localStorage.getItem('myStaff')) || [];
        staffList = staffList.filter(s => s.id !== id);
        localStorage.setItem('myStaff', JSON.stringify(staffList));
        renderStaff();
    }
}

function resetStaffDB() {
    location.reload();
}
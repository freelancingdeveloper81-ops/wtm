document.addEventListener('DOMContentLoaded', () => {
    // Initial Load
    renderCustomers();

    // Theme Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // Handle Form Submit
    const addForm = document.getElementById('addCustForm');
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newCust = {
            id: Date.now(),
            name: document.getElementById('cName').value,
            phone: document.getElementById('cPhone').value,
            area: document.getElementById('cArea').value,
            balance: parseFloat(document.getElementById('cBalance').value) || 0,
            address: document.getElementById('cAddress').value,
            lastDel: "New Account"
        };

        // Save to LocalStorage
        let customers = JSON.parse(localStorage.getItem('myCustomers')) || [];
        customers.push(newCust);
        localStorage.setItem('myCustomers', JSON.stringify(customers));

        alert("✅ CUSTOMER REGISTERED SUCCESSFULLY");
        addForm.reset();
        switchTab('list'); // Switch back to list after saving
        renderCustomers();
    });
});

// Switch Tabs Function
function switchTab(tab) {
    const list = document.getElementById('listView');
    const add = document.getElementById('addView');
    const bList = document.getElementById('tabList');
    const bAdd = document.getElementById('tabAdd');

    if(tab === 'list') {
        list.style.display = 'block'; add.style.display = 'none';
        bList.classList.add('active'); bAdd.classList.remove('active');
    } else {
        list.style.display = 'none'; add.style.display = 'block';
        bList.classList.remove('active'); bAdd.classList.add('active');
    }
}

// Render Table and Stats
function renderCustomers() {
    const customers = JSON.parse(localStorage.getItem('myCustomers')) || [];
    const tbody = document.getElementById('customerTableBody');
    const statTotal = document.getElementById('totalClients');
    const statDues = document.getElementById('totalDues');
    const statAdv = document.getElementById('totalAdvance');

    tbody.innerHTML = "";
    let duesTotal = 0;
    let advTotal = 0;

    customers.forEach(c => {
        // Stats Calculation
        if(c.balance < 0) duesTotal += Math.abs(c.balance);
        if(c.balance > 0) advTotal += c.balance;

        // UI Logic
        const balClass = c.balance < 0 ? 'amt-due' : (c.balance > 0 ? 'amt-adv' : '');
        const balText = c.balance < 0 ? `Due: $${Math.abs(c.balance)}` : (c.balance > 0 ? `Adv: $${c.balance}` : '0.00');

        tbody.innerHTML += `
            <tr>
                <td><strong>${c.name}</strong><br><small style="color:#64748b;">ID: ${c.id.toString().slice(-5)}</small></td>
                <td><i class="fas fa-phone"></i> ${c.phone}<br><i class="fas fa-map-marker-alt"></i> ${c.area}</td>
                <td><span class="${balClass}">${balText}</span></td>
                <td>${c.lastDel}</td>
                <td>
                    <button class="btn-history" onclick="deleteCust(${c.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });

    // Update Stats Display
    statTotal.innerText = customers.length;
    statDues.innerText = `$${duesTotal.toLocaleString()}`;
    statAdv.innerText = `$${advTotal.toLocaleString()}`;

    if(customers.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5' style='text-align:center; padding:30px;'>No customers registered yet.</td></tr>";
    }
}

function deleteCust(id) {
    if(confirm("Remove this customer from records?")) {
        let customers = JSON.parse(localStorage.getItem('myCustomers')) || [];
        customers = customers.filter(c => c.id !== id);
        localStorage.setItem('myCustomers', JSON.stringify(customers));
        renderCustomers();
    }
}

function clearDatabase() {
    if(confirm("CRITICAL: This will delete ALL customers! Continue?")) {
        localStorage.removeItem('myCustomers');
        renderCustomers();
    }
}
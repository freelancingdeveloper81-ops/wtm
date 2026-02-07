document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // 2. Dummy Data for History
    const historyData = [
        { id: "LOG-9821", time: "2024-03-20 10:30 AM", product: "19 Liter Jar 🍶", qty: "150", operator: "Ali Khan", status: "Verified" },
        { id: "LOG-9820", time: "2024-03-20 09:15 AM", product: "1.5 Liter Bottle 🍼", qty: "500", operator: "Saeed Ahmed", status: "Verified" },
        { id: "LOG-9819", time: "2024-03-19 04:45 PM", product: "500ml Bottle 💧", qty: "1200", operator: "Zainab Bibi", status: "Verified" },
        { id: "LOG-9818", time: "2024-03-19 02:00 PM", product: "19 Liter Jar 🍶", qty: "80", operator: "Ali Khan", status: "Verified" },
        { id: "LOG-9817", time: "2024-03-19 11:30 AM", product: "19 Liter Jar 🍶", qty: "200", operator: "Ali Khan", status: "Verified" }
    ];

    const historyBody = document.getElementById('historyBody');

    const renderTable = (data) => {
        historyBody.innerHTML = "";
        data.forEach(item => {
            const row = `
                <tr>
                    <td style="font-weight:700; color:#0062BD;">${item.id}</td>
                    <td>${item.time}</td>
                    <td>${item.product}</td>
                    <td style="font-weight:700;">${item.qty} Units</td>
                    <td>${item.operator}</td>
                    <td><span class="status-badge">${item.status}</span></td>
                    <td class="action-btns">
                        <button class="btn-view" title="View Details"><i class="fas fa-eye"></i></button>
                        <button class="btn-edit" title="Edit Record"><i class="fas fa-pen-to-square"></i></button>
                    </td>
                </tr>
            `;
            historyBody.innerHTML += row;
        });
    };

    renderTable(historyData);

    // 3. Simple Search/Filter Interaction
    document.querySelector('.btn-search').addEventListener('click', () => {
        const filterVal = document.getElementById('productFilter').value;
        alert(`Applying system filter for: ${filterVal}\nDatabase searching...`);
        // Real filtering logic can be added here
    });

    // 4. Action Listeners
    document.addEventListener('click', (e) => {
        if(e.target.closest('.btn-edit')) {
            alert("Open System Modal: Edit Mode Enabled for this log.");
        }
        if(e.target.closest('.btn-view')) {
            alert("Displaying Detailed Production Receipt for this entry.");
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Theme Logic (Persistent)
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('aquaTheme', newTheme);
    });

    // 2. Load Real Data from Storage
    const loadInventory = () => {
        // Fetching data from the same key used in Prod.html and Stock.html
        const storedData = JSON.parse(localStorage.getItem('myInventory')) || [];
        renderInventory(storedData);
        updateSummaryCards(storedData);
        document.getElementById('syncTime').innerText = new Date().toLocaleTimeString();
    };

    // 3. Stats Calculation (Total, Low, Out)
    const updateSummaryCards = (data) => {
        let totalUnits = 0;
        let lowCount = 0;
        let outCount = 0;

        data.forEach(item => {
            const qty = parseInt(item.qty) || 0;
            const reorder = parseInt(item.reorder) || 50; // Default reorder point
            
            totalUnits += qty;
            if (qty === 0) outCount++;
            else if (qty <= reorder) lowCount++;
        });

        document.getElementById('totalCountDisplay').innerText = totalUnits.toLocaleString();
        document.getElementById('lowStockCount').innerText = `${lowCount} Items`;
        document.getElementById('outOfStockCount').innerText = `${outCount} Items`;
    };

    // 4. Render Engine
    const tableBody = document.getElementById('balanceBody');
    const renderInventory = (data) => {
        tableBody.innerHTML = "";
        
        if (data.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='6' style='text-align:center; padding:30px;'>No inventory data found in system database.</td></tr>";
            return;
        }

        data.forEach(item => {
            const qty = parseInt(item.qty) || 0;
            const reorder = parseInt(item.reorder) || 50;
            const max = 1000; // Assuming 1000 as 100% capacity for visual bar

            // Dynamic Styling Logic
            let healthClass = "good";
            let statusText = "HEALTHY STOCK";
            let statusClass = "healthy";
            let percentage = Math.round((qty / max) * 100);
            if(percentage > 100) percentage = 100;

            if (qty === 0) {
                healthClass = "crit";
                statusText = "OUT OF STOCK";
                statusClass = "out";
                percentage = 5;
            } else if (qty <= reorder) {
                healthClass = "low";
                statusText = "REORDER SOON";
                statusClass = "reorder";
            }

            const row = `
                <tr>
                    <td><strong>${item.name}</strong><br><small>${item.sku || 'N/A'}</small></td>
                    <td>${item.cat || 'General'}</td>
                    <td><strong style="font-size: 1.1rem;">${qty.toLocaleString()}</strong> Units</td>
                    <td>
                        <div class="health-container">
                            <span class="health-label">Warehouse Capacity: ${percentage}%</span>
                            <div class="bar-outer">
                                <div class="bar-inner ${healthClass}" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    </td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td><button class="btn-order" onclick="triggerPurchase('${item.name}')">Restock 🛒</button></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    };

    // 5. Initial Load & Sync
    loadInventory();

    // 6. Search Functionality
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        const storedData = JSON.parse(localStorage.getItem('myInventory')) || [];
        const filtered = storedData.filter(item => 
            item.name.toLowerCase().includes(val) || (item.sku && item.sku.toLowerCase().includes(val))
        );
        renderInventory(filtered);
    });

    // 7. Manual Sync Button
    document.getElementById('syncBtn').addEventListener('click', () => {
        const btn = document.getElementById('syncBtn');
        btn.innerHTML = '<i class="fas fa-sync fa-spin"></i> Syncing...';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-sync"></i> Refresh Data';
            loadInventory();
        }, 1000);
    });
});

function triggerPurchase(prod) {
    alert(`SYSTEM REDIRECT: Navigating to procurement for ${prod}. Generating Purchase Order...`);
}
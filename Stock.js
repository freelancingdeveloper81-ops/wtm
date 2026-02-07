let activeMode = 'IN';

document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromStorage();
    updateClock();
    setInterval(updateClock, 1000);

    // Theme Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // Qty Input Listener for Live Calculation
    document.getElementById('qtyInput').addEventListener('input', updateProjectedBalance);
});

// 1. Load Products from Prod.html's storage
function loadProductsFromStorage() {
    const products = JSON.parse(localStorage.getItem('myInventory')) || [];
    const select = document.getElementById('productSelect');
    
    products.forEach(p => {
        let opt = document.createElement('option');
        opt.value = p.id; // Use ID to track correctly
        opt.innerHTML = `${p.name} (${p.sku})`;
        select.appendChild(opt);
    });
}

// 2. Load Balance when Product is selected
function loadCurrentBalance() {
    const products = JSON.parse(localStorage.getItem('myInventory')) || [];
    const selectedId = document.getElementById('productSelect').value;
    const liveInput = document.getElementById('liveStock');
    
    const product = products.find(p => p.id == selectedId);
    if(product) {
        liveInput.value = `${product.qty} Units`;
        updateProjectedBalance();
    } else {
        liveInput.value = "0 Units";
    }
}

// 3. Mode Toggle Logic
function setTransactionMode(mode) {
    activeMode = mode;
    const isIn = mode === 'IN';
    
    document.getElementById('modeIn').classList.toggle('active', isIn);
    document.getElementById('modeOut').classList.toggle('active', !isIn);
    
    document.getElementById('formTitle').innerText = isIn ? "Stock Inward Entry 📥" : "Stock Outward Entry 📤";
    document.getElementById('qtyLabel').innerText = isIn ? "Purchase Quantity 🔢" : "Sale / Delivery Quantity 🔢";
    document.getElementById('refLabel').innerText = isIn ? "Reference (Invoice / Vendor) 🧾" : "Reference (Delivery Note / Customer) 👥";
    document.getElementById('statusMode').innerText = isIn ? "PURCHASE_IN" : "SALES_OUT";
    document.getElementById('mainSubmitBtn').style.background = isIn ? "#16a34a" : "#dc2626";

    updateProjectedBalance();
}

// 4. Calculation Engine
function updateProjectedBalance() {
    const liveVal = parseInt(document.getElementById('liveStock').value) || 0;
    const inputQty = parseInt(document.getElementById('qtyInput').value) || 0;
    const result = document.getElementById('newBalance');

    const final = (activeMode === 'IN') ? (liveVal + inputQty) : (liveVal - inputQty);
    result.innerText = final.toLocaleString();
}

// 5. Submit Transaction (Internal Linking & Storage Update)
document.getElementById('stockMovementForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const products = JSON.parse(localStorage.getItem('myInventory')) || [];
    const selectedId = document.getElementById('productSelect').value;
    const inputQty = parseInt(document.getElementById('qtyInput').value);

    // Update the master inventory
    const index = products.findIndex(p => p.id == selectedId);
    if(index !== -1) {
        if(activeMode === 'OUT' && products[index].qty < inputQty) {
            alert("❌ Insufficient Stock for this delivery!");
            return;
        }

        products[index].qty = (activeMode === 'IN') 
            ? parseInt(products[index].qty) + inputQty 
            : parseInt(products[index].qty) - inputQty;

        // Save back to storage
        localStorage.setItem('myInventory', JSON.stringify(products));

        // ALSO: Log this transaction for the History page (fill.html)
        const historyLog = JSON.parse(localStorage.getItem('fillingLogs')) || [];
        historyLog.push({
            id: Date.now(),
            time: document.getElementById('entryDate').value + "T" + new Date().toLocaleTimeString(),
            product: products[index].name,
            qty: (activeMode === 'IN' ? "+" : "-") + inputQty,
            total: products[index].qty,
            operator: document.getElementById('authBy').value
        });
        localStorage.setItem('fillingLogs', JSON.stringify(historyLog));

        alert("✅ TRANSACTION LOGGED & STOCK UPDATED!");
        location.reload(); // Refresh to show new balances
    }
});

function updateClock() {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}
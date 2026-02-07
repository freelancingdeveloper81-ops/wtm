// Theme Toggle Logic
const themeBtn = document.getElementById('theme-toggle');
const html = document.documentElement;

themeBtn.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    
    html.setAttribute('data-theme', nextTheme);
    
    // Update Toggle Icon
    themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
});

// Simple Console Log to confirm script load
console.log("Water Inventory Software Loaded Successfully.");
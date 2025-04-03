const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// Toggle between admin and user login
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Form submission handlers
document.getElementById('adminForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const adminId = this.querySelector('input[type="text"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    // Basic validation
    if (adminId === "admin" && password === "admin123") {
        
        // Redirect to admin dashboard
        window.location.href = "admin.html";
    } else {
        alert("Invalid admin credentials. Please try again.");
    }
});

document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    // Basic validation
    if (email && password) {
        
        // Redirect to user dashboard
        window.location.href = "dashboard.html";
    } else {
        alert("Please enter both email and password.");
    }
});
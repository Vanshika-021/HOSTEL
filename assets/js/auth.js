// Authentication functionality

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupLoginForm();
        this.setupRegisterForm();
        this.setupFormToggle();
        this.checkAuthStatus();
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(loginForm);
            });
        }
    }

    setupRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(registerForm);
            });
        }
    }

    setupFormToggle() {
        const showRegisterBtn = document.getElementById('showRegister');
        const showLoginBtn = document.getElementById('showLogin');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (showRegisterBtn && showLoginBtn && loginForm && registerForm) {
            showRegisterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleForms(loginForm, registerForm);
            });

            showLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleForms(registerForm, loginForm);
            });
        }
    }

    toggleForms(hideForm, showForm) {
        hideForm.classList.add('d-none');
        showForm.classList.remove('d-none');
        
        // Clear form data
        hideForm.reset();
        this.clearFormValidation(hideForm);
        this.clearFormValidation(showForm);
    }

    clearFormValidation(form) {
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });

        const feedbacks = form.querySelectorAll('.invalid-feedback, .valid-feedback');
        feedbacks.forEach(feedback => feedback.remove());
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const username = formData.get('username') || form.querySelector('input[type="text"]').value;
        const password = formData.get('password') || form.querySelector('input[type="password"]').value;

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

        try {
            // Simulate API call
            await this.simulateApiCall();

            // Mock authentication logic
            const user = this.authenticateUser(username, password);
            
            if (user) {
                this.setCurrentUser(user);
                this.showNotification('Login successful!', 'success');
                
                // Redirect based on user type
                setTimeout(() => {
                    if (user.type === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        window.location.href = 'student-dashboard.html';
                    }
                }, 1500);
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            this.showNotification(error.message || 'Login failed. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    async handleRegister(form) {
        const formData = new FormData(form);
        const userData = {
            fullName: formData.get('fullName') || form.querySelector('input[placeholder="Full Name"]').value,
            email: formData.get('email') || form.querySelector('input[type="email"]').value,
            contact: formData.get('contact') || form.querySelector('input[placeholder="Contact No."]').value,
            password: formData.get('password') || form.querySelector('input[type="password"]').value
        };

        // Validate form
        if (!this.validateRegistrationData(userData)) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';

        try {
            // Simulate API call
            await this.simulateApiCall();

            // Mock registration logic
            const user = this.registerUser(userData);
            
            if (user) {
                this.showNotification('Registration successful! Please login with your credentials.', 'success');
                
                // Switch to login form
                setTimeout(() => {
                    const loginForm = document.getElementById('loginForm');
                    const registerForm = document.getElementById('registerForm');
                    this.toggleForms(registerForm, loginForm);
                }, 2000);
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            this.showNotification(error.message || 'Registration failed. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    validateRegistrationData(userData) {
        let isValid = true;

        // Full name validation
        if (!userData.fullName || userData.fullName.trim().length < 2) {
            this.showFieldError('fullName', 'Full name must be at least 2 characters long');
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userData.email || !emailRegex.test(userData.email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Contact validation
        const contactRegex = /^[\+]?[1-9][\d]{9,14}$/;
        if (!userData.contact || !contactRegex.test(userData.contact.replace(/\s/g, ''))) {
            this.showFieldError('contact', 'Please enter a valid contact number');
            isValid = false;
        }

        // Password validation
        if (!userData.password || userData.password.length < 6) {
            this.showFieldError('password', 'Password must be at least 6 characters long');
            isValid = false;
        }

        return isValid;
    }

    showFieldError(fieldName, message) {
        const form = document.getElementById('registerForm');
        const field = form.querySelector(`input[placeholder*="${fieldName}"], input[name="${fieldName}"]`) ||
                     form.querySelector('input[type="email"]');
        
        if (field) {
            field.classList.add('is-invalid');
            
            // Remove existing feedback
            const existingFeedback = field.parentNode.querySelector('.invalid-feedback');
            if (existingFeedback) {
                existingFeedback.remove();
            }
            
            // Add new feedback
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = message;
            field.parentNode.appendChild(feedback);
        }
    }

    authenticateUser(username, password) {
        // Mock user database
        const users = [
            { id: 1, username: 'admin', password: 'admin123', type: 'admin', name: 'Administrator' },
            { id: 2, username: 'student', password: 'student123', type: 'student', name: 'Rohan Sharma', studentId: '2025-CS-101' },
            { id: 3, username: 'rohan', password: 'password', type: 'student', name: 'Rohan Sharma', studentId: '2025-CS-101' }
        ];

        return users.find(user => 
            user.username === username && user.password === password
        );
    }

    registerUser(userData) {
        // Mock registration - in real app, this would call an API
        const newUser = {
            id: Date.now(),
            username: userData.email.split('@')[0],
            email: userData.email,
            fullName: userData.fullName,
            contact: userData.contact,
            type: 'student',
            registeredAt: new Date().toISOString()
        };

        // Store in localStorage for demo purposes
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        existingUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

        return newUser;
    }

    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', this.generateToken());
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    }

    isAuthenticated() {
        return !!this.getCurrentUser() && !!localStorage.getItem('authToken');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    }

    checkAuthStatus() {
        // Check if user is on a protected page without authentication
        const protectedPages = ['admin-dashboard.html', 'student-dashboard.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage) && !this.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        // Redirect authenticated users away from login page
        if (currentPage === 'login.html' && this.isAuthenticated()) {
            const user = this.getCurrentUser();
            if (user.type === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'student-dashboard.html';
            }
        }
    }

    generateToken() {
        return btoa(Date.now() + Math.random().toString(36));
    }

    simulateApiCall() {
        return new Promise(resolve => {
            setTimeout(resolve, 1000 + Math.random() * 1000);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Initialize authentication manager
const authManager = new AuthManager();

// Global logout function
function logout() {
    authManager.logout();
}

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease-out;
    }
    
    .notification-success {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }
    
    .notification-error {
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }
    
    .notification-warning {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
    }
    
    .notification-info {
        background: #d1ecf1;
        border: 1px solid #bee5eb;
        color: #0c5460;
    }
    
    .notification-content {
        padding: 15px 20px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.7;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 10px;
            left: 10px;
            min-width: auto;
        }
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
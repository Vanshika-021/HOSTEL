// Main JavaScript file for HostelHub website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavbar();
    initializeAnimations();
    initializeGallery();
    initializeForms();
    initializeScrollEffects();
});

// Navbar functionality
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Animation effects
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .facility-card, .hostel-card, .section-title');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Counter animation for statistics
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        observer.observe(counter);
        counter.addEventListener('animationstart', updateCounter);
    });
}

// Gallery functionality
function initializeGallery() {
    const galleryFilter = document.querySelector('.gallery-filter');
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (!galleryFilter || !galleryGrid) return;

    const filterButtons = galleryFilter.querySelectorAll('.btn[data-filter]');
    const galleryItems = galleryGrid.querySelectorAll('.gallery-card');

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category.includes(filter)) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Image modal functionality
    const galleryImages = document.querySelectorAll('.gallery-img');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
    });
}

// Image modal
function openImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <img src="${src}" alt="${alt}" class="modal-image">
                <p class="modal-caption">${alt}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal functionality
    const closeModal = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
}

// Form handling
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                handleFormSubmission(this);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
    });
}

// Form validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let message = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required';
    }
    
    // Email validation
    else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    else if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }
    }
    
    // Password validation
    else if (type === 'password' && value) {
        if (value.length < 6) {
            isValid = false;
            message = 'Password must be at least 6 characters long';
        }
    }
    
    // Update field appearance
    updateFieldValidation(field, isValid, message);
    return isValid;
}

function updateFieldValidation(field, isValid, message) {
    const feedbackElement = field.parentNode.querySelector('.invalid-feedback') || 
                           field.parentNode.querySelector('.valid-feedback');
    
    // Remove existing feedback
    if (feedbackElement) {
        feedbackElement.remove();
    }
    
    // Remove existing classes
    field.classList.remove('is-valid', 'is-invalid');
    
    if (!isValid) {
        field.classList.add('is-invalid');
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = message;
        field.parentNode.appendChild(feedback);
    } else if (field.value.trim()) {
        field.classList.add('is-valid');
    }
}

// Form submission handling
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification('Form submitted successfully!', 'success');
        form.reset();
        
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // Remove validation classes
        const inputs = form.querySelectorAll('.is-valid, .is-invalid');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
        
        // Remove feedback messages
        const feedbacks = form.querySelectorAll('.invalid-feedback, .valid-feedback');
        feedbacks.forEach(feedback => feedback.remove());
        
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

// Scroll effects
function initializeScrollEffects() {
    // Back to top button
    const backToTopButton = createBackToTopButton();
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    // Parallax effect for hero sections
    const heroSections = document.querySelectorAll('.hero-section, .hero-section1');
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        heroSections.forEach(section => {
            const rate = scrolled * -0.5;
            section.style.transform = `translateY(${rate}px)`;
        });
    });
}

function createBackToTopButton() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.setAttribute('aria-label', 'Back to top');
    
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(button);
    return button;
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add CSS for dynamic elements
const dynamicStyles = `
    .navbar-scrolled {
        background-color: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    }
    
    .image-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        animation: fadeIn 0.3s ease-out;
    }
    
    .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }
    
    .modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        text-align: center;
    }
    
    .modal-image {
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 10px;
    }
    
    .modal-close {
        position: absolute;
        top: -40px;
        right: -40px;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-caption {
        color: white;
        margin-top: 15px;
        font-size: 1.1rem;
    }
    
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
    
    .back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .back-to-top.show {
        opacity: 1;
        visibility: visible;
    }
    
    .back-to-top:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
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
        
        .back-to-top {
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
        }
        
        .modal-close {
            top: -30px;
            right: -10px;
        }
    }
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);
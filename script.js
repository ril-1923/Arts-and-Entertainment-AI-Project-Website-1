// Global variables
let currentUser = null;

// DOM Elements
const body = document.body;
const navbar = document.querySelector('.navbar');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    addScrollToTopButton();
    setupAnimations();
});

// Initialize application
function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
    
    // Update navbar on scroll
    window.addEventListener('scroll', updateNavbarOnScroll);
    
    // Setup smooth scrolling
    setupSmoothScrolling();
}

// Setup event listeners
function setupEventListeners() {
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Event cards
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn') && e.target.textContent.includes('Get Tickets')) {
            handleTicketBooking(e);
        }
    });
}

// Handle newsletter subscription
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Simulate API call
    showLoading(e.target.querySelector('button'));
    
    setTimeout(() => {
        showNotification('Thank you for subscribing! You\'ll receive our latest updates.', 'success');
        e.target.reset();
        hideLoading(e.target.querySelector('button'));
    }, 1500);
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const email = e.target.querySelector('#loginEmail').value;
    const password = e.target.querySelector('#loginPassword').value;
    
    showLoading(e.target.querySelector('button[type="submit"]'));
    
    // Simulate login API call
    setTimeout(() => {
        currentUser = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0]
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
        
        showNotification('Welcome back! You\'re now logged in.', 'success');
        hideLoading(e.target.querySelector('button[type="submit"]'));
        e.target.reset();
    }, 1500);
}

// Handle registration
function handleRegister(e) {
    e.preventDefault();
    const name = e.target.querySelector('#registerName').value;
    const email = e.target.querySelector('#registerEmail').value;
    const password = e.target.querySelector('#registerPassword').value;
    const confirmPassword = e.target.querySelector('#registerConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    showLoading(e.target.querySelector('button[type="submit"]'));
    
    // Simulate registration API call
    setTimeout(() => {
        currentUser = {
            id: Date.now(),
            email: email,
            name: name
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        modal.hide();
        
        showNotification('Account created successfully! Welcome to ArtVibe.', 'success');
        hideLoading(e.target.querySelector('button[type="submit"]'));
        e.target.reset();
    }, 1500);
}

// Handle ticket booking
function handleTicketBooking(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Please login to book tickets.', 'warning');
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        return;
    }
    
    const eventCard = e.target.closest('.event-card');
    const eventTitle = eventCard.querySelector('h4').textContent;
    
    showLoading(e.target);
    
    setTimeout(() => {
        showNotification(`Tickets for "${eventTitle}" have been added to your cart!`, 'success');
        hideLoading(e.target);
    }, 1000);
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const loginBtn = document.querySelector('button[data-bs-target="#loginModal"]');
    if (loginBtn && currentUser) {
        loginBtn.innerHTML = `<i class="fas fa-user me-1"></i>${currentUser.name}`;
        loginBtn.onclick = handleLogout;
        loginBtn.removeAttribute('data-bs-toggle');
        loginBtn.removeAttribute('data-bs-target');
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    const loginBtn = document.querySelector('button');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-user me-1"></i>Login';
        loginBtn.onclick = null;
        loginBtn.setAttribute('data-bs-toggle', 'modal');
        loginBtn.setAttribute('data-bs-target', '#loginModal');
    }
    
    showNotification('You have been logged out successfully.', 'info');
}

// Update navbar on scroll
function updateNavbarOnScroll() {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(31, 41, 55, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(31, 41, 55, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
}

// Setup smooth scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Show loading state
function showLoading(button) {
    const originalText = button.innerHTML;
    button.dataset.originalText = originalText;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
    button.disabled = true;
}

// Hide loading state
function hideLoading(button) {
    button.innerHTML = button.dataset.originalText;
    button.disabled = false;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} notification`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-xl);
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Add scroll to top button
function addScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
}

// Setup scroll animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    document.querySelectorAll('.event-card, .artist-card, .form-card, .social-card').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Add dynamic CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

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

// Export functions for use in other files
window.ArtVibeApp = {
    showNotification,
    showLoading,
    hideLoading,
    currentUser: () => currentUser
};
// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('contact.html')) {
        initializeContactPage();
        setupFloatingLabels();
        setupFormValidation();
        setupFileUpload();
        setupMapInteraction();
        setupSocialCards();
    }
});

// Initialize contact page
function initializeContactPage() {
    // Setup form animations
    animateFormsOnScroll();
    
    // Setup contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
    
    // Setup artist form submission
    const artistForm = document.getElementById('artistForm');
    if (artistForm) {
        artistForm.addEventListener('submit', handleArtistSubmission);
    }
    
    // Setup form field interactions
    setupFormInteractions();
}

// Setup floating labels functionality
function setupFloatingLabels() {
    const formGroups = document.querySelectorAll('.floating-form .form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('.form-control');
        const label = group.querySelector('label');
        
        if (input && label) {
            // Handle input focus/blur
            input.addEventListener('focus', () => {
                group.classList.add('focused');
                animateLabel(label, true);
            });
            
            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    group.classList.remove('focused');
                    animateLabel(label, false);
                }
            });
            
            // Handle input changes
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    group.classList.add('has-value');
                    animateLabel(label, true);
                } else {
                    group.classList.remove('has-value');
                    if (!group.classList.contains('focused')) {
                        animateLabel(label, false);
                    }
                }
                
                // Real-time validation
                validateField(input);
            });
            
            // Check initial value
            if (input.value.trim()) {
                group.classList.add('has-value');
                animateLabel(label, true);
            }
        }
    });
}

// Animate label
function animateLabel(label, isActive) {
    if (isActive) {
        label.style.transform = 'translateY(-25px) scale(0.85)';
        label.style.color = 'var(--primary-color)';
    } else {
        label.style.transform = 'translateY(-50%) scale(1)';
        label.style.color = '#6B7280';
    }
}

// Setup form validation
function setupFormValidation() {
    const forms = document.querySelectorAll('.floating-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('.form-control');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const isRequired = field.hasAttribute('required');
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (isRequired && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // URL validation
    if (fieldType === 'url' && value) {
        try {
            new URL(value);
        } catch {
            showFieldError(field, 'Please enter a valid URL');
            return false;
        }
    }
    
    // Text length validation
    if (field.tagName === 'TEXTAREA' && value.length > 0 && value.length < 10) {
        showFieldError(field, 'Please provide more details (minimum 10 characters)');
        return false;
    }
    
    // Show success state
    showFieldSuccess(field);
    return true;
}

// Show field error
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle me-1"></i>${message}`;
    formGroup.appendChild(errorDiv);
    
    // Add error styling to field
    field.style.borderColor = 'var(--error-color)';
}

// Show field success
function showFieldSuccess(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('success');
    formGroup.classList.remove('error');
    
    field.style.borderColor = 'var(--success-color)';
}

// Clear field error
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error', 'success');
    
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    
    field.style.borderColor = '#E5E7EB';
}

// Handle contact form submission
function handleContactSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate all fields
    const inputs = form.querySelectorAll('.form-control');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        window.ArtVibeApp.showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    window.ArtVibeApp.showLoading(submitBtn);
    
    // Simulate API call
    setTimeout(() => {
        const contactData = {
            name: formData.get('contactName') || document.getElementById('contactName').value,
            email: formData.get('contactEmail') || document.getElementById('contactEmail').value,
            subject: formData.get('contactSubject') || document.getElementById('contactSubject').value,
            message: formData.get('contactMessage') || document.getElementById('contactMessage').value
        };
        
        // Store in localStorage for demo
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contacts.push({
            ...contactData,
            id: Date.now(),
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('contacts', JSON.stringify(contacts));
        
        window.ArtVibeApp.hideLoading(submitBtn);
        window.ArtVibeApp.showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        
        // Reset form with animation
        resetFormWithAnimation(form);
        
    }, 2000);
}

// Handle artist form submission
function handleArtistSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate all fields
    const inputs = form.querySelectorAll('.form-control');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        window.ArtVibeApp.showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    window.ArtVibeApp.showLoading(submitBtn);
    
    // Simulate API call
    setTimeout(() => {
        const artistData = {
            name: formData.get('artistName') || document.getElementById('artistName').value,
            email: formData.get('artistEmail') || document.getElementById('artistEmail').value,
            type: formData.get('artistType') || document.getElementById('artistType').value,
            portfolio: formData.get('portfolioLink') || document.getElementById('portfolioLink').value,
            bio: formData.get('artistBio') || document.getElementById('artistBio').value
        };
        
        // Store in localStorage for demo
        const artists = JSON.parse(localStorage.getItem('artists') || '[]');
        artists.push({
            ...artistData,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            status: 'pending'
        });
        localStorage.setItem('artists', JSON.stringify(artists));
        
        window.ArtVibeApp.hideLoading(submitBtn);
        
        // Show success modal
        showArtistApplicationSuccess(artistData);
        
        // Reset form with animation
        resetFormWithAnimation(form);
        
    }, 2500);
}

// Show artist application success modal
function showArtistApplicationSuccess(artistData) {
    const successModal = document.createElement('div');
    successModal.className = 'modal fade';
    successModal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-star me-2"></i>Application Submitted!
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <div class="success-animation">
                        <i class="fas fa-check-circle fa-4x text-success mb-3"></i>
                        <h4>Welcome to ArtVibe!</h4>
                        <p class="mb-4">Thank you for your interest in joining our community of talented artists.</p>
                        <div class="application-summary">
                            <h6>Application Summary:</h6>
                            <div class="summary-item">
                                <strong>Name:</strong> ${artistData.name}
                            </div>
                            <div class="summary-item">
                                <strong>Artist Type:</strong> ${artistData.type}
                            </div>
                            <div class="summary-item">
                                <strong>Status:</strong> <span class="badge bg-warning">Under Review</span>
                            </div>
                        </div>
                        <p class="text-muted mt-3">
                            <i class="fas fa-clock me-2"></i>
                            We'll review your application within 3-5 business days and get back to you via email.
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="window.location.href='index.html'">
                        <i class="fas fa-home me-2"></i>Back to Home
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    const modal = new bootstrap.Modal(successModal);
    modal.show();
    
    // Remove modal from DOM when hidden
    successModal.addEventListener('hidden.bs.modal', () => {
        successModal.remove();
    });
}

// Reset form with animation
function resetFormWithAnimation(form) {
    const formGroups = form.querySelectorAll('.form-group');
    
    formGroups.forEach((group, index) => {
        setTimeout(() => {
            group.style.transform = 'translateX(-10px)';
            group.style.opacity = '0.5';
            
            setTimeout(() => {
                const input = group.querySelector('.form-control');
                const label = group.querySelector('label');
                
                if (input) {
                    input.value = '';
                    input.style.borderColor = '#E5E7EB';
                }
                
                if (label) {
                    animateLabel(label, false);
                }
                
                group.classList.remove('focused', 'has-value', 'error', 'success');
                
                group.style.transform = 'translateX(0)';
                group.style.opacity = '1';
            }, 200);
        }, index * 100);
    });
}

// Setup file upload functionality
function setupFileUpload() {
    const fileInput = document.getElementById('artistPortfolio');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
        
        // Create custom file upload area
        const fileUploadArea = createFileUploadArea(fileInput);
        fileInput.parentNode.insertBefore(fileUploadArea, fileInput.nextSibling);
        fileInput.style.display = 'none';
    }
}

// Create file upload area
function createFileUploadArea(fileInput) {
    const uploadArea = document.createElement('div');
    uploadArea.className = 'file-upload-area';
    uploadArea.innerHTML = `
        <div class="upload-content">
            <i class="fas fa-cloud-upload-alt fa-2x mb-2"></i>
            <p class="upload-text">Drag & drop files here or <span class="upload-link">browse</span></p>
            <small class="upload-hint">Supported formats: JPG, PNG, PDF, MP4 (Max 10MB)</small>
        </div>
        <div class="upload-progress" style="display: none;">
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: 0%"></div>
            </div>
            <small class="progress-text">Uploading...</small>
        </div>
    `;
    
    // Handle click to open file dialog
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileUpload({ target: fileInput });
        }
    });
    
    return uploadArea;
}

// Handle file upload
function handleFileUpload(e) {
    const files = e.target.files;
    const uploadArea = e.target.parentNode.querySelector('.file-upload-area');
    
    if (files.length > 0) {
        const file = files[0];
        
        // Validate file
        if (!validateFile(file)) {
            return;
        }
        
        // Show upload progress
        showUploadProgress(uploadArea, file);
        
        // Simulate upload
        simulateFileUpload(uploadArea, file);
    }
}

// Validate file
function validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
    
    if (file.size > maxSize) {
        window.ArtVibeApp.showNotification('File size must be less than 10MB', 'error');
        return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
        window.ArtVibeApp.showNotification('File type not supported. Please use JPG, PNG, PDF, or MP4', 'error');
        return false;
    }
    
    return true;
}

// Show upload progress
function showUploadProgress(uploadArea, file) {
    const uploadContent = uploadArea.querySelector('.upload-content');
    const uploadProgress = uploadArea.querySelector('.upload-progress');
    
    uploadContent.style.display = 'none';
    uploadProgress.style.display = 'block';
    
    uploadProgress.querySelector('.progress-text').textContent = `Uploading ${file.name}...`;
}

// Simulate file upload
function simulateFileUpload(uploadArea, file) {
    const progressBar = uploadArea.querySelector('.progress-bar');
    const progressText = uploadArea.querySelector('.progress-text');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Show success
            setTimeout(() => {
                showUploadSuccess(uploadArea, file);
            }, 500);
        }
        
        progressBar.style.width = progress + '%';
        progressText.textContent = `Uploading ${file.name}... ${Math.round(progress)}%`;
    }, 200);
}

// Show upload success
function showUploadSuccess(uploadArea, file) {
    const uploadProgress = uploadArea.querySelector('.upload-progress');
    
    uploadProgress.innerHTML = `
        <div class="upload-success">
            <i class="fas fa-check-circle text-success fa-2x mb-2"></i>
            <p class="mb-1"><strong>${file.name}</strong></p>
            <small class="text-muted">Upload completed successfully</small>
            <button type="button" class="btn btn-sm btn-outline-danger mt-2" onclick="removeUploadedFile(this)">
                <i class="fas fa-trash me-1"></i>Remove
            </button>
        </div>
    `;
}

// Remove uploaded file
function removeUploadedFile(button) {
    const uploadArea = button.closest('.file-upload-area');
    const fileInput = uploadArea.parentNode.querySelector('input[type="file"]');
    
    // Reset file input
    fileInput.value = '';
    
    // Reset upload area
    const uploadContent = uploadArea.querySelector('.upload-content');
    const uploadProgress = uploadArea.querySelector('.upload-progress');
    
    uploadContent.style.display = 'block';
    uploadProgress.style.display = 'none';
    uploadProgress.innerHTML = `
        <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: 0%"></div>
        </div>
        <small class="progress-text">Uploading...</small>
    `;
}

// Setup map interaction
function setupMapInteraction() {
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        const iframe = mapContainer.querySelector('iframe');
        
        // Add click overlay to enable map interaction
        const overlay = document.createElement('div');
        overlay.className = 'map-overlay';
        overlay.innerHTML = '<p><i class="fas fa-mouse-pointer me-2"></i>Click to interact with map</p>';
        
        mapContainer.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
            overlay.style.display = 'none';
            iframe.style.pointerEvents = 'auto';
        });
        
        // Reset overlay when clicking outside
        document.addEventListener('click', (e) => {
            if (!mapContainer.contains(e.target)) {
                overlay.style.display = 'flex';
                iframe.style.pointerEvents = 'none';
            }
        });
    }
}

// Setup social cards interaction
function setupSocialCards() {
    const socialCards = document.querySelectorAll('.social-card');
    
    socialCards.forEach(card => {
        card.addEventListener('click', () => {
            const platform = card.querySelector('.social-header span').textContent;
            window.ArtVibeApp.showNotification(`Opening ${platform} in a new window...`, 'info');
            
            // Simulate opening social media
            setTimeout(() => {
                window.open('#', '_blank');
            }, 1000);
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Setup form interactions
function setupFormInteractions() {
    // Add focus effects to form cards
    const formCards = document.querySelectorAll('.form-card');
    
    formCards.forEach(card => {
        const inputs = card.querySelectorAll('.form-control');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                card.classList.add('form-focused');
            });
            
            input.addEventListener('blur', () => {
                // Check if any input in this card is still focused
                const focusedInput = card.querySelector('.form-control:focus');
                if (!focusedInput) {
                    card.classList.remove('form-focused');
                }
            });
        });
    });
}

// Animate forms on scroll
function animateFormsOnScroll() {
    const formCards = document.querySelectorAll('.form-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    formCards.forEach(card => {
        observer.observe(card);
    });
}

// Add custom styles for contact page
const contactStyles = document.createElement('style');
contactStyles.textContent = `
    .form-focused {
        box-shadow: 0 15px 35px rgba(107, 70, 193, 0.15) !important;
        transform: translateY(-2px);
    }
    
    .error-message {
        color: var(--error-color);
        font-size: 0.8rem;
        margin-top: 5px;
        display: flex;
        align-items: center;
    }
    
    .form-group.error .form-control {
        border-color: var(--error-color) !important;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
    }
    
    .form-group.success .form-control {
        border-color: var(--success-color) !important;
        box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1) !important;
    }
    
    .file-upload-area {
        border: 2px dashed #E5E7EB;
        border-radius: var(--border-radius);
        padding: 30px;
        text-align: center;
        cursor: pointer;
        transition: var(--transition);
        margin-top: 10px;
    }
    
    .file-upload-area:hover,
    .file-upload-area.drag-over {
        border-color: var(--primary-color);
        background: rgba(107, 70, 193, 0.05);
    }
    
    .upload-link {
        color: var(--primary-color);
        text-decoration: underline;
        cursor: pointer;
    }
    
    .upload-hint {
        color: #6B7280;
    }
    
    .upload-success {
        padding: 20px;
    }
    
    .map-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: var(--transition);
    }
    
    .map-overlay:hover {
        background: rgba(0, 0, 0, 0.7);
    }
    
    .map-container iframe {
        pointer-events: none;
        transition: var(--transition);
    }
    
    .application-summary {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 20px;
        margin: 20px 0;
        text-align: left;
    }
    
    .summary-item {
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e9ecef;
    }
    
    .summary-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }
    
    .form-card.animate-in {
        animation: slideInUp 0.6s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .social-card {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .file-upload-area {
            padding: 20px;
        }
        
        .form-card {
            margin-bottom: 30px;
        }
    }
`;
document.head.appendChild(contactStyles);
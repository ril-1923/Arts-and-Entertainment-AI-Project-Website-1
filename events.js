// Events data
const eventsData = [
    {
        id: 1,
        title: "Shakespeare's Hamlet",
        date: "2025-01-15",
        time: "19:30",
        location: "Royal Theater",
        price: 45,
        category: "theater",
        image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        description: "A captivating performance of the classic tragedy",
        fullDescription: "Experience Shakespeare's most famous tragedy brought to life by our acclaimed theater company. This powerful production features stunning costumes, dramatic lighting, and passionate performances that will leave you spellbound.",
        venue: "Royal Theater - Downtown",
        duration: "3 hours (including intermission)",
        ageRating: "PG-13"
    },
    {
        id: 2,
        title: "Christmas Symphony",
        date: "2025-01-22",
        time: "20:00",
        location: "City Concert Hall",
        price: 65,
        category: "music",
        image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        description: "Holiday classics performed by renowned orchestra",
        fullDescription: "Join us for an enchanting evening of holiday music performed by the City Symphony Orchestra. Featuring beloved Christmas classics and winter favorites, this concert is perfect for the whole family.",
        venue: "City Concert Hall - Arts District",
        duration: "2 hours",
        ageRating: "All ages"
    },
    {
        id: 3,
        title: "Modern Art Showcase",
        date: "2025-01-28",
        time: "18:00",
        location: "Metropolitan Gallery",
        price: 25,
        category: "art",
        image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        description: "Contemporary works from emerging artists",
        fullDescription: "Discover the future of contemporary art in this curated exhibition featuring works from the most promising emerging artists in the region. Interactive installations and thought-provoking pieces await.",
        venue: "Metropolitan Gallery - Cultural Center",
        duration: "Self-guided (Gallery open until 22:00)",
        ageRating: "All ages"
    },
    {
        id: 4,
        title: "Jazz Night Extravaganza",
        date: "2025-02-05",
        time: "21:00",
        location: "Blue Note Club",
        price: 55,
        category: "music",
        image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        description: "An evening of smooth jazz and soulful melodies",
        fullDescription: "Immerse yourself in the smooth sounds of jazz with performances by local and touring musicians. Featuring both classic standards and contemporary jazz fusion.",
        venue: "Blue Note Club - West Side",
        duration: "3 hours",
        ageRating: "21+"
    },
    {
        id: 5,
        title: "Contemporary Dance Festival",
        date: "2025-02-12",
        time: "19:00",
        location: "Dance Theater",
        price: 40,
        category: "dance",
        image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        description: "Cutting-edge choreography and artistic expression",
        fullDescription: "Experience the beauty and power of contemporary dance through performances by renowned dance companies. This festival showcases innovative choreography and artistic storytelling through movement.",
        venue: "Dance Theater - Arts District",
        duration: "2.5 hours",
        ageRating: "All ages"
    },
    {
        id: 6,
        title: "Comedy Night Live",
        date: "2025-02-18",
        time: "20:30",
        location: "Laugh Factory",
        price: 35,
        category: "comedy",
        image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        description: "Stand-up comedy featuring top comedians",
        fullDescription: "Get ready to laugh until your sides hurt! Our comedy night features a lineup of hilarious stand-up comedians, from rising stars to established names in the comedy world.",
        venue: "Laugh Factory - Downtown",
        duration: "2 hours",
        ageRating: "18+"
    }
];

// Initialize events page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('events.html')) {
        initializeEventsPage();
        setupEventFilters();
        loadEvents();
    }
});

// Initialize events page
function initializeEventsPage() {
    // Set up event listeners for filters
    const filters = ['genreFilter', 'locationFilter', 'dateFilter', 'priceFilter'];
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', filterEvents);
        }
    });
}

// Setup event filters
function setupEventFilters() {
    const genreFilter = document.getElementById('genreFilter');
    const locationFilter = document.getElementById('locationFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    if (genreFilter && locationFilter && priceFilter) {
        // Add event listeners for real-time filtering
        [genreFilter, locationFilter, priceFilter].forEach(filter => {
            filter.addEventListener('change', debounce(filterEvents, 300));
        });
        
        // Set today's date as minimum for date filter
        const dateFilter = document.getElementById('dateFilter');
        if (dateFilter) {
            const today = new Date().toISOString().split('T')[0];
            dateFilter.setAttribute('min', today);
            dateFilter.addEventListener('change', debounce(filterEvents, 300));
        }
    }
}

// Load and display events
function loadEvents(filteredEvents = eventsData) {
    const eventsGrid = document.getElementById('eventsGrid');
    if (!eventsGrid) return;
    
    // Clear existing events
    eventsGrid.innerHTML = '';
    
    // Show loading state
    eventsGrid.innerHTML = '<div class="col-12 text-center"><div class="loading-spinner"><i class="fas fa-spinner fa-spin fa-2x"></i><p class="mt-3">Loading events...</p></div></div>';
    
    // Simulate loading delay
    setTimeout(() => {
        eventsGrid.innerHTML = '';
        
        if (filteredEvents.length === 0) {
            eventsGrid.innerHTML = `
                <div class="col-12 text-center">
                    <div class="no-events">
                        <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                        <h4>No events found</h4>
                        <p class="text-muted">Try adjusting your filters to see more events.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        filteredEvents.forEach(event => {
            const eventCard = createEventCard(event);
            eventsGrid.appendChild(eventCard);
        });
        
        // Trigger animation for new cards
        setTimeout(() => {
            eventsGrid.querySelectorAll('.event-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animated');
                }, index * 100);
            });
        }, 100);
    }, 500);
}

// Create event card
function createEventCard(event) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 mb-4';
    
    const eventDate = new Date(event.date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    
    col.innerHTML = `
        <div class="event-card animate-on-scroll" data-event-id="${event.id}">
            <div class="event-image">
                <img src="${event.image}" alt="${event.title}">
                <div class="event-date">
                    <span class="date-day">${day}</span>
                    <span class="date-month">${month}</span>
                </div>
                <div class="event-category ${event.category}">
                    ${getCategoryIcon(event.category)} ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </div>
            </div>
            <div class="event-content">
                <h4>${event.title}</h4>
                <p class="event-location"><i class="fas fa-map-marker-alt me-2"></i>${event.location}</p>
                <p class="event-time"><i class="fas fa-clock me-2"></i>${event.time}</p>
                <p class="event-description">${event.description}</p>
                <div class="event-footer">
                    <span class="event-price">From $${event.price}</span>
                    <div class="event-actions">
                        <button class="btn btn-outline-primary btn-sm me-2" onclick="showEventDetails(${event.id})">
                            <i class="fas fa-info-circle me-1"></i>Details
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="bookEvent(${event.id})">
                            <i class="fas fa-ticket-alt me-1"></i>Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        theater: '🎭',
        music: '🎶',
        art: '🎨',
        dance: '💃',
        comedy: '😄'
    };
    return icons[category] || '🎪';
}

// Filter events
function filterEvents() {
    const genreFilter = document.getElementById('genreFilter')?.value;
    const locationFilter = document.getElementById('locationFilter')?.value;
    const dateFilter = document.getElementById('dateFilter')?.value;
    const priceFilter = document.getElementById('priceFilter')?.value;
    
    let filteredEvents = eventsData.filter(event => {
        // Genre filter
        if (genreFilter && event.category !== genreFilter) {
            return false;
        }
        
        // Location filter
        if (locationFilter && !event.location.toLowerCase().includes(locationFilter.toLowerCase())) {
            return false;
        }
        
        // Date filter
        if (dateFilter && event.date !== dateFilter) {
            return false;
        }
        
        // Price filter
        if (priceFilter) {
            const price = event.price;
            if (priceFilter === '0-25' && price > 25) return false;
            if (priceFilter === '25-50' && (price < 25 || price > 50)) return false;
            if (priceFilter === '50-100' && (price < 50 || price > 100)) return false;
            if (priceFilter === '100+' && price < 100) return false;
        }
        
        return true;
    });
    
    loadEvents(filteredEvents);
}

// Show event details in modal
function showEventDetails(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    const modal = document.getElementById('eventModal');
    const modalTitle = document.getElementById('eventModalTitle');
    const modalBody = document.getElementById('eventModalBody');
    const bookBtn = document.getElementById('bookEventBtn');
    
    if (modal && modalTitle && modalBody && bookBtn) {
        modalTitle.textContent = event.title;
        
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${event.image}" alt="${event.title}" class="img-fluid rounded mb-3">
                </div>
                <div class="col-md-6">
                    <h5 class="mb-3">Event Details</h5>
                    <div class="event-detail-item">
                        <strong><i class="fas fa-calendar me-2 text-primary"></i>Date:</strong>
                        <span>${new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</span>
                    </div>
                    <div class="event-detail-item">
                        <strong><i class="fas fa-clock me-2 text-primary"></i>Time:</strong>
                        <span>${event.time}</span>
                    </div>
                    <div class="event-detail-item">
                        <strong><i class="fas fa-map-marker-alt me-2 text-primary"></i>Venue:</strong>
                        <span>${event.venue}</span>
                    </div>
                    <div class="event-detail-item">
                        <strong><i class="fas fa-hourglass-half me-2 text-primary"></i>Duration:</strong>
                        <span>${event.duration}</span>
                    </div>
                    <div class="event-detail-item">
                        <strong><i class="fas fa-users me-2 text-primary"></i>Age Rating:</strong>
                        <span>${event.ageRating}</span>
                    </div>
                    <div class="event-detail-item">
                        <strong><i class="fas fa-dollar-sign me-2 text-primary"></i>Price:</strong>
                        <span class="text-primary fw-bold">From $${event.price}</span>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-12">
                    <h6>About this Event</h6>
                    <p>${event.fullDescription}</p>
                </div>
            </div>
        `;
        
        bookBtn.onclick = () => bookEvent(eventId);
        
        const eventModal = new bootstrap.Modal(modal);
        eventModal.show();
    }
}

// Book event
function bookEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    if (!window.ArtVibeApp.currentUser()) {
        window.ArtVibeApp.showNotification('Please login to book tickets.', 'warning');
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        return;
    }
    
    // Close event modal if open
    const eventModal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
    if (eventModal) {
        eventModal.hide();
    }
    
    // Show booking confirmation
    showBookingConfirmation(event);
}

// Show booking confirmation
function showBookingConfirmation(event) {
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'modal fade';
    confirmationModal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-check-circle me-2"></i>Booking Confirmation
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <div class="booking-success">
                        <i class="fas fa-ticket-alt fa-3x text-success mb-3"></i>
                        <h4>Booking Successful!</h4>
                        <p class="mb-4">Your tickets for <strong>"${event.title}"</strong> have been reserved.</p>
                        <div class="booking-details">
                            <div class="detail-row">
                                <span class="detail-label">Event:</span>
                                <span class="detail-value">${event.title}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Date:</span>
                                <span class="detail-value">${new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Time:</span>
                                <span class="detail-value">${event.time}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Venue:</span>
                                <span class="detail-value">${event.venue}</span>
                            </div>
                            <div class="detail-row total">
                                <span class="detail-label">Total:</span>
                                <span class="detail-value">$${event.price}</span>
                            </div>
                        </div>
                        <p class="text-muted mt-3">
                            <i class="fas fa-envelope me-2"></i>
                            Confirmation details have been sent to your email.
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="downloadTicket(${event.id})">
                        <i class="fas fa-download me-2"></i>Download Ticket
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmationModal);
    
    const modal = new bootstrap.Modal(confirmationModal);
    modal.show();
    
    // Remove modal from DOM when hidden
    confirmationModal.addEventListener('hidden.bs.modal', () => {
        confirmationModal.remove();
    });
    
    // Add booking details styles
    const style = document.createElement('style');
    style.textContent = `
        .booking-details {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .detail-row.total {
            font-weight: bold;
            font-size: 1.1em;
            color: var(--success-color);
            border-top: 2px solid #e9ecef;
            padding-top: 15px;
            margin-top: 15px;
        }
        .detail-label {
            color: #6c757d;
        }
        .detail-value {
            color: #212529;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
}

// Download ticket (simulation)
function downloadTicket(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    window.ArtVibeApp.showNotification(`Ticket for "${event.title}" is being prepared for download.`, 'info');
    
    // Simulate ticket generation
    setTimeout(() => {
        window.ArtVibeApp.showNotification('Ticket downloaded successfully! Check your downloads folder.', 'success');
    }, 2000);
}

// Search events
function searchEvents(query) {
    const filteredEvents = eventsData.filter(event => 
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase())
    );
    
    loadEvents(filteredEvents);
}

// Sort events
function sortEvents(sortBy) {
    let sortedEvents = [...eventsData];
    
    switch (sortBy) {
        case 'date':
            sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'price-low':
            sortedEvents.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedEvents.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedEvents.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            break;
    }
    
    loadEvents(sortedEvents);
}

// Debounce utility
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

// Add custom styles for event categories
const eventStyles = document.createElement('style');
eventStyles.textContent = `
    .event-category {
        position: absolute;
        top: 15px;
        left: 15px;
        background: rgba(255, 255, 255, 0.9);
        color: var(--dark-color);
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        backdrop-filter: blur(10px);
    }
    
    .event-category.theater {
        background: rgba(107, 70, 193, 0.9);
        color: white;
    }
    
    .event-category.music {
        background: rgba(220, 38, 38, 0.9);
        color: white;
    }
    
    .event-category.art {
        background: rgba(245, 158, 11, 0.9);
        color: white;
    }
    
    .event-category.dance {
        background: rgba(5, 150, 105, 0.9);
        color: white;
    }
    
    .event-category.comedy {
        background: rgba(217, 119, 6, 0.9);
        color: white;
    }
    
    .event-actions {
        display: flex;
        gap: 8px;
    }
    
    .loading-spinner {
        padding: 60px 0;
        color: #6c757d;
    }
    
    .no-events {
        padding: 60px 0;
    }
    
    @media (max-width: 768px) {
        .event-actions {
            flex-direction: column;
        }
        
        .event-actions .btn {
            width: 100%;
            margin-bottom: 8px;
        }
        
        .event-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
        }
    }
`;
document.head.appendChild(eventStyles);
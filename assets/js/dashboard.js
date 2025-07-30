// Dashboard functionality for both admin and student dashboards

class DashboardManager {
    constructor(type) {
        this.type = type; // 'admin' or 'student'
        this.init();
    }

    init() {
        this.setupSidebar();
        this.setupViewSwitching();
        this.setupMobileMenu();
        
        if (this.type === 'admin') {
            this.initAdminDashboard();
        } else if (this.type === 'student') {
            this.initStudentDashboard();
        }
    }

    setupSidebar() {
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                sidebarLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Get target view
                const targetView = link.getAttribute('data-view');
                this.switchView(targetView);
                
                // Update header title
                const headerTitle = document.getElementById('main-header-title') || 
                                  document.getElementById('main-header');
                if (headerTitle) {
                    headerTitle.textContent = link.textContent.trim();
                }
                
                // Close mobile sidebar
                this.closeMobileSidebar();
            });
        });
    }

    setupViewSwitching() {
        // Hide all views initially except the first one
        const views = document.querySelectorAll('[id$="-view"]');
        views.forEach((view, index) => {
            if (index > 0) {
                view.classList.add('hidden');
            }
        });
    }

    setupMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle-btn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                this.openMobileSidebar();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeMobileSidebar();
            });
        }

        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileSidebar();
            }
        });
    }

    openMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (sidebar) sidebar.classList.remove('-translate-x-full');
        if (overlay) overlay.classList.remove('hidden');
    }

    closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (sidebar) sidebar.classList.add('-translate-x-full');
        if (overlay) overlay.classList.add('hidden');
    }

    switchView(targetView) {
        // Hide all views
        const views = document.querySelectorAll('[id$="-view"]');
        views.forEach(view => {
            view.classList.add('hidden');
        });

        // Show target view
        const target = document.getElementById(targetView);
        if (target) {
            target.classList.remove('hidden');
            
            // Trigger view-specific initialization
            this.onViewSwitch(targetView);
        }
    }

    onViewSwitch(viewName) {
        // Override in subclasses
    }

    // Utility methods
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

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }
}

// Admin Dashboard Manager
class AdminDashboardManager extends DashboardManager {
    constructor() {
        super('admin');
        this.mockData = {
            totalRooms: 350,
            pendingRequests: [],
            allottedRooms: [],
            students: []
        };
        this.loadMockData();
    }

    initAdminDashboard() {
        this.setupBookingRequestHandlers();
        this.renderDashboard();
    }

    loadMockData() {
        // Load mock data for demonstration
        this.mockData.pendingRequests = [
            { id: 1, studentName: 'Rohan Sharma', studentId: '2025-CS-101', requestedType: 'AC Single' },
            { id: 2, studentName: 'Priya Singh', studentId: '2025-EE-045', requestedType: 'Non-AC Double' },
            { id: 3, studentName: 'Amit Patel', studentId: '2025-ME-089', requestedType: 'AC Double' },
            { id: 4, studentName: 'Sneha Verma', studentId: '2025-CS-132', requestedType: 'Non-AC Single' }
        ];

        this.mockData.allottedRooms = [
            { studentName: 'Vikram Rathore', studentId: '2024-CS-012', roomNumber: 'A-101', roomType: 'AC Single' },
            { studentName: 'Anjali Mehta', studentId: '2024-ME-033', roomNumber: 'B-205', roomType: 'Non-AC Double' }
        ];

        this.mockData.students = [...this.mockData.allottedRooms];
    }

    setupBookingRequestHandlers() {
        const bookingRequestsList = document.getElementById('booking-requests-list');
        
        if (bookingRequestsList) {
            bookingRequestsList.addEventListener('click', (e) => {
                const target = e.target;
                const requestId = parseInt(target.dataset.requestId);

                if (target.classList.contains('accept-btn')) {
                    this.acceptBookingRequest(requestId);
                } else if (target.classList.contains('decline-btn')) {
                    this.declineBookingRequest(requestId);
                }
            });
        }
    }

    acceptBookingRequest(requestId) {
        const requestIndex = this.mockData.pendingRequests.findIndex(r => r.id === requestId);
        if (requestIndex === -1) return;

        const request = this.mockData.pendingRequests[requestIndex];
        const newAllotment = {
            studentName: request.studentName,
            studentId: request.studentId,
            roomNumber: this.findNextAvailableRoom(request.requestedType),
            roomType: request.requestedType
        };

        this.mockData.allottedRooms.push(newAllotment);
        this.mockData.students.push(newAllotment);
        this.mockData.pendingRequests.splice(requestIndex, 1);

        this.renderDashboard();
        this.showNotification(`Room ${newAllotment.roomNumber} allotted to ${request.studentName}`, 'success');
    }

    declineBookingRequest(requestId) {
        const requestIndex = this.mockData.pendingRequests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1) {
            const request = this.mockData.pendingRequests[requestIndex];
            this.mockData.pendingRequests.splice(requestIndex, 1);
            this.renderDashboard();
            this.showNotification(`Request from ${request.studentName} declined`, 'warning');
        }
    }

    findNextAvailableRoom(roomType) {
        const blockPrefix = roomType.includes('AC') ? 'A' : 'C';
        const lastRoomNum = this.mockData.allottedRooms
            .filter(r => r.roomNumber.startsWith(blockPrefix))
            .map(r => parseInt(r.roomNumber.split('-')[1]))
            .reduce((max, num) => Math.max(max, num), 100);
        return `${blockPrefix}-${lastRoomNum + 1}`;
    }

    renderDashboard() {
        this.updateStats();
        this.renderPendingRequests();
        this.renderAllottedRooms();
        this.renderStudentsTable();
    }

    updateStats() {
        const occupiedCount = this.mockData.allottedRooms.length;
        const pendingCount = this.mockData.pendingRequests.length;
        const availableCount = this.mockData.totalRooms - occupiedCount;

        this.updateStatElement('available-rooms-stat', availableCount);
        this.updateStatElement('pending-requests-stat', pendingCount);
        this.updateStatElement('occupied-rooms-stat', occupiedCount);
    }

    updateStatElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    renderPendingRequests() {
        const container = document.getElementById('booking-requests-list');
        const noRequestsMsg = document.getElementById('no-requests-msg');
        
        if (!container) return;

        container.innerHTML = '';

        if (this.mockData.pendingRequests.length === 0) {
            if (noRequestsMsg) {
                container.appendChild(noRequestsMsg);
            }
        } else {
            this.mockData.pendingRequests.forEach(request => {
                const card = this.createRequestCard(request);
                container.appendChild(card);
            });
        }
    }

    createRequestCard(request) {
        const card = document.createElement('div');
        card.className = 'request-card bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4';
        card.innerHTML = `
            <div>
                <p class="font-bold text-slate-800">${request.studentName}</p>
                <p class="text-sm text-slate-500">ID: ${request.studentId}</p>
                <p class="text-sm text-slate-600 font-medium mt-1">Wants: <span class="text-indigo-600">${request.requestedType}</span></p>
            </div>
            <div class="flex-shrink-0 flex gap-2">
                <button data-request-id="${request.id}" class="accept-btn bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm">Accept</button>
                <button data-request-id="${request.id}" class="decline-btn bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm">Decline</button>
            </div>
        `;
        return card;
    }

    renderAllottedRooms() {
        const container = document.getElementById('allotted-rooms-list');
        const noAllottedMsg = document.getElementById('no-allotted-msg');
        
        if (!container) return;

        container.innerHTML = '';

        if (this.mockData.allottedRooms.length === 0) {
            if (noAllottedMsg) {
                container.appendChild(noAllottedMsg);
            }
        } else {
            this.mockData.allottedRooms.forEach(allotment => {
                const card = this.createAllottedCard(allotment);
                container.appendChild(card);
            });
        }
    }

    createAllottedCard(allotment) {
        const card = document.createElement('div');
        card.className = 'allotted-card bg-slate-50 p-4 rounded-lg border border-slate-200';
        card.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold text-slate-800">${allotment.studentName}</p>
                    <p class="text-sm text-slate-500">ID: ${allotment.studentId}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold text-blue-600 text-lg">${allotment.roomNumber}</p>
                    <p class="text-sm text-slate-500">${allotment.roomType}</p>
                </div>
            </div>
        `;
        return card;
    }

    renderStudentsTable() {
        const tbody = document.getElementById('students-table-body');
        const noStudentsMsg = document.getElementById('no-students-msg');
        const table = tbody?.parentElement;
        
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.mockData.students.length === 0) {
            if (noStudentsMsg) {
                noStudentsMsg.classList.remove('hidden');
            }
            if (table) {
                table.classList.add('hidden');
            }
        } else {
            if (noStudentsMsg) {
                noStudentsMsg.classList.add('hidden');
            }
            if (table) {
                table.classList.remove('hidden');
            }

            this.mockData.students.forEach(student => {
                const row = this.createStudentRow(student);
                tbody.appendChild(row);
            });
        }
    }

    createStudentRow(student) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">${student.studentName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${student.studentId}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${student.roomNumber}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${student.roomType}</td>
        `;
        return row;
    }

    onViewSwitch(viewName) {
        if (viewName === 'students-view') {
            this.renderStudentsTable();
        }
    }
}

// Student Dashboard Manager
class StudentDashboardManager extends DashboardManager {
    constructor() {
        super('student');
        this.studentProfile = {
            name: 'Rohan Sharma',
            studentId: '2025-CS-101',
            course: 'B.Tech Computer Science',
            email: 'rohan.sharma@university.edu',
            phone: '+91 98765 43210',
            booking: null
        };
        this.currentHostelData = [];
        this.roomTypes = ['ac-single', 'ac-double', 'non-ac-single', 'non-ac-double'];
        this.hostelBlocks = {
            boys: [
                { id: 'A', name: 'Aravali' }, { id: 'B', name: 'Vindhya' }, 
                { id: 'C', name: 'Nilgiri' }, { id: 'D', name: 'Shivalik' }, 
                { id: 'E', name: 'Himalaya' }
            ],
            girls: [
                { id: 'F', name: 'Ganga' }, { id: 'G', name: 'Yamuna' }, 
                { id: 'H', name: 'Saraswati' }, { id: 'I', name: 'Kaveri' }, 
                { id: 'J', name: 'Godavari' }
            ]
        };
    }

    initStudentDashboard() {
        this.renderProfile();
        this.setupHostelSelection();
        this.setupRoomSelection();
        this.setupRoomFiltering();
    }

    renderProfile() {
        const elements = {
            'profile-name': this.studentProfile.name,
            'profile-id': `Student ID: ${this.studentProfile.studentId}`,
            'profile-course': `Course: ${this.studentProfile.course}`,
            'profile-email': this.studentProfile.email,
            'profile-phone': this.studentProfile.phone
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    setupHostelSelection() {
        const form = document.getElementById('hostel-selection-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (this.studentProfile.booking) {
                    this.showNotification('You already have an active or pending booking.', 'warning');
                    this.switchView('booking-details-view');
                    return;
                }

                const hostelType = document.getElementById('hostel-type').value;
                this.generateHostelData(hostelType);
                this.switchView('room-allotment-view');
                this.renderRoomSelection();
            });
        }
    }

    setupRoomSelection() {
        const roomDisplayArea = document.getElementById('room-display-area');
        if (roomDisplayArea) {
            roomDisplayArea.addEventListener('click', (e) => {
                const roomCircle = e.target.closest('.room-circle');
                if (roomCircle && 
                    roomCircle.dataset.available === "true" && 
                    !roomCircle.classList.contains('opacity-30')) {
                    
                    this.bookRoom(roomCircle);
                }
            });
        }
    }

    setupRoomFiltering() {
        const filter = document.getElementById('room-type-filter');
        if (filter) {
            filter.addEventListener('change', () => {
                this.renderRoomSelection();
            });
        }
    }

    generateHostelData(hostelType) {
        const blocks = this.hostelBlocks[hostelType];
        this.currentHostelData = [];

        blocks.forEach(blockInfo => {
            const block = {
                id: blockInfo.id,
                name: `Block ${blockInfo.id}: ${blockInfo.name}`,
                floors: []
            };

            for (let floor = 1; floor <= 7; floor++) {
                const floorData = { name: `Floor ${floor}`, rooms: [] };
                
                for (let room = 1; room <= 10; room++) {
                    const roomNumber = floor * 100 + room;
                    floorData.rooms.push({
                        number: `${blockInfo.id}-${roomNumber}`,
                        type: this.roomTypes[roomNumber % this.roomTypes.length],
                        isOccupied: (floor + room) % 5 === 0
                    });
                }
                
                block.floors.push(floorData);
            }
            
            this.currentHostelData.push(block);
        });
    }

    renderRoomSelection() {
        const container = document.getElementById('room-display-area');
        const filter = document.getElementById('room-type-filter');
        
        if (!container) return;

        const selectedType = filter ? filter.value : 'all';
        container.innerHTML = '';

        this.currentHostelData.forEach(block => {
            const accordionItem = this.createBlockAccordion(block, selectedType);
            container.appendChild(accordionItem);
        });
    }

    createBlockAccordion(block, selectedType) {
        const accordionItem = document.createElement('div');
        accordionItem.className = 'bg-white rounded-lg shadow-md overflow-hidden';

        const header = document.createElement('button');
        header.className = 'w-full flex justify-between items-center p-4 md:p-5 text-left font-bold text-lg md:text-xl text-slate-800 hover:bg-slate-50 transition';
        header.innerHTML = `
            <span>${block.name}</span>
            <svg class="accordion-arrow w-6 h-6 text-slate-500 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        `;

        const content = document.createElement('div');
        content.className = 'p-4 md:p-5 border-t border-slate-200 hidden space-y-6';

        block.floors.forEach(floor => {
            const floorElement = this.createFloorElement(floor, selectedType);
            content.appendChild(floorElement);
        });

        header.addEventListener('click', () => {
            content.classList.toggle('hidden');
            header.querySelector('.accordion-arrow').classList.toggle('rotate-180');
        });

        accordionItem.appendChild(header);
        accordionItem.appendChild(content);
        return accordionItem;
    }

    createFloorElement(floor, selectedType) {
        const floorElement = document.createElement('div');
        floorElement.innerHTML = `<h4 class="text-md font-semibold mb-3 text-slate-600">${floor.name}</h4>`;

        const roomsGrid = document.createElement('div');
        roomsGrid.className = 'grid grid-cols-5 sm:grid-cols-10 gap-3';

        floor.rooms.forEach(room => {
            const roomCircle = this.createRoomCircle(room, selectedType);
            roomsGrid.appendChild(roomCircle);
        });

        floorElement.appendChild(roomsGrid);
        return floorElement;
    }

    createRoomCircle(room, selectedType) {
        const roomCircle = document.createElement('div');
        roomCircle.className = 'room-circle w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white cursor-pointer transition-all hover:scale-110';
        roomCircle.textContent = room.number.split('-')[1];
        roomCircle.dataset.roomNumber = room.number;
        roomCircle.dataset.roomType = room.type;

        const roomTypeDisplay = room.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

        if (room.isOccupied) {
            roomCircle.classList.add('bg-slate-400', 'cursor-not-allowed');
            roomCircle.title = `Room ${room.number} (Occupied)`;
            roomCircle.dataset.available = "false";
            roomCircle.classList.remove('hover:scale-110');
        } else {
            const colorClass = this.getRoomTypeColor(room.type);
            roomCircle.classList.add(colorClass);
            roomCircle.title = `Room ${room.number} (${roomTypeDisplay}) - Available`;
            roomCircle.dataset.available = "true";

            if (selectedType !== 'all' && room.type !== selectedType) {
                roomCircle.classList.add('opacity-30');
            }
        }

        return roomCircle;
    }

    getRoomTypeColor(type) {
        const colors = {
            'ac-single': 'bg-blue-500',
            'ac-double': 'bg-indigo-500',
            'non-ac-single': 'bg-amber-500',
            'non-ac-double': 'bg-orange-500'
        };
        return colors[type] || 'bg-gray-500';
    }

    bookRoom(roomCircle) {
        const roomNumber = roomCircle.dataset.roomNumber;
        const roomType = roomCircle.dataset.roomType;
        const roomTypeDisplay = roomType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

        if (confirm(`Book Room ${roomNumber} (${roomTypeDisplay})?\n\nThis action cannot be undone.`)) {
            this.studentProfile.booking = {
                roomNumber: roomNumber,
                roomType: roomType,
                status: 'confirmed',
                bookedAt: new Date().toISOString()
            };

            this.showNotification('Room booked successfully!', 'success');
            this.switchView('booking-details-view');
        }
    }

    onViewSwitch(viewName) {
        if (viewName === 'booking-details-view') {
            this.renderBookingDetails();
        }
    }

    renderBookingDetails() {
        const container = document.getElementById('booking-status-container');
        if (!container) return;

        container.innerHTML = '';

        if (!this.studentProfile.booking) {
            container.innerHTML = this.createNoBookingCard();
        } else if (this.studentProfile.booking.status === 'pending') {
            container.innerHTML = this.createPendingCard();
        } else {
            container.innerHTML = this.createConfirmedCard();
        }
    }

    createNoBookingCard() {
        return `
            <div class="status-card text-center bg-white p-8 rounded-xl border border-slate-200">
                <i class="fas fa-folder-open fa-3x text-slate-400 mb-4"></i>
                <h2 class="text-xl font-bold text-slate-800">No Booking Found</h2>
                <p class="text-slate-500 mt-2">You haven't applied for a room yet. Please go to the "Book a Room" section to start.</p>
            </div>
        `;
    }

    createPendingCard() {
        return `
            <div class="status-card text-center bg-white p-8 rounded-xl border border-slate-200">
                <i class="fas fa-hourglass-half fa-3x text-amber-500 mb-4"></i>
                <h2 class="text-xl font-bold text-slate-800">Application Pending</h2>
                <p class="text-slate-500 mt-2">Your application is under review. We will notify you once it's processed.</p>
            </div>
        `;
    }

    createConfirmedCard() {
        const booking = this.studentProfile.booking;
        const roomTypeDisplay = booking.roomType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        return `
            <div class="status-card bg-white p-6 md:p-8 rounded-xl border border-green-300 shadow-lg">
                <div class="text-center mb-6">
                    <i class="fas fa-check-circle fa-3x text-green-500 mb-4"></i>
                    <h2 class="text-xl md:text-2xl font-bold text-slate-800">Congratulations! Room Allotted!</h2>
                    <p class="text-slate-500 mt-1">Welcome to your new home at Hostel Hub.</p>
                </div>
                <div class="mt-6 border-t border-slate-200 pt-6">
                    <dl class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <dt class="text-sm font-medium text-slate-500">Student Name</dt>
                            <dd class="mt-1 text-lg font-semibold text-slate-900">${this.studentProfile.name}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-slate-500">Student ID</dt>
                            <dd class="mt-1 text-lg font-semibold text-slate-900">${this.studentProfile.studentId}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-slate-500">Allotted Room</dt>
                            <dd class="mt-1 text-xl md:text-2xl font-bold text-indigo-600">${booking.roomNumber}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-slate-500">Room Type</dt>
                            <dd class="mt-1 text-lg font-semibold text-slate-900">${roomTypeDisplay}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        `;
    }
}

// Initialize dashboard based on page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('admin-dashboard')) {
        new AdminDashboardManager();
    } else if (currentPage.includes('student-dashboard')) {
        new StudentDashboardManager();
    }
});
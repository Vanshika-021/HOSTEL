# HostelHub - Complete Hostel Management System

A comprehensive web-based hostel management system built with HTML, CSS, JavaScript, Bootstrap, and Tailwind CSS.

## Features

### Public Website
- **Homepage**: Overview of hostel facilities and services
- **Hostel Gallery**: Visual showcase of different hostels
- **Facilities**: Detailed information about amenities
- **Rules & Regulations**: Comprehensive hostel guidelines
- **Contact Us**: Contact information and inquiry form

### Student Portal
- **Profile Management**: View and manage personal information
- **Room Booking**: Interactive room selection system
- **Booking Status**: Track application and allotment status
- **Responsive Design**: Works on all devices

### Admin Dashboard
- **Dashboard Overview**: Statistics and key metrics
- **Booking Management**: Accept/decline room requests
- **Student Directory**: View all registered students
- **Room Management**: Monitor room occupancy

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Bootstrap 5.3.3, Tailwind CSS 3.4.0
- **Icons**: Font Awesome 6.5.2, Bootstrap Icons
- **Fonts**: Google Fonts (Poppins, Inter)
- **Build Tool**: Vite 5.0.0

## Project Structure

```
hostelhub/
├── assets/
│   ├── css/
│   │   ├── style.css          # Main stylesheet
│   │   └── login.css          # Login page styles
│   └── js/
│       ├── main.js            # Main JavaScript functionality
│       ├── dashboard.js       # Dashboard management
│       └── auth.js            # Authentication system
├── index.html                 # Homepage
├── login.html                 # Login/Register page
├── admin-dashboard.html       # Admin dashboard
├── student-dashboard.html     # Student dashboard
├── facilities.html            # Facilities page
├── our-Hostels.html          # Gallery page
├── boys-hostel.html          # Boys hostel details
├── girl-hostel.html          # Girls hostel details
├── contact-us.html           # Contact page
├── rules.html                # Rules & regulations
├── package.json              # Project dependencies
├── vite.config.js            # Vite configuration
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hostelhub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Alternative Setup (Static Server)

If you prefer to run without Node.js:

1. Install a simple HTTP server:
```bash
npm install -g http-server
```

2. Run the server:
```bash
http-server . -p 3000
```

## Usage

### Demo Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123`

**Student Login:**
- Username: `student`
- Password: `student123`

### Key Features

1. **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
2. **Interactive Dashboards**: Real-time updates and dynamic content
3. **Room Selection**: Visual room selection with filtering options
4. **Form Validation**: Client-side validation with user feedback
5. **Notification System**: Toast notifications for user actions
6. **Authentication**: Mock authentication system with role-based access

## Customization

### Styling
- Modify `assets/css/style.css` for general styling
- Update `assets/css/login.css` for login page specific styles
- Colors and themes can be customized using CSS variables

### Content
- Update HTML files to change content and structure
- Modify JavaScript files for functionality changes
- Replace placeholder images with actual hostel photos

### Configuration
- Update `vite.config.js` for build settings
- Modify `package.json` for project metadata

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact:
- Email: hostelhub@edu.ac.in
- Phone: +91 987 654 3210

## Acknowledgments

- Bootstrap team for the excellent CSS framework
- Tailwind CSS for utility-first styling
- Font Awesome for comprehensive icon library
- Unsplash for placeholder images
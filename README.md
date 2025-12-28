# UniBridge Foundation Website

A professional, modern web application for the UniBridge Foundation - a non-profit organization dedicated to connecting opportunities with organizations and individuals who need support.

## Features

### Public Website
- **Clean Landing Page**: Professional hero section with foundation mission and values
- **About Section**: Detailed information about what UniBridge does and how we help
- **Organizations Showcase**: Display all partner organizations with profile images
- **Organization Detail Pages**: Individual pages for each organization showing:
  - Organization information and description
  - Photo gallery organized by year
  - Image descriptions visible on hover
  - Year-based filtering for galleries

### Admin Portal
- **Secure Authentication**: Protected admin dashboard with login
- **Organization Management**: 
  - Add new organizations with name, description, and profile image
  - Edit existing organizations
  - Delete organizations
- **Gallery Management**:
  - Add images to organization galleries
  - Categorize images by year
  - Add descriptions to images (visible on hover)
  - Delete images from galleries
- **All data stored in localStorage** for easy deployment

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. **IMPORTANT**: Add the UniBridge logo to the project:
   - Save the logo image as `logo.png` in the `public/` folder
   - The logo should be in PNG format for best results

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Admin Access

### Default Credentials
- **Username**: `admin`
- **Password**: `unibridge2025`

**Important**: Change these credentials in production by modifying the `authService` in `src/utils/storage.js`

### Admin Features
1. Navigate to `/admin` to access the login page
2. After logging in, you can:
   - Add new organizations
   - Upload profile images for organizations
   - Add multiple gallery images with descriptions and years
   - Edit organization details
   - Delete organizations and images
   - View all organizations in a dashboard layout

## Technology Stack

- **React 18** - Modern UI library
- **React Router 6** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **localStorage** - Client-side data persistence

## Project Structure

```
UniBridge-Foundation/
├── public/
│   └── logo.png              # Logo file (add this manually)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation component
│   │   ├── Hero.jsx          # Landing page hero section
│   │   ├── About.jsx         # About section
│   │   ├── Organizations.jsx # Organizations grid
│   │   └── Footer.jsx        # Footer component
│   ├── pages/
│   │   ├── Home.jsx          # Home page
│   │   ├── OrganizationDetail.jsx  # Individual org page
│   │   ├── AdminLogin.jsx    # Admin login page
│   │   └── AdminDashboard.jsx # Admin panel
│   ├── utils/
│   │   └── storage.js        # localStorage utilities
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Usage Guide

### For Visitors
1. View the landing page to learn about UniBridge Foundation
2. Scroll down to see partner organizations
3. Click on any organization to view detailed information and galleries
4. Hover over gallery images to see descriptions

### For Administrators
1. Go to `/admin` and log in with credentials
2. **Adding an Organization**:
   - Click "Add Organization" button
   - Fill in the organization name and description
   - Upload a profile image (optional but recommended)
   - Click "Add Organization"

3. **Managing Gallery**:
   - Click "Add Image" button for any organization
   - Upload an image
   - Specify the year (for categorization)
   - Add a description (will show on hover)
   - Click "Add Image"

4. **Editing/Deleting**:
   - Use the edit (pencil) icon to modify organization details
   - Use the delete (trash) icon to remove organizations
   - Hover over gallery thumbnails and click the X to remove images

## Data Storage

All data is stored in the browser's localStorage under the following keys:
- `unibridge_auth` - Authentication state
- `unibridge_organizations` - All organization data including galleries

**Note**: localStorage data persists in the browser but:
- Is limited to ~5-10MB depending on browser
- Will be cleared if user clears browser data
- Is not shared across browsers or devices
- For production use, consider implementing a backend database

## Color Scheme

- **Primary Blue**: `#2563a8` (unibridge-blue)
- **Navy**: `#1e3a5f` (unibridge-navy)
- The color scheme is customizable in `tailwind.config.js`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Consider implementing:
- Backend API for data persistence
- Image optimization and CDN storage
- User registration for volunteers
- Contact form functionality
- Newsletter subscription
- Search and filter functionality
- Multi-language support

## License

This project is created for the UniBridge Foundation.

## Support

For issues or questions, please contact the administrator through the admin portal.

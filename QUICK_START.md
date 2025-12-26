# Quick Start Guide - AFDEI Website & CMS

## 🚀 How to Preview the Website and CMS

### Step 1: Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

Or manually:
```bash
npm install
cd backend && npm install
cd ..
```

### Step 2: Setup Environment Variables

Create a `.env` file in the `backend` folder:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/afdei_cms

# JWT Secret
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d

# Server Port
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Step 3: Start MongoDB

Make sure MongoDB is running on your system:
- If installed locally: MongoDB should start automatically
- Or use MongoDB Atlas (cloud) and update MONGODB_URI

### Step 4: Create Admin User (First Time Only)

After starting the backend, create the admin user:

```bash
# Using curl or Postman
curl -X POST http://localhost:5000/api/auth/setup
```

Or visit: `http://localhost:5000/api/auth/setup` in your browser

**Default Admin Credentials:**
- Email: `admin@afdei.org`
- Password: `admin123`

⚠️ **Change the password after first login!**

### Step 5: Start Development Servers

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

### Step 6: Access the Website and CMS

#### Public Website
- **URL**: http://localhost:5173
- **Features**: 
  - View the AFDEI website
  - Toggle between English/Arabic
  - Browse all sections

#### Admin CMS Panel
- **Login URL**: http://localhost:5173/admin/login
- **Dashboard**: http://localhost:5173/admin/dashboard (after login)

**Login Credentials:**
- Email: `admin@afdei.org`
- Password: `admin123`

---

## 📱 What You Can Do in the CMS

### Dashboard
- View statistics (events, projects, submissions)
- See recent activities
- Quick actions

### Content Management
- **Home Content**: Edit hero section, headlines
- **About Content**: Edit vision, mission, values, president's message, objectives
- **Membership Content**: Edit membership information
- **Advisory Bodies**: Manage advisory bodies content

### Events Manager
- Add new events
- Edit existing events
- Delete events
- All content in English and Arabic

### Projects Manager
- Add new projects
- Edit projects (including E-Tajer)
- Delete projects
- Upload project images

### Media Library
- Upload images
- Delete media
- View all uploaded files

### Contact Submissions
- View contact form submissions
- See submission details

### Settings
- Site settings
- Logo upload
- Social media links
- SEO settings

### Users
- Manage admin users
- Add/edit/delete users
- Role management

---

## 🎨 Website Features

### Sections Available:
1. **Hero** - Main landing section
2. **About Us** - Vision, Mission, Values, President's Message, Objectives
3. **Membership** - Membership information and benefits
4. **Advisory Bodies** - Advisory bodies information
5. **Activities & Events** - Event listings
6. **Projects** - Featured E-Tajer project + other projects
7. **Contact** - Contact form and information
8. **Footer** - Links and social media

### Language Support:
- ✅ English (LTR)
- ✅ Arabic (RTL)
- ✅ Language toggle in header
- ✅ All content bilingual

### Design:
- ✅ Dark green (#1B5E20) primary color
- ✅ White secondary color
- ✅ Responsive design
- ✅ Smooth animations

---

## 🔧 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify MONGODB_URI in .env file
- Check if port 5000 is available

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check CORS settings in backend
- Verify FRONTEND_URL in backend .env

### Can't login to CMS
- Make sure admin user is created (run /api/auth/setup)
- Check backend logs for errors
- Verify JWT_SECRET is set

### Images not loading
- Check if uploads folder exists in backend
- Verify file upload permissions
- Check media routes in backend

---

## 📝 Notes

- The website uses dummy/fallback data if the API is not available
- All content can be managed through the CMS
- Changes are saved to MongoDB database
- The website is fully responsive

---

## 🎯 Next Steps

1. **Start the servers** using `npm run dev`
2. **Login to CMS** at http://localhost:5173/admin/login
3. **Explore the website** at http://localhost:5173
4. **Add content** through the CMS
5. **Test language toggle** on the website

Enjoy exploring your AFDEI website and CMS! 🚀



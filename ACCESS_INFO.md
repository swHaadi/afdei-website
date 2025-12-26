# 🚀 AFDEI Website & CMS - Access Information

## ✅ Servers Starting...

The development servers are now starting. Please wait a few moments for them to fully initialize.

---

## 🌐 Access URLs

### Public Website
**URL**: http://localhost:5173

**Features:**
- View the AFDEI website
- Toggle between English (EN) and Arabic (AR)
- Browse all sections:
  - Home/Hero
  - About Us (Vision, Mission, Values, President's Message, Objectives)
  - Membership
  - Advisory Bodies
  - Activities & Events
  - Projects (including E-Tajer)
  - Contact

---

### Admin CMS Panel

**Login URL**: http://localhost:5173/admin/login

**Default Credentials:**
- **Email**: `admin@afdei.org`
- **Password**: `admin123`

⚠️ **Important**: If this is your first time, you need to create the admin user first!

**To create admin user:**
1. Make sure backend is running (http://localhost:5000)
2. Visit: http://localhost:5000/api/auth/setup
3. Or use this command:
   ```bash
   curl -X POST http://localhost:5000/api/auth/setup
   ```

**After Login, you can access:**
- **Dashboard**: http://localhost:5173/admin/dashboard
- **Content Manager**: http://localhost:5173/admin/content
- **Events Manager**: http://localhost:5173/admin/events
- **Projects Manager**: http://localhost:5173/admin/projects
- **Media Library**: http://localhost:5173/admin/media
- **Contact Submissions**: http://localhost:5173/admin/contact
- **Settings**: http://localhost:5173/admin/settings
- **Users**: http://localhost:5173/admin/users

---

## 🔧 Server Status

- **Frontend**: Running on http://localhost:5173
- **Backend API**: Running on http://localhost:5000

---

## 📝 Notes

1. **MongoDB Required**: Make sure MongoDB is running on your system
   - If MongoDB is not installed, the backend will show connection errors
   - You can still view the website (it uses fallback data)
   - But CMS features won't work without MongoDB

2. **First Time Setup**:
   - Create admin user at: http://localhost:5000/api/auth/setup
   - Then login at: http://localhost:5173/admin/login

3. **Language Toggle**:
   - Click the language button in the header
   - Website will switch between English and Arabic
   - All content is bilingual

---

## 🎨 What to Check

### Website:
- ✅ All sections are visible
- ✅ Language toggle works
- ✅ Smooth scrolling navigation
- ✅ Responsive design (try resizing browser)
- ✅ Dark green color scheme

### CMS:
- ✅ Login works
- ✅ Dashboard shows statistics
- ✅ Can edit content
- ✅ Can add events
- ✅ Can manage projects
- ✅ Can upload media

---

## 🐛 Troubleshooting

**Backend not starting?**
- Check if MongoDB is running
- Verify `.env` file exists in `backend` folder
- Check port 5000 is not in use

**Can't login?**
- Make sure admin user is created (visit /api/auth/setup)
- Check backend is running
- Verify credentials: admin@afdei.org / admin123

**Website not loading?**
- Check frontend is running on port 5173
- Try refreshing the page
- Check browser console for errors

---

**Enjoy exploring your AFDEI website and CMS!** 🎉



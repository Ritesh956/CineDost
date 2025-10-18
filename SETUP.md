# 🎬 MovieRec - Movie Recommendation System

A modern, full-stack movie recommendation application with enhanced UI/UX, Google OAuth integration, and personalized recommendations.

## ✨ Features

- 🔐 **Secure Authentication** - Email/password with Google OAuth support
- 🎯 **Personalized Recommendations** - Get movie suggestions based on your preferences
- 🔍 **Advanced Search** - Find movies by title, genre, or year
- ⭐ **Rating System** - Rate movies and get better recommendations
- 📋 **Watchlist** - Save movies to watch later
- 📊 **Rating History** - Track all your movie ratings
- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations
- 🔒 **Password Validation** - Strong password requirements (letters + numbers)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Movie-Recommendation
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

3. **Setup Environment Variables**

   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/movierec
   JWT_SECRET=your_jwt_secret_key
   TMDB_API_KEY=your_tmdb_api_key
   OMDB_API_KEY=your_omdb_api_key
   ```

4. **Get API Keys**

   - **TMDB API Key**: 
     1. Sign up at [themoviedb.org](https://www.themoviedb.org/)
     2. Go to Settings > API
     3. Request an API key
   
   - **Google OAuth Client ID**:
     1. Go to [Google Cloud Console](https://console.cloud.google.com/)
     2. Create a new project
     3. Enable Google+ API
     4. Go to "APIs & Services" > "Credentials"
     5. Create OAuth 2.0 Client ID
     6. Add `http://localhost:3000` to authorized origins

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Run the application**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🔑 Password Requirements

When registering or logging in, passwords must:
- Contain at least 6 characters
- Include both letters (a-z, A-Z)
- Include at least one number (0-9)
- Special characters are optional but recommended for stronger security

## 📱 Features Overview

### Authentication
- **Email/Password Login** - Traditional authentication with strong password validation
- **Google Sign-In** - Quick authentication using Google account
- **Genre Selection** - Choose favorite genres during registration for better recommendations

### Home Page
- Personalized movie recommendations based on your preferences
- Beautiful card-based layout with hover effects
- Quick add to watchlist
- Star rating system

### Search
- Search movies by title
- Filter by genre, year, rating
- Real-time search results

### Profile
- View your rating history
- Manage your watchlist
- Update preferences

## 🎨 UI/UX Enhancements

- **Modern Design** - Dark theme with vibrant red accents
- **Smooth Animations** - Fade-in effects and smooth transitions
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Loading States** - Beautiful loading spinners
- **Error Handling** - User-friendly error messages
- **Password Strength Indicator** - Real-time feedback on password strength
- **Toggle Password Visibility** - Easy password viewing

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- React Router v6
- Axios for API calls
- Google OAuth (@react-oauth/google)
- CSS3 with modern animations

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- TMDB API integration

## 📦 Project Structure

```
Movie-Recommendation/
├── src/
│   ├── components/
│   │   ├── Auth/        # Login, Register components
│   │   ├── Common/      # Shared components (Header, Loading)
│   │   ├── Home/        # Home page and recommendation cards
│   │   ├── Profile/     # User profile, watchlist, ratings
│   │   └── Search/      # Search and filter components
│   ├── contexts/        # React contexts (Auth)
│   ├── hooks/           # Custom hooks
│   ├── services/        # API services
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── backend/
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   ├── services/    # External API services
│   │   └── utils/       # Backend utilities
│   └── package.json
└── package.json
```

## 🔧 Available Scripts

- `npm start` - Run frontend only
- `npm run server` - Run backend only
- `npm run dev` - Run both frontend and backend concurrently
- `npm run build` - Build for production
- `npm test` - Run tests

## 🐛 Troubleshooting

### Port Already in Use
If you see "EADDRINUSE" error:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /F /PID <PID>

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MongoDB URI in `.env` file
- Verify MongoDB port (default: 27017)

### Google OAuth Not Working
- Verify Client ID in `.env` file
- Check authorized origins in Google Console
- Clear browser cache and cookies

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ by the MovieRec Team

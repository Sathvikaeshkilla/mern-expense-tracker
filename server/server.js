const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const dotenv = require('dotenv');
const expenseRoutes = require('./routes/expenseRoutes'); // Make sure this path is correct
const authRoutes = require('./routes/authRoutes');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Session middleware (required for passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport GitHub Strategy
const User = require('./models/User');
const jwt = require('jsonwebtoken');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      // Get primary email from GitHub
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`;
      
      // Find or create user
      let user = await User.findOne({ githubId: profile.id });
      
      if (!user) {
        // Check if user with this email already exists
        user = await User.findOne({ email });
        
        if (user) {
          // Link GitHub account to existing user
          user.githubId = profile.id;
          user.name = profile.displayName || profile.username;
          user.avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
          await user.save();
        } else {
          // Create new user
          user = await User.create({
            githubId: profile.id,
            email,
            name: profile.displayName || profile.username,
            avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          });
        }
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// GitHub OAuth routes
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: 'http://localhost:5173/login?error=auth_failed', session: false }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });

import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/web/User';

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && 
    process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here' && 
    process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret_here') {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
    try {
      // Find user by email or googleId
      let user = await User.findOne({ 
        $or: [
          { email: profile.emails?.[0]?.value },
          { googleId: profile.id }
        ] 
      });

      if (user) {
        // Link Google account if not already
        if (!user.googleId) {
          user.googleId = profile.id;
          if (profile.displayName && user.fullname !== profile.displayName) {
            user.fullname = profile.displayName;
          }
          const photoUrl = profile.photos?.[0]?.value;
          if (photoUrl && (!user.profileImage || user.profileImage !== photoUrl)) {
            user.profileImage = photoUrl;
          }
          await user.save();
        }
        return done(null, user);
      } else {
        // Create new user
        user = new User({
          fullname: profile.displayName || 'Google User',
          email: profile.emails?.[0]?.value || '',
          googleId: profile.id,
          profileImage: profile.photos?.[0]?.value || null,
          // No password for Google user
        });
        await user.save();
        return done(null, user);
      }
    } catch (err) {
      console.error('Google strategy error:', err);
      return done(err, false);
    }
  }));
}

passport.serializeUser((user: any, done: (error: any, id?: any) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: (error: any, user?: any) => void) => {
  try {
    const user = await User.findById(id);
    done(null, user || false);
  } catch (err) {
    done(err, false);
  }
});

export default passport;

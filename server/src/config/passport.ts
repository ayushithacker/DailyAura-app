import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userSchema";
import dotenv from "dotenv";

dotenv.config();

// Fix callback URL configuration
const getCallbackURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return `${process.env.BACKEND_URL}/api/auth/google/callback`;
  }
  // For development, use localhost
  return `http://localhost:${process.env.PORT || 5050}/api/auth/google/callback`;
};

const callbackURL = getCallbackURL();
console.log("Google OAuth Callback URL:", callbackURL);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: callbackURL
    },

    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const username = profile.displayName;

        if (!email) return done(null, false);

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            username,
            email,
            password: "google-auth", // dummy password
          });
        }

        done(null, user);
      } catch (err) {
        done(err as any, undefined);
      }
    }
  )
);

export default passport;

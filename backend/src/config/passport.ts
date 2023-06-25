import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const clientID = "process.env.GOOGLE_CLIENT_ID";
const clientSecret = "process.env.GOOGLE_CLIENT_SECRET";

if (!clientID || !clientSecret) {
  throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in the environment variables');
}

passport.use(new GoogleStrategy({
    clientID: clientID as string,
    clientSecret: clientSecret as string,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
  },
  async (req: express.Request, accessToken: string, refreshToken: string, profile: any, cb: any) => {
    let user = await prisma.user.findUnique({ where: { googleId: profile.id } });

    // If not, create a new user
    if (!user) {
        user = await prisma.user.create({
        data: {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails ? profile.emails[0].value : null, // assuming google provides at least one email
        },
        });
    }
    return cb(null, user);
  }
));

// Configure Passport authenticated session persistence.
passport.serializeUser((user: any, cb) => {
    cb(null, user.googleId);
});

passport.deserializeUser(async (id: string, cb) => {
    const user = await prisma.user.findUnique({ where: { googleId: id } });
    cb(null, user);
});

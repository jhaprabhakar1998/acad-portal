/**
 * Session Middleware
 * Configures and manages user sessions
 */

import session from 'express-session';
import { Application } from 'express';

// Extend Express Session type
declare module 'express-session' {
  interface SessionData {
    _user?: any;
  }
}

/**
 * Configure session middleware
 * @param app - Express application instance
 */
export function configureSession(app: Application): void {
  app.use(
    session({
      name: 'vmc_session',
      secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: parseInt(process.env.SESSION_MAX_AGE || '7200000', 10), // 2 hours default
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict',
      },
    })
  );
}

/**
 * Middleware to check if user is authenticated
 */
export function requireAuth(req: any, res: any, next: any) {
  if (req.session && req.session._user) {
    return next();
  }
  return res.status(401).json({
    msg: 'Authentication required',
    errcode: 1
  });
}

/**
 * Middleware to get current user from session
 */
export function getCurrentUser(req: any) {
  return req.session?._user || null;
}


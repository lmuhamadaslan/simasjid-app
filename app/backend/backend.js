import express from 'express';
import session from 'express-session';
import csrf from 'csurf';
import passport from 'passport';
import flash from 'connect-flash';
import { encrypt, decrypt } from './helpers/Helper.js';
import role from './routes/role.js';
import permission from './routes/permission.js'
import auth from './routes/auth.js';
import dashboard from './routes/dashboard.js';

const app = express();

// middleware
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: true, 
    saveUninitialized: true, 
    cookie: {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: 'strict'                
    }
}));
// export const csrfProtection = csrf({ 
//     cookie: {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production' ? true : false,
//         sameSite: 'strict'
//     }
// });
// app.use(csrfProtection);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(auth);
app.use(dashboard);
app.use(role);
app.use(permission);
// end middleware

// method global
app.locals.encrypt = encrypt;
app.locals.decrypt = decrypt;

export default app;
import express from 'express';
import auth from './routes/auth.js';
import dashboard from './routes/dashboard.js';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';

// try {
//     sequelize.authenticate();
//     console.log('Connection has been established successfully.');
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }

const app = express();

// middleware
app.use(session({
    secret: 'keyboard', resave: true, saveUninitialized: true, cookie: {
        maxAge: 60 * 60 * 1000
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(auth);
app.use(dashboard);
// end middleware


export default app;
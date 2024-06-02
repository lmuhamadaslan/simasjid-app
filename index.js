import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import backend from './app/backend/backend.js';
// import session from 'express-session';
// import passport from 'passport';

const app = express();
dotenv.config();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use(session({
//     secret: 'keyboard', resave: true, saveUninitialized: true, cookie: {
//         maxAge: 60 * 60 * 1000
//     }
// }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(backend);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
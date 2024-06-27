import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import backend from './app/backend/backend.js';

const app = express();
dotenv.config();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'), path.join(__dirname, 'views/backend/'));
app.use(backend);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
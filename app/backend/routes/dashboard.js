import { Router } from 'express';
import { index } from '../controllers/dashboard.js';

const router = Router();

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}
router.get('/dashboard', isAuthenticated, index);

export default router;
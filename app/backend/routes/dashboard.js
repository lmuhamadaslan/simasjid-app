import { Router } from 'express';

const router = Router();

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}
router.get('/dashboard', isAuthenticated, (req, res, next) => res.render('backend/components/main', {
    user: req.user,
}));

export default router;
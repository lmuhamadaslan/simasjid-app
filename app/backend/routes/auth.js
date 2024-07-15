import { Router } from 'express';
import { registerPage, loginPage, register, login, registerValidator, loginValidator, logout} from '../controllers/auth.js';
import { check, validationResult } from 'express-validator';

const router = Router();

const redirectIfAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return res.redirect('/dashboard');
    next();
}

router.get('/register', redirectIfAuthenticated, registerPage);
router.get('/login', redirectIfAuthenticated, loginPage);
router.get('/logout', logout);
router.post('/auth/register', registerValidator, register);
router.post('/auth/login',loginValidator, login);

export default router;
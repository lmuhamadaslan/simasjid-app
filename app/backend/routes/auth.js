import { Router } from 'express';
import { registerPage, loginPage, register, login, logout} from '../controllers/auth.js';
import { registerValidator } from '../validation/RegisterValidator.js';
import { loginValidator } from '../validation/LoginValidator.js';

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
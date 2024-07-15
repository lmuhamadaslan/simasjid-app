import { Router } from "express";
import { create, destroy, index, store } from "../controllers/user.js";
import checkPermission from "../middleware/CheckPermission.js";
import { isAuthenticated } from "../helpers/Helper.js";
import { userValidator } from "../validation/UserValidation.js";

const router = Router();
const permission = async (req, res, next) => {
    if (req.user.role_id === 1) {
        return next();
    }

    const hasAccess = await checkPermission(req.user.id, 'view_user');
    if (!hasAccess) {
        return res.send('You do not have access to this menu');
    }
    next();
}

router.post('/user/store', isAuthenticated, permission, userValidator, store);
router.get('/user', isAuthenticated, permission, index);
router.get('/user/create', isAuthenticated, permission, create);
router.delete('/user/delete/:id', isAuthenticated, permission, destroy);

export default router;
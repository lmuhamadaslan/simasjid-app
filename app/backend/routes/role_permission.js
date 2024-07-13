import { Router } from "express";
import { index, edit, create, store } from "../controllers/role_permission.js";
import checkPermission from "../middleware/CheckPermission.js";
import { isAuthenticated } from "../helpers/Helper.js";

const router = Router();
const permission = async (req, res, next) => {
    if (req.user.role_id === 1) {
        return next();
    }
    
    const hasAccess = await checkPermission(req.user.id, 'role_permission_menu');
    if (!hasAccess) {
        return res.send("You di not have access to this menu");
    }
    next();
}

router.post('/role-permission/store', isAuthenticated, permission, store);
router.get('/role-permission', isAuthenticated, permission, index);
router.get('/role-permission/create', isAuthenticated, permission, create);
router.get('/role-permission/edit/:id', isAuthenticated, permission, edit);

export default router;
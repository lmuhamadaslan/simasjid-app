import { Router } from "express";
import { index, create, store, edit, update, destroy } from "../controllers/permission.js";
import { permissionValidator } from "../validation/PermissionValidation.js";
import checkPermission from "../middleware/CheckPermission.js";
import { isAuthenticated } from "../helpers/Helper.js";

const router = Router();
const permission = async (req, res, next) => {
    const hasAccess = await checkPermission(req.user.id, 'view_management_user');
    if (!hasAccess) {
        return res.send('You do not have access to this menu');
    }
    next();
}

router.post('/permission/store', isAuthenticated, permission, permissionValidator, store);
router.get('/permission', isAuthenticated, permission, index);
router.get('/permission/create', isAuthenticated, permission, create);
router.get('/permission/edit/:id', isAuthenticated, permission, edit);
router.post('/permission/update/:id', isAuthenticated, permission, permissionValidator, update);
router.delete('/permission/delete/:id', isAuthenticated, permission, destroy);

export default router;

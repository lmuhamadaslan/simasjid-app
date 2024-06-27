import { Router } from "express";
import express from 'express';
import { create, index, store, edit, update, destroy} from "../controllers/role.js";
import { roleValidator } from "../validation/RoleValidation.js";
import checkPermission from "../middleware/CheckPermission.js";
import { isAuthenticated } from "../helpers/Helper.js";

const router = Router();
const app = express();
const permission = async (req, res, next) => {
    const hasAccess = await checkPermission(req.user.id, 'view_management_user');
    if (!hasAccess) {
        return res.send('You do not have access to this menu');
    }
    next();
}

router.post('/role/store', isAuthenticated, permission, roleValidator, store);
router.get('/role', isAuthenticated, permission, index);
router.get('/role/create', isAuthenticated, permission, create);
router.get('/role/edit/:id', isAuthenticated, permission, edit);
router.post('/role/update/:id', isAuthenticated, permission, roleValidator, update);
router.delete('/role/delete/:id', isAuthenticated, permission, destroy);

export default router;

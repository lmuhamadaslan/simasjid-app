import { Router } from "express";
import express from 'express';
import { index, create, store } from "../controllers/permission.js";
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

// router.post('/role/store', isAuthenticated, permission, permissionValidator, store);
router.get('/permission', isAuthenticated, permission, index);
// router.get('/role/create', isAuthenticated, permission, create);
// router.get('/role/edit/:id', isAuthenticated, permission, edit);
// router.post('/role/update/:id', isAuthenticated, permission, permissionValidator, update);
// router.delete('/role/delete/:id', isAuthenticated, permission, destroy);

export default router;

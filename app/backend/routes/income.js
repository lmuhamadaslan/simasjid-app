import { Router } from "express";
import { create, destroy, edit, index, store, update } from "../controllers/income.js";
import { incomeValidation } from "../validation/IncomeValidation.js";
import checkPermission from "../middleware/CheckPermission.js";
import { isAuthenticated } from "../helpers/Helper.js";

const router = Router();
const income = async (req, res, next) => {
    if (req.user.role_id === 1) {
        return next();
    }

    const hasAccess = await checkPermission(req.user.id, 'view_income');
    if (!hasAccess) {
        return res.send('You do not have access to this menu');
    }
    next();
}

router.post('/income-record/store', isAuthenticated, income, incomeValidation, store);
router.get('/income-record/create', isAuthenticated, income, create);
router.get('/income-record', isAuthenticated, income, index);
router.get('/income-record/edit/:id', isAuthenticated, income, edit);
router.post('/income-record/update/:id', isAuthenticated, income, incomeValidation, update);
router.delete('/income-record/delete/:id', isAuthenticated, income, destroy);

export default router;
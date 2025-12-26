import { Router } from "express";
import { addLeave, cancelLeave, getAllLeaves, getAllMyLeaves } from "../controllers/leave.controller";
import authenticate from "../middleware/jwtMiddleware";

const router = Router()

router.post('/apply-leave',authenticate,addLeave)
router.get('/all-leaves',authenticate,getAllLeaves)
router.get('/all/my/leaves',authenticate,getAllMyLeaves)
router.delete('/leave/:id/cancel',authenticate,cancelLeave)


export default router
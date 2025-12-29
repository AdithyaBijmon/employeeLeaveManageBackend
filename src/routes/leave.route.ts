import { Router } from "express";
import { addLeave, approveLeave, cancelLeave, getAllLeaves, getAllMyLeaves, rejectLeave } from "../controllers/leave.controller";
import authenticate from "../middleware/jwtMiddleware";
import adminAuthenticate from "../middleware/adminAuthentication";

const router = Router()

router.post('/apply-leave',authenticate,addLeave)
router.get('/all-leaves',adminAuthenticate,getAllLeaves)
router.get('/all/my/leaves',authenticate,getAllMyLeaves)
router.delete('/leave/:id/cancel',authenticate,cancelLeave)
router.put('/leave/:id/reject',adminAuthenticate,rejectLeave)
router.put('/leave/:id/approve',adminAuthenticate,approveLeave)


export default router
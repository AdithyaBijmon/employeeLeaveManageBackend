import { Router } from "express";
import { addUser, getUsers } from "../controllers/user.controller";
import { loginUser } from "../controllers/auth.controller";
import adminAuthenticate from "../middleware/adminAuthentication";


const router =  Router()

router.get('/employees',getUsers)
router.post('/login',loginUser)
router.post('/new-employee',adminAuthenticate,addUser)

export default router
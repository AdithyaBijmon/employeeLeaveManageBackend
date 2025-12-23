import { Router } from "express";
import { getUsers } from "../controllers/user.controller";
import { loginUser } from "../controllers/auth.controller";


const router =  Router()

router.get('/',getUsers)
router.post('/login',loginUser)

export default router
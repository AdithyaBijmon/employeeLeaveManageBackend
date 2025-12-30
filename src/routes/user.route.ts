import { Router } from "express";
import { addUser, getUsers, removeUser, updateUser } from "../controllers/user.controller";
import { loginUser } from "../controllers/auth.controller";
import adminAuthenticate from "../middleware/adminAuthentication";


const router =  Router()

router.get('/employees',adminAuthenticate,getUsers)
router.post('/login',loginUser)
router.post('/new-employee',adminAuthenticate,addUser)
router.put('/update/:id/user',adminAuthenticate,updateUser)
router.delete('/remove/:id/user',adminAuthenticate,removeUser)

export default router
import { Router } from "express";
import { addUser, getAnEmployee, getUsers, removeUser, updateUser } from "../controllers/user.controller";
import { loginUser } from "../controllers/auth.controller";
import adminAuthenticate from "../middleware/adminAuthentication";
import authenticate from "../middleware/jwtMiddleware";


const router =  Router()

router.get('/employees',adminAuthenticate,getUsers)
router.get('/myDetails',authenticate,getAnEmployee)
router.post('/login',loginUser)
router.post('/new-employee',adminAuthenticate,addUser)
router.put('/update/:id/user',adminAuthenticate,updateUser)
router.delete('/remove/:id/user',adminAuthenticate,removeUser)

export default router
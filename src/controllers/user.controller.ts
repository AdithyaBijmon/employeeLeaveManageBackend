import { AppDataSource } from "../config/data-source"
import { User } from "../entitites/User"


const userRepo = AppDataSource.getRepository(User)


// get Users 
export const getUsers = async (req:any,res:any)=>{
  const users = await userRepo.find()
  res.json(users)
}


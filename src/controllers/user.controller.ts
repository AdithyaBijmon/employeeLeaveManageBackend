import { AppDataSource } from "../config/data-source"
import { Leave } from "../entitites/Leave"
import { User } from "../entitites/User"


const userRepo = AppDataSource.getRepository(User)
const leaveRepo = AppDataSource.getRepository(Leave)


// add users
export const addUser = async (req: any, res: any) => {
  // console.log("add user")
  const { fullName, email, password, designation } = req.body
  const existingUser = await userRepo.findOne({ where: { email } })
  if (existingUser) {
    res.status(409).json({ message: "User already added." })
  }
  else {
    const newUser = userRepo.create({ fullName, email, password, designation, leaveBalance: 20 })
    await userRepo.save(newUser)
    res.status(200).json({ message: "User added successfully." })
  }
}

// get a single user
export const getAnEmployee = async(req:any,res:any)=>{
  const email = req.user.email
  try{
   const user = await userRepo.findOne({where:{email}})
   res.status(200).json(user)
  }
  catch(err){
    res.status(500).json(err)
  }
}

// get Users 
export const getUsers = async (req: any, res: any) => {

  try {
    const users = await userRepo.find({ where: { role: "user" } })
    res.json(users)
  }
  catch (err) {
    res.status(500).json(err)
  }
}

//edit user
export const updateUser = async (req: any, res: any) => {
  const { id } = req.params
  const {fullName,email,designation} = req.body

  try {
    const user = await userRepo.update(id,{fullName,email,designation})
    res.status(200).json(user)
  }
  catch (err) {
    res.status(500).json(err)
  }

}

// remove user
export const removeUser = async (req: any, res: any) => {
  try {
    const { id } = req.params
    await leaveRepo.delete({ user: { id } })
    const remove = await userRepo.delete(id)
    res.status(200).json(remove)
  }
  catch (err) {
    res.status(500).json(err)
  }
}


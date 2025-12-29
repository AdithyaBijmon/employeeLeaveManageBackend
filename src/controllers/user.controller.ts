import { AppDataSource } from "../config/data-source"
import { User } from "../entitites/User"


const userRepo = AppDataSource.getRepository(User)


// add users
export const addUser = async (req: any, res: any) => {
  console.log("add user")
  const { fullName, email, password, designation } = req.body
  const existingUser = await userRepo.findOne({ where: { email } })
  if (existingUser) {
    res.status(409).json({ message: "User already added." })
  }
  else {
    const newUser = userRepo.create({ fullName, email, password, designation })
    await userRepo.save(newUser)
    res.status(200).json({ message: "User added successfully." })
  }
}
// get Users 
export const getUsers = async (req: any, res: any) => {

  const users = await userRepo.find({ where: { role: "user" } })
  res.json(users)
}


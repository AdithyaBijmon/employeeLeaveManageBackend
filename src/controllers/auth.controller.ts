import { AppDataSource } from "../config/data-source"
import { User } from "../entitites/User"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRepo = AppDataSource.getRepository(User);

export const loginUser = async (req: any, res: any) => {
    const { email, password } = req.body

    try {
        const user = await userRepo.findOne({ where: { email }, select: ["id", "fullName", "email", "password", "role"] })
        if (!user) {
            return res.status(404).json({ message: "Account does not exist" });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }


        const token = jwt.sign({ email: user!.email, role: user!.role }, process.env.JWT_SECRET || "")
        res.status(200).json({ token, user })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Login failed", error })
    }
}
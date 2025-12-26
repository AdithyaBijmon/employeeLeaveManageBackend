import { AppDataSource } from "../config/data-source"
import { Leave } from "../entitites/Leave"
import { User } from "../entitites/User";

const leaveRepo = AppDataSource.getRepository(Leave)
const userRepo = AppDataSource.getRepository(User)


export const addLeave = async (req: any, res: any) => {

    // console.log("inside leave controller");

    const { fullName, phone, department, leaveType, dayType, startDate, endDate, leaveReason } = req.body
    const initialLeaveBalance = 20

    try {
        const newLeave = leaveRepo.create({ fullName, phone, department, leaveType, dayType, startDate, endDate, leaveBalance: initialLeaveBalance, leaveReason, status: "pending" })

        await leaveRepo.save(newLeave)

        res.status(200).json({ message: "Leave request send Successfully" })
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" })
        console.log(error)
    }
}

export const getAllLeaves = async (req: any, res: any) => {
    // console.log("Inside get all leaves")

    try {
        const allLeaves = await leaveRepo.find({ order: { id: "DESC" } })
        res.status(200).json(allLeaves)
    }
    catch (err) {
        res.status(500).json(err)
    }
}

export const getAllMyLeaves = async (req: any, res: any) => {
    const userId = req.user.id;

    try {
        const myLeaves = await leaveRepo.find({ where: { user: { id: userId } } })
        res.status(200).json(myLeaves)
    }
    catch (err) {
        res.status(500).json(err)
    }
}

export const cancelLeave = async (req: any, res: any) => {

    try {
        const { id } = req.params
        const leave = await leaveRepo.delete(id)
        res.status(200).json(leave)

    }
    catch (err) {
        res.status(500).json(err)
    }
}
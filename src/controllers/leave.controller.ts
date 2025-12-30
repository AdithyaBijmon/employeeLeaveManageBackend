import { log } from "console";
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
        const user = await userRepo.findOne({ where: { id: req.user.id } })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newLeave = leaveRepo.create({ fullName, phone, department, leaveType, dayType, startDate, endDate, leaveReason, status: "pending", user })

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
    console.log("REQ.USER 👉", req.user);

    console.log("user id : ", req.user.id)
    try {
        const myLeaves = await leaveRepo.find({ where: { user: { id: req.user.id } } })
        res.status(200).json(myLeaves)
        console.log(myLeaves)
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



const calculateLeaveDays = (startDate: Date, endDate: Date, dayType: string) => {
    if (startDate.toDateString() === endDate.toDateString()) {
        return dayType === 'Full' ? 1 : 0.5
    }

    const diffTime = endDate.getTime() - startDate.getTime()
    return diffTime / (1000 * 60 * 60 * 24) + 1
}

export const approveLeave = async (req: any, res: any) => {
    const { id } = req.params

    try {
        const approve = await leaveRepo.findOne({ where: { id } })

        if (!approve) {
            return res.status(404).json({ message: "Leave not found" })
        }

        if (approve.status === "approved") {
            return res.status(400).json({ message: "Leave already approved" })
        }

        const leaveDays = calculateLeaveDays(
            new Date(approve.startDate),
            new Date(approve.endDate),
            approve.dayType.toString()
        )

        if (approve.user.leaveBalance < leaveDays) {
            return res.status(400).json({ message: "Insufficient leave balance." })
        }

        approve.user.leaveBalance -= leaveDays
        approve.status = "approved"

        await leaveRepo.save(approve)

        res.status(200).json({
            message: "Leave approved successfully",
            deductedDays: leaveDays,
            remainingBalance: approve.user.leaveBalance
        })

    } catch (err) {
        res.status(500).json(err)
    }
}


export const rejectLeave = async (req: any, res: any) => {
    const { id } = req.params
    try {
        const reject = await leaveRepo.findOne({ where: { id } })

        if (!reject) {
            return res.status(404).json({ message: "Leave not found" });
        }
        reject.status = 'rejected'
        await leaveRepo.save(reject)
        res.status(200).json(reject)
    }
    catch (err) {
        res.status(500).json(err)
    }
}
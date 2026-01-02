import { log } from "console";
import { AppDataSource } from "../config/data-source"
import { Leave } from "../entitites/Leave"
import { User } from "../entitites/User";
import nodemailer from 'nodemailer'

const leaveRepo = AppDataSource.getRepository(Leave)
const userRepo = AppDataSource.getRepository(User)

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS,
    },
    tls: {

        rejectUnauthorized: false
    }
});


export const addLeave = async (req: any, res: any) => {
    const userMail = req.user.email

    const { fullName, phone, department, leaveType, dayType, startDate, endDate, leaveReason } = req.body


    try {
        const user = await userRepo.findOne({ where: { id: req.user.id } })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newLeave = leaveRepo.create({ fullName, phone, department, leaveType, dayType, startDate, endDate, leaveReason, status: "pending", user })

        await leaveRepo.save(newLeave)

        const mailOptions = {
            from: userMail,
            to: process.env.ADMIN_EMAIL,
            replyTo: userMail,
            subject: `Leave Request - ${fullName}`,
            html: `
                <h3>New Leave Request Received</h3>
                <p><strong>Employee:</strong> ${fullName}</p>
                <p><strong>Duration:</strong> ${startDate} to ${endDate}</p>
                <p><strong>Reason:</strong> ${leaveReason}</p>
                <br/>`,
        }

        await transporter.sendMail(mailOptions)



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
    // console.log("REQ.USER ", req.user);

    // console.log("user id : ", req.user.id)
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
    const start = new Date(startDate.toDateString())
    const end = new Date(endDate.toDateString())

    const diffTime = end.getTime() - start.getTime()
    let days = diffTime / (1000 * 60 * 60 * 24) + 1

    if (days === 1 && (dayType.toLowerCase().includes('half'))) {
        return 0.5
    }

    return days

}

export const approveLeave = async (req: any, res: any) => {
    const { id } = req.params;


    try {
        const approve = await leaveRepo.findOne({ where: { id }, relations: ["user"] });

        if (!approve) {
            return res.status(404).json({ message: "Leave not found" });
        }


        const leaveDays = calculateLeaveDays(
            new Date(approve.startDate),
            new Date(approve.endDate),
            approve.dayType.toString()
        );


        if (approve.user.leaveBalance < leaveDays) {
            return res.status(400).json({ message: "Insufficient leave balance." });
        }


        approve.user.leaveBalance -= leaveDays;
        approve.status = "approved";


        await userRepo.save(approve.user);
        await leaveRepo.save(approve);

        const mailOptions = {
            from: `"Leave System" <${process.env.ADMIN_EMAIL}>`,
            to: approve.user.email,
            subject: `Leave request approved `,
            html: `
                <h3>Your leave request has been approved!</h3>
                
                <p>${approve.startDate} - ${approve.endDate}</p>
                <h4>Your leave Balance is ${approve.user.leaveBalance} days</h3>
               `,
        }

        await transporter.sendMail(mailOptions)



        res.status(200).json({ message: "Leave approved successfully", deductedDays: leaveDays, remainingBalance: approve.user.leaveBalance });

    } catch (err) {
        console.error(err); // Always log the error to see what failed
        res.status(500).json({ message: "Internal server error", error: err });
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

        

        const mailOptions = {
            from: `"Leave System" <${process.env.ADMIN_EMAIL}>`,
            to: reject.user.email,
            subject: `Leave request approved `,
            html: `
                <h3>Your leave request has been rejected!</h3>
                
                <p>${reject.startDate} - ${reject.endDate}</p>
               `,
        }
        await transporter.sendMail(mailOptions)
        res.status(200).json(reject)
    }
    catch (err) {
        res.status(500).json(err)
    }
}
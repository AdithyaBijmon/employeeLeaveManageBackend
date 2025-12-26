import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity("leaves")
export class Leave {
    @PrimaryGeneratedColumn()
    id: String;

    @ManyToOne(() => User, user => user.leaves)
    user: User;

    @Column({ type: "varchar", length: 225 })
    fullName: String;

    @Column({ type: "varchar", length: 10 })
    phone: String;

    @Column({ type: "varchar", length: 225 })
    department: String;

    @Column({ type: "varchar", length: 50 })
    leaveType: String;

    @Column({ type: "varchar", length: 50 })
    dayType: String;

    @Column({ type: "date" })
    startDate: Date;

    @Column({ type: "date" })
    endDate: Date;

    @Column({ type: "int" })
    leaveBalance: number;

    @Column({ type: "varchar", length: 300 })
    leaveReason: String;

    @Column({ type: "varchar", default: 'pending' })
    status: String;

}
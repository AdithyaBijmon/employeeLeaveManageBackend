import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Leave } from "./Leave";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  fullName: string;

  @Column({ type: "varchar", unique: true })
  email: string;


  @Column({ type: "varchar", select: false })
  password: string;

  @Column({ type: "varchar", nullable: true })
  designation: string;

  @Column({ type: "varchar", default: "user", })
  role: string;

  @Column({ type: 'double precision', default: 20 })
  leaveBalance: number;

  @OneToMany(() => Leave, leave => leave.user)
  leaves: Leave[];

}
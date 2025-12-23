import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

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

  @Column({type: "varchar",default: "user",})
  role: string;

}
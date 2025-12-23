import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entitites/User"
import dotenv from "dotenv"

dotenv.config()

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: getEnv("DB_HOST"),
  port: Number(getEnv("DB_PORT")),
  username: getEnv("DB_USERNAME"),
  password: getEnv("DB_PASSWORD"),
  database: getEnv("DB_NAME"),
  synchronize: true,
  logging: false,
  entities:[User]
})
